// BottomNavigationBar.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// type Props = {
//   translateY?: Animated.AnimatedInterpolation<string | number> | number;
//   opacity?: Animated.AnimatedInterpolation<string | number> | number;
//   /** if true, uses navigation.replace() so back button won’t traverse other tabs */
//   replaceOnPress?: boolean;
// };

const BottomNavigationBar = ({
  translateY = 0,
  opacity = 1,
  replaceOnPress = false,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const activeTab = route.name;

  const tabs = [
    { name: 'Home', label: 'Home', icon: 'home-outline' },
    { name: 'Labs', label: 'Labs', icon: 'test-tube' },
    { name: 'Search', label: 'Search', icon: 'magnify' },
    { name: 'Medicines', label: 'Medicines', icon: 'pill' },
    { name: 'Profile', label: 'Profile', icon: 'account-circle-outline' },
  ];

  const handlePress = name => {
    if (name === activeTab) return;
    if (replaceOnPress) navigation.replace(name);
    else navigation.navigate(name);
  };

  return (
    <Animated.View
      style={[
        styles.navContainer,
        {
          paddingBottom: Math.max(insets.bottom, hp('1%')),
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.name;
        const isProfile = tab.name === 'Profile';

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => handlePress(tab.name)}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            <View
              style={[
                styles.iconContainer,
                isActive && styles.activeRing,
                isProfile && styles.profilePill,
              ]}
            >
              <Icon
                name={tab.icon}
                size={wp('6%')}
                color={
                  isProfile
                    ? '#fff'
                    : isActive
                    ? '#069494' // primary highlight
                    : '#25605C'
                }
              />
            </View>
            <Text
              style={[
                styles.label,
                { color: isActive ? '#069494' : '#25605C' },
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#F9FCFF',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: hp('1%'),
    borderTopWidth: Platform.OS === 'android' ? 0.6 : 0.3,
    borderTopColor: '#E5E7EB',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tab: {
    alignItems: 'center',
    width: wp('18%'),
  },
  iconContainer: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeRing: {
    borderWidth: 2,
    borderColor: '#069494',
  },
  profilePill: {
    backgroundColor: '#069494',
    borderRadius: wp('6%'),
  },
  label: {
    marginTop: hp('0.5%'),
    fontSize: wp('3.2%'),
    fontWeight: '500',
  },
});

export default BottomNavigationBar;
