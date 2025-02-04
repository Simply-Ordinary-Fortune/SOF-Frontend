import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'; // ✅ Animated는 꼭 reanimated에서 import 할 것
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import YearMonthPicker from '../components/YearMonthPicker';

import data from '../constants/luckyLetter.json';
import Slider from '../components/Slider';

const PhotoScreen = () => {
  const [letterData, setLetterData] = useState(null);

  const getCurrentYearMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  };

  const handleDateChange = useCallback(filteredLetters => {
    console.log('🔥 필터링 시작');
    setLetterData(prev => {
      return JSON.stringify(prev) === JSON.stringify(filteredLetters)
        ? prev
        : filteredLetters;
    });
    console.log('📌 필터링된 데이터:', filteredLetters);
  }, []);
  /*const handleDateChange = filteredLetters => {
    console.log('필터링된 데이터:', filteredLetters);
    setLetterData(filteredLetters);
  }; -> handleDateChange가 무한 리렌더링 되는 에러 발생...*/

  useEffect(() => {
    // ✅ 초기 마운트 시 현재 년도와 월에 맞는 데이터로 변경
    const currentYearMonth = getCurrentYearMonth();
    const initialFilteredData = data.filter(item =>
      item.letterDate.includes(currentYearMonth),
    );
    setLetterData(initialFilteredData);
  }, []);

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
        <YearMonthPicker letterData={data} onDateChange={handleDateChange} />
      </View>
      {letterData === null ? ( // 데이터 로딩 중일 때 로딩 메시지 표시
        <Text style={{textAlign: 'center', marginTop: 20}}>로딩 중...</Text>
      ) : letterData.length === 0 ? (
        <Text style={{textAlign: 'center', marginTop: 20}}>
          받은 편지가 없습니다...
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
