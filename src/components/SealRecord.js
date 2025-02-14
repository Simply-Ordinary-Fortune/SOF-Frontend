import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Tag from './Tag';
import {Button} from 'react-native';

const SealedRecord = ({photo, today, selectedTag, recordText}) => {
  const tagColors = {
    green: '#2ECC71',
    orange: '#E67E22',
    yellow: '#F1C40F',
    blue: '#3498DB',
    pink: '#FF69B4',
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <Image source={{uri: photo}} style={styles.image} />
      ) : (
        <Text style={styles.noPhotoText}>사진이 없습니다.</Text>
      )}
      <Text style={styles.dateText}>{today}의 행운</Text>
      {selectedTag && <Tag color={selectedTag} noClick={true} />}
      <View style={styles.recordTextBox}>
        <Text style={styles.recordTitle}>한 줄 기록</Text>
        <Text style={styles.recordText}>{recordText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 150,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  dateText: {
    fontSize: 12,
    fontWeight: 'regular',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  noPhotoText: {
    fontSize: 14,
    color: '#959595',
  },
  recordTextBox: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordTitle: {
    fontSize: 14,
  },
  recordText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  tag: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  tagText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default SealedRecord;
