// UserDetails.js
import React, { useCallback, useState } from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {
  Provider as PaperProvider,
  Surface,
  Text,
  TextInput,
  IconButton,
  Snackbar,
  Button as PaperButton,
  Portal,
  Modal,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles, theme } from './Styles';
import TopCustomHeader from '../../../components/TopNavBar/TopCustomHeader';
import BottomNavigation from '../../../components/BottomNavBar/BottomNavigation';

const UserDetails = () => {
  const navigation = useNavigation();

  // patient fields
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  // Custom dropdown modal state (replaces Menu)
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const openGenderModal = () => setGenderModalVisible(true);
  const closeGenderModal = () => setGenderModalVisible(false);

  // Gender options
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleNext = useCallback(async () => {
    if (!name.trim()) {
      setSnackbarMsg('Please enter full name');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      const patient = {
        name: name.trim(),
        gender: gender.trim(),
        age: age.trim(),
        description: description.trim(),
      };

      await AsyncStorage.setItem('patientDetails', JSON.stringify(patient));
      Keyboard.dismiss();
      navigation.navigate('Next', { patient });
    } catch (err) {
      console.warn('Save patient error', err);
      setSnackbarMsg('Failed to save patient details');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  }, [name, gender, age, description, navigation]);

  const submit = () => {
    Keyboard.dismiss();
    navigation.navigate('Address');
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          source={require('../../../assets/images/BackGround.png')}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          pointerEvents="none"
        />

        <View style={styles.topCustomHeader}>
          <TopCustomHeader title="Patient Details Required" />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.scrollContainer,
              { paddingBottom: 160 },
            ]}
          >
            <Surface style={[styles.surface, { padding: 16 }]}>
              <Text variant="titleLarge" style={{ marginBottom: 12 }}>
                Patient Information
              </Text>

              <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={{ marginBottom: 12 }}
                outlineColor="#E0E3EB"
                activeOutlineColor={theme.colors.primary}
                returnKeyType="next"
              />

              {/* --- Custom Gender Dropdown (Portal + Modal) --- */}
              <View style={{ marginBottom: 12 }}>
                <TouchableOpacity
                  onPress={openGenderModal}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 4,
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    backgroundColor: '#fff',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="gender-male-female" size={20} />
                    <Text style={{ marginLeft: 12 }}>
                      {gender ? gender : 'Gender'}
                    </Text>
                  </View>
                  <IconButton
                    icon="chevron-down"
                    size={20}
                    onPress={openGenderModal}
                  />
                </TouchableOpacity>

                <Portal>
                  <Modal
                    visible={genderModalVisible}
                    onDismiss={closeGenderModal}
                    contentContainerStyle={{
                      marginHorizontal: 20,
                      backgroundColor: 'white',
                      padding: 12,
                      borderRadius: 8,
                    }}
                  >
                    <Surface style={{ paddingVertical: 4 }}>
                      {genderOptions.map(opt => (
                        <TouchableOpacity
                          key={opt}
                          onPress={() => {
                            setGender(opt);
                            closeGenderModal();
                          }}
                          style={{
                            paddingVertical: 12,
                            paddingHorizontal: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#eee',
                          }}
                          activeOpacity={0.7}
                        >
                          <Text>{opt}</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        onPress={closeGenderModal}
                        style={{
                          marginTop: 8,
                          paddingVertical: 10,
                          alignItems: 'center',
                          borderRadius: 6,
                        }}
                      >
                        <Text>Cancel</Text>
                      </TouchableOpacity>
                    </Surface>
                  </Modal>
                </Portal>
              </View>

              <TextInput
                label="Age"
                value={age}
                onChangeText={setAge}
                mode="outlined"
                keyboardType="numeric"
                style={{ marginBottom: 12 }}
                outlineColor="#E0E3EB"
                activeOutlineColor={theme.colors.primary}
                returnKeyType="done"
              />

              <TextInput
                label="Description / Notes"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={{ marginBottom: 12 }}
                outlineColor="#E0E3EB"
                activeOutlineColor={theme.colors.primary}
              />

              <TouchableOpacity style={styles.btn} onPress={submit}>
                <Text style={styles.btnText}>Add Location & Book Now</Text>
              </TouchableOpacity>
            </Surface>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.bottomWrap}>
          <BottomNavigation />
        </View>

        {/* <View
          style={{
            position: 'absolute',
            right: 16,
            left: 16,
            bottom: Platform.OS === 'ios' ? 78 : 78,
          }}
        >
          <PaperButton
            mode="contained"
            onPress={handleNext}
            loading={loading}
            disabled={loading}
            contentStyle={{ paddingVertical: 8 }}
          >
            Next
          </PaperButton>
        </View> */}

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: 'Close',
            onPress: () => setSnackbarVisible(false),
          }}
          style={{ backgroundColor: '#069494' }}
        >
          {snackbarMsg}
        </Snackbar>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default UserDetails;
