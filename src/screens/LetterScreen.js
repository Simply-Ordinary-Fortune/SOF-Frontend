import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native';
import CloverImage from '../components/CloverIcon.js';

const LetterScreen = () => {
  console.log('행운편지보관함 첫 화면 랜더링입니다...');
  const navigation = useNavigation();

  // 현재 날짜를 가져와서 월/일 형식으로 포맷
  const currentDate = new Date();
  const formattedDate = `${
    currentDate.getMonth() + 1
  }.${currentDate.getDate()}`;

  // 새로운 메세지 여부
  const hasNewMessage = true;

  // 최근 행운편지 2개
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
  ];

  return (
    <View>
      <Text style={styles.title}>행운의 유리병 편지</Text>
      <View style={styles.imageContainer}>
        {/* 유리병 이미지 */}
        <Image
          source={require('../assets/bottle.png')} // 유리병 이미지 경로
          style={styles.bottleImage}
          resizeMode="contain"
        />
        {/* 날짜 */}
        <Text style={styles.date}>{formattedDate}</Text>
        {/* 새로운 편지가 있을 때만 클로버 표시 */}
        {hasNewMessage ? (
          <Image
            source={require('../assets/clover.png')}
            style={styles.cloverImage}
            resizeMode="contain"
          />
        ) : null}
      </View>
      {/* 새로운 편지가 있을 때만 알람 표시 */}
      {hasNewMessage ? (
        <View style={styles.alarmContainer}>
          <Text style={styles.alarmText}>
            1개의 새로운 행운편지가 도착했어요!
          </Text>
        </View>
      ) : null}
      <View style={styles.menuContainer}>
        <Text style={styles.menuText}>행운편지 보관함</Text>
        {/* 화살표 아이콘 추가 */}
        <Icon
          name="angle-right"
          size={40}
          color="#959595"
          style={styles.arrowIcon}
          onPress={() => navigation.navigate('LetterDetailScreen')} // 아이콘 클릭 시 이동
        />
      </View>
      {/* 가장 최근의 행운 편지 2개 표시 */}
      <View style={styles.luckyLettersContainer}>
        {luckyLetters.slice(0, 2).map(letter => (
          <View key={letter.letterId} style={styles.letterItem}>
            <SafeAreaView>
              <CloverImage
                style={styles.cloverShapeImage}
                imageUrl={letter.ImageUrl}
                size={90}
              />
            </SafeAreaView>
            <Text style={styles.letterDate}>{letter.letterDate}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// 스타일 시트
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  bottleImage: {
    width: 400,
    height: 400,
  },
  date: {
    position: 'absolute',
    top: 170,
    left: 90,
    fontSize: 30,
    transform: [{rotate: '12deg'}], // 텍스트를 10도 회전
    color: 'black',
  },
  cloverImage: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: 160,
    left: 110,
  },
  alarmContainer: {
    position: 'absolute',
    top: 80,
    left: 50,
    padding: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#2ECC71',
    backgroundColor: '#F5FCF8', // 투명도 포함 배경색
    shadowColor: '#2ECC71',
    shadowOffset: {
      width: 30,
      height: 30,
    },
    shadowOpacity: 0.5,
    shadowRadius: 50,
  },
  alarmText: {
    fontSize: 18,
    color: '#2ECC71',
    textAlign: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  menuText: {
    fontSize: 20,
    color: '#19191B',
  },
  luckyLettersContainer: {
    marginTop: 20,
  },
  letterItem: {
    flexDirection: 'row',
    marginBottom: 30,
    marginLeft: 30,
  },
  cloverShapeImage: {},
  letterDate: {
    marginLeft: 80,
    paddingTop: 30,
    fontSize: 20,
  },
});

export default LetterScreen;
