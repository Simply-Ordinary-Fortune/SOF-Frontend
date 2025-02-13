import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'; // ✅ Animated는 꼭 reanimated에서 import 할 것
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useRoute} from '@react-navigation/native';
import {View, Text, StyleSheet} from 'react-native';
import YearMonthPicker from '../components/YearMonthPicker';
import {fetchBottleFocus} from '../utils/fetchBottleFocus.js';

import data from '../constants/luckyLetter.json';
import Slider from '../components/Slider';

const PhotoScreen = () => {
  console.log('💥포커스 화면이 랜더링 됩니다...');
  const route = useRoute();
  const {letterId} = route.params || {}; // ✅ `route.params`에서 letterId 가져오기

  console.log('📌 전달된 letterId:', letterId);

  const [letterData, setLetterData] = useState(null);
  const [letterCount, setLetterCount] = useState();

  /*const fetchBottleFocus = async ({mode, year, month, letterId}) => {
    try {
      const guestId = await AsyncStorage.getItem('guestId');

      let url = '';
      if (mode === 'date') {
        url = `${BASE_URL}/api/bottle/focus?year=${year}&month=${month}`;
      } else if (mode === 'recent') {
        url = `${BASE_URL}/api/bottle/focus/${letterId}`;
      }

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'guest-id': '4866bb84-f080-4cee-bccc-004d1e984a5d', // 추후 guestId로 수정
        },
      });
      console.log(`Response Status:`, response.status);

      const responseBody = await response.text(); // 응답 본문 가져오기
      if (response.ok) {
        const responseData = JSON.parse(responseBody); // 성공 시 JSON 데이터 리턴
        // 📌 API 응답 구조에 맞춰 데이터 설정
        const focusLetters =
          mode === 'date'
            ? responseData?.result?.focusList
            : responseData?.result?.focusDetailList;

        const focusLetterCount = responseData?.result?.letterCount;
        console.log('포커스 된 편지 목록:', focusLetters);

        setLetterData(focusLetters);
        setLetterCount(focusLetterCount);
      } else {
        const errorData = JSON.parse(responseBody); // 실패 응답 처리
        console.log(errorData);
      }
    } catch (error) {
      console.log(`Network Error: ${error.message}`);
    }
  };*/

  const getCurrentYearMonth = () => {
    const now = new Date();
    return {
      year: now.getFullYear().toString(),
      month: (now.getMonth() + 1).toString(),
    };
  };

  const handleDateChange = useCallback(async ({year, month}) => {
    console.log('🔥 날짜 변경:', year, month);
    console.log('🔥 필터링 시작');
    const {focusLetters, focusLetterCount} = await fetchBottleFocus({
      mode: 'date',
      year,
      month,
    });
    setLetterData(focusLetters);
    setLetterCount(focusLetterCount);
  }, []);

  useEffect(() => {
    if (letterId) {
      const fetchData = async () => {
        const {focusLetters, focusLetterCount} = await fetchBottleFocus({
          mode: 'recent', // ✅ 최근 편지 모드
          letterId,
        });
        setLetterData(focusLetters);
        setLetterCount(focusLetterCount);
      };

      fetchData();
    } else {
      const fetchData = async () => {
        const {year, month} = getCurrentYearMonth();
        const {focusLetters, focusLetterCount} = await fetchBottleFocus({
          mode: 'date',
          year,
          month,
        });
        setLetterData(focusLetters);
        setLetterCount(focusLetterCount);
      };

      fetchData();
    }
  }, [letterId]); // ✅ letterId가 변경될 때마다 실행

  // ✅ 스크롤 값 처음 한번만 렌더링 되도록 설정
  const scrollX = useRef(useSharedValue(0)).current;
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <YearMonthPicker
          letterCount={letterCount}
          onDateChange={handleDateChange}
        />
      </View>
      {letterData === null ? ( // 데이터 로딩 중일 때 로딩 메시지 표시
        <Text style={{textAlign: 'center', marginTop: 20}}>로딩 중...</Text>
      ) : letterData.length === 0 ? (
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 200,
          }}>
          이 달에는 받은 편지가 없습니다...
        </Text>
      ) : (
        <Animated.FlatList
          data={letterData}
          renderItem={({item, index}) => (
            <Slider item={item} index={index} scrollX={scrollX} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={onScrollHandler}
          removeClippedSubviews={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCF8',
  },
  pickerContainer: {
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 10,
  },
});

export default PhotoScreen;
