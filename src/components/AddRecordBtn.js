import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import axios from 'axios';
import * as ImageResizer from 'react-native-image-resizer';
import {BASE_URL} from '../../env.js';
import {GUEST_ID} from '../../env.js';

const AddRecordBtn = ({recordText, selectedTag, photo, isToday}) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const guestId = GUEST_ID;
  // const uri = typeof photo === 'string' ? photo : photo?.uri;

  // const resizeImage = async photo => {
  //   console.log('📌 ImageResizer:', ImageResizer);

  //   if (!uri) {
  //     console.error('❌ Image URI is null or undefined!');
  //     return;
  //   }

  //   try {
  //     const resizedImage = await ImageResizer.createResizedImage(
  //       uri, // 원본 이미지 경로
  //       800, // 너비 (너무 크게 업로드되지 않도록 조절)
  //       800, // 높이
  //       'JPEG', // 포맷
  //       80, // 품질 (0~100)
  //     );

  //     return resizedImage;
  //   } catch (error) {
  //     console.error('📌 이미지 리사이징 오류:', error);
  //     return null;
  //   }
  // };

  const handleSubmit = async () => {
    if (isLoading) {
      return;
    } // 중복 클릭 방지
    setIsLoading(true);
    if (!photo) {
      Alert.alert('오류', '이미지가 선택되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    // const finalPhoto = await resizeImage(photo); // 이미지 리사이징 시도
    // if (!finalPhoto) {
    //   Alert.alert('오류', '이미지 리사이징에 실패했습니다.');
    //   setIsLoading(false);
    //   return;
    // }

    if (!guestId) {
      Alert.alert('오류', 'guest-id가 필요합니다.');
      setIsLoading(false);
      return;
    }
    if (!selectedTag) {
      Alert.alert('오류', '기록 내용과 태그를 입력해야 합니다.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('content', recordText);
    formData.append('tags[]', selectedTag);
    if (photo) {
      formData.append('image', {
        uri: photo,
        type: 'image/jpeg',
        name: 'record.jpg',
      });
    }

    console.log('FormData:', formData);
    try {
      // axios
      //   .post(`{B}api/signup`)
      //   .then(response => console.log('서버 정상:', response.data))
      //   .catch(error => console.error('서버 연결 실패:', error));

      const response = await axios.post(`${BASE_URL}/api/records`, formData, {
        headers: {
          'guest-id': guestId,
        },
      });

      console.log('응답:', response.data);
      Alert.alert('성공', '기록이 저장되었습니다!');
      navigation.navigate('RecordScreen');
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.closeBtn}
      onPress={handleSubmit}
      disabled={isLoading} // 로딩 중이면 버튼 비활성화
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.closeBtnText}>닫기</Text>
      )}
    </TouchableOpacity>
  );
};

export default AddRecordBtn;

const styles = StyleSheet.create({
  closeBtn: {
    bottom: 46,
    marginHorizontal: 20,
    backgroundColor: '#2ECC71',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
