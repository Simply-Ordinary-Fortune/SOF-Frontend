import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Card,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Icon} from 'react-native-elements';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const onDayPress = day => {
    setSelectedDate(day.dateString);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => Alert.alert('차트 페이지로 이동합니다.')}>
          <Icon
            name="bar-chart-outline"
            type="ionicon"
            size={28}
            color="#959595"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert('설정 페이지가 준비 중입니다.')}>
          <Icon
            name="settings-outline"
            type="ionicon"
            size={28}
            color="#959595"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>🍀아보행 로고🍀</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  settingsIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
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
    backgroundColor: '#2ECC71',
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
