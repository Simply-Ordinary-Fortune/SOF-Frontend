import React from 'react';
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
import data from '../constants/luckyLetter.json';

const {width} = Dimensions.get('window');

const MonthlyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {selectedMonth} = route.params || {};

  const filteredData = data
    .filter(item => item.letterDate.startsWith(selectedMonth))
    .sort((a, b) => new Date(a.letterDate) - new Date(b.letterDate));

  const groupImagesByRows = () => {
    const rows = [];
    let row = [];
    const pattern = [1, 3, 2];

    filteredData.forEach((item, index) => {
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
            source={{uri: item.ImageUrl}}
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
    <View style={styles.container}>
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
          <Text style={styles.statText}>아보행 {filteredData.length}개</Text>
          {renderImages()}
        </View>
      </ScrollView>
    </View>
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
