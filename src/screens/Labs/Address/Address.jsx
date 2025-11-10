// screens/Profile/Address/Address.jsx
import React, { useCallback, useState } from 'react';
import {
  View,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Surface,
  Button,
  ActivityIndicator,
  HelperText,
  Divider,
  TextInput,
} from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles, theme } from './Styles';
import TopCustomHeader from '../../../components/TopNavBar/TopCustomHeader';
import BottomNavigation from '../../../components/BottomNavBar/BottomNavigation';

const Address = ({ navigation }) => {
  const [loc, setLoc] = useState(null); // { latitude, longitude, accuracy }
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // manual address UI state
  const [manualVisible, setManualVisible] = useState(false);
  const [addr, setAddr] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');

  const pinInvalid =
    manualVisible && pincode.length > 0 && !/^\d{6}$/.test(pincode);
  const phoneInvalid =
    manualVisible && phone.length > 0 && !/^\d{10}$/.test(phone);

  const requestAndroidPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need your location to auto-fill your address.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (e) {
      return false;
    }
  };

  const ensurePermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      return await requestAndroidPermission();
    }
    // iOS: permission prompt handled by Geolocation.requestAuthorization
    const auth = await Geolocation.requestAuthorization('whenInUse');
    return auth === 'granted';
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setErr('');
    setLoading(true);
    setLoc(null);

    try {
      const ok = await ensurePermission();
      if (!ok) {
        setLoading(false);
        setErr('Location permission denied. Enable it in settings.');
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude, accuracy } = position.coords || {};
          setLoc({ latitude, longitude, accuracy });
          setLoading(false);
        },
        error => {
          setLoading(false);
          setErr(error?.message || 'Unable to fetch location.');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000,
          forceRequestLocation: true,
          showLocationDialog: true,
        },
      );
    } catch (e) {
      setLoading(false);
      setErr('Something went wrong while fetching location.');
    }
  }, [ensurePermission]);

  const onSave = useCallback(() => {
    if (!loc) {
      Alert.alert('No location', 'Please fetch your location first.');
      return;
    }
    Alert.alert(
      'Saved',
      `Location saved:\nLat: ${loc.latitude}\nLng: ${loc.longitude}`,
    );
    navigation.navigate('');
  }, [loc]);

  // Save manual address
  const onSaveManual = useCallback(() => {
    if (!addr.trim()) {
      Alert.alert('Missing address', 'Please enter your address.');
      return;
    }
    if (pinInvalid) {
      Alert.alert('Invalid pincode', 'Pincode must be 6 digits.');
      return;
    }
    if (phoneInvalid) {
      Alert.alert('Invalid phone', 'Phone number must be 10 digits.');
      return;
    }
    // TODO: send manual address to backend
    Alert.alert(
      'Address Saved',
      `Address: ${addr}\nLandmark: ${landmark || '-'}\nPincode: ${
        pincode || '-'
      }\nPhone: ${phone || '-'}`,
    );
    navigation.navigate('');
  }, [addr, landmark, pincode, phone, pinInvalid, phoneInvalid]);

  // Toggle manual block and optionally clear fields
  const openManual = useCallback(() => {
    setManualVisible(true);
    // If you want to clear each time it opens, uncomment:
    // setAddr(''); setLandmark(''); setPincode(''); setPhone('');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Background */}
      <ImageBackground
        source={require('../../../assets/images/BackGround.png')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        pointerEvents="none"
      />

      {/* Header */}
      <View style={styles.topCustomHeader}>
        <TopCustomHeader title="Add your Location" />
      </View>

      {/* Main content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: 80 },
          ]}
        >
          <Surface style={[styles.surface, { padding: 12 }]}>
            <Card.Title
              title="Current Location"
              subtitle="Automatically detect your position"
              left={props => (
                <Icon
                  {...props}
                  name="map-marker-radius-outline"
                  size={28}
                  color={theme.colors.primary}
                />
              )}
            />
            <Card.Content>
              {loading ? (
                <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                  <ActivityIndicator />
                  <Text style={{ marginTop: 8 }}>Fetching your location…</Text>
                </View>
              ) : (
                <>
                  {loc ? (
                    <View style={{ marginBottom: 8 }}>
                      <Text style={{ fontWeight: '700', color: '#111' }}>
                        Latitude:{' '}
                        <Text style={{ fontWeight: '400' }}>
                          {loc.latitude.toFixed(6)}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontWeight: '700',
                          color: '#111',
                          marginTop: 2,
                        }}
                      >
                        Longitude:{' '}
                        <Text style={{ fontWeight: '400' }}>
                          {loc.longitude.toFixed(6)}
                        </Text>
                      </Text>
                      {typeof loc.accuracy === 'number' && (
                        <Text style={{ color: '#6B7280', marginTop: 2 }}>
                          Accuracy: ±{Math.round(loc.accuracy)} m
                        </Text>
                      )}
                    </View>
                  ) : (
                    <Text style={{ color: '#6B7280' }}>
                      Tap “Use current location” to detect automatically.
                    </Text>
                  )}
                  {!!err && (
                    <HelperText type="error" visible>
                      {err}
                    </HelperText>
                  )}
                </>
              )}
            </Card.Content>

            <Button
              mode="contained-tonal"
              onPress={getCurrentLocation}
              icon="crosshairs-gps"
              disabled={loading}
            >
              Use current location
            </Button>

            {/* Optional: save current GPS */}
            <Button
              mode="contained"
              onPress={onSave}
              icon="content-save"
              disabled={!loc}
            >
              Save GPS
            </Button>

            <Divider style={{ marginVertical: 12, color: '#000' }} />

            {/* Manual entry trigger */}
            <View style={{ marginTop: 4 }}>
              <Button mode="outlined" icon="map-search" onPress={openManual}>
                Enter address manually
              </Button>
            </View>

            {/* 👇 Manual address block */}
            {manualVisible && (
              <View style={{ marginTop: 12, gap: 10 }}>
                <TextInput
                  mode="outlined"
                  label="Enter address"
                  placeholder="House/Flat, Street, Area"
                  value={addr}
                  onChangeText={setAddr}
                  multiline
                />

                <TextInput
                  mode="outlined"
                  label="Landmark"
                  placeholder="Near ..."
                  value={landmark}
                  onChangeText={setLandmark}
                />

                <TextInput
                  mode="outlined"
                  label="Pincode"
                  placeholder="6-digit pincode"
                  value={pincode}
                  onChangeText={txt =>
                    setPincode(txt.replace(/\D/g, '').slice(0, 6))
                  }
                  keyboardType="number-pad"
                  maxLength={6}
                  error={pinInvalid}
                />
                {pinInvalid && (
                  <HelperText type="error" visible>
                    Pincode must be 6 digits.
                  </HelperText>
                )}

                <TextInput
                  mode="outlined"
                  label="Phone number"
                  placeholder="10-digit mobile"
                  value={phone}
                  onChangeText={txt =>
                    setPhone(txt.replace(/\D/g, '').slice(0, 10))
                  }
                  keyboardType="phone-pad"
                  maxLength={10}
                  error={phoneInvalid}
                />
                {phoneInvalid && (
                  <HelperText type="error" visible>
                    Phone number must be 10 digits.
                  </HelperText>
                )}

                <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                  <Button
                    mode="contained"
                    icon="content-save"
                    onPress={onSaveManual}
                  >
                    Save address
                  </Button>
                  <Button
                    mode="text"
                    icon="close"
                    onPress={() => setManualVisible(false)}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            )}
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomWrap}>
        <BottomNavigation />
      </View>
    </SafeAreaView>
  );
};

export default Address;
