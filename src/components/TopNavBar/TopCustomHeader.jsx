import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TopCustomHeader = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Screen Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Logo */}
      <Image
        source={require('../../assets/images/Logo.png')}
        style={styles.logo}
      />
    </View>
  );
};

export default TopCustomHeader;

const styles = StyleSheet.create({
  container: {
    height: 56,
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
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'left',
  },
  logo: {
    width: 95,
    height: 60,
    resizeMode: 'contain',
  },
});
