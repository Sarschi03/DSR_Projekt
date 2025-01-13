import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRouter, Link } from 'expo-router';


export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {

        localStorage.setItem('userEmail', email);
        sessionStorage.setItem('userLoggedIn', 'true');
        Alert.alert('Success', 'You are successfully signed up!');
        router.push('/(tabs)/welcome_page');

      } else {
        Alert.alert('Error', result.error || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server. Please try again later.');
      console.error('Fetch error:', error);
    }
  };

  return (
    <View style={styles.container1}>
      <Text style={styles.title}>LOGIN!</Text>

      <View style={styles.form}>
        <Text style={styles.text}>Your e-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          placeholderTextColor="#AAAAAA"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.text}>Your password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#AAAAAA"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
          
            <Text style={styles.registerButtonText}>LOGIN</Text>
         
        </TouchableOpacity>

        <TouchableOpacity>
        <Link href={'/(tabs)/register'}>
          <Text style={styles.loginText}>Don't have an account? SIGN UP!</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#131313',
    padding: '2%',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    top: '10%',
    left: '10%',
    fontFamily: 'Roboto Medium',
  },
  text: {
    color: '#131312',
    fontSize: 15,
    textAlign: 'left',
    marginTop: '2%',
    fontFamily: 'Roboto Medium',
  },
  form: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    width: '80%',
    paddingVertical: 40,
    paddingHorizontal: 40,
    elevation: 5,
    marginTop: '10%',
    marginLeft: '20%',
  },
  input: {
    backgroundColor: '#D3D3D3',
    width: '40%',
    borderRadius: 30,
    paddingVertical: 17,
    paddingHorizontal: 30,
    marginTop: 20,
    fontSize: 14,
    color: '#121212',
    fontFamily: 'Roboto Thin',
    fontStyle: 'italic',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButton: {
    backgroundColor: '#131312',
    width: '20%',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: '10%',
    marginLeft: '55%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#828283',
    marginTop: 20,
    fontSize: 14,
    marginLeft:'30%',
 
    fontFamily: 'Roboto Thin',

  },
});
