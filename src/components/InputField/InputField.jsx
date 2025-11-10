import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function InputField({ label, ...props }) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholderTextColor="#9aa0a6"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { color: '#374151', marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
