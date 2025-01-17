// Import necessary modules
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const HomeAddressScreen = () => {
  const [street, setStreet] = useState('');
  const [suburb, setSuburb] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const navigation = useNavigation();

  const handleSaveAddress = async () => {
    if (!street.trim() || !suburb.trim() || !state.trim() || !postcode.trim()) {
      Alert.alert('Error', 'Please fill out all fields: Street, Suburb, State, and Postcode.');
      return false;
    }

    try {
      // Simulate saving address to a database or API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating network delay
      Alert.alert('Success', `Address saved successfully!\n\nStreet: ${street}\nSuburb: ${suburb}\nState: ${state}\nPostcode: ${postcode}`);
      return true;
    } catch (error) {
      Alert.alert('Error', 'Failed to save the address. Please try again.');
      return false;
    }
  };

  const handleNext = async () => {
    const isSaved = await handleSaveAddress();
    if (isSaved) {
      navigation.navigate('NextScreen'); // Replace 'NextScreen' with your target screen name
    }
  };

  return (
    <LinearGradient
      colors={["#220b4e", "#81e9e6"]}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Enter Your Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          value={street}
          onChangeText={setStreet}
        />
        <TextInput
          style={styles.input}
          placeholder="Street"
          placeholderTextColor="#aaa"
          value={street}
          onChangeText={setStreet}
        />
        <TextInput
          style={styles.input}
          placeholder="Suburb"
          placeholderTextColor="#aaa"
          value={suburb}
          onChangeText={setSuburb}
        />
        <TextInput
          style={styles.input}
          placeholder="State"
          placeholderTextColor="#aaa"
          value={state}
          onChangeText={setState}
        />
        <TextInput
          style={styles.input}
          placeholder="Postcode"
          placeholderTextColor="#aaa"
          value={postcode}
          onChangeText={setPostcode}
          keyboardType="numeric"
        />
        <Button title="Next" onPress={handleNext} color="#220b4e" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#220b4e',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
});

export default HomeAddressScreen;
