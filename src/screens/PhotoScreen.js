import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'; // ✅ Animated는 꼭 reanimated에서 import 할 것
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select'; // ⚠️ 드롭다운 오류 발생

import data from '../constants/luckyLetter.json';
import Slider from '../components/Slider';

const PhotoScreen = () => {
  console.log('데이터 확인을 위한 출력:', data); // 🔍 데이터 확인용

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 0월부터 시작하므로 1 더해주고 두 자리로 패딩

  const [letterData, setLetterData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear); // 🔍
  const [selectedMonth, setSelectedMonth] = useState(currentMonth); // 🔍
  const [filteredData, setFilteredData] = useState([]); // 🔍

  // ✅ useEffect를 사용해 최초 1회만 데이터 설정 : 추후 API 연동을 위함
  useEffect(() => {
    setLetterData(data);
  }, []);

  // 🔍드롭다운에서 월이 선택될 때마다 데이터 필터링
  const filterData = (year, month) => {
    // API 연동 필요
    const filtered = letterData.filter(item => item.date.includes(month)); // 날짜에 따라 필터링
    setFilteredData(filtered);
  };

  // ✅ 스크롤 값 처음 한번만 렌더링 되도록 설정
  const scrollX = useRef(useSharedValue(0)).current;
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.dropDown}>2025년 1월 v</Text>
        <Text style={styles.letterNumber}>행운편지 17개</Text>
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCF8',
  },
  titleContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  dropDown: {
    fontSize: 35,
    fontWeight: 3,
    marginBottom: 10,
  },
});

export default PhotoScreen;
