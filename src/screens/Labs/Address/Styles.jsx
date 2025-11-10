// Styles.js
import { StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const MAJOR_COLOR = '#069494';
export const BOTTOM_NAV_HEIGHT = 64;

export const theme = {
  colors: {
    primary: MAJOR_COLOR,
    accent: '#ffffff',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#333333',
    placeholder: '#888888',
  },
  roundness: 8,
};

export const styles = StyleSheet.create({
  /* ---------- Layout Containers ---------- */
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: wp('5%'),
    paddingBottom: wp('5%') + BOTTOM_NAV_HEIGHT, // avoids overlap with bottom nav
  },
  topCustomHeader: {
    zIndex: 10,
    elevation: 6,
  },
  surface: {
    width: '100%',
    alignSelf: 'center',
    elevation: 6,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },

  /* ---------- Cards ---------- */
  testCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    padding: 12,
  },
  testCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },

  /* ---------- Typography ---------- */
  title: {
    fontSize: wp('5.6%'),
    fontWeight: '800',
    color: theme.colors.primary,
    textAlign: 'left',
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: wp('4%'),
    color: theme.colors.text,
    textAlign: 'left',
    marginBottom: hp('2%'),
  },
  description: {
    fontSize: wp('3.6%'),
    color: '#4B5563',
  },
  price: {
    fontSize: wp('4.6%'),
    fontWeight: '800',
    color: theme.colors.primary,
    marginTop: 4,
  },

  /* ---------- Bottom Navigation ---------- */
  bottomWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BOTTOM_NAV_HEIGHT,
    backgroundColor: '#fff',
    justifyContent: 'center',
    elevation: 10, // Android
    shadowColor: '#000', // iOS
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    borderTopWidth: Platform.OS === 'android' ? 0 : StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },

  /* ---------- Header Overlay (for animated header) ---------- */
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },

  /* ---------- Search Row (if used on list screens) ---------- */
  searchRow: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 15,
    paddingVertical: 0,
    marginLeft: 6,
  },
  iconRightHit: {
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  icon: {
    color: '#6B7280',
  },

  /* ---------- Buttons ---------- */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: MAJOR_COLOR,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 12,
  },
  btnText: {
    fontSize: 15,
    color: '#FFFFFF', // better contrast on primary bg
    fontWeight: '700',
  },

  /* ---------- Date Button ---------- */
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    marginTop: 12,
  },
});
