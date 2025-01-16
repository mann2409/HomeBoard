import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { transactionTypes } from '../utils/transactionType';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { saveTransaction } from '../services/FinancesAPI'; // Import API function
import { ActivityIndicator } from 'react-native'; // Import ActivityIndicator
import moment from 'moment'; // Ensure you have moment.js installed

const AddTransactionScreen = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isPickerVisible, setPickerVisible] = useState(true); // Manage picker visibility
    const [isLoading, setIsLoading] = useState(false); // For showing a loading indicator
    const [isProcessing, setIsProcessing] = useState(false);


    // const [date, setDate] = useState(new Date());
    // const [datePickerVisible, setDatePickerVisible] = useState(false);

    const formatDateToLocal = (date) => {
        return moment(date).format('YYYY-MM-DD'); // Formats the date in the local timezone
    };

    const handleSave = async () => {
        if (!title || !category || !amount) {
            Alert.alert('Validation Error', 'Please fill all mandatory fields.');
            return;
        }

        const newTransaction = {
            date: formatDateToLocal(date), // Format date as YYYY-MM-DD
            timestamp: new Date().toISOString(), // Add timestamp
            title,
            description,
            category,
            amount,
            Status: 'C'
        };
        setIsProcessing(true);
        try {
            const response = await saveTransaction(newTransaction);
            if (response.ok) {
                //Navigate to Finance screen
                navigation.setParams({ refresh: true }); // Pass the refresh parameter
                navigation.goBack(); // Go back to the Finances screen
            } else {
                setIsProcessing(false); // Hide loading indicator
                Alert.alert('Error', 'Failed to save transaction. Please try again.');
            }
        } catch (error) {
            console.error('Error saving transaction:', error);
            setIsProcessing(false); // Hide loading indicator
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false); // Hide loading indicator

        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView>
                <Text style={styles.title}>Add Transaction</Text>
                {/* Date */}
                <Text>Date</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setDatePickerVisible(true)}
                >
                    <Text style={{ color: '#000' }}>{formatDateToLocal(date)}</Text>
                </TouchableOpacity>
                {/* Busy Indicator */}
                {isProcessing && (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#4845d2" />
                    </View>
                )}
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={(selectedDate) => {
                        setDate(selectedDate);
                        setDatePickerVisible(false);
                    }}
                    onCancel={() => setDatePickerVisible(false)}
                    themeVariant="light"
                />
                {/* Title  */}
                <Text>Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                />
                {/* Description */}
                <Text>Description</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Description (Optional)"
                    value={description}
                    onChangeText={setDescription}
                />

                {/* Category */}
                <Text>Category</Text>
                {isPickerVisible && (
                    <Picker
                        selectedValue={category}
                        onValueChange={(itemValue) => {
                            setCategory(itemValue);
                            setPickerVisible(false); // Hide the picker after selection
                        }}
                        style={styles.input}
                    >
                        <Picker.Item label="Select Category" value="" />
                        {transactionTypes
                            .slice() // Create a copy of the array to avoid mutating the original
                            .sort((a, b) => a.label.localeCompare(b.label)) // Sort by label in ascending order
                            .map((type) => (
                                <Picker.Item key={type.id} label={type.label} value={type.value} />
                            ))}
                    </Picker>
                )}
                {!isPickerVisible && (
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setPickerVisible(true)}
                    >
                        <Text>{category || 'Select Category'}</Text>
                    </TouchableOpacity>
                )}

                {/* Amount */}
                <Text>Amount</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 4,
    },
    buttons: { flexDirection: 'row', justifyContent: 'space-between' },
    cancelButton: { padding: 10, backgroundColor: '#ccc', borderRadius: 5 },
    saveButton: { padding: 10, backgroundColor: '#6200ee', borderRadius: 5 },
    buttonText: { color: 'white', fontWeight: 'bold' },
});

export default AddTransactionScreen;
