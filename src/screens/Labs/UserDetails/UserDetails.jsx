// UserDetails_withImagePicker.js
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
  Image,
  Alert,
  PermissionsAndroid,
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
import { styles as appStyles, theme } from './Styles';
import TopCustomHeader from '../../../components/TopNavBar/TopCustomHeader';
import BottomNavigation from '../../../components/BottomNavBar/BottomNavigation';

// NOTE: using your project's dependency (react-native-image-picker)
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const UserDetails = () => {
  const navigation = useNavigation();

  // patient fields
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');

  // image picker state
  const [docImage, setDocImage] = useState(null); // { uri, fileName, type }
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  // Custom dropdown modal state
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const openGenderModal = () => setGenderModalVisible(true);
  const closeGenderModal = () => setGenderModalVisible(false);

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const openImageModal = () => setImageModalVisible(true);
  const closeImageModal = () => setImageModalVisible(false);

  // ----------------------------
  // Permission helpers
  // ----------------------------
  const requestAndroidPermissions = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      // Camera is always needed
      const permissions = [PermissionsAndroid.PERMISSIONS.CAMERA];

      // Platform.Version is usually number; handle string just in case
      const sdk =
        typeof Platform.Version === 'string'
          ? parseInt(Platform.Version, 10)
          : Platform.Version || 0;

      if (sdk >= 33) {
        // Android 13+ uses READ_MEDIA_IMAGES for image access.
        // PermissionsAndroid may or may not expose READ_MEDIA_IMAGES constant depending on RN version,
        // so push the literal string as fallback.
        if (PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE) {
          // still push READ_EXTERNAL_STORAGE as compatibility
          permissions.push(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          );
        }
        // Add READ_MEDIA_IMAGES string (safe fallback)
        permissions.push('android.permission.READ_MEDIA_IMAGES');
      } else {
        // pre-Android 13
        permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        // WRITE may be required on older target SDKs
        permissions.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      }

      const result = await PermissionsAndroid.requestMultiple(permissions);

      // result is object mapping permission -> value
      const allGranted = Object.values(result).every(
        v => v === PermissionsAndroid.RESULTS.GRANTED,
      );

      return allGranted;
    } catch (err) {
      console.warn('Permission request error', err);
      return false;
    }
  };

  // ----------------------------
  // Camera pick
  // ----------------------------
  const pickFromCamera = async () => {
    closeImageModal();

    if (Platform.OS === 'android') {
      const ok = await requestAndroidPermissions();
      if (!ok) {
        setSnackbarMsg('Camera or storage permission denied');
        setSnackbarVisible(true);
        return;
      }
    }

    try {
      const options = {
        mediaType: 'photo',
        saveToPhotos: true, // try false if you get permission/storage issues
        cameraType: 'back',
        quality: 0.8,
        includeBase64: false,
      };

      const result = await launchCamera(options);

      // debug log (inspect in Metro / device logs)
      console.log('launchCamera result:', JSON.stringify(result, null, 2));

      if (result.didCancel) {
        // user cancelled
        return;
      }

      if (result.errorCode) {
        console.warn('Camera error:', result.errorCode, result.errorMessage);
        const message =
          result.errorMessage ||
          (result.errorCode === 'camera_unavailable'
            ? 'Camera not available on this device'
            : result.errorCode === 'permission'
            ? 'Camera permission missing'
            : 'Unable to open camera');
        setSnackbarMsg(message);
        setSnackbarVisible(true);
        return;
      }

      const asset = result.assets && result.assets[0];
      if (asset) {
        setDocImage({
          uri: asset.uri,
          fileName: asset.fileName || 'document.jpg',
          type: asset.type || 'image/jpeg',
        });
      }
    } catch (err) {
      console.warn('pickFromCamera exception:', err);
      setSnackbarMsg('Camera error');
      setSnackbarVisible(true);
    }
  };

  // ----------------------------
  // Gallery pick
  // ----------------------------
  const pickFromLibrary = async () => {
    closeImageModal();

    if (Platform.OS === 'android') {
      const ok = await requestAndroidPermissions();
      if (!ok) {
        setSnackbarMsg('Storage permission denied');
        setSnackbarVisible(true);
        return;
      }
    }

    try {
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      };

      const result = await launchImageLibrary(options);

      console.log(
        'launchImageLibrary result:',
        JSON.stringify(result, null, 2),
      );

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        console.warn('Gallery error:', result.errorCode, result.errorMessage);
        setSnackbarMsg(result.errorMessage || 'Unable to open gallery');
        setSnackbarVisible(true);
        return;
      }

      const asset = result.assets && result.assets[0];
      if (asset) {
        setDocImage({
          uri: asset.uri,
          fileName: asset.fileName || 'document.jpg',
          type: asset.type || 'image/jpeg',
        });
      }
    } catch (err) {
      console.warn('pickFromLibrary exception:', err);
      setSnackbarMsg('Gallery error');
      setSnackbarVisible(true);
    }
  };

  const removeImage = () => {
    Alert.alert('Remove Image', 'Do you want to remove the attached image?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setDocImage(null),
      },
    ]);
  };

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
        document: docImage, // may be null
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
  }, [name, gender, age, description, docImage, navigation]);

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

        <View style={appStyles.topCustomHeader}>
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
              appStyles.scrollContainer,
              { paddingBottom: 160 },
            ]}
          >
            <Surface style={[appStyles.surface, { padding: 16 }]}>
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
                    <Icon
                      name="gender-male-female"
                      color={'#069494'}
                      size={20}
                    />
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

              {/* Image picker area */}
              <View style={{ marginBottom: 12 }}>
                <Text variant="labelLarge" style={{ marginBottom: 8 }}>
                  Attach Doctor's Prescription
                </Text>

                {docImage ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={{ uri: docImage.uri }}
                      style={{ width: 92, height: 92, borderRadius: 6 }}
                      resizeMode="cover"
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text numberOfLines={1} style={{ marginBottom: 8 }}>
                        {docImage.fileName || 'Attached Document'}
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <PaperButton
                          mode="outlined"
                          onPress={openImageModal}
                          style={{ marginRight: 8 }}
                        >
                          Replace
                        </PaperButton>
                        <PaperButton mode="contained" onPress={removeImage}>
                          Remove
                        </PaperButton>
                      </View>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={openImageModal}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: '#ccc',
                      borderRadius: 6,
                      padding: 12,
                      backgroundColor: '#fff',
                    }}
                  >
                    <Icon
                      name="file-plus-outline"
                      color={'#069494'}
                      size={24}
                    />
                    <Text style={{ marginLeft: 12 }}>Attach Document</Text>
                  </TouchableOpacity>
                )}

                <Portal>
                  <Modal
                    visible={imageModalVisible}
                    onDismiss={closeImageModal}
                    contentContainerStyle={{
                      marginHorizontal: 20,
                      backgroundColor: 'white',
                      padding: 12,
                      borderRadius: 8,
                      borderColor: '#069494',
                      borderWidth: 1,
                    }}
                  >
                    <Surface style={{ paddingVertical: 4 }}>
                      <TouchableOpacity
                        onPress={pickFromCamera}
                        style={{ paddingVertical: 12 }}
                      >
                        <Text>Take Photo</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={pickFromLibrary}
                        style={{ paddingVertical: 12 }}
                      >
                        <Text>Choose from Gallery</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={closeImageModal}
                        style={{ paddingVertical: 12, alignItems: 'center' }}
                      >
                        <Text>Cancel</Text>
                      </TouchableOpacity>
                    </Surface>
                  </Modal>
                </Portal>
              </View>

              <TouchableOpacity style={appStyles.btn} onPress={submit}>
                <Text style={appStyles.btnText}>Add Location & Book Now</Text>
              </TouchableOpacity>
            </Surface>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={appStyles.bottomWrap}>
          <BottomNavigation />
        </View>

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
