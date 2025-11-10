// screens/Labs/Labs.jsx
import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  ImageBackground,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles, theme, BOTTOM_NAV_HEIGHT } from './Styles';
import TopCustomHeader from '../../../components/TopNavBar/TopCustomHeader';
import BottomNavigation from '../../../components/BottomNavBar/BottomNavigation';

// Sample lab test data
const TESTS = [
  {
    id: '1',
    name: 'Complete Blood Count (CBC)',
    description: 'Hemoglobin, WBC, Platelets',
    price: 350,
  },
  {
    id: '2',
    name: 'Thyroid Profile',
    description: 'T3, T4, TSH levels',
    price: 400,
  },
  {
    id: '3',
    name: 'Liver Function Test (LFT)',
    description: 'ALT, AST, Bilirubin, Albumin',
    price: 500,
  },
  {
    id: '4',
    name: 'Kidney Function Test (KFT)',
    description: 'Urea, Creatinine, Uric Acid',
    price: 550,
  },
  {
    id: '5',
    name: 'Lipid Profile',
    description: 'Cholesterol, HDL, LDL, Triglycerides',
    price: 600,
  },
  {
    id: '6',
    name: 'Diabetes Screening',
    description: 'Fasting Blood Sugar, HbA1c',
    price: 400,
  },
  {
    id: '7',
    name: 'Vitamin D Test',
    description: '25-Hydroxy Vitamin D Levels',
    price: 650,
  },
  {
    id: '8',
    name: 'Iron Studies',
    description: 'Serum Iron, TIBC, Ferritin',
    price: 550,
  },
  {
    id: '9',
    name: 'Electrolyte Panel',
    description: 'Sodium, Potassium, Chloride, Bicarbonate',
    price: 450,
  },
  {
    id: '10',
    name: 'Urine Routine & Microscopy',
    description: 'Protein, Sugar, RBC, WBC',
    price: 300,
  },
];

const Labs = () => {
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
  // Clamp to a small distance (e.g., 100px) to decide hide/show
  const bottomClamp = useMemo(
    () => Animated.diffClamp(scrollY, 0, 100),
    [scrollY],
  );
  const bottomTranslateY = useMemo(() => {
    return bottomClamp.interpolate({
      inputRange: [0, 100], // small upward scroll hides it
      outputRange: [0, BOTTOM_NAV_HEIGHT], // slide down by its height
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

  // --- Search filter ---
  const [query, setQuery] = useState('');
  const filteredTests = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TESTS;
    return TESTS.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }, [query]);

  const handleCardPress = test => {
    navigation.navigate('LabDetails', { test });
  };

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
          styles.headerOverlay,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <TopCustomHeader title="Labs" />
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
          {/* Search Bar */}
          <View style={styles.searchRow}>
            <Icon name="magnify" size={20} style={styles.icon} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search tests or categories..."
              placeholderTextColor="#9EA3A8"
              returnKeyType="search"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.iconRightHit} onPress={() => {}}>
              <Icon name="microphone" size={20} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#fff',
              marginBottom: 12,
            }}
          >
            Available Lab Tests
          </Text>

          {/* Test Cards */}
          {filteredTests.map(test => (
            <Card
              key={test.id}
              style={styles.testCard}
              onPress={() => handleCardPress(test)}
            >
              <Card.Content style={styles.testCardContent}>
                <Icon
                  name="flask-outline"
                  size={28}
                  color={theme.colors.primary}
                  style={{ marginRight: 12 }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 16, fontWeight: '600', color: '#333' }}
                  >
                    {test.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
                    {test.description}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: theme.colors.primary,
                      marginTop: 4,
                    }}
                  >
                    ₹{test.price}
                  </Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={28}
                  color="#999"
                  style={{ marginLeft: 6 }}
                />
              </Card.Content>
            </Card>
          ))}
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

export default Labs;
