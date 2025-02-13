import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Dimensions, StyleSheet} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../env.js';
import data from '../constants/luckyLetter.json';
import CloverIcon from '../components/CloverIcon';

const screenWidth = Dimensions.get('window').width;
const cellSize = screenWidth / 7 - 4; // 7개씩 맞추기 위해 여백 고려

const CalendarScreen = () => {
  const [calendarLetter, setCalendarLetter] = useState([]);

  const fetchBottleCalendar = async () => {
    try {
      const guestId = await AsyncStorage.getItem('guestId');
      const response = await fetch(`${BASE_URL}/api/bottle/calendar`, {
        headers: {
          'Content-Type': 'application/json',
          'guest-id': '4866bb84-f080-4cee-bccc-004d1e984a5d', // 추후 guestId로 수정
        },
      });
      console.log(`Response Status:`, response.status);

      const responseBody = await response.text(); // 응답 본문 가져오기
      if (response.ok) {
        const responseData = JSON.parse(responseBody); // 성공 시 JSON 데이터 리턴
        const calendarLetters = responseData?.result?.calendarList;
        console.log('캘린더뷰 편지 목록:', calendarLetters);

        // 📌 데이터 변환 (년-월을 키로 그룹화)
        const groupedData = calendarLetters.reduce((acc, letter) => {
          const date = moment(letter.date, 'YYYY-MM-DD');
          console.log(date);
          const key = `${date.year()}-${date.month() + 1}`; // YYYY-M 형식
          if (!acc[key]) acc[key] = [];
          acc[key].push(letter);
          return acc;
        }, {});

        setCalendarLetter(groupedData);
      } else {
        const errorData = JSON.parse(responseBody); // 실패 응답 처리
        console.log(errorData);
      }
    } catch (error) {
      console.log(`Network Error: ${error.message}`);
    }
  };

  useEffect(() => {
    // ✅ 초기 마운트 시 데이터 로딩
    fetchBottleCalendar();
  }, []);

  /* 날짜 데이터 변환
  const groupedLetters = data.reduce((acc, letter) => {
    const date = moment(letter.letterDate, 'YYYY-MM-DD');
    const key = `${date.year()}-${date.month() + 1}`; // YYYY-M 형식
    if (!acc[key]) acc[key] = [];
    acc[key].push(letter);
    return acc;
  }, {});*/

  // 📌 가장 오래된 날짜와 가장 최근 날짜 찾기
  const allDates = Object.keys(calendarLetter).map(date =>
    moment(date, 'YYYY-M'),
  );
  const minDate = moment.min(allDates);
  const maxDate = moment.max(allDates);

  // 📌 두 날짜 사이의 모든 월을 채우기
  const months = [];
  let currentDate = minDate.clone();
  while (currentDate.isSameOrBefore(maxDate, 'month')) {
    months.push(currentDate.format('YYYY-M'));
    currentDate.add(1, 'month');
  }

  const generateCalendar = (year, month) => {
    const startOfMonth = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
    const daysInMonth = startOfMonth.daysInMonth();
    const startDay = startOfMonth.day(); // 0 = 일요일 ~ 6 = 토요일

    const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
    const emptyDays = Array.from({length: startDay}, () => null);
    return [...emptyDays, ...days];
  };

  const renderMonth = ({item}) => {
    const [year, month] = item.split('-');
    const days = generateCalendar(year, month);
    const letterDates = new Map(
      calendarLetter[item]?.map(l => [
        moment(l.date, 'YYYY-MM-DD').date(),
        l.imageUrl,
      ]) || [],
    );
    console.log(`📅 ${item}의 데이터`, letterDates);

    return (
      <View style={styles.monthContainer}>
        <Text style={styles.monthTitle}>
          {year}년 {month}월
        </Text>
        <View style={styles.daysContainer}>
          {days.map((day, index) => (
            <View key={index} style={styles.dayFormat}>
              {day ? (
                letterDates.has(day) ? (
                  <View style={styles.cloverContainer}>
                    <CloverIcon
                      style={styles.cloverShapeImage}
                      imageUrl={letterDates.get(day)}
                      size={cellSize}
                    />
                    <Text style={styles.cloverDate}>{day}</Text>
                  </View>
                ) : (
                  <Text style={{color: '#B0B0B0'}}>{day}</Text>
                )
              ) : null}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={months}
        keyExtractor={item => item}
        renderItem={renderMonth}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCF8',
    alignItems: 'center',
  },
  monthContainer: {
    marginVertical: 5,
    backgroundColor: '#FFFFFF',
  },
  monthTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: screenWidth,
  },
  dayFormat: {
    width: cellSize,
    height: cellSize,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  cloverContainer: {
    position: 'relative',
  },
  cloverDate: {
    position: 'absolute',
    color: '#FFFFFF',
    top: 16,
    left: 20,
    fontWeight: 'bold',
  },
});
