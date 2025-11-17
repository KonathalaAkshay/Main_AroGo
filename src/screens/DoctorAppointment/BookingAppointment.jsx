import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text as RNText,
} from 'react-native';
import {
  Provider as PaperProvider,
  Card,
  Text,
  TextInput,
  Button,
  Divider,
  Portal,
  Modal,
  RadioButton,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { styles as sharedStyles, theme } from './style';
import TopCustomHeader from './../../components/TopNavBar/TopCustomHeader';
import BottomNavigation from './../../components/BottomNavBar/BottomNavigation';

const STORAGE_KEY = '@appointments';

const DOCTORS = [
  { id: 'dr_aneesh', name: 'Dr. Aneesh (MBBS)' },
  { id: 'dr_meera', name: 'Dr. Meera (MD)' },
  { id: 'dr_rohit', name: 'Dr. Rohit (Orthopedics)' },
];

const BookingAppointment = () => {
  const navigation = useNavigation();

  // form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [doctor, setDoctor] = useState(DOCTORS[0].id);
  const [issue, setIssue] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // doctor modal (replacement for Menu)
  const [doctorModalVisible, setDoctorModalVisible] = useState(false);

  // modal for confirmation / summary
  const [confirmVisible, setConfirmVisible] = useState(false);

  const selectedDoctorName = useMemo(
    () => DOCTORS.find(d => d.id === doctor)?.name ?? 'Select doctor',
    [doctor],
  );

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter name');
      return false;
    }
    const ageNum = parseInt(age, 10);
    if (!age.trim() || Number.isNaN(ageNum) || ageNum <= 0) {
      Alert.alert('Validation', 'Please enter a valid age');
      return false;
    }
    if (!gender) {
      Alert.alert('Validation', 'Please select gender');
      return false;
    }
    if (!doctor) {
      Alert.alert('Validation', 'Please select a doctor');
      return false;
    }
    if (!issue.trim()) {
      Alert.alert('Validation', 'Please describe the issue');
      return false;
    }
    if (!date || !(date instanceof Date)) {
      Alert.alert('Validation', 'Please select appointment date');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setName('');
    setAge('');
    setGender('male');
    setDoctor(DOCTORS[0].id);
    setIssue('');
    setDate(new Date());
  };

  const handleBookAppointment = useCallback(async () => {
    if (!validateForm()) return;

    const appointment = {
      id: `appt_${Date.now()}`,
      name: name.trim(),
      age: parseInt(age, 10),
      gender,
      doctor,
      doctorName: selectedDoctorName,
      issue: issue.trim(),
      date: date.toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(appointment); // newest first
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      setConfirmVisible(true);
    } catch (e) {
      console.error('Failed saving appointment', e);
      Alert.alert('Error', 'Unable to save appointment. Please try again.');
    }
  }, [name, age, gender, doctor, issue, date, selectedDoctorName]);

  const handleConfirmClose = () => {
    setConfirmVisible(false);
    Alert.alert(
      'Booked',
      'Your appointment has been booked successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            // optional: navigation.goBack();
          },
        },
      ],
      { cancelable: false },
    );
  };

  // date picker handlers (modal version)
  const openDatePicker = () => setShowDatePicker(true);
  const closeDatePicker = () => setShowDatePicker(false);
  const onConfirmDate = selected => {
    setShowDatePicker(false);
    if (selected) {
      setDate(selected);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          source={require('../../assets/images/BackGround.png')}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          pointerEvents="none"
        />

        <View style={sharedStyles.topCustomHeader}>
          <TopCustomHeader title="Book Appointment" />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              sharedStyles.scrollContainer,
              { paddingBottom: 140 },
            ]}
          >
            <Card style={sharedStyles.testCard}>
              <Card.Content>
                <Text variant="titleLarge" style={{ marginBottom: 12 }}>
                  Patient Details
                </Text>

                <TextInput
                  label="Full name"
                  value={name}
                  onChangeText={setName}
                  mode="outlined"
                  left={<TextInput.Icon icon="account" />}
                  style={localStyles.input}
                  returnKeyType="next"
                />

                <TextInput
                  label="Age"
                  value={age}
                  onChangeText={t => setAge(t.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  mode="outlined"
                  left={<TextInput.Icon icon="calendar-account" />}
                  style={localStyles.input}
                />

                <View style={{ marginVertical: 8 }}>
                  <Text style={{ marginBottom: 6 }}>Gender</Text>
                  <View style={localStyles.genderRow}>
                    <TouchableOpacity
                      style={localStyles.genderItem}
                      onPress={() => setGender('male')}
                    >
                      <RadioButton.Android
                        value="male"
                        status={gender === 'male' ? 'checked' : 'unchecked'}
                        onPress={() => setGender('male')}
                      />
                      <RNText style={localStyles.genderLabel}>Male</RNText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={localStyles.genderItem}
                      onPress={() => setGender('female')}
                    >
                      <RadioButton.Android
                        value="female"
                        status={gender === 'female' ? 'checked' : 'unchecked'}
                        onPress={() => setGender('female')}
                      />
                      <RNText style={localStyles.genderLabel}>Female</RNText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={localStyles.genderItem}
                      onPress={() => setGender('other')}
                    >
                      <RadioButton.Android
                        value="other"
                        status={gender === 'other' ? 'checked' : 'unchecked'}
                        onPress={() => setGender('other')}
                      />
                      <RNText style={localStyles.genderLabel}>Other</RNText>
                    </TouchableOpacity>
                  </View>
                </View>

                <Divider style={{ marginVertical: 8 }} />

                {/* Doctor select using Modal (safe replacement for Menu) */}
                <Text style={{ marginVertical: 6 }}>Select Doctor</Text>

                <Button
                  mode="outlined"
                  onPress={() => setDoctorModalVisible(true)}
                  contentStyle={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                  icon="doctor"
                >
                  {selectedDoctorName}
                </Button>

                <Portal>
                  <Modal
                    visible={doctorModalVisible}
                    onDismiss={() => setDoctorModalVisible(false)}
                    contentContainerStyle={localStyles.doctorModal}
                  >
                    <Text
                      variant="titleMedium"
                      style={{ paddingHorizontal: 12, marginBottom: 8 }}
                    >
                      Choose Doctor
                    </Text>

                    <ScrollView style={{ paddingHorizontal: 8 }}>
                      {DOCTORS.map(d => (
                        <TouchableOpacity
                          key={d.id}
                          onPress={() => {
                            setDoctor(d.id);
                            setDoctorModalVisible(false);
                          }}
                          style={localStyles.doctorRow}
                        >
                          <RadioButton.Android
                            value={d.id}
                            status={doctor === d.id ? 'checked' : 'unchecked'}
                            onPress={() => {
                              setDoctor(d.id);
                              setDoctorModalVisible(false);
                            }}
                          />
                          <Text style={{ marginLeft: 8 }}>{d.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    <Button
                      mode="text"
                      onPress={() => setDoctorModalVisible(false)}
                      style={{ marginTop: 8 }}
                    >
                      Cancel
                    </Button>
                  </Modal>
                </Portal>

                <TextInput
                  label="Describe the issue"
                  value={issue}
                  onChangeText={setIssue}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  style={[localStyles.input, { marginTop: 12 }]}
                />

                <Divider style={{ marginVertical: 12 }} />

                {/* Single Date button - opens DateTimePickerModal */}
                <Text style={{ marginBottom: 8 }}>Appointment Date & Time</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Button
                    mode="contained"
                    onPress={openDatePicker}
                    icon="calendar-clock"
                    contentStyle={{ paddingVertical: 6 }}
                  >
                    {date ? date.toLocaleString() : 'Choose date & time'}
                  </Button>
                </View>

                <DateTimePickerModal
                  isVisible={showDatePicker}
                  mode="datetime"
                  date={date || new Date()}
                  minimumDate={new Date()}
                  onConfirm={onConfirmDate}
                  onCancel={closeDatePicker}
                  is24Hour
                />

                <Divider style={{ marginVertical: 12 }} />

                <Button
                  mode="contained"
                  onPress={handleBookAppointment}
                  disabled={
                    !name.trim() || !age.trim() || !issue.trim() || !doctor
                  }
                >
                  Book Appointment
                </Button>
              </Card.Content>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={sharedStyles.bottomWrap}>
          <BottomNavigation />
        </View>

        {/* Confirmation Modal */}
        <Portal>
          <Modal
            visible={confirmVisible}
            onDismiss={() => setConfirmVisible(false)}
            contentContainerStyle={localStyles.modalContainer}
          >
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>
              Appointment Booked
            </Text>
            <Text style={{ marginBottom: 16 }}>
              Your appointment with {selectedDoctorName} on{' '}
              {date.toLocaleString()} has been saved.
            </Text>

            <Button mode="contained" onPress={handleConfirmClose}>
              OK
            </Button>
          </Modal>
        </Portal>
      </SafeAreaView>
    </PaperProvider>
  );
};

const localStyles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  genderLabel: {
    marginLeft: 2,
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  doctorModal: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 8,
    paddingVertical: 10,
    maxHeight: 360,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default BookingAppointment;
