// screens/Labs/LabDetails.jsx
import React, { useRef, useState } from 'react';
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
import { Card, Text, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles, theme, BOTTOM_NAV_HEIGHT } from './Styles';
import TopCustomHeader from '../../../components/TopNavBar/TopCustomHeader';
import BottomNavigation from '../../../components/BottomNavBar/BottomNavigation';

const LOCATIONS = [
  'Sample Center A',
  'Sample Center B',
  'Sample Center C',
  'Home Collection',
];

const LabsDetails = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  const test = route?.params?.test || {
    id: '0',
    name: 'Lab Test',
    description: 'Details not provided',
    price: 0,
  };

  // ---- booking form state ----
  const [selectedDate, setSelectedDate] = useState(null);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [showPicker, setShowPicker] = useState(false);
  const [expanded, setExpanded] = useState(false); 

  const openPicker = () => setShowPicker(true);
  const closePicker = () => setShowPicker(false);
  const onConfirmDate = date => {
    setSelectedDate(date);
    setShowPicker(false);
  };

  const handleLocationSelect = loc => {
    setLocation(loc);
    setExpanded(false); 
  };

  const submit = () => {
    alert(
      'Booking created for ' +
        (selectedDate ? moment(selectedDate).format('lll') : 'no date') +
        ' at ' +
        location,
    );
    navigation.navigate('Address');
  };

  // ---- animations (header + bottom nav) ----
  const scrollY = useRef(new Animated.Value(0)).current;
  const HEADER_CONTENT_HEIGHT = 56;
  const safeTop = Number.isFinite(insets?.top) ? insets.top : 0;
  const HEADER_TOTAL_HEIGHT = HEADER_CONTENT_HEIGHT + safeTop;

  // Header slides up on scroll
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_TOTAL_HEIGHT],
    outputRange: [0, -HEADER_TOTAL_HEIGHT],
    extrapolate: 'clamp',
  });

  // Bottom nav slides down on scroll up
  const bottomTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, BOTTOM_NAV_HEIGHT],
    extrapolate: 'clamp',
  });

  const bottomOpacity = scrollY.interpolate({
    inputRange: [0, 60, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Background */}
      <ImageBackground
        source={require('../../../assets/images/BackGround.png')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        pointerEvents="none"
      />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.topCustomHeader,
          local.headerOverlay,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <TopCustomHeader title={test.name} />
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
          {/* Test Details Card */}
          <Card style={styles.testCard}>
            <Card.Content>
              <Text style={[styles.title, { marginBottom: 8 }]}>
                {test.name}
              </Text>
              <Text style={[styles.subtitle, { marginBottom: 12 }]}>
                {test.description}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '800',
                  color: theme.colors.primary,
                }}
              >
                Price: ₹{test.price} + GST
              </Text>
            </Card.Content>

            {/* Location Dropdown (auto-closes on selection) */}
            <View style={{ marginTop: 10 }}>
              <List.Accordion
                title={location || 'Select Location'}
                expanded={expanded}
                onPress={() => setExpanded(!expanded)}
                left={props => (
                  <List.Icon {...props} icon="map-marker-outline" />
                )}
                style={local.dropdown}
                titleStyle={local.dropdownTitle}
                rippleColor="rgba(0,0,0,0.06)"
              >
                {LOCATIONS.map(loc => (
                  <List.Item
                    key={loc}
                    title={loc}
                    left={props => (
                      <List.Icon {...props} icon="map-marker-outline" />
                    )}
                    onPress={() => handleLocationSelect(loc)} 
                  />
                ))}
              </List.Accordion>
            </View>

            {/* Date & Time selector */}
            <TouchableOpacity style={styles.dateBtn} onPress={openPicker}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
              >
                <Icon
                  name="calendar-clock"
                  size={20}
                  color="#6B7280"
                  style={{ marginRight: 8 }}
                />
                <Text style={{ fontWeight: '700' }}>
                  {selectedDate
                    ? moment(selectedDate).format('LLLL')
                    : 'Pick date & time'}
                </Text>
              </View>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={showPicker}
              mode="datetime"
              date={selectedDate || new Date()}
              onConfirm={onConfirmDate}
              onCancel={closePicker}
              is24Hour
            />

            <TouchableOpacity style={styles.btn} onPress={submit}>
              <Text style={styles.btnText}>
                Add Location & Book Now
              </Text>
            </TouchableOpacity>
          </Card>
        </Animated.ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Navigation with animation */}
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

export default LabsDetails;

/* ----- Local styles for this screen ----- */
const local = StyleSheet.create({
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  dropdownTitle: {
    fontWeight: '700',
    color: '#111827',
  },
});
