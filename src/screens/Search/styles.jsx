import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  /* ---------- Backdrop + Sheet ---------- */
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)', // dim background behind sheet
  },
  backdropPressable: {
    flex: 1, // upper area to tap and dismiss
  },
  sheet: {
    backgroundColor: 'transparent',
    marginTop: 'auto', // push to bottom
  },
  handle: {
    alignItems: 'center',
    paddingTop: 8,
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3A3B40',
  },
  sheetContent: {
    backgroundColor: '#0E0E0F',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
    minHeight: '60%', // feel free to tweak (50–80%)
    // subtle shadow on Android + iOS
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
  },

  /* ---------- Existing search styles ---------- */
  searchRow: {
    marginTop: 4,
    height: 44,
    backgroundColor: '#1A1B1E',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#2A2B2F',
  },
  iconLeftHit: {
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
  },
  iconRightHit: {
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  icon: {
    color: '#E7E7EA',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    paddingVertical: 0,
  },
  headerRow: {
    marginTop: 16,
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    color: '#9EA3A8',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  clearText: {
    color: '#FF4D4D',
    fontSize: 12,
  },
  listContent: {
    paddingTop: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#24262B',
  },
  recentIcon: {
    color: '#B7BBC2',
    marginRight: 8,
  },
  recentText: {
    color: '#E7E7EA',
    fontSize: 14,
  },
  emptyText: {
    color: '#5D6168',
    fontSize: 13,
    padding: 12,
  },
});
