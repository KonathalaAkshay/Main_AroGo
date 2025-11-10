import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  TextInput,
  Text,
  Chip,
  Surface,
  Card,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

/* ================== DATA ================== */
const MOCK_ITEMS = [
  {
    id: '1',
    name: 'Paracetamol 650',
    type: 'Medicine',
    meta: 'Fever, Pain Relief',
  },
  { id: '2', name: 'Vitamin C Chewable', type: 'Medicine', meta: 'Immunity' },
  {
    id: '3',
    name: 'Full Body Checkup',
    type: 'Lab',
    meta: 'Includes 80+ tests',
  },
  { id: '4', name: 'Thyroid Profile', type: 'Lab', meta: 'TSH, T3, T4' },
  { id: '5', name: 'Amoxicillin 500mg', type: 'Medicine', meta: 'Antibiotic' },
  { id: '6', name: 'COVID RTPCR', type: 'Lab', meta: 'Same-day report' },
];

function mockSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MOCK_ITEMS.filter(
    x => x.name.toLowerCase().includes(q) || x.meta.toLowerCase().includes(q),
  );
}

/** 3-col “Swiggy style” categories – tailored to Medicines/Labs */
const CATEGORIES = [
  // MEDICINES
  {
    id: 'c1',
    title: 'Pain Relief',
    kind: 'Medicine',
    // image: require('../../assets/categories/pain_relief.png'),
  },
  {
    id: 'c2',
    title: 'Immunity',
    kind: 'Medicine',
    // image: require('../../assets/categories/immunity.png'),
  },
  {
    id: 'c3',
    title: 'Antibiotics',
    kind: 'Medicine',
    // image: require('../../assets/categories/antibiotics.png'),
  },
  {
    id: 'c4',
    title: 'Vitamins',
    kind: 'Medicine',
    // image: require('../../assets/categories/vitamins.png'),
  },
  {
    id: 'c5',
    title: 'Cold & Cough',
    kind: 'Medicine',
    // image: require('../../assets/categories/cold_cough.png'),
  },
  {
    id: 'c6',
    title: 'Diabetes Care',
    kind: 'Medicine',
    // image: require('../../assets/categories/diabetes.png'),
  },

  // LABS
  {
    id: 'c7',
    title: 'Thyroid Tests',
    kind: 'Lab',
    // image: require('../../assets/categories/thyroid.png'),
  },
  {
    id: 'c8',
    title: 'RTPCR',
    kind: 'Lab',
    // image: require('../../assets/categories/rtpcr.png'),
  },
  {
    id: 'c9',
    title: 'Full Body',
    kind: 'Lab',
    // image: require('../../assets/categories/full_body.png'),
  },
  {
    id: 'c10',
    title: 'Heart Health',
    kind: 'Lab',
    // image: require('../../assets/categories/heart.png'),
  },
  {
    id: 'c11',
    title: 'Women’s Health',
    kind: 'Lab',
    // image: require('../../assets/categories/women.png'),
  },
  {
    id: 'c12',
    title: 'Liver Profile',
    kind: 'Lab',
    // image: require('../../assets/categories/liver.png'),
  },
];

