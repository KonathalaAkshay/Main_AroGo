import { StyleSheet } from 'react-native';
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: 'transparent',
    padding: wp('5%'),
  },
  surface: {
    width: wp('90%'),
    maxWidth: 400,
    elevation: 8,
    borderRadius: 12,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  logo: {
    width: wp('30%'),
    height: wp('30%'),
    resizeMode: 'contain',
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
  input: {
    marginBottom: hp('2%'),
    backgroundColor: 'white',
  },
  button: {
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: hp('1.5%'),
  },
  linkButton: {
    alignSelf: 'center',
    color: 'black',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  signUpText: {
    color: theme.colors.text,
    fontSize: wp('4%'),
  },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  valueText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333333',
  },
  sectionLabel: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
   bottomWrap: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: BOTTOM_NAV_HEIGHT,
      backgroundColor: '#fff',
      justifyContent: 'center',
      // shadows
      elevation: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: -2 },
      // small top border to separate from content
      borderTopWidth: Platform.OS === 'android' ? 0 : StyleSheet.hairlineWidth,
      borderTopColor: '#E5E7EB',
      paddingBottom: 0, // your BottomNavigation can handle safe area if needed
    },
});
