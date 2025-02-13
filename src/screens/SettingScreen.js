import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../env.js';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';

const openWebsite = () => {
  const url = // 앱 평가 url
    'https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&ssc=tab.nx.all&query=%EB%85%B8%EC%85%98&oquery=%ED%8C%8C%ED%8C%8C%EA%B3%A0&tqi=iI705lpzLi0ssfkKIcdssssssmV-134540';
  Linking.openURL(url).catch(err =>
    console.error('링크를 열 수 없습니다!', err),
  );
};

const SettingScreen = () => {
  const navigation = useNavigation();
  const [notification, setNotification] = useState();
  const [useID, setUserID] = useState();

  // 알림 설정 불러오기
  const getNotificationSetting = async () => {
    try {
      const notify = await AsyncStorage.getItem('notify');
      //console.log('💥알림설정 불러오기: ', notify);
      if (notify === null) {
        // 알림 값이 없다면 첫 접속이므로 기본값(true) 저장
        await AsyncStorage.setItem('notify', JSON.stringify(true));
        setNotification(true);
      } else {
        setNotification(JSON.parse(notify));
      }
    } catch (error) {
      console.error('알림 값 불러오기 오류:', error);
    }
  };

  // 알림 설정 저장하기
  const saveNotificationSetting = () => {
    try {
      console.log(!notification);
      setNotification(!notification);
      AsyncStorage.setItem('notify', JSON.stringify(!notification));
    } catch (error) {
      console.error('알림 값 저장 오류:', error);
    }
  };

  // 알림 설정 디비에 저장하기
  const fetchNotification = async () => {
    try {
      const guestId = await AsyncStorage.getItem('guestId');
      const notify = await AsyncStorage.getItem('notify');
      console.log(JSON.parse(notify));
      console.log(`${BASE_URL}/api/notifications`);

      const response = await fetch(`${BASE_URL}/api/notifications`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'guest-id': '4866bb84-f080-4cee-bccc-004d1e984a5d', // 추후 guestId로 수정
        },
        body: JSON.stringify({
          pushEnabled: JSON.parse(notify),
        }),
      });
      console.log(`Response Status:`, response.status);

      const responseBody = await response.text(); // 응답 본문 가져오기
      if (response.ok) {
        console.log('💥알림 상태 저장완료!!');
        const responseData = JSON.parse(responseBody); // 성공 시 JSON 데이터 리턴
        //console.log('💥현재 유저 아이디: ', responseData?.result?.userId);

        setUserID(responseData?.result?.userId);
        setNotification(responseData?.result?.pushEnabled);
      } else {
        const errorData = JSON.parse(responseBody); // 실패 응답 처리
        console.log(errorData);
      }
    } catch (error) {
      console.log(`Network Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchMypage = async () => {
      try {
        const guestId = await AsyncStorage.getItem('guestId');
        const response = await fetch(`${BASE_URL}/api/mypage`, {
          headers: {
            'Content-Type': 'application/json',
            'guest-id': '4866bb84-f080-4cee-bccc-004d1e984a5d', // 추후 guestId로 수정
          },
        });
        console.log(`Response Status:`, response.status);

        const responseBody = await response.text(); // 응답 본문 가져오기
        if (response.ok) {
          const responseData = JSON.parse(responseBody); // 성공 시 JSON 데이터 리턴
          console.log('💥현재 알림 상태: ', responseData?.result?.pushEnabled);

          setUserID(responseData?.result?.userId);
          setNotification(responseData?.result?.pushEnabled);
        } else {
          const errorData = JSON.parse(responseBody); // 실패 응답 처리
          console.log(errorData);
        }
      } catch (error) {
        console.log(`Network Error: ${error.message}`);
      }
    };
    fetchMypage();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon
          style={styles.icon}
          onPress={() => navigation.goBack()}
          name="angle-left"
          size={40}
          color="#959595"
        />
        <Text style={styles.title}>설정</Text>
      </View>
      <View style={styles.optionContainer}>
        <Image
          style={styles.optionIcon}
          source={require('../assets/icons/notiIcon.png')}
        />
        <Text style={styles.optionTitle}>일기 알림</Text>
        <TouchableOpacity
          onPress={() => {
            saveNotificationSetting();
            fetchNotification();
          }}>
          <Image
            source={
              notification
                ? require('../assets/icons/sliderVariantIcon.png') // ON 이미지
                : require('../assets/icons/sliderDefaultIcon.png') // OFF 이미지
            }
            style={styles.sliderIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.optionContainer} onPress={openWebsite}>
        <Image
          style={styles.optionIcon}
          source={require('../assets/icons/cloudIcon.png')}
        />
        <Text style={styles.optionTitle}>구글 클라우드 동기화</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionContainer} onPress={openWebsite}>
        <Image
          style={styles.optionIcon}
          source={require('../assets/icons/backupIcon.png')}
        />
        <Text style={styles.optionTitle}>백업 / 복원</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionContainer} onPress={openWebsite}>
        <Image
          style={styles.optionIcon}
          source={require('../assets/icons/smileIcon.png')}
        />
        <Text style={styles.optionTitle}>앱 평가하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191B',
    marginTop: 5,
    marginBottom: 20,
    marginLeft: 140,
  },
  optionContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    marginTop: 10,
  },
  optionIcon: {
    width: 35,
    height: 35,
  },
  optionTitle: {
    marginLeft: 30,
    marginTop: 3,
    fontSize: 20,
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191B',
    height: 40,
    textAlign: 'center',
  },
  sliderIcon: {
    width: 55,
    height: 35,
    marginLeft: 170,
  },
});
