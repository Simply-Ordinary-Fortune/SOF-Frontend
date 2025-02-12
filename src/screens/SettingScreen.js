import React, {useState, useEffect, useRef, useCallback} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Linking,
  Button,
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

  // 알림 설정 불러오기
  const getNotificationSetting = async () => {
    try {
      const notify = await AsyncStorage.getItem('notify');
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
  const saveNotificationSetting = async () => {
    try {
      setNotification(prev => {
        const newValue = !prev; // 기존 값 반전
        AsyncStorage.setItem('notify', JSON.stringify(newValue));
        console.log('현재 알림 설정 상태: ', newValue);
        return newValue;
      });
    } catch (error) {
      console.error('알림 값 저장 오류:', error);
    }
  };

  getNotificationSetting;

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
        <TouchableOpacity onPress={saveNotificationSetting}>
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
    backgroundColor: '#F5FCF8',
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 160,
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
    height: 40,
    textAlign: 'center',
  },
  sliderIcon: {
    width: 55,
    height: 35,
    marginLeft: 170,
  },
});
