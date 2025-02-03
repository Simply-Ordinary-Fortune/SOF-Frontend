import React from 'react';
import {StyleSheet, Text} from 'react-native';

const ListScreen = () => {
  return <Text style={styles.container}>리스트 화면입니다...</Text>;
};

export default ListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCF8',
    alignContent: 'center',
  },
});
