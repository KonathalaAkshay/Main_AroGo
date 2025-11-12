import React, { useCallback, useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import {
  Provider as PaperProvider,
  Surface,
  Text,
  List,
  Divider,
  Button,
  TextInput,
  Avatar,
  HelperText,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import { BOTTOM_NAV_HEIGHT } from './Styles.jsx';
import TopCustomHeader from '../../components/TopNavBar/TopCustomHeader.jsx';
import BottomNavigation from '../../components/BottomNavBar/BottomNavigation';
import { styles } from './Styles.jsx';

const Payments = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

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

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI / Netbanking state
  const [upiId, setUpiId] = useState('');
  const [vpaValid, setVpaValid] = useState(true);

  // Netbanking / Wallet mock
  const [mobile, setMobile] = useState('');

  // Amount for demo
  const [amount, setAmount] = useState('499.00');

  // Payment methods list
  const methods = [
    { key: 'card', label: 'Card (Credit / Debit)', icon: 'credit-card' },
    {
      key: 'upi',
      label: 'UPI (Google Pay, PhonePe, Paytm UPI)',
      icon: 'bank-transfer',
    },
    // { key: 'netbanking', label: 'Netbanking / IMPS', icon: 'bank' },
    { key: 'cod', label: 'Cash on Delivery (if available)', icon: 'cash' },
  ];

  // Helpers
  const showMessage = msg => setSnackbar({ visible: true, message: msg });

  const validateCard = () => {
    // very basic validation. In production use Luhn check and server-side tokenization
    return (
      cardNumber.replace(/\s+/g, '').length >= 13 &&
      cvv.length >= 3 &&
      expiry.length >= 3 &&
      cardName.length > 1
    );
  };

  const handlePayWithCard = async () => {
    if (!validateCard()) {
      showMessage('Please fill valid card details');
      return;
    }
    setLoading(true);
    try {
      // === PRODUCTION NOTE ===
      // Do NOT process card details directly from the app to your servers without PCI compliance.
      // Use a payment SDK (Stripe React Native, Braintree, Razorpay, PayU SDK etc.) to tokenize card data
      // and send a token to your backend to create a charge/PaymentIntent.
      // The code below is a mocked flow to show UI only.

      await new Promise(r => setTimeout(r, 1400));
      showMessage(
        'Card payment simulated — integrate Stripe/Provider SDK for real payment.',
      );
    } catch (e) {
      showMessage('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const openUPI = async vpa => {
    // Build a UPI deep link which most UPI apps can handle
    // Example UPI URI: upi://pay?pa=example@upi&pn=Receiver&am=10&cu=INR
    const uri = `upi://pay?pa=${encodeURIComponent(
      vpa,
    )}&pn=${encodeURIComponent('Merchant Name')}&am=${encodeURIComponent(
      amount,
    )}&cu=INR&tn=${encodeURIComponent('Payment for order')}`;

    try {
      const supported = await Linking.canOpenURL(uri);
      if (!supported) {
        Alert.alert(
          'UPI not supported',
          'No UPI app found that can handle the payment. You can copy the UPI ID and pay using your UPI app.',
        );
        return;
      }
      Linking.openURL(uri);
    } catch (err) {
      Alert.alert('Error', 'Could not open UPI app');
    }
  };

  const handleUPIPay = async () => {
    if (!upiId || !upiId.includes('@')) {
      setVpaValid(false);
      showMessage('Enter a valid UPI ID (e.g. name@bank)');
      return;
    }
    setVpaValid(true);
    // For best UX, create an order on your server (amount, orderId) and use that as a reference
    showMessage('Opening UPI app...');
    openUPI(upiId);
  };

  const handleNetbanking = async () => {
    // open a hosted netbanking flow via your provider (PayU, Razorpay, Stripe + PSP)
    showMessage(
      'Netbanking flow should open in webview or provider SDK. This is a demo.',
    );
  };

  const handleWallet = async () => {
    showMessage(
      'Wallet payment — integrate provider SDK or open wallet deep link.',
    );
  };

  const handleWebCheckout = async () => {
    // Typically you create a payment session on your server and open the hosted checkout URL
    // For example: Stripe Checkout session or your PSP hosted page
    const demoUrl =
      'https://example.com/hosted-checkout?amount=' +
      encodeURIComponent(amount);
    const can = await Linking.canOpenURL(demoUrl);
    if (can) Linking.openURL(demoUrl);
    else showMessage('Unable to open web checkout in this demo');
  };

  const handleCOD = () => {
    Alert.alert(
      'Confirm COD',
      `Place order with Cash on Delivery for ₹${amount}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, place order',
          onPress: () => showMessage('Order placed with Cash on Delivery'),
        },
      ],
    );
  };

  // Form UI for selected method
  const renderMethodForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <View>
            <TextInput
              label="Card holder name"
              value={cardName}
              onChangeText={setCardName}
              style={localStyles.input}
              left={
                <TextInput.Icon
                  name={() => <Icon name="account" size={20} />}
                />
              }
            />
            <TextInput
              label="Card number"
              value={cardNumber}
              onChangeText={t => setCardNumber(t.replace(/[^0-9 ]/g, ''))}
              keyboardType="number-pad"
              style={localStyles.input}
              left={
                <TextInput.Icon
                  name={() => <Icon name="credit-card-outline" size={20} />}
                />
              }
            />
            <View style={localStyles.row}>
              <TextInput
                label="Expiry (MM/YY)"
                value={expiry}
                onChangeText={setExpiry}
                style={[localStyles.input, { flex: 1, marginRight: 8 }]}
              />
              <TextInput
                label="CVV"
                value={cvv}
                onChangeText={t => setCvv(t.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                style={[localStyles.input, { width: 120 }]}
                secureTextEntry
              />
            </View>

            <Button
              mode="contained"
              onPress={handlePayWithCard}
              style={localStyles.payBtn}
              loading={loading}
            >
              Pay ₹{amount}
            </Button>
            <HelperText type="info">
              This demo uses a mocked card flow. Use provider SDKs for
              production.
            </HelperText>
          </View>
        );

      case 'upi':
        return (
          <View>
            <TextInput
              label="Enter UPI ID (VPA)"
              value={upiId}
              onChangeText={t => setUpiId(t)}
              style={localStyles.input}
              left={
                <TextInput.Icon
                  name={() => <Icon name="qrcode-scan" size={20} />}
                />
              }
            />
            {!vpaValid && (
              <HelperText type="error">Enter a valid UPI ID</HelperText>
            )}
            <Button
              mode="contained"
              onPress={handleUPIPay}
              style={localStyles.payBtn}
            >
              Pay with UPI — ₹{amount}
            </Button>
            <HelperText type="info">
              This will open the default UPI app on the device.
            </HelperText>
          </View>
        );

      case 'netbanking':
        return (
          <View>
            <TextInput
              label="Mobile / Account"
              value={mobile}
              onChangeText={setMobile}
              style={localStyles.input}
            />
            <Button
              mode="contained"
              onPress={handleNetbanking}
              style={localStyles.payBtn}
            >
              Continue to Netbanking
            </Button>
            <HelperText type="info">
              Netbanking usually opens a hosted bank page via your PSP.
            </HelperText>
          </View>
        );

      case 'cod':
        return (
          <View>
            <Button
              mode="contained"
              onPress={handleCOD}
              style={localStyles.payBtn}
            >
              Place Order (COD) — ₹{amount}
            </Button>
          </View>
        );

      default:
        return (
          <View>
            <Text>Select a payment method to continue</Text>
          </View>
        );
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          source={require('../../assets/images/BackGround.png')}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          pointerEvents="none"
        />
        <Animated.View
          style={[
            styles.topCustomHeader,
            styles.headerOverlay,
            { transform: [{ translateY: headerTranslateY }] },
          ]}
        >
          <TopCustomHeader title="Payment gateway" />
        </Animated.View>

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
            <Surface style={localStyles.surface}>
              <View style={localStyles.amountRow}>
                <Avatar.Icon size={48} icon="currency-inr" />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600' }}>
                    Amount to pay
                  </Text>
                  <Text style={{ fontSize: 22, fontWeight: '700' }}>
                    ₹{amount}
                  </Text>
                </View>
              </View>

              <Divider style={{ marginVertical: 12 }} />

              <List.Section>
                {methods.map(m => (
                  <List.Item
                    key={m.key}
                    title={m.label}
                    left={props => <List.Icon {...props} icon={m.icon} />}
                    right={() => (
                      <Button compact onPress={() => setSelectedMethod(m.key)}>
                        {selectedMethod === m.key ? 'Selected' : 'Choose'}
                      </Button>
                    )}
                    onPress={() => setSelectedMethod(m.key)}
                  />
                ))}
              </List.Section>

              <Divider style={{ marginVertical: 12 }} />

              <View style={localStyles.formContainer}>
                {renderMethodForm()}
              </View>

              {loading && (
                <View style={{ marginTop: 12 }}>
                  <ActivityIndicator animating size={28} />
                </View>
              )}

              <View style={{ height: 44 }} />
            </Surface>
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

        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar(s => ({ ...s, visible: false }))}
          duration={3000}
        >
          {snackbar.message}
        </Snackbar>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default Payments;

const localStyles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
  },
  surface: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    padding: 16,
    backgroundColor: '#069494',
  },
  headerText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  bottomWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    padding: 10,
  },
  bottomNav: { alignItems: 'center' },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  input: { marginVertical: 8 },
  payBtn: { marginTop: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  formContainer: { marginTop: 8 },
});
