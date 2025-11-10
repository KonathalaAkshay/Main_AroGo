import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TopCustomHeader = ({ title }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    // Safe area wrapper to avoid overlap
    <SafeAreaView edges={['top']} style={{ backgroundColor: '#069494' }}>
      {/* Set status bar style/background to match header */}
      <StatusBar barStyle="light-content" backgroundColor="#069494" />

      <View style={[styles.container, { paddingTop: 0 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>

        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {title}
        </Text>

        <Image source={require('../../assets/images/Logo.png')} style={styles.logo} />
      </View>
    </SafeAreaView>
  );
};

export default TopCustomHeader;

const styles = StyleSheet.create({
  container: {
    height: 56, // content height (safe area padding is added by SafeAreaView)
    backgroundColor: '#069494',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    padding: 6,
    marginRight: 6,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 20, // slightly reduced so long titles don’t collide with logo
    fontWeight: '800',
    textAlign: 'left',
  },
  logo: {
    width: 95,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 8,
  },
});
