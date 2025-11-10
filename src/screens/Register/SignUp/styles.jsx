import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const MAJOR_COLOR = '#069494';

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
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: hp('0%'),
  },
  signUpText: {
    color: theme.colors.text,
    fontSize: wp('4%'),
  },
});
