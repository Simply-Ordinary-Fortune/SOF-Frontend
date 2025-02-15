import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import data from '../constants/luckyLetter.json';

const {width} = Dimensions.get('window');
const BASE_URL = 'http://54.180.5.215:3000';

const AlbumScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
        {data.length > 0 ? (
          data.map((item, index) => {
            const [year, month, day] = item.letterDate.split('-');
            return (
              <View key={index} style={styles.imageContainer}>
                <Image style={styles.image} source={{uri: item.ImageUrl}} />
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
    </View>
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
