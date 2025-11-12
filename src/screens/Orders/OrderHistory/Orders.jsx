import React, { useCallback, useState, useMemo, useRef } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Animated,
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
import { BOTTOM_NAV_HEIGHT } from './Styles.jsx';
import TopCustomHeader from '../../../components/TopNavBar/TopCustomHeader.jsx';
import BottomNavigation from '../../../components/BottomNavBar/BottomNavigation.jsx';
import { styles } from './Styles.jsx';

const Order = () => {
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;

  const HEADER_CONTENT_HEIGHT = 30;
  const HEADER_TOTAL_HEIGHT = HEADER_CONTENT_HEIGHT + insets.top;
  const headerTranslateY = useMemo(() => {
    const clamped = Animated.diffClamp(scrollY, 0, HEADER_TOTAL_HEIGHT);
    return clamped.interpolate({
      inputRange: [0, HEADER_TOTAL_HEIGHT],
      outputRange: [0, -HEADER_TOTAL_HEIGHT],
    });
  }, [scrollY, HEADER_TOTAL_HEIGHT]);

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

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orders, setOrders] = useState([
    {
      id: 'ORD-1001',
      title: 'Medicine order — Paracetamol',
      amount: '₹299',
      date: '2025-10-28',
      status: 'completed',
      subtitle: 'Delivered to home',
    },
    {
      id: 'ORD-1002',
      title: 'Blood test - CBC',
      amount: '₹499',
      date: '2025-11-02',
      status: 'in_progress',
      subtitle: 'Sample pickup scheduled',
    },
    {
      id: 'ORD-1003',
      title: 'Medicine order — Insulin',
      amount: '₹1,299',
      date: '2025-09-14',
      status: 'cancelled',
      subtitle: 'Cancelled by user',
    },
    {
      id: 'ORD-1004',
      title: 'Antibiotics pack',
      amount: '₹599',
      date: '2025-11-08',
      status: 'in_progress',
      subtitle: 'Out for delivery',
    },
    {
      id: 'ORD-1005',
      title: 'Vitamin D - monthly',
      amount: '₹199',
      date: '2025-08-30',
      status: 'completed',
      subtitle: 'Picked up from store',
    },
  ]);

  const grouped = useMemo(() => {
    return {
      completed: orders.filter(o => o.status === 'completed'),
      in_progress: orders.filter(o => o.status === 'in_progress'),
      cancelled: orders.filter(o => o.status === 'cancelled'),
    };
  }, [orders]);

  const formatDate = dateStr => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  // --- Snackbar State ---
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const onPressOrder = order => {
    const message = `${order.title}\nStatus: ${order.status.replace(
      '_',
      ' ',
    )}\nAmount: ${order.amount}\nDate: ${formatDate(order.date)}`;
    setSnackbarMsg(message);
    setSnackbarVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View
        style={[
          styles.topCustomHeader,
          styles.headerOverlay,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <TopCustomHeader title="Order History" />
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
          {loadingOrders ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator animating size="large" />
              <Text style={{ marginTop: 10 }}>Loading orders...</Text>
            </View>
          ) : (
            <List.Section>
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 24,
                  color: '#333',
                }}
              >
                Your Orders
              </Text>

              {/* Completed */}
              <List.Accordion
                title={`Completed (${grouped.completed.length})`}
                left={props => (
                  <List.Icon {...props} icon="check-circle-outline" />
                )}
              >
                {grouped.completed.length === 0 ? (
                  <List.Item title="No completed orders" />
                ) : (
                  grouped.completed.map(order => (
                    <List.Item
                      key={order.id}
                      title={order.title}
                      description={`${order.subtitle} • ${formatDate(
                        order.date,
                      )} • ${order.amount}`}
                      onPress={() => onPressOrder(order)}
                      left={props => (
                        <Avatar.Icon
                          {...props}
                          icon="package-variant-closed"
                          size={40}
                          style={{ backgroundColor: '#069494' }}
                        />
                      )}
                      right={props => (
                        <Text
                          style={{
                            alignSelf: 'center',
                            marginRight: 8,
                            color: '#10B981',
                          }}
                        >
                          Done
                        </Text>
                      )}
                    />
                  ))
                )}
              </List.Accordion>

              <Divider />

              {/* In Progress */}
              <List.Accordion
                title={`In Progress (${grouped.in_progress.length})`}
                left={props => <List.Icon {...props} icon="truck-fast" />}
              >
                {grouped.in_progress.length === 0 ? (
                  <List.Item title="No in-progress orders" />
                ) : (
                  grouped.in_progress.map(order => (
                    <List.Item
                      key={order.id}
                      title={order.title}
                      description={`${order.subtitle} • ${formatDate(
                        order.date,
                      )} • ${order.amount}`}
                      onPress={() => onPressOrder(order)}
                      left={props => (
                        <Avatar.Icon
                          {...props}
                          icon="clock-outline"
                          size={40}
                          style={{ backgroundColor: '#069494' }}
                        />
                      )}
                      right={props => (
                        <Text
                          style={{
                            alignSelf: 'center',
                            marginRight: 8,
                            color: '#F59E0B',
                          }}
                        >
                          In progress
                        </Text>
                      )}
                    />
                  ))
                )}
              </List.Accordion>

              <Divider />

              {/* Cancelled */}
              <List.Accordion
                title={`Cancelled (${grouped.cancelled.length})`}
                left={props => (
                  <List.Icon {...props} icon="close-circle-outline" />
                )}
              >
                {grouped.cancelled.length === 0 ? (
                  <List.Item title="No cancelled orders" />
                ) : (
                  grouped.cancelled.map(order => (
                    <List.Item
                      key={order.id}
                      title={order.title}
                      description={`${order.subtitle} • ${formatDate(
                        order.date,
                      )} • ${order.amount}`}
                      onPress={() => onPressOrder(order)}
                      left={props => (
                        <Avatar.Icon
                          {...props}
                          icon="cancel"
                          size={40}
                          style={{ backgroundColor: '#069494' }}
                        />
                      )}
                      right={props => (
                        <Text
                          style={{
                            alignSelf: 'center',
                            marginRight: 8,
                            color: '#EF4444',
                          }}
                        >
                          Cancelled
                        </Text>
                      )}
                    />
                  ))
                )}
              </List.Accordion>
            </List.Section>
          )}
        </Animated.ScrollView>
      </KeyboardAvoidingView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        action={{
          label: 'Close',
          onPress: () => setSnackbarVisible(false),
          labelStyle: { color: '#fff', fontWeight: '600' }, // optional: makes 'Close' text visible
        }}
        style={{
          backgroundColor: '#069494',
          marginBottom: BOTTOM_NAV_HEIGHT + 36,
        }}
      >
        <Text style={{ color: '#fff' }}>{snackbarMsg}</Text>
      </Snackbar>

      {/* Fixed Bottom Navigation */}
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

export default Order;
