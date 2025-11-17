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
  /* Layout containers */
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: wp('5%'),
    paddingBottom: wp('5%') + BOTTOM_NAV_HEIGHT,
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

  /* Cards */
  testCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  title: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: wp('4%'),
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: hp('3%'),
  },

  /* Bottom Navigation */
  bottomWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BOTTOM_NAV_HEIGHT,
    backgroundColor: '#fff',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    borderTopWidth: Platform.OS === 'android' ? 0 : StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },

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
});
