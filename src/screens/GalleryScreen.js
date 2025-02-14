import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../env.js';
import CloverIcon from '../components/CloverIcon';

const {width} = Dimensions.get('window');
const photoWidth = width / 3;
const photoHeight = (photoWidth * 174.67) / 131;

const GalleryScreen = () => {
  const [galleryLetter, setGalleryLetter] = useState([]);

  const fetchBottleGallery = async () => {
    try {
      const guestId = await AsyncStorage.getItem('guestId');
      const response = await fetch(`${BASE_URL}/api/bottle/gallery`, {
        headers: {
          'Content-Type': 'application/json',
          'guest-id': '4866bb84-f080-4cee-bccc-004d1e984a5d', // 추후 guestId로 수정
        },
      });
      console.log(`Response Status:`, response.status);

      const responseBody = await response.text(); // 응답 본문 가져오기
      if (response.ok) {
        const responseData = JSON.parse(responseBody); // 성공 시 JSON 데이터 리턴
        const galleryLetters = responseData?.result?.galleryList;
        console.log('갤러리뷰 편지 목록:', galleryLetters);

        setGalleryLetter(galleryLetters);
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
    fetchBottleGallery();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {galleryLetter.map(photo => {
          return (
            <View key={photo.letterId} style={styles.photoContainer}>
              <Image
                source={{uri: photo.imageUrl}}
                style={{width: photoWidth, height: photoHeight}}
              />
              {/* ⚠️ CloverIcon 컴포넌트는 SVG 방식으로 렌더링되기 때문에 View 컴포넌트로 감싸주기 */}
              <View style={styles.cloverIcon}>
                <CloverIcon size={43} color={'#F5FCF8'} />
              </View>
              <Text style={styles.dateText}>{photo.date}</Text>
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
