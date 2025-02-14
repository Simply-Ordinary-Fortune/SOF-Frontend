import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');
const BASE_URL = 'https://sof.backendbase.site';

const MonthlyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {selectedMonth} = route.params || {};
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedMonth) {
      setLoading(true);

      const year = selectedMonth.split('-')[0]; // 연도
      const month = selectedMonth.split('-')[1]; // 월

      axios
        .get(`${BASE_URL}/api/records/photos?year=${year}&month=${month}`, {
          headers: {'guest-id': '65e44a6d-5f27-4a63-a819-494234d46a1d'},
        })
        .then(response => {
          const filteredPhotos = response.data.photos || [];
          const filteredByMonth = filteredPhotos.filter(photo => {
            const photoMonth = new Date(photo.createdAt).getMonth() + 1;
            return photoMonth === parseInt(month, 10);
          });

          setPhotos(filteredByMonth);
          setLoading(false);
        })
        .catch(error => {
          console.error('사진 가져오기 실패:', error);
          setLoading(false);
        });
    }
  }, [selectedMonth]);

  if (loading) {
    return <Text>로딩 중...</Text>;
  }

  const groupImagesByRows = () => {
    const rows = [];
    let row = [];
    const pattern = [1, 3, 2];

    photos.forEach((item, index) => {
      row.push(item);

      if (row.length === pattern[rows.length % pattern.length]) {
        rows.push(row);
        row = [];
      }
    });

    if (row.length) {
      rows.push(row);
    }

    return rows;
  };

  const renderImages = () => {
    const rows = groupImagesByRows();
    return rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.imageContainer}>
        {row.map((item, index) => (
          <Image
            key={index}
            source={{uri: `${BASE_URL}${item.imageUrl}`}}
            style={[styles.image, {width: getImageWidth(row.length)}]}
            resizeMode="cover"
          />
        ))}
      </View>
    ));
  };

  const getImageWidth = rowLength => {
    if (rowLength === 1) return width;
    if (rowLength === 2) return width / 2;
    return width / 3;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('AlbumScreen')}>
          <Image
            source={require('../assets/left.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.AlbumContainer}>
          <Text style={styles.dateText}>
            {`${selectedMonth?.split('-')[0] || ''}년 ${
              parseInt(selectedMonth?.split('-')[1]) || ''
            }월`}
          </Text>
          <Text style={styles.statText}>아보행 {photos.length}개</Text>
          {renderImages()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 64,
    paddingLeft: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 34,
    paddingBottom: 20,
    alignItems: 'center',
  },
  AlbumContainer: {
    alignItems: 'flex-start',
    width: '100%',
  },
  dateText: {
    fontSize: 24,
    fontFamily: 'NanumSquare Neo OTF',
    fontWeight: 'bold',
    color: '#19191b',
    position: 'relative',
    paddingLeft: 20,
    marginTop: 30,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191b',
    position: 'relative',
    paddingLeft: 20,
    marginTop: 5,
    paddingBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: width,
  },
  image: {
    width: '100%',
    height: 174,
  },
});

export default MonthlyScreen;
