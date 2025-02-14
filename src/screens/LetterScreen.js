import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native';
import CloverImage from '../components/CloverIcon.js';
import {BASE_URL} from '../../env.js';
import {fetchBottleFocus} from '../utils/fetchBottleFocus.js';

const LetterScreen = () => {
  console.log('행운편지보관함 화면 랜더링입니다...');

  const [recentLetter, setRecentLetter] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState();
  const [letterId, setLetterId] = useState();

  const navigation = useNavigation();

  const handleRecentLetterClick = letterId => {
    console.log('📩 최근 편지 ID:', letterId);
    fetchBottleFocus({mode: 'recent', letterId});
  };

  useEffect(() => {
    const fetchLetterHome = async () => {
      try {
        const guestId = await AsyncStorage.getItem('guestId');
        const response = await fetch(`${BASE_URL}/api/bottle`, {
          headers: {
            'Content-Type': 'application/json',
            'guest-id': guestId, // 테스트 할 때는 '4866bb84-f080-4cee-bccc-004d1e984a5d'
          },
        });
        console.log(`Response Status:`, response.status);

        const responseBody = await response.text(); // 응답 본문 가져오기
        if (response.ok) {
          const responseData = JSON.parse(responseBody); // 성공 시 JSON 데이터 리턴
          const recentLetters = responseData?.result?.recentLetters; // recentLetters 추출
          console.log('최근 편지 목록:', recentLetters);

          setRecentLetter(recentLetters);
          //console.log(recentLetter);
          setIsAllChecked(responseData?.result?.isAllChecked);
          setLetterId(responseData?.result?.recentLetters.letterId);
        } else {
          const errorData = JSON.parse(responseBody); // 실패 응답 처리
          console.log(errorData);
        }
      } catch (error) {
        console.log(`Network Error: ${error.message}`);
      }
    };

    fetchLetterHome();
  }, []);

  // 현재 날짜를 가져와서 월.일 형식으로 포맷
  const currentDate = new Date();
  const formattedDate = `${
    currentDate.getMonth() + 1
  }.${currentDate.getDate()}`;

  /*// 최근 행운편지 2개
  const luckyLetters = [
    {
      letterId: 1,
      letterDate: '2025-01-05',
      ImageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjKcURzdi46eBCEV80tCMc34bhFdqJJ6_-OA&s',
      letterContent: '크리스마스 쿠키를 만들다.',
      tagId: 2,
      tagName: '일상 속 기쁨',
      tagImageUrl: 'sdf',
    },
    {
      letterId: 2,
      letterDate: '2025-01-04',
      ImageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_m-HMI3ld4fZkeFkTn7N-NCNGydEldIYKTw&s',
      letterContent: '라면을 먹다가 하트 파가 나왔다.',
      tagId: 2,
      tagName: '일상 속 기쁨',
      tagImageUrl: 'df',
    },
    {
      letterId: 3,
      letterDate: '2025-01-03',
      ImageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_m-HMI3ld4fZkeFkTn7N-NCNGydEldIYKTw&s',
      letterContent: '네잎클로버를 찾았다!!',
      tagId: 1,
      tagName: '자연의 선물',
      tagImageUrl: 'df',
    },
  ];*/

  return (
    <SafeAreaView>
      <View style={{backgroundColor: '#FFFFFF'}}>
        <Text style={styles.title}>행운의 유리병 편지</Text>
      </View>
      <View style={styles.imageContainer}>
        {/* 유리병 이미지 */}
        <Image
          source={require('../assets/bottle.png')}
          style={styles.bottleImage}
          resizeMode="contain"
        />
        {/* 날짜 */}
        <Text style={styles.date}>{formattedDate}</Text>
        {/* 새로운 편지가 있을 때만 클로버 표시 */}
        {isAllChecked ? (
          <Image
            source={require('../assets/clover.png')}
            style={styles.cloverImage}
            resizeMode="contain"
          />
        ) : null}
      </View>
      {/* 새로운 편지가 있을 때만 알람 표시 */}
      {isAllChecked ? (
        <View style={styles.alarmContainer}>
          <Text style={styles.alarmText}>
            1개의 새로운 행운편지가 도착했어요!
          </Text>
        </View>
      ) : null}
      <View style={styles.luckyLettersContainer}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuText}>행운편지 보관함</Text>
          {/* 화살표 아이콘 추가 */}
          <Icon
            name="angle-right"
            size={40}
            color="#959595"
            style={styles.arrowIcon}
            onPress={() => navigation.navigate('LetterDetailScreen')}
          />
        </View>
        {/* 가장 최근의 행운 편지 1개 표시 */}
        <View>
          {recentLetter.slice(0, 1).map(letter => (
            <TouchableOpacity
              onPress={() => {
                setIsAllChecked(false);
                navigation.navigate('LetterDetailScreen', {letterId: 80}); //letterId 넘어오는 데이터로 수정필요
              }}
              key={letter.letterId}
              style={styles.letterItem}>
              <SafeAreaView>
                <CloverImage
                  style={styles.cloverShapeImage}
                  imageUrl={letter.imageUrl}
                  size={65}
                />
              </SafeAreaView>
              <Text style={styles.letterDate}>
                {letter.year}년 {letter.sentAt} 행운편지
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

// 스타일 시트
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191B',
    marginTop: 30,
    marginBottom: 30,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 20,
  },
  bottleImage: {
    width: 500,
    height: 500,
  },
  date: {
    position: 'absolute',
    top: 230,
    left: 75,
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'NanumSquare Neo OTF',
    transform: [{rotate: '12deg'}],
    color: 'black',
  },
  cloverImage: {
    position: 'absolute',
    width: 250,
    height: 250,
    top: 220,
    left: 90,
  },
  alarmContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: 150,
    left: 28,
    padding: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#2ECC71',
    backgroundColor: '#F5FCF8', // 투명도 포함 배경색
    shadowColor: '#2ECC71',
    shadowOffset: {
      width: 100,
      height: 100,
    },
    shadowOpacity: 0.5,
    shadowRadius: 50,
  },
  alarmText: {
    fontSize: 22,
    color: '#2ECC71',
    textAlign: 'center',
  },
  luckyLettersContainer: {
    height: 300,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 23,
    fontWeight: '700',
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191B',
  },
  letterItem: {
    flexDirection: 'row',
    marginBottom: 30,
    marginLeft: 30,
  },
  cloverShapeImage: {},
  letterDate: {
    marginLeft: 20,
    paddingTop: 20,
    fontSize: 22,
    fontWeight: 'regular',
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191B',
  },
});

export default LetterScreen;
