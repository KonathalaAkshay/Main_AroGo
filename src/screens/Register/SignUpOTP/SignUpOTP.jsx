import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  Provider,
  TextInput,
  Button,
  Card,
  Text,
  Surface,
  ActivityIndicator,
  Snackbar,
  Portal,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { styles, theme } from './styles';

const SignUpOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const navigation = useNavigation();

  const showSnack = msg => {
    setSnackbarText(msg);
    setSnackbarVisible(true);
  };

  const handleVerify = async () => {
    // if (!otp.trim()) {
    //   showSnack('Please enter the OTP');
    //   return;
    // }
    // setLoading(true);
    // try {
    //   // Mock API request for OTP verification
    //   await axios.post('https://jsonplaceholder.typicode.com/posts', { otp });
    //   showSnack('OTP verified successfully!');
    //   // Navigate to next screen (e.g., Home or Login)
    //   //   navigation.navigate('Login');
    // } catch (error) {
    //   showSnack('Invalid OTP. Please try again.');
    // } finally {
    //   setLoading(false);
    // }
    navigation.navigate('Profile');
  };

  return (
    <Provider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Full-screen background underlay */}
          <ImageBackground
            source={require('../../../assets/images/BackGround.png')}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <Surface style={styles.surface}>
                <Card style={styles.card}>
                  <Card.Content>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                      <Image
                        source={require('../../../assets/images/Logo.png')}
                        style={styles.logo}
                      />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Verify OTP</Text>
                    <Text style={styles.subtitle}>
                      Enter the OTP sent to your registered number / Email
                    </Text>

                    {/* OTP Input */}
                    <TextInput
                      label="Enter OTP"
                      value={otp}
                      onChangeText={setOtp}
                      mode="outlined"
                      keyboardType="number-pad"
                      maxLength={6}
                      outlineColor="#E0E3EB"
                      activeOutlineColor={theme.colors.primary}
                      left={
                        <TextInput.Icon
                          icon={props => (
                            <Icon
                              name="key-outline"
                              size={22}
                              color={props.color ?? theme.colors.primary}
                            />
                          )}
                        />
                      }
                      style={styles.input}
                    />

                    {/* Verify Button */}
                    <Button
                      mode="contained"
                      onPress={handleVerify}
                      loading={loading}
                      disabled={loading}
                      style={styles.button}
                      contentStyle={styles.buttonContent}
                      uppercase={false}
                    >
                      {loading ? (
                        <ActivityIndicator animating={true} color="white" />
                      ) : (
                        'Verify'
                      )}
                    </Button>

                    {/* Resend OTP Link */}
                    <Button
                      mode="text"
                      onPress={() => showSnack('OTP resent successfully')}
                      style={styles.linkButton}
                      uppercase={false}
                    >
                      Resend OTP
                    </Button>
                  </Card.Content>
                </Card>
              </Surface>
            </ScrollView>

            {/* Snackbar */}
            <Portal>
              <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{
                  label: 'OK',
                  onPress: () => setSnackbarVisible(false),
                }}
                wrapperStyle={{ bottom: 16 }}
                style={{
                  marginHorizontal: 20,
                  backgroundColor: snackbarText.includes('success')
                    ? '#4CAF50'
                    : snackbarText.includes('failed') ||
                      snackbarText.includes('error')
                    ? '#F44336'
                    : '#069494',
                }}
                theme={{ colors: { onSurface: '#FFFFFF' } }}
              >
                {snackbarText}
              </Snackbar>
            </Portal>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </Provider>
  );
};

export default SignUpOTP;
