import React, { useEffect, useState, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Easing } from 'react-native';
import { useRouter } from 'expo-router'; 

const App = () => {
  const translateX = useRef(new Animated.Value(0)).current; 
  const opacityWorld = useRef(new Animated.Value(0)).current; 
  const opacityUser = useRef(new Animated.Value(0)).current; 
  const [userName, setUserName] = useState('User'); 
  const router = useRouter();

  useEffect(() => {
  
    const fetchUserName = async () => {
      const storedName = 'User'; 
      setUserName(storedName); 
    };

    fetchUserName(); 

    
    const animation = Animated.sequence([
     
      Animated.parallel([
        Animated.timing(opacityWorld, {
          toValue: 1, 
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityUser, {
          toValue: 0, 
          duration: 0,
          useNativeDriver: true,
        }),
      ]),

      
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 200, 
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityUser, {
          toValue: 1, 
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

      
      Animated.delay(1000),

      
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0, 
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityUser, {
          toValue: 0, 
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

      
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0, 
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityWorld, {
          toValue: 1, 
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

     
      Animated.delay(1000),
    ]);

    
    const loopAnimation = Animated.loop(animation, { iterations: 2 });

    
    loopAnimation.start();

    
    const timer = setTimeout(() => {
      router.push('/(tabs)'); 
    }, 6000); 

    return () => clearTimeout(timer);
  }, [router, opacityWorld, opacityUser, translateX]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>[ Hello </Text>

      <View style={styles.animatedContent}>
        <Animated.Text
          style={[styles.dynamicText, { opacity: opacityWorld, transform: [{ translateX }] }]}
        >
          World
        </Animated.Text>
        <Animated.Text
          style={[styles.dynamicText, { opacity: opacityUser, transform: [{ translateX }] }]}
        >
          {userName}
        </Animated.Text>
      </View>

      <Text style={styles.text}> ]</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Roboto Medium',
    fontSize: 40,
    lineHeight: 40,
    color: '#ecf0f1',
    textAlign: 'center',
  },
  dynamicText: {
    fontFamily: 'Roboto Medium',
    fontSize: 40,
    lineHeight: 40,
    color: '#ecf0f1',
    textAlign: 'center',
  },
});

export default App;
