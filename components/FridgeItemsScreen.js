import React, { useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal, Button, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import styles from '../styles/styles';
import moment from 'moment'; // Ensure you have moment.js installed
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { saveItem, fetchItems, updateItem } from '../services/ItemsExpiryAPI';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { getEmojiForItem } from '../utils/emojiUtils';  // Import utility function
import { showDeleteConfirmation } from '../components/DeleteConfirmation';
import { formatExpiryDate } from '../utils/helper';


const formatDateToLocal = (date) => {
    return moment(date).format('YYYY-MM-DD'); // Formats the date in the local timezone
};
// // // Sample Data
// const fridgeItems = [
//     { id: '1', name: 'Bananas', expiry: '5 days', category: 'My pantry', icon: '🍌' },
//     { id: '2', name: 'Bread', expiry: '6 days', category: 'My pantry', icon: '🍞' },
//     { id: '3', name: 'Potatoes', expiry: '6 days', category: 'My fridge', icon: '🥕' },
//     { id: '4', name: 'Cheese', expiry: '14 days', category: 'My fridge', icon: '🥛' },
//     { id: '5', name: 'Butter', expiry: '30 days', category: 'My fridge', icon: '🥛' },
// ];


export default function FridgeItemsScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [newItem, setNewItem] = useState('');
    const [expiryItems, setExpiryItems] = useState([]);
    const [date, setDate] = useState(new Date());
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const navigation = useNavigation();
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // const [fridgeItems, setExpiryItems] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsProcessing(true);
                setLoading(true);
                const data = await fetchItems();
                // Sort data by ascending expiry date
                const sortedData = data.sort((a, b) => new Date(a.ExpDate) - new Date(b.ExpDate));

                // Set the sorted data
                setExpiryItems(sortedData);
                setFilteredItems(data);
                setIsProcessing(false);
            } catch (err) {
                setLoading(false);
                setIsProcessing(false);
                console.error('Error fetching Fridge items:', err);
                setError('Failed to fetch Item list');
            } finally {
                setLoading(false);
                setIsProcessing(false);
            }
        };

        fetchData();
    }, []);

    // Sort items by expiry date
    const sortedItems = expiryItems.sort((a, b) => parseInt(a.expiry) - parseInt(b.expiry));
    const renderItem = ({ item }) => (
        <GestureHandlerRootView>
            <Swipeable
                renderRightActions={() => renderRightActions(item)}>
                <TouchableOpacity onPress={() => toggleStatus(item)}>
                    <View style={styles.itemContainer}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons
                                name={item.Status === 'U' ? "check-box" : "check-box-outline-blank"}
                                size={24}
                                color={item.Status === 'U' ? 'green' : 'gray'}
                            />
                        </View>
                        <View style={styles.itemDetails}>

                            <Text style={styles.itemName}>{getEmojiForItem(item.ItemName)}  {item.ItemName}</Text>
                            <Text style={styles.itemExpiry}>{formatExpiryDate(item.ExpDate)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </GestureHandlerRootView>
    );


    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredItems(expiryItems);
        } else {
            const filtered = expiryItems.filter(item =>
                item.ItemName.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredItems(filtered);
        }
    };

    const handleSave = async () => {
        if (!newItem.trim()) {
            alert('Please enter an item name');
            return;
        }

        const itemData = {
            Id: newItem.Id || Math.max(...expiryItems.map((item) => item.Id), 0) + 1,
            ItemName: newItem.ItemName || newItem,
            ExpDate: formatDateToLocal(date),
            Status: 'C',
        };

        setModalVisible(false); // Close modal
        setIsProcessing(true);  // Start processing

        try {
            let response;
            if (newItem.Id) {
                // If the item has an Id, update the existing item
                response = await updateItem(itemData);
            } else {
                // Otherwise, save it as a new item
                response = await saveItem(itemData);
            }

            if (response.ok) {
                const updatedData = await fetchItems();
                setExpiryItems(updatedData);
                setFilteredItems(updatedData);
            } else {
                console.error('Failed to save or update fridge item');
            }
        } catch (err) {
            console.error('Error during save or update:', err);
        } finally {
            setIsProcessing(false); // Stop processing
            setNewItem('');         // Reset input
        }
    };


    const toggleStatus = async (item) => {
        const updatedItem = {
            Id: item.Id,
            Status: item.Status === 'C' ? 'U' : 'C',
        };

        setIsProcessing(true);  // Start processing
        try {
            const response = await updateItem(updatedItem);
            if (response.ok) {
                const updatedData = await fetchgroceries();
                set(updatedData);
                setFilteredItems(updatedData);
            } else {
                console.error('Failed to update fridge item');
            }
        } catch (err) {
            console.error('Error updating fridge item:', err);
        } finally {
            setIsProcessing(false);  // Stop processing
        }
    };

    const handleDelete = async (item) => {
        const confirmed = await showDeleteConfirmation();
        if (confirmed) {
            setIsProcessing(true);  // Start processing
            try {
                const deleteItem = {
                    Id: item.Id,
                    Status: 'D',
                };
                console.log('Deleting item,', item.Id);
                const response = await updateItem(deleteItem);
                if (response.ok) {
                    const updatedData = await fetchItems();
                    setExpiryItems(updatedData);
                    setFilteredItems(updatedData);
                } else {
                    console.error('Failed to delete fridge item');
                }
            } catch (err) {
                console.error('Error deleting fridge item:', err);
            } finally {
                setIsProcessing(false);  // Stop processing
            }
        }
    };

    const renderRightActions = (item) => (
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}>
            <MaterialIcons name="delete" size={30} color="white" />
        </TouchableOpacity>
    );


    return (
        <LinearGradient
            colors={['#220b4e', '#81e9e6']} // Gradient colors
            style={{ flex: 1 }} // Full-screen gradient
        >
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Shopping list"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setModalVisible(true)}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
                {isProcessing && (
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                )}
                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.Id.toString()}
                    renderItem={renderItem}
                />

                {/* Add Button */}
                {/* <View style={styles.tabBar}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setModalVisible(true)}>
                    <MaterialIcons name="edit" size={24} color="white" />
                    <Text style={styles.actionText}>Add</Text>
                </TouchableOpacity>
            </View> */}

                {/* Add Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text>Item Name</Text>
                            <TextInput
                                placeholder="Enter fridge item"
                                value={newItem}
                                onChangeText={setNewItem}
                                style={styles.input}
                            />
                            {/* Date */}
                            <Text >Expiry Date</Text>
                            <TouchableOpacity style={styles.input} onPress={() => setDatePickerVisible(true)}>
                                <Text style={{ color: '#000' }}>{formatDateToLocal(date)}</Text>
                            </TouchableOpacity>
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
                            <View style={styles.buttonContainer}>
                                <Button title="Save" onPress={handleSave} />
                                <Button title="Cancel" onPress={() => setModalVisible(false)} />
                            </View>
                        </View>
                    </View>
                </Modal>

                {isProcessing && (
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                )}
            </View>
        </LinearGradient>
    );
}
