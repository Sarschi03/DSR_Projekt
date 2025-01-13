import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import UserProfile from './index'
import { useNavigation } from '@react-navigation/native';
import { useRouter, Link } from 'expo-router';

export default function RegisterScreen() {
  const navigation = useNavigation(); 
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('front_end');
  const [githubUrl, setGithubUrl] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [useGithubData, setUseGithubData] = useState(false);

  const handleRegister = async () => {
    if (!password || !confirmPassword || !role || (useGithubData && !githubUrl)) {
      Alert.alert('Validation Error', 'Please fill all the fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Password and confirm password must match');
      return;
    }

    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      role: role,
      github_url: githubUrl,
      profile_image_url: profileImageUrl,
    };

    try {
      const response = await fetch('http://localhost:8000/post_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Registration Successful', 'You have successfully registered!');
        
        
        router.push('/(tabs)/welcome_page');
        
      } else {
        Alert.alert('Registration Failed', data.error || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Failed to connect to server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SIGN UP!</Text>
      
      <View style={styles.form}>
        <View style={styles.githubToggle}>
          <Text style={styles.githubToggleLabel}>Use GitHub for auto-fill?</Text>
          <Switch
            value={useGithubData}
            onValueChange={setUseGithubData}
          />
        </View>

        {!useGithubData && (
          <>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#AAAAAA"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#AAAAAA"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Your Email"
              placeholderTextColor="#AAAAAA"
              value={email}
              onChangeText={setEmail}
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Create a Password"
          placeholderTextColor="#AAAAAA"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm a Password"
          placeholderTextColor="#AAAAAA"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {useGithubData && (
          <>
            <TextInput
              style={styles.input}
              placeholder="GitHub URL"
              placeholderTextColor="#AAAAAA"
              value={githubUrl}
              onChangeText={setGithubUrl}
            />
          </>
        )}

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>REGISTER</Text>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Link href={'/(tabs)/login'}>
            <Text style={styles.loginText}>Already have an account? Log in</Text>
          </Link>        
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2%',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    top: '10%',
    bottom: '2%',
    left: '10%',
    fontFamily: 'Roboto Medium',
  },
  form: {
    backgroundColor: '#E0E0E0',
    width: '90%',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 5,
  },
  input: {
    backgroundColor: '#D3D3D3',
    width: '40%',
    height: 40,
    borderRadius: 30,
    marginRight: '30%',
    marginTop: 20,
    fontSize: 14,
    color: '#121212',
    fontFamily: 'Roboto Thin',
    fontStyle: 'italic',
  },
  registerButton: {
    backgroundColor: '#131312',
    width: '20%',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: '2%',
    marginLeft: '55%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  githubToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  githubToggleLabel: {
    fontSize: 16,
    color: '#121212',
  },
  loginText: {
    color: '#828283',
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Roboto Thin',
  },
});
