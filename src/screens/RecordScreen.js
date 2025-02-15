import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import data from '../constants/luckyLetter.json';

const {width} = Dimensions.get('window');

const IMAGE_WIDTH = 90;
const FIRST_IMAGE_WIDTH = 130;
const IMAGE_MARGIN = 10;
const BASE_URL = 'http://54.180.5.215:3000';

const fetchAlbumPhotos = async selectedYear => {
  try {
    const {data} = await axios.get(`${BASE_URL}/api/records/photos`, {
      headers: {'guest-id': '65e44a6d-5f27-4a63-a819-494234d46a1d'},
      params: {year: selectedYear},
    });
    return data.photos || [];
  } catch (error) {
    console.error('앨범 사진 가져오기 실패:', error.response || error);
    return [];
  }
};

const fetchTagStats = async (period = 'monthly') => {
  try {
    const {data} = await axios.get(`${BASE_URL}/api/statistics/user`, {
      headers: {
        'guest-id': '65e44a6d-5f27-4a63-a819-494234d46a1d',
        Authorization: `Bearer accessToken`,
      },
      params: {period},
    });
    return data.tagsUsage || {};
  } catch (error) {
    console.error('태그 통계 가져오기 실패:', error.response || error);
    return {};
  }
};

const RecordScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [year, setYear] = useState(2025);
  const navigation = useNavigation();
  const [viewMode, setViewMode] = useState('monthly');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2025년 1월');

  useEffect(() => {
    if (viewMode === 'monthly') {
      setSelectedDate('2025년 1월');
    } else if (viewMode === 'yearly') {
      setSelectedDate('2025년');
    }
  }, [viewMode]);

  const setViewModeAndDate = mode => {
    setViewMode(mode);
  };

  const yearlyData = ['2024년', '2025년'];
  const monthlyData = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  const handleYearChange = direction => {
    setYear(prevYear => {
      if (direction === 'previous' && prevYear > 2024) {
        return prevYear - 1;
      } else if (direction === 'next' && prevYear < 2025) {
        return prevYear + 1;
      }
      return prevYear;
    });
  };

  const sortedData = data.sort((a, b) => {
    const monthA = parseInt(a.letterDate.split('-')[1], 10);
    const monthB = parseInt(b.letterDate.split('-')[1], 10);
    return monthA - monthB;
  });

  const firstImageOfEachMonth = monthlyData.map(month => {
    const monthNumber = monthlyData.indexOf(month) + 1;
    const firstImage = sortedData.find(item => {
      const itemYear = parseInt(item.letterDate.split('-')[0], 10);
      const itemMonth = parseInt(item.letterDate.split('-')[1], 10);
      return itemYear === year && itemMonth === monthNumber;
    });

    return {
      year,
      month,
      imageUrl: firstImage ? firstImage.ImageUrl : null,
    };
  });

  const handleScroll = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.floor(contentOffsetX / (IMAGE_WIDTH + IMAGE_MARGIN));
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleSelection = item => {
    setSelectedDate(item);
    setIsDropdownVisible(false);
  };

  const dropdownData =
    viewMode === 'monthly'
      ? yearlyData.flatMap(y => monthlyData.map(m => `${y} ${m}`))
      : yearlyData;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>기록 아카이브</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabNavigator')}>
          <Image source={require('../assets/x.png')} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.albumSection}>
        <View style={styles.albumHeader}>
          <Text style={styles.albumTitle}>아보행 앨범</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AlbumScreen')}>
            <Image
              source={require('../assets/right.png')}
              style={styles.albumIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.albumYearContainer}>
          <TouchableOpacity onPress={() => handleYearChange('previous')}>
            <Image
              source={require('../assets/left_small.png')}
              style={styles.yearChangeIcon}
            />
          </TouchableOpacity>
          <Text style={styles.albumYear}>{year}년</Text>
          <TouchableOpacity onPress={() => handleYearChange('next')}>
            <Image
              source={require('../assets/right_small.png')}
              style={styles.yearChangeIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.albumImagesContainer}>
          <FlatList
            horizontal
            data={firstImageOfEachMonth}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.scrollContainer}
            snapToInterval={IMAGE_WIDTH + IMAGE_MARGIN}
            decelerationRate="fast"
            onScroll={handleScroll}
            renderItem={({item, index}) => {
              const isFirstImage = index === currentIndex;
              const imageStyle = [
                styles.albumImage,
                {
                  width: isFirstImage ? FIRST_IMAGE_WIDTH : IMAGE_WIDTH,
                  height: 209,
                },
              ];

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate('MonthlyScreen', {
                      selectedMonth: `${year}-${String(
                        monthlyData.indexOf(item.month) + 1,
                      ).padStart(2, '0')}`,
                    })
                  }>
                  {item.imageUrl ? (
                    <ImageBackground
                      source={{uri: item.imageUrl}}
                      style={imageStyle}
                      imageStyle={{borderRadius: 10}}>
                      <Text style={styles.monthLabel}>{item.month}</Text>
                    </ImageBackground>
                  ) : (
                    <View style={[imageStyle, {backgroundColor: '#d3d3d3'}]}>
                      <Text style={styles.monthLabel}>{item.month}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>태그 분포</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setViewModeAndDate('monthly')}>
            <Text
              style={[
                styles.buttonText,
                viewMode === 'monthly' && {
                  color: '#2ecc71',
                  borderBottomWidth: 2,
                  borderBottomColor: '#2ecc71',
                },
              ]}>
              월간
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setViewModeAndDate('yearly')}>
            <Text
              style={[
                styles.buttonText,
                viewMode === 'yearly' && {
                  color: '#2ecc71',
                  borderBottomWidth: 2,
                  borderBottomColor: '#2ecc71',
                },
              ]}>
              연간
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={toggleDropdown}>
            <View style={styles.dropdownContent}>
              <Text style={styles.dropdownButtonText}>{selectedDate}</Text>
              <Image
                source={require('../assets/down_small.png')}
                style={[
                  styles.dropdownIcon,
                  isDropdownVisible && {transform: [{rotate: '180deg'}]},
                ]}
              />
            </View>
          </TouchableOpacity>
          {isDropdownVisible && (
            <View style={styles.dropdown}>
              <FlatList
                data={dropdownData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity onPress={() => handleSelection(item)}>
                    <Text style={styles.dropdownItem}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
        <View style={styles.tagBar}>
          {Object.entries(tagList || {}).map(([tagName, percentage], index) => {
            const isLargest = tagName === mostFrequentTag;
            return (
              <View key={index} style={styles.tagItem}>
                {getTagImage(tagName, isLargest)}
                <Text style={styles.tagText}>{percentage}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.tagItem}>
            <View style={styles.barContainer}>
              {Object.entries(tagList || {}).map(
                ([tagName, percentage], index) => {
                  const borderRadius =
                    index === 0
                      ? {borderTopLeftRadius: 10, borderBottomLeftRadius: 10}
                      : index === Object.entries(tagList || {}).length - 1
                      ? {borderTopRightRadius: 10, borderBottomRightRadius: 10}
                      : {};

                  return (
                    <View
                      key={index}
                      style={[
                        styles.tagBarItem,
                        {
                          width: `${percentage}`,
                          backgroundColor: getTagColor(tagName),
                          ...borderRadius,
                        },
                      ]}
                    />
                  );
                },
              )}
            </View>
          </View>
        </View>
        <Text style={styles.summary}>
          {selectedDate}에는{' '}
          <Text style={styles.highlight}>{mostFrequentTag}</Text>을 많이
          겪었어요!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcf8',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#fff',
    height: 64,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  headerText: {
    width: 107,
    position: 'absolute',
    fontSize: 18,
    display: 'inline-block',
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191b',
    top: '50%',
    left: '53%',
    transform: 'translate(-50%, -50%)',
  },
  albumSection: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#fff',
    height: 320,
    paddingLeft: 20,
  },
  albumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  albumTitle: {
    fontSize: 18,
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191b',
    paddingLeft: 5,
  },
  albumIcon: {
    width: 20,
    height: 20,
    marginRight: 20,
  },
  albumYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginTop: 15,
    paddingLeft: 5,
  },
  yearChangeIcon: {
    width: 16,
    height: 16,
  },
  albumYear: {
    fontSize: 17,
    lineHeight: 24,
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191b',
    textAlign: 'left',
    paddingLeft: 7,
    paddingRight: 7,
  },
  albumImagesContainer: {
    flexDirection: 'row',
    alignItems: 'left',
    marginTop: 15,
    gap: 10,
  },
  albumImage: {
    position: 'relative',
    borderRadius: 10,
    maxWidth: '100%',
    overflow: 'hidden',
    height: 209,
    resizeMode: 'cover',
    marginLeft: 10,
  },
  monthLabel: {
    position: 'absolute',
    bottom: 15,
    left: 13,
    color: '#fff',
    fontSize: 21,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 4,
    fontFamily: 'NanumSquare Neo OTF',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
  },
  statsSection: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    height: 413,
  },
  statsTitle: {
    width: '100%',
    fontSize: 18,
    fontFamily: 'NanumSquare Neo OTF',
    color: '#19191b',
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    width: '100%',
    whiteSpace: 'nowrap',
    fontSize: 14,
    fontFamily: 'NanumSquare Neo OTF',
    color: '#b0b0b0',
    textAlign: 'center',
    cursor: 'pointer',
  },
  dropdownContainer: {
    marginTop: 10,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    fontFamily: 'NanumSquare Neo OTF',
    color: '#000',
  },
  dropdownIcon: {
    width: 16,
    height: 16,
    marginLeft: 10,
  },
  dropdownButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 250,
    textAlign: 'center',
    flexShrink: 1,
    overflow: 'hidden',
  },
  dropdown: {
    backgroundColor: '#fff',
    padding: 5,
    alignSelf: 'center',
    position: 'absolute',
    fontFamily: 'NanumSquare Neo OTF',
    zIndex: 10,
    width: '30%',
    top: 60,
    maxHeight: 300,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  tagBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 30,
  },
  tagItem: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 50,
  },
  icon: {
    position: 'absolute',
    top: -30, // 텍스트 위로 올리기
    width: 20,
    height: 20, // 이미지 크기 조정
  },
  tagText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#19191b',
  },
  summary: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    marginTop: 50,
  },
  highlight: {
    color: '#ff9b37',
    fontWeight: 'bold',
  },
});

export default RecordScreen;
