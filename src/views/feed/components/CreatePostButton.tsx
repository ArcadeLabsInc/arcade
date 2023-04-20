// src/views/feed/components/CreatePostButton.tsx
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { palette } from 'views/theme'
import { FontAwesome } from '@expo/vector-icons'

export const CreatePostButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <FontAwesome name="plus" size={24} color={palette.white} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: palette.arwesFade,
    borderRadius: 50,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginRight: 12,
  },
})
