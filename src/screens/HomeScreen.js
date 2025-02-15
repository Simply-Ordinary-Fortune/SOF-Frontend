import React, {useState} from 'react';
import Toast from '../components/Toast';
import ModalBottomSheet from '../components/ModalBottomSheet';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Card,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [onModalClose, setOnModalClose] = useState(false);
  const navigation = useNavigation();

  const navigation = useNavigation();

  const onDayPress = day => {
    setSelectedDate(day.dateString);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setOnModalClose(true);
  };

  const showToast = message => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast
        message={toastMessage}
        visible={isToastVisible}
        onHide={() => setIsToastVisible(false)}
      />
      <ModalBottomSheet visible={isModalVisible} onClose={closeModal} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => showToast('차트 페이지가 준비중입니다.')}>
          <Icon
            name="bar-chart-outline"
            type="ionicon"
            size={28}
            color="#959595"
          />
        </TouchableOpacity>
        <Text style={styles.title}>🍀아보행 로고🍀</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SettingScreen')}>
          <Icon
            name="settings-outline"
            type="ionicon"
            size={28}
            color="#959595"
          />
        </TouchableOpacity>
      </View>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: {selected: true, selectedColor: '#2ECC71'},
          '2023-01-06': {marked: true, dotColor: '#50cebb'},
          '2023-01-10': {marked: true, dotColor: '#f0ad4e'},
          '2023-01-15': {marked: true, dotColor: '#d9534f'},
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#2ecc71',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#000',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#2ecc71',
          selectedDotColor: '#ffffff',
          arrowColor: '#2ecc71',
          monthTextColor: '#000',
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 22,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
        markingType={'custom'}
        monthFormat={'yyyy년 MM월'}
        firstDay={0}
        dayNames={[
          '일요일',
          '월요일',
          '화요일',
          '수요일',
          '목요일',
          '금요일',
          '토요일',
        ]}
        dayNamesShort={['일', '월', '화', '수', '목', '금', '토']}
      />
      {/* 회색 구분선 */}
      <View style={styles.divider} />
      <Text style={styles.promptText}>오늘의 행운</Text>
      <View style={styles.recordSection}>
        <Text style={styles.descriptionText}>
          오늘 발견한 아주 보통의 행운이 있나요?
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TodayPhotoScreen')}>
          <Text style={styles.buttonText}>오늘의 행운 기록하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
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
    top: 30,
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
    marginTop: 30,
    paddingBottom: 12,
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
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  promptText: {
    color: '#B0B0B0',
    fontSize: 13,
    margin: 3,
  },
  descriptionText: {
    color: '#B0B0B0',
    textAlign: 'center',
    fontSize: 12,
    margin: 5,
  },
  divider: {
    borderBottomColor: '#D3D3D3', // 연한 회색 구분선
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  recordSection: {
    marginTop: 20,
  },
});

export default HomeScreen;
