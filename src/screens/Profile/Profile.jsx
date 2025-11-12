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
import { styles, theme } from './styles'; // reuse your styles + theme
import TopCustomHeader from './../../components/TopNavBar/TopCustomHeader';
import BottomNavigation from './../../components/BottomNavBar/BottomNavigation';

const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const user = (route.params && route.params.user) || {
    name: 'Akshay Konathala',
    phone: '+91 98765 43210',
    email: 'Akshay@gmail.com',
  };

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
        <TopCustomHeader title="Profile" />
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
          <Surface style={styles.surface}>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.headerWrap}>
                  <Avatar.Text
                    size={56}
                    label={initials || 'U'}
                    color="#fff"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.title}>{user.name}</Text>
                  </View>
                </View>

                {/* User Info */}
                <View style={{ marginTop: 8, marginBottom: 16 }}>
                  <View style={styles.row}>
                    <Icon
                      name="account-outline"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.valueText}>{user.name}</Text>
                  </View>
                  <View style={styles.row}>
                    <Icon
                      name="phone-outline"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.valueText}>{user.phone}</Text>
                  </View>
                  <View style={styles.row}>
                    <Icon
                      name="email-outline"
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.valueText}>{user.email}</Text>
                  </View>
                </View>

                <Divider />

                {/* Actions */}
                <Text style={styles.sectionLabel}>Actions</Text>

                <List.Section style={{ marginTop: 4 }}>
                  <List.Item
                    title="Order History"
                    description="View your Current & past orders"
                    left={props => <List.Icon {...props} icon="cart-outline" />}
                    right={props => (
                      <List.Icon {...props} icon="chevron-right" />
                    )}
                    onPress={() => navigation.navigate('Order')}
                  />
                  <List.Item
                    title="Personal Details"
                    description="View and edit your personal info"
                    left={props => (
                      <List.Icon {...props} icon="account-cog-outline" />
                    )}
                    right={props => (
                      <List.Icon {...props} icon="chevron-right" />
                    )}
                  />
                  <List.Item
                    title="Settings"
                    description="Preferences and app settings"
                    left={props => <List.Icon {...props} icon="cog-outline" />}
                    right={props => (
                      <List.Icon {...props} icon="chevron-right" />
                    )}
                  />
                  <List.Item
                    title="About"
                    description="Know about us"
                    left={props => (
                      <List.Icon {...props} icon="information-outline" />
                    )}
                    right={props => (
                      <List.Icon {...props} icon="chevron-right" />
                    )}
                  />
                  <List.Item
                    title="Log Out"
                    titleStyle={{ color: '#F44336', fontWeight: '600' }}
                    left={props => (
                      <List.Icon {...props} icon="logout" color="#F44336" />
                    )}
                  />
                </List.Section>
              </Card.Content>
            </Card>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.bottomWrap}>
        <BottomNavigation />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
