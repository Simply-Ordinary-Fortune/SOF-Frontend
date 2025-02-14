import React from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';

const Tag = ({color, isSelected, onSelect, noClick}) => {
  let label;
  let textColor;
  let backgroundColor;
  let iconSource;

  switch (color) {
    case 'green':
      label = '자연의 선물';
      textColor = '#42D647';
      backgroundColor = 'rgba(162, 217, 164, 0.15)';
      iconSource = require('../assets/green_small.png');
      break;
    case 'yellow':
      label = '일상속 기쁨';
      textColor = '#FFD53C';
      backgroundColor = 'rgba(253, 238, 183, 0.15)';
      iconSource = require('../assets/yellow_small.png');
      break;
    case 'orange':
      label = '뜻밖의 친절';
      textColor = '#FF9B37';
      backgroundColor = 'rgba(255, 210, 165, 0.15)';
      iconSource = require('../assets/orange_small.png');
      break;
    case 'blue':
      label = '예상 못한 선물';
      textColor = '#52C5EF';
      backgroundColor = 'rgba(163, 223, 245, 0.15)';
      iconSource = require('../assets/blue_small.png');
      break;
    case 'pink':
      label = '우연한 행운';
      textColor = '#FF7992';
      backgroundColor = 'rgba(255, 179, 193, 0.15)';
      iconSource = require('../assets/pink_small.png');
      break;
    default:
      label = '기타';
      textColor = '#000';
      backgroundColor = 'rgba(224, 224, 224, 0.15)';
      iconSource = require('../assets/pink_small.png');
      break;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if (noClick) {
          return;
        }
        onSelect(color);
      }}>
      <View
        style={[
          styles.tagContainer,
          {
            backgroundColor,
            borderColor: isSelected ? textColor : 'transparent',
          },
        ]}>
        <Image source={iconSource} style={styles.icon} />
        <Text style={[styles.tag, {color: textColor}]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    minWidth: 110,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    gap: 4,
    borderWidth: 1, // 선택 시 테두리 표시
  },
  tag: {
    fontSize: 13,
    fontWeight: 'regular',
    marginLeft: 4,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default Tag;
