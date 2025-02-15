import React from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function SignButton({buttonName, redirectPath}) {
  return (
    <TouchableOpacity style={styles.buttonContainer} href={redirectPath}>
      {buttonName}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 10,
    color: 'white',
    backgroundColor: '#2ECC71',
    width: 40,
    height: 10,
  },
});
