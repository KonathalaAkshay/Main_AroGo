import React, { useCallback } from 'react';
import {
  View,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import {
  Provider,
  Card,
  Text,
  Surface,
  List,
  Divider,
  Avatar,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles, theme } from './styles';
import TopCustomHeader from './../../components/TopNavBar/TopCustomHeader';
import BottomNavigation from './../../components/BottomNavBar/BottomNavigation';

const Home = () => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Background */}
      <ImageBackground
        source={require('../../assets/images/BackGround.png')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        pointerEvents="none"
      />
      <View style={styles.topCustomHeader}>
        <TopCustomHeader title="Home" />
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
            { paddingBottom: 80 }, // add bottom padding to prevent overlap
          ]}
        >
          <Surface style={styles.surface}></Surface>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* ✅ Fixed Bottom Navigation */}
      <View style={styles.bottomWrap}>
        <BottomNavigation />
      </View>
    </SafeAreaView>
  );
};

export default Home;
