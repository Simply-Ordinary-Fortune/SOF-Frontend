import React, {useState, useRef} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import Tag from '../components/Tag';
import SealedRecord from '../components/\bSealRecord';

const {height} = Dimensions.get('window'); // 화면 높이 가져오기

const AddRecordScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {photo, isToday, today} = route.params || {};
  const [recordText, setRecordText] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [isSwiped, setIsSwiped] = useState(false);
  const [swipeTextOpacity] = useState(new Animated.Value(1)); // 처음에는 완전히 보이게 설정
  const [showSealedRecord, setShowSealedRecord] = useState(false); // 추가된 상태

  const translateY = useRef(new Animated.Value(0)).current; // 화면 이동 애니메이션
  const sealAnim = useRef(new Animated.Value(0)).current; // 실링 왁스 찍는 애니메이션
  const afterSealAnim = useRef(new Animated.Value(0)).current;
  const handleTagSelect = color => {
    setSelectedTag(prev => (prev === color ? null : color));
  };

  const sealImages = {
    green: require('../assets/BGreen.png'),
    orange: require('../assets/BOrange.png'),
    yellow: require('../assets/BYellow.png'),
    blue: require('../assets/BBlue.png'),
    pink: require('../assets/BPink.png'),
  };
  const sealAfterImages = {
    green: require('../assets/AGreen.png'),
    orange: require('../assets/AOrange.png'),
    yellow: require('../assets/AYellow.png'),
    blue: require('../assets/ABlue.png'),
    pink: require('../assets/APink.png'),
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy < -10, // 위로 스와이프 감지
      onPanResponderRelease: (_, gesture) => {
        if (gesture.moveY < height / 2) {
          // 화면의 절반 이상 스와이프 시 실행
          setIsSwiped(true);
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -height + 100,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(sealAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ]).start(() => {
            Animated.timing(swipeTextOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start(() => setIsSwiped(true));
            setTimeout(() => {
              Animated.timing(afterSealAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
              }).start();

              // 3초 후 SealedRecord 컴포넌트
              setTimeout(() => {
                setShowSealedRecord(true);
              }, 3000);
            }, 600);
          });
        }
      },
    }),
  ).current;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{translateY}],
          },
        ]}>
        <View style={styles.padding}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/left.png')}
                style={styles.Icon}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>{today}</Text>
          </View>

          {photo ? (
            <Image
              source={{uri: isToday ? photo : photo.uri}}
              style={styles.image}
            />
          ) : (
            <Text style={styles.noPhotoText}>사진이 없습니다.</Text>
          )}

          <View style={styles.recordBox}>
            <Text style={styles.recordTitle}>오늘의 행운 기록</Text>
            <TextInput
              style={styles.recordTextBox}
              placeholder="내용을 입력해 주세요."
              value={recordText}
              onChangeText={setRecordText}
              multiline
              numberOfLines={4}
              editable={!showSealedRecord}
              maxLength={100}
            />

            <Text style={styles.recordTitle}>태그</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tagContainer}>
                {['green', 'orange', 'yellow', 'blue', 'pink'].map(color => (
                  <Tag
                    key={color}
                    color={color}
                    isSelected={selectedTag === color}
                    onSelect={handleTagSelect}
                  />
                ))}
              </View>
            </ScrollView>

            {/* 위로 스와이프 */}
            {selectedTag && (
              <View {...panResponder.panHandlers} style={styles.arrowBtn}>
                <Image
                  source={require('../assets/topArrow.png')}
                  style={styles.Icon}
                />
              </View>
            )}
          </View>
        </View>
        {!isSwiped && selectedTag && (
          <View style={styles.swipeTextBox}>
            <Text style={styles.swipeText}>밀어서 행운 기록 저장</Text>
          </View>
        )}
      </Animated.View>

      {/* 실링 왁스 애니메이션 */}
      {selectedTag && !showSealedRecord && (
        <Animated.View
          style={[
            styles.sealContainer,
            {
              opacity: sealAnim,
              transform: [{scale: sealAnim}],
            },
          ]}>
          <Image source={sealImages[selectedTag]} style={styles.sealImage} />
          <Animated.Image
            source={sealAfterImages[selectedTag]}
            style={[
              styles.sealImage,
              {
                position: 'absolute',
                opacity: afterSealAnim,
              },
            ]}
          />
        </Animated.View>
      )}

      {/* Show SealedRecord after animation */}
      {showSealedRecord && (
        <>
          <SealedRecord
            photo={isToday ? photo : photo.uri}
            today={today}
            selectedTag={selectedTag}
            recordText={recordText}
          />
          <View style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>닫기</Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default AddRecordScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FCF8',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#F5FCF8',
  },
  padding: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    paddingBottom: 22,
    borderTopWidth: 0,
    shadowColor: '#2ECC71',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
  },
  noPhotoText: {
    fontSize: 14,
    color: '#959595',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19191b',
    textAlign: 'center',
    flex: 1,
  },
  Icon: {
    width: 24,
    height: 24,
  },
  recordBox: {
    width: '100%',
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'NotoSansKR-Bold',
    marginBottom: 8,
    marginTop: 20,
  },
  recordTextBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    height: 87,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlignVertical: 'top',
  },
  arrowBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 23,
    paddingVertical: 3, // 터치 영역 확대
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sealContainer: {
    position: 'absolute',
    top: 120,
    height: 590,
    width: '100%',
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F5FCF8',
  },
  sealImage: {
    width: 172,
    height: 172,
  },
  swipeTextBox: {
    marginTop: 10,
  },
  swipeText: {
    color: '#2ECC71',
    fontSize: 17,
    fontWeight: 'bold',
  },
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
  },
});
