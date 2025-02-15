import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  PanResponder,
  Animated,
  Image,
} from 'react-native';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import recordData from '../constants/ViewDetailRecord.json';
const ModalBottomSheet = ({visible, onClose, selectedDate}) => {
  // guest-id 가져오기(api 호출용)
  /*
  useEffect(() => {
    const fetchGuestId = async () => {
      const guestId = await AsyncStorage.getItem('guest-id');
    };
    fetchGuestId();
  }, []);
  */

  // 선택한 날짜 데이터 로딩(목데이터 ver.)
  useEffect(() => {
    if (visible && selectedDate) {
      const formatDate = selectedDate.toISOString().slice(0, 10);
      setRecordDetails(recordData[formatDate]);
    }
  }, [visible, selectedDate]);
  // api 호출용
  /*
  const fetchRecordDetails = async recordId => {
    try {
      const response = await fetch(`https://records/${recordId}`, {
        method: 'GET',
        headers: {
          'guest-id': guestId,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error fetching record details:', error);
    }
  };
  */

  const [panY] = useState(new Animated.Value(0));

  const [recordDetails, setRecordDetails] = useState(null);
  /*
  useEffect(() => {
    if (visible && selectedDate) {
      fetchRecordDetails(recordId).then(data => {
        setRecordDetails(data);
      });
    }
  }, [visible, recordId]);
  */
  // 모달 복원
  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  // 모달 닫기
  const closeAnim = Animated.timing(panY, {
    toValue: 500,
    duration: 300,
    useNativeDriver: true,
  });
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gesture) => {
      if (gesture.dy > 0) {
        panY.setValue(gesture.dy);
      }
    },
    onPanResponderRelease: (e, gesture) => {
      if (gesture.dy > 100) {
        closeAnim.start(onClose);
      } else {
        resetPositionAnim.start();
      }
    },
  });

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 300],
    outputRange: [0, 0, 300],
  });

  const handleClose = () => {
    closeAnim.start(onClose);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.sheetContainer, {transform: [{translateY}]}]}
          {...panResponder.panHandlers}>
          <View style={styles.handleBar} />
          <View style={styles.header}>
            <Icon
              name="chevron-back-outline"
              type="ionicon"
              size={28}
              color="#000"
              onPress={onClose}
            />
            <Text style={styles.date}>
              {selectedDate
                ? `${selectedDate.getDate()}월 ${selectedDate.getDay()}일의 행운`
                : '날짜가 로드되지 않았습니다.'}
            </Text>
            <Icon
              name="close-outline"
              type="ionicon"
              size={28}
              color="#000"
              onPress={handleClose}
            />
          </View>
          <View style={styles.content}>
            {recordDetails ? (
              <View style={styles.card}>
                <Image
                  source={require('../assets/dog.jpg')}
                  style={styles.image}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.recordText}>{recordDetails.text}</Text>
                  <View style={styles.tagContainer}>
                    {recordDetails.tags.map(tag => (
                      <Text key={tag} style={styles.tag}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.card}>
                <Text>
                  내용을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  handleBar: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 5,
  },
  recordText: {
    fontSize: 12,
    color: '#000',
  },
  tagContainer: {
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#E8F5E9',
    color: '#27AE60',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ModalBottomSheet;
