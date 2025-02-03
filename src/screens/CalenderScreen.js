import React from 'react';
import {StyleSheet, Text} from 'react-native';

const CalenderScreen = () => {
  return <Text style={styles.container}>달력 화면입니다...</Text>;
};

export default CalenderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCF8',
    alignContent: 'center',
  },
});
