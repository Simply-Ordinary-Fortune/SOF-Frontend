import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import {LinearGradient} from 'react-native-svg';
import PropTypes from 'prop-types';

const {width} = Dimensions.get('screen');

const formatDate = dateString => {
  const [year, month, day] = dateString.split('-');
  return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
};

const Slider = ({item, index, scrollX}) => {
  console.log('슬라이더 컴포넌트에서 데이터 전달 확인용: ', item);
  if (item === null) {
    console.log('빈 배열이 전달되면 null이라 인식');
  } else if (item === undefined) {
    console.log('빈 배열이 전달되면 undefined이라 인식');
  } else {
    console.log('빈 배열이 전달되면 ???이라 인식');
  }
  const rnAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.9, 1, 0.9],
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        {scale},
        {
          translateX: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-width * 0.2, 0, width * 0.2],
            Extrapolation.CLAMP,
          ),
        },
      ],
      zIndex: Math.floor(scale * 10), // ⚠️ zIndex 적용이 안됨
    };
  });
  return (
    <Animated.View style={[styles.container, rnAnimatedStyle]}>
      <View style={styles.itemContainer}>
        <Image
          source={{uri: item.imageUrl}}
          style={{
            width: width * 0.75,
            height: width * 0.8,
            borderRadius: 20,
            marginTop: 30,
          }}
        />
        <LinearGradient
          colors={['transparent', '#2ECC71']}
          style={styles.background}
        />
        <Text style={styles.dateFormat}>{item.date}의 행운편지</Text>
        <Text style={styles.contentFormat}>{item.message}</Text>
      </View>
    </Animated.View>
  );
};

// ✅ SharedValue 타입 검증 함수 : scrollX 프롭이 잘 전달되는지 확인용 -> 나중에 삭제
Slider.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  scrollX: (props, propName, componentName) => {
    if (
      typeof props[propName] !== 'object' ||
      props[propName] === null ||
      typeof props[propName].value !== 'number'
    ) {
      return new Error(
        `${componentName}: '${propName}' prop은 SharedValue<number> 타입이어야 합니다.`,
      );
    }
  },
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    // 폴라로이드 한장을 포함하는 컨테이너
    alignItems: 'center',
    width: width,
    gap: 20,
  },
  itemContainer: {
    // 폴라로이드 컨테이너
    alignItems: 'center',
    width: width * 0.85,
    height: 550,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 112, 0.5)',
    elevation: 5,
  },
  background: {
    position: 'absolute',
    width: width - 70,
    height: 550,
    padding: 20,
    borderRadius: 20,
  },
  dateFormat: {
    fontSize: 15,
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191B',
    marginTop: 15,
  },
  contentFormat: {
    fontSize: 18,
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191B',
    marginTop: 20,
  },
});
