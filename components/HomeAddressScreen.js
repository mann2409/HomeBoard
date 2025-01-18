// Import necessary modules
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getSuburbList, getStreetList, getPropertiesList, getCollectionSchedule } from '../services/BccAPI';

const HomeAddressScreen = () => {
    const [street, setStreet] = useState('');
    const [suburb, setSuburb] = useState('');
    const [state, setState] = useState('');
    const [fullname, setFullname] = useState('');
    const [loading, setLoading] = useState(false); // Track loading state
    const navigation = useNavigation();

    // Utility functions for string normalization
    const normalizeString = (str) => {
        return str
            .replace(/\b(street|st)\b/gi, 'st') // Normalize "street" to "st"
            .replace(/\s+/g, ' ')               // Replace multiple spaces with a single space
            .trim()                             // Remove leading/trailing spaces
            .toLowerCase();                     // Convert to lowercase
    };

    const extractStreetName = (str) => {
        // Remove house number and optional letter suffix (e.g., 161a, 45B)
        return str.replace(/^\d+[a-zA-Z]?\s*/, '');
    };

    const handleSaveAddress = async () => {
        try {
            setLoading(true); // Show busy indicator

            // Step 1: Get suburb list
            const responseData = await getSuburbList();
            const suburbs = responseData.localities;

            if (!suburbs || !Array.isArray(suburbs)) {
                Alert.alert("Error", "Failed to fetch suburb data. Please try again.");
                setLoading(false);
                return false;
            }

            // Find the locality ID by matching the suburb name
            const locality = suburbs.find(loc => loc.name.toLowerCase() === suburb.trim().toLowerCase());
            if (!locality) {
                Alert.alert("Error", `Suburb '${suburb}' not found.`);
                setLoading(false);
                return false;
            }

            // Step 2: Get street list
            const streetsSearch = await getStreetList(locality.id);
            const streets = streetsSearch.streets;

            if (!streets || !Array.isArray(streets)) {
                Alert.alert("Error", "Failed to fetch street data.");
                setLoading(false);
                return false;
            }

            // Normalize input and match
            const normalizedUserStreet = normalizeString(extractStreetName(street)); // Street name without house number
            console.log('Normalized User Street:', normalizedUserStreet);

            const streetData = streets.find(s => {
                const normalizedApiStreet = normalizeString(s.name);
                return normalizedApiStreet.includes(normalizedUserStreet);
            });

            if (!streetData) {
                Alert.alert("Error", `Street '${street}' not found.`);
                setLoading(false);
                return false;
            }

            // Step 3: Get property list
            const propertiesResponse = await getPropertiesList(streetData.id);
            const properties = propertiesResponse.properties;

            if (!properties || !Array.isArray(properties)) {
                Alert.alert("Error", "Failed to fetch property data.");
                setLoading(false);
                return false;
            }

            const propertyData = properties.find(s => {
                const normalizedApiStreet = normalizeString(s.name);
                return normalizedApiStreet.includes(normalizedUserStreet);
            });

            if (!propertyData) {
                Alert.alert("Error", "Property not found.");
                setLoading(false);
                return false;
            }

            // Step 4: Get collection schedule
            const schedule = await getCollectionSchedule(propertyData.id);

            // Navigate to the next screen
            navigation.navigate("Home", {
                street,
                suburb,
                state,
                schedule,
            });

            setLoading(false); // Hide busy indicator
            return true;
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
            setLoading(false); // Hide busy indicator
            return false;
        }
    };

    const handleNext = async () => {
        await handleSaveAddress();
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
                    value={fullname}
                    onChangeText={setFullname}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Street address"
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
                {loading ? (
                    <ActivityIndicator size="large" color="#220b4e" />
                ) : (
                    <Button title="Next" onPress={handleNext} color="#220b4e" />
                )}
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
