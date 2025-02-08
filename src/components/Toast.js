import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, Animated} from 'react-native';

const Toast = ({message, visible, onHide}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(onHide);
        }, 2000);
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastContainer, {opacity: fadeAnim}]}>
      <Text style={styles.toastText}>{message}☘️</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    backgroundColor: '#D9DADB',
    padding: 15,
    borderRadius: 10,
    zIndex: 1000,
    alignItems: 'center',
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Toast;
