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
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles, theme } from './styles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const navigation = useNavigation();

  const showSnack = msg => {
    setSnackbarText(msg);
    setSnackbarVisible(true);
  };

  handleForgotPassword = () => {
    if (!email) {
      showSnack('Please fill in all fields');
      return;
    }

    navigation.navigate('ForgotPassword');
  };

  const handleLogin = async () => {
    // if (!email || !password) {
    //   showSnack('Please fill in all fields');
    //   return;
    // }
    // setLoading(true);
    // try {
    //   await axios.post('https://jsonplaceholder.typicode.com/posts', {
    //     email,
    //     password,
    //   });
    //   await AsyncStorage.setItem('userToken', 'mockToken123');
    //   showSnack('Login successful!');
    //   navigation.navigate('Home');
    // } catch (error) {
    //   showSnack('Login failed. Please try again.');
    // } finally {
    //   setLoading(false);
    // }

    navigation.navigate('Home');
  };

  return (
    <Provider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Full-screen background underlay */}
          <ImageBackground
            source={require('../../assets/images/BackGround.png')}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover" // use "contain" if you want full image without cropping
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
                        source={require('../../assets/images/Logo.png')}
                        style={styles.logo}
                      />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to your account</Text>

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
                      returnKeyType="next"
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
                      theme={{
                        colors: {
                          primary: theme.colors.primary,
                          placeholder: theme.colors.placeholder,
                        },
                      }}
                    />

                    {/* Password Input */}
                    <TextInput
                      label="Password"
                      value={password}
                      onChangeText={setPassword}
                      mode="outlined"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="password"
                      returnKeyType="done"
                      textColor="#000"
                      outlineColor="#E0E3EB"
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
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        />
                      }
                      style={styles.input}
                      theme={{
                        colors: {
                          primary: theme.colors.primary,
                          placeholder: theme.colors.placeholder,
                        },
                      }}
                    />

                    {/* Login Button */}
                    <Button
                      mode="contained"
                      onPress={handleLogin}
                      loading={loading}
                      disabled={loading}
                      style={styles.button}
                      contentStyle={styles.buttonContent}
                      uppercase={false}
                    >
                      {loading ? (
                        <ActivityIndicator animating={true} color="white" />
                      ) : (
                        'Login'
                      )}
                    </Button>

                    {/* Forgot Password */}
                    <Button
                      mode="text"
                      onPress={handleForgotPassword}
                      style={styles.linkButton}
                      uppercase={false}
                    >
                      Forgot Password?
                    </Button>

                    {/* Sign Up Link */}
                    <View style={styles.signUpContainer}>
                      <Text style={styles.signUpText}>
                        Don&apos;t have an account?{' '}
                      </Text>
                      <Button
                        mode="text"
                        onPress={() => navigation.navigate('SignUp')}
                        style={styles.linkButton}
                        uppercase={false}
                      >
                        Sign Up
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              </Surface>
            </ScrollView>

            {/* Snackbar (Portal renders above everything) */}
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

export default Login;
