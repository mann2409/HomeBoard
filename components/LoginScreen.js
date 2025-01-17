import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../userConfig/FirebaseConfig';

const auth = getAuth(app);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Welcome', `Logged in as ${userCredential.user.email}`);
      navigation.navigate('Home Address');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', `Account created for ${userCredential.user.email}`);
      setIsSigningUp(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <LinearGradient
    colors={['#220b4e', '#81e9e6']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.background}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to Home Board</Text>
        <Image source={require('../assets/Logo_house1.png')} style={styles.backgroundLogo} />
        <Text style={styles.tagline}>Your Family's Digital Command Center</Text>
      </View>

      {/* Sign-In Form */}
      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>{isSigningUp ? 'Create an Account' : 'Sign in to your Account'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#ccc"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#ccc"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={isSigningUp ? handleSignUp : handleSignIn}
        >
          <Text style={styles.buttonText}>{isSigningUp ? 'Sign Up' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSigningUp(!isSigningUp)}>
          <Text style={styles.link}>
            {isSigningUp
              ? 'Already have an account? Sign In'
              : 'Don’t have an account? Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    flex: 1.5, // Take more space for header to fit the logo and tagline
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  backgroundLogo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 0.5, // Add spacing below the logo
    opacity: 0.2, // Faint visibility
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 0.5,
    opacity: 0.5, 
  },
  formContainer: {
    flex: 1, // Take less space for the form
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backgroundColor: '#bbd4ce',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#264e70',
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#5e9aa4',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
