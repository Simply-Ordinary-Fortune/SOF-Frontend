import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function SignButton({buttonName, onPress}) {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Text style={styles.buttonText}>{buttonName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 10,
    backgroundColor: '#2ECC71',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