/* ================== SCREEN ================== */
const Search = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState([
    'Paracetamol',
    'Thyroid',
    'Vitamin C',
    'RTPCR',
  ]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState < typeof MOCK_ITEMS > [];
  const [snack, setSnack] =
    useState <
    { type: 'info' | 'success' | 'error' } >
    {
      visible: false,
      text: '',
      type: 'info',
    };

  const timerRef = useRef < ReturnType < typeof setTimeout > null > null;

  const showSnack = useCallback((text = 'info') => {
    setSnack({ visible: true, text, type });
  }, []);

  const doSearch = useCallback(q => {
    setLoading(true);
    const id = setTimeout(() => {
      try {
        setResults(mockSearch(q));
      } finally {
        setLoading(false);
      }
    }, 250);
    return id;
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = doSearch(query);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, doSearch]);

  const onSubmit = () => {
    const t = query.trim();
    if (!t) return;
    setRecent(prev => {
      const arr = [t, ...prev.filter(x => x.toLowerCase() !== t.toLowerCase())];
      return arr.slice(0, 8);
    });
    doSearch(t);
  };

  const onClearQuery = () => {
    setQuery('');
    setResults([]);
  };

  const onClearRecent = () => setRecent([]);

  const dynamicSnackColor = useMemo(() => {
    if (snack.type === 'success') return '#22C55E';
    if (snack.type === 'error') return '#EF4444';
    return '#0EA5E9';
  }, [snack.type]);

  const renderResult = ({ item }) => (
    <Card
      style={s.resultCard}
      onPress={() => showSnack(`${item.name} selected`, 'success')}
    >
      <Card.Content style={s.resultRow}>
        <View style={s.iconWrap}>
          <Icon
            name={item.type === 'Lab' ? 'test-tube' : 'pill'}
            size={20}
            color="#22D3EE"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.resultTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={s.resultMeta} numberOfLines={1}>
            {item.meta}
          </Text>
        </View>
        <Icon name="chevron-right" size={22} color="#6B7280" />
      </Card.Content>
    </Card>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={s.catItem}
      onPress={() => {
        // Example behavior: put the category title into search
        setQuery(item.title);
      }}
    >
      <View style={s.catImageWrap}>
        <Image source={item.image} style={s.catImage} />
      </View>
      <Text style={s.catLabel} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const listHeader = (
    <>
      {/* Search bar */}
      <Surface style={s.searchBar} elevation={2}>
        <TextInput
          mode="flat"
          value={query}
          onChangeText={setQuery}
          placeholder="Search medicines or lab tests"
          placeholderTextColor="#9CA3AF"
          autoCorrect
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          left={
            <TextInput.Icon
              icon="arrow-left"
              onPress={() => (navigation?.goBack ? navigation.goBack() : null)}
            />
          }
          right={
            query ? (
              <TextInput.Icon
                icon="close"
                onPress={onClearQuery}
                forceTextInputFocus={false}
              />
            ) : null
          }
          style={s.input}
          underlineColor="transparent"
          selectionColor="#22D3EE"
          textColor="#E5E7EB"
          theme={{
            colors: { primary: '#22D3EE', onSurfaceVariant: '#9CA3AF' },
          }}
        />
      </Surface>

      {/* Recents */}
      <View style={s.section}>
        <View style={s.sectionHead}>
          <Text style={s.sectionTitle}>Your recent searches</Text>
          {recent.length > 0 ? (
            <TouchableOpacity onPress={onClearRecent}>
              <Text style={s.clearText}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={s.chipsRow}>
          {recent.length === 0 ? (
            <Text style={s.emptyMini}>No recent searches</Text>
          ) : (
            recent.map((r, i) => (
              <Chip
                key={`${r}-${i}`}
                mode="flat"
                style={s.chip}
                textStyle={s.chipText}
                onPress={() => setQuery(r)}
                selectedColor="#111827"
              >
                {r}
              </Chip>
            ))
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>What’s on your mind?</Text>
      </View>
    </>
  );

  const showResults = query.trim().length > 0;

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      >
        {showResults ? (
          <FlatList
            contentContainerStyle={s.listPad}
            data={loading ? [] : results}
            keyExtractor={item => item.id}
            renderItem={renderResult}
            ListHeaderComponent={listHeader}
            ListEmptyComponent={
              <View style={s.emptyWrap}>
                {loading ? (
                  <ActivityIndicator />
                ) : (
                  <>
                    <Icon name="magnify-close" size={26} color="#9CA3AF" />
                    <Text style={s.emptyText}>No results for “{query}”</Text>
                  </>
                )}
              </View>
            }
            stickyHeaderIndices={[0]} // keep search at top
          />
        ) : (
          <FlatList
            contentContainerStyle={[s.listPad, { paddingBottom: 28 }]}
            numColumns={3}
            columnWrapperStyle={s.catRow}
            data={CATEGORIES}
            keyExtractor={item => item.id}
            renderItem={renderCategory}
            ListHeaderComponent={listHeader}
            stickyHeaderIndices={[0]}
          />
        )}

        {/* Snackbar */}
        <Snackbar
          visible={snack.visible}
          onDismiss={() => setSnack(sv => ({ ...sv, visible: false }))}
          duration={2200}
          style={[s.snack, { backgroundColor: dynamicSnackColor }]}
          action={{
            label: 'OK',
            onPress: () => setSnack(sv => ({ ...sv, visible: false })),
          }}
        >
          {snack.text}
        </Snackbar>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Search;

/* ================== STYLES (Dark, Swiggy-like) ================== */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B0B0F' }, // deep dark
  listPad: { paddingHorizontal: 14, paddingTop: 8 },

  /* Search bar */
  searchBar: {
    backgroundColor: '#0B0B0F',
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 10,
  },
  input: {
    backgroundColor: '#1A1B21',
    borderRadius: 12,
    color: '#E5E7EB',
  },

  /* Sections */
  section: { paddingHorizontal: 14, paddingTop: 8 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#D1D5DB',
    fontSize: 13,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  clearText: { color: '#22D3EE', fontSize: 13 },

  /* Chips */
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 10 },
  chip: { backgroundColor: '#262833', borderRadius: 999 },
  chipText: { color: '#E5E7EB', fontSize: 13 },
  emptyMini: { color: '#9CA3AF', fontSize: 13, paddingTop: 6 },

  /* Categories (3-col) */
  catRow: { justifyContent: 'space-between', marginBottom: 8 },
  catItem: { width: '32%', alignItems: 'center', marginBottom: 10 },
  catImageWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#1E202A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  catImage: { width: 78, height: 78, resizeMode: 'cover' },
  catLabel: { color: '#E5E7EB', fontSize: 12, marginTop: 8 },

  /* Results list */
  resultCard: {
    backgroundColor: '#14151B',
    borderRadius: 12,
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0E2030',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  resultTitle: { color: '#E5E7EB', fontSize: 15, fontWeight: '600' },
  resultMeta: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },

  /* Empty */
  emptyWrap: { alignItems: 'center', paddingVertical: 28, gap: 8 },
  emptyText: { color: '#9CA3AF', fontSize: 14 },

  /* Snackbar */
  snack: { marginHorizontal: 18, borderRadius: 12, marginBottom: 16 },
});
