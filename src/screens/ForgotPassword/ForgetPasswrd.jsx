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
  TextInput,
  Button,
  Card,
  Text,
  Surface,
  Snackbar,
  Portal,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { styles, theme } from './Styles';

const ForgetPassword = () => {
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
    if (!otp.trim() || otp.trim().length !== 6) {
      showSnack('Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      // TODO: plug in your real verify-OTP API here
      // If success:
      showSnack('OTP verified successfully!');
      navigation.navigate('Login');
    } catch (e) {
      showSnack('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require('../../assets/images/BackGround.png')}
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
                  <View style={styles.logoContainer}>
                    <Image
                      source={require('../../assets/images/Logo.png')}
                      style={styles.logo}
                    />
                  </View>

                  <Text style={styles.title}>Verify OTP</Text>
                  <Text style={styles.subtitle}>
                    Enter the OTP sent to your registered number / Email
                  </Text>

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

                  <Button
                    mode="contained"
                    onPress={handleVerify}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                  >
                    Verify
                  </Button>

                  <Button
                    mode="text"
                    onPress={() => showSnack('OTP resent successfully')}
                    style={styles.linkButton}
                  >
                    Resend OTP
                  </Button>
                </Card.Content>
              </Card>
            </Surface>
          </ScrollView>

          <Portal>
            <Snackbar
              visible={snackbarVisible}
              onDismiss={() => setSnackbarVisible(false)}
              duration={3000}
              action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
              wrapperStyle={{ bottom: 16 }}
              style={{
                marginHorizontal: 20,
                backgroundColor: snackbarText.toLowerCase().includes('success')
                  ? '#4CAF50'
                  : snackbarText.toLowerCase().includes('invalid') ||
                    snackbarText.toLowerCase().includes('error') ||
                    snackbarText.toLowerCase().includes('failed')
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
  );
};

export default ForgetPassword;
