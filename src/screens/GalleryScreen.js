import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

import data from '../constants/luckyLetter.json';
import CloverIcon from '../components/CloverIcon';

const {width} = Dimensions.get('window');
const photoWidth = width / 3;
const photoHeight = (photoWidth * 174.67) / 131;

const GalleryScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {data.map(photo => {
          const [year, month, day] = photo.letterDate.split('-'); // 날짜를 '-'로 나눔
          return (
            <View key={photo.letterId} style={styles.photoContainer}>
              <Image
                source={{uri: photo.ImageUrl}}
                style={{width: photoWidth, height: photoHeight}}
              />
              {/* ⚠️ CloverIcon 컴포넌트는 SVG 방식으로 렌더링되기 때문에 View 컴포넌트로 감싸주기 */}
              <View style={styles.cloverIcon}>
                <CloverIcon size={43} color={'#F5FCF8'} />
              </View>
              <Text style={styles.dateText}>
                {parseInt(month)}.{parseInt(day)}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCF8',
    alignContent: 'center',
  },
  photoContainer: {
    width: photoWidth,
    height: photoHeight,
    position: 'relative',
  },
  cloverIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  dateText: {
    position: 'absolute',
    top: 22,
    left: 16, // 중앙 정렬을 위해 왼쪽을 50%로 설정
    transform: [{translateX: -1}], // 텍스트 길이에 따라 조정 (필요시 값 변경)
    color: '#2ECC71',
    fontSize: 12,
    fontWeight: 'light',
    textAlign: 'center',
    width: 33, // 고정된 너비 설정
  },
});
