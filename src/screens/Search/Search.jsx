import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Keyboard,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

const STORAGE_KEY = '@recent_searches';

const Search = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [recents, setRecents] = useState([]);

  const loadRecents = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      setRecents(raw ? JSON.parse(raw) : []);
    } catch (e) {
      console.log('Error loading recents:', e);
    }
  }, []);

  const saveRecents = useCallback(async items => {
    try {
      setRecents(items);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.log('Error saving recents:', e);
    }
  }, []);

  useEffect(() => {
    loadRecents();
  }, [loadRecents]);

  const onSubmit = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    Keyboard.dismiss();

    const next = [
      trimmed,
      ...recents.filter(r => r.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, 10);

    saveRecents(next);
  }, [query, recents, saveRecents]);

  const onClearAll = useCallback(() => {
    saveRecents([]);
  }, [saveRecents]);

  const onBack = useCallback(() => {
    navigation?.goBack?.();
  }, [navigation]);

  const onMicPress = useCallback(() => {
    // hook your voice input here
  }, []);

  return (
    <View style={styles.backdrop}>
      <StatusBar barStyle="light-content" />
      {/* tap outside sheet to close */}
      <Pressable style={styles.backdropPressable} onPress={onBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
        style={styles.sheet}
      >
        {/* grab handle */}
        <View style={styles.handle}>
          <View style={styles.handleBar} />
        </View>

        <View style={styles.sheetContent}>
          {/* Search Bar */}
          <View style={styles.searchRow}>
            <TouchableOpacity onPress={onBack} style={styles.iconLeftHit}>
              <Icon name="chevron-left" size={28} style={styles.icon} />
            </TouchableOpacity>

            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Medicine name or a lab..."
              placeholderTextColor="#9EA3A8"
              returnKeyType="search"
              onSubmitEditing={onSubmit}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity onPress={onMicPress} style={styles.iconRightHit}>
              <Icon name="microphone" size={20} style={styles.icon} />
            </TouchableOpacity>
          </View>

          {/* Recent header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>YOUR RECENT SEARCHES</Text>
            {recents.length > 0 && (
              <TouchableOpacity onPress={onClearAll}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Recent list */}
          <FlatList
            data={recents}
            keyExtractor={(item, i) => item + i}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setQuery(item)}
                style={styles.recentItem}
              >
                <Icon
                  name="clock-outline"
                  size={18}
                  style={styles.recentIcon}
                />
                <Text style={styles.recentText}>{item}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No recent searches yet</Text>
            }
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Search;
