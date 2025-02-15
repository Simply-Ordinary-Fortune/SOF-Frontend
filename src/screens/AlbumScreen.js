import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';

const {width} = Dimensions.get('window');
const BASE_URL = 'http://54.180.5.215:3000';

const AlbumScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const guestId = '65e44a6d-5f27-4a63-a819-494234d46a1d';
  const [selectedYear, setSelectedYear] = useState(route.params?.year || 2025);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(
          'https://sof.backendbase.site/api/records/photos',
          {
            headers: {'guest-id': guestId},
            params: {year: selectedYear},
          },
        );
        const filteredPhotos = response.data.photos.filter(item => {
          const year = item.createdAt.split('T')[0].split('-')[0];
          return year === String(selectedYear);
        });
        const sortedPhotos = filteredPhotos.sort((a, b) => {
          const monthA = parseInt(a.createdAt.split('T')[0].split('-')[1]);
          const monthB = parseInt(b.createdAt.split('T')[0].split('-')[1]);
          return monthA - monthB;
        });

        setPhotos(sortedPhotos || []);
        setLoading(false);
      } catch (error) {
        console.error('❌ 사진 데이터 가져오기 실패:', error);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [selectedYear]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>아보행 앨범</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RecordScreen')}>
          <Image
            source={require('../assets/left.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        scrollEventThrottle={16}
        disableIntervalMomentum={true}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>로딩 중...</Text>
          </View>
        ) : Array.isArray(photos) && photos.length > 0 ? (
          photos.map((item, index) => {
            const [year, month] = item.createdAt.split('T')[0].split('-');
            const fullImageUrl = `${BASE_URL}${item.imageUrl}`;

            return (
              <View key={index} style={styles.imageContainer}>
                {fullImageUrl ? (
                  <Image style={styles.image} source={{uri: fullImageUrl}} />
                ) : (
                  <Text style={styles.noImageText}>이미지 없음</Text>
                )}
                <Text style={styles.monthLabel}>{parseInt(month)}월</Text>
              </View>
            );
          })
        ) : (
          <View style={styles.noImagesContainer}>
            <Text style={styles.noImagesText}>등록된 사진이 없습니다.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
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
    justifyContent: 'flex-start',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'NanumSquare Neo OTF',
    fontWeight: 'bold',
    color: '#19191b',
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    transform: [{translateX: -40}],
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 64,
  },
  imageContainer: {
    width: width * 0.9,
    aspectRatio: 353 / 470,
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  monthLabel: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{translateX: -30}],
    fontSize: 24,
    fontFamily: 'NanumSquare Neo OTF',
    fontWeight: 'bold',
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 5,
  },
  noImagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImagesText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default AlbumScreen;
