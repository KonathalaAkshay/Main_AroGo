import React, { useMemo, useRef } from 'react';
import {
  View,
  ImageBackground,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles, theme, BOTTOM_NAV_HEIGHT } from './styles';
import TopCustomHeader from './../../components/TopNavBar/TopCustomHeader';
import BottomNavigation from './../../components/BottomNavBar/BottomNavigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ActionCard = ({ iconName, title, subtitle, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card style={localStyles.card}>
        <Card.Content style={localStyles.cardContent}>
          <View style={localStyles.left}>
            <Icon name={iconName} size={28} />
          </View>
          <View style={localStyles.middle}>
            <Text variant="titleMedium">{title}</Text>
            <Text
              variant="bodySmall"
              numberOfLines={2}
              style={localStyles.description}
            >
              {subtitle}
            </Text>
          </View>
          <View style={localStyles.right}>
            <Icon name="chevron-right" size={28} />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const Home = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // --- Shared scroll value ---
  const scrollY = useRef(new Animated.Value(0)).current;

  // --- Header hide on scroll up ---
  const HEADER_CONTENT_HEIGHT = 56;
  const HEADER_TOTAL_HEIGHT = HEADER_CONTENT_HEIGHT + insets.top;
  const headerTranslateY = useMemo(() => {
    const clamped = Animated.diffClamp(scrollY, 0, HEADER_TOTAL_HEIGHT);
    return clamped.interpolate({
      inputRange: [0, HEADER_TOTAL_HEIGHT],
      outputRange: [0, -HEADER_TOTAL_HEIGHT],
    });
  }, [scrollY, HEADER_TOTAL_HEIGHT]);

  // --- Bottom nav hide on scroll up (slide DOWN) ---
  const bottomClamp = useMemo(
    () => Animated.diffClamp(scrollY, 0, 100),
    [scrollY],
  );
  const bottomTranslateY = useMemo(() => {
    return bottomClamp.interpolate({
      inputRange: [0, 100],
      outputRange: [0, BOTTOM_NAV_HEIGHT],
      extrapolate: 'clamp',
    });
  }, [bottomClamp]);

  const bottomOpacity = useMemo(() => {
    return bottomClamp.interpolate({
      inputRange: [0, 60, 100],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
    });
  }, [bottomClamp]);

  const handleBookDoctor = () => navigation.navigate('BookingAppointment');
  const handleBookLab = () => navigation.navigate('Labs');
  const handleBookMedicines = () => navigation.navigate('Medicines');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Background */}
      <ImageBackground
        source={require('../../assets/images/BackGround.png')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        pointerEvents="none"
      />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.topCustomHeader,
          styles.headerOverlay,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <TopCustomHeader title="Home" />
      </Animated.View>

      {/* Main Content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
      >
        <Animated.ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingTop: HEADER_TOTAL_HEIGHT + 8 },
          ]}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
        >
          {/* Cards wrapper */}
          <View style={localStyles.cardWrapper}>
            <ActionCard
              iconName="stethoscope"
              title="Book a Doctor"
              subtitle="Schedule an appointment with a nearby doctor — choose date, time and clinic."
              onPress={handleBookDoctor}
            />

            <ActionCard
              iconName="test-tube"
              title="Book a Lab Appointment"
              subtitle="Book lab tests at a nearby diagnostic centre. Choose tests, date and time."
              onPress={handleBookLab}
            />

            <ActionCard
              iconName="pill"
              title="Book Medicines"
              subtitle="Order prescribed medicines or OTC items with home delivery or clinic pickup."
              onPress={handleBookMedicines}
            />
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>

      <Animated.View
        style={[
          styles.bottomWrap,
          {
            transform: [{ translateY: bottomTranslateY }],
            opacity: bottomOpacity,
          },
        ]}
      >
        <BottomNavigation />
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;

const localStyles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 16,
  },
  card: {
    height: 88,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  left: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: {
    flex: 1,
    paddingHorizontal: 8,
  },
  right: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    marginTop: 4,
  },
});
