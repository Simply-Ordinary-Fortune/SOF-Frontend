import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Calendar} from 'react-native-calendars';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const onDayPress = day => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로고자리!</Text>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: {selected: true, selectedColor: '#00adf5'},
          '2023-01-06': {marked: true, dotColor: '#50cebb'},
          '2023-01-10': {marked: true, dotColor: '#f0ad4e'},
          '2023-01-15': {marked: true, dotColor: '#d9534f'},
        }}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          arrowColor: '#00adf5',
          monthTextColor: '#000',
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>오늘의 행운 기록하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  calendar: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  button: {
    backgroundColor: '#00adf5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
