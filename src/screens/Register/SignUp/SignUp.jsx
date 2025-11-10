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
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { styles, theme } from './styles';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const navigation = useNavigation();

  const showSnack = msg => {
    setSnackbarText(msg);
    setSnackbarVisible(true);
  };

  const handleSignUp = async () => {
    // if (!name || !email || !phone || !password || !confirmPassword) {
    //   showSnack('Please fill in all fields');
    //   return;
    // }

    // if (password !== confirmPassword) {
    //   showSnack('Passwords do not match');
    //   return;
    // }

    // setLoading(true);
    // try {
    //   await axios.post('https://jsonplaceholder.typicode.com/posts', {
    //     name,
    //     email,
    //     phone,
    //     password,
    //   });
    //   showSnack('Account created successfully!');
    //   navigation.navigate('Login');
    // } catch (error) {
    //   showSnack('Sign up failed. Please try again.');
    // } finally {
    //   setLoading(false);
    // }
    navigation.navigate('SignUpOTP');
  };

  return (
    <Provider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Background */}
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
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>

                    {/* Name Input */}
                    <TextInput
                      label="Full Name"
                      value={name}
                      onChangeText={setName}
                      mode="outlined"
                      autoCapitalize="words"
                      autoCorrect={false}
                      outlineColor="#E0E3EB"
                      activeOutlineColor={theme.colors.primary}
                      left={
                        <TextInput.Icon
                          icon={props => (
                            <Icon
                              name="account-outline"
                              size={22}
                              color={props.color ?? theme.colors.primary}
                            />
                          )}
                        />
                      }
                      style={styles.input}
                    />

                    {/* Email Input */}
                    <TextInput
                      label="Email"
                      value={email}
                      onChangeText={setEmail}
                      mode="outlined"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      outlineColor="#E0E3EB"
                      activeOutlineColor={theme.colors.primary}
                      left={
                        <TextInput.Icon
                          icon={props => (
                            <Icon
                              name="email-outline"
                              size={22}
                              color={props.color ?? theme.colors.primary}
                            />
                          )}
                        />
                      }
                      style={styles.input}
                    />

                    {/* Phone Input */}
                    <TextInput
                      label="Phone Number"
                      value={phone}
                      onChangeText={setPhone}
                      mode="outlined"
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      outlineColor="#E0E3EB"
                      activeOutlineColor={theme.colors.primary}
                      left={
                        <TextInput.Icon
                          icon={props => (
                            <Icon
                              name="phone-outline"
                              size={22}
                              color={props.color ?? theme.colors.primary}
                            />
                          )}
                        />
                      }
                      style={styles.input}
                    />

                    {/* Password Input */}
                    <TextInput
                      label="Password"
                      value={password}
                      onChangeText={setPassword}
                      mode="outlined"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      outlineColor="#E0E3EB"
                      textColor="#000"
                      activeOutlineColor={theme.colors.primary}
                      left={
                        <TextInput.Icon
                          icon={props => (
                            <Icon
                              name="lock-outline"
                              size={22}
                              color={props.color ?? theme.colors.primary}
                            />
                          )}
                        />
                      }
                      right={
                        <TextInput.Icon
                          icon={showPassword ? 'eye-off' : 'eye'}
                          onPress={() => setShowPassword(v => !v)}
                          forceTextInputFocus={false}
                        />
                      }
                      style={styles.input}
                    />

                    {/* Confirm Password Input */}
                    <TextInput
                      label="Confirm Password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      mode="outlined"
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      outlineColor="#E0E3EB"
                      textColor="#000"
                      activeOutlineColor={theme.colors.primary}
                      left={
                        <TextInput.Icon
                          icon={props => (
                            <Icon
                              name="lock-check-outline"
                              size={22}
                              color={props.color ?? theme.colors.primary}
                            />
                          )}
                        />
                      }
                      right={
                        <TextInput.Icon
                          icon={showConfirmPassword ? 'eye-off' : 'eye'}
                          onPress={() => setShowConfirmPassword(v => !v)}
                          forceTextInputFocus={false}
                        />
                      }
                      style={styles.input}
                    />

                    {/* Create Account Button */}
                    <Button
                      mode="contained"
                      onPress={handleSignUp}
                      loading={loading}
                      disabled={loading}
                      style={styles.button}
                      contentStyle={styles.buttonContent}
                      uppercase={false}
                    >
                      {loading ? (
                        <ActivityIndicator animating={true} color="white" />
                      ) : (
                        'Create Account'
                      )}
                    </Button>

                    {/* Already have account */}
                    <View style={styles.signUpContainer}>
                      <Text style={styles.signUpText}>
                        Already have an account?{' '}
                      </Text>
                      <Button
                        mode="text"
                        onPress={() => navigation.navigate('Login')}
                        style={styles.linkButton}
                        uppercase={false}
                      >
                        Login
                      </Button>
                    </View>
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
                style={{ marginHorizontal: 20, backgroundColor: '#ff0000' }}
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

export default SignUp;
