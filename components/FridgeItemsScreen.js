import React, { useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Modal, Button , ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import styles from '../styles/styles';
import moment from 'moment'; // Ensure you have moment.js installed
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { saveItem, fetchItems, updateItem } from '../services/ItemsExpiryAPI';

const formatDateToLocal = (date) => {
    return moment(date).format('YYYY-MM-DD'); // Formats the date in the local timezone
};
// // Sample Data
const fridgeItems = [
    { id: '1', name: 'Bananas', expiry: '5 days', category: 'My pantry', icon: '🍌' },
    { id: '2', name: 'Bread', expiry: '6 days', category: 'My pantry', icon: '🍞' },
    { id: '3', name: 'Potatoes', expiry: '6 days', category: 'My fridge', icon: '🥕' },
    { id: '4', name: 'Cheese', expiry: '14 days', category: 'My fridge', icon: '🥛' },
    { id: '5', name: 'Butter', expiry: '30 days', category: 'My fridge', icon: '🥛' },
];

// Sort items by expiry date
const sortedItems = fridgeItems.sort((a, b) => parseInt(a.expiry) - parseInt(b.expiry));

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


    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsProcessing(true);
                setLoading(true);
                const data = await fetchItems();
                setExpiryItems(data);
                setFilteredItems(data);
                setIsProcessing(false);
            } catch (err) {
                setLoading(false);
                console.error('Error fetching Fridge items:', err);
                setError('Failed to fetch Item list');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                            {/* <Text style={styles.itemExpiry}>{item.ExpDate}</Text> */}
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </GestureHandlerRootView>
    );


    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredItems(todoItems);
        } else {
            const filtered = todoItems.filter(item =>
                item.ItemName.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredItems(filtered);
        }
    };

    const handleSave = async () => {
        const newId = newItem.length > 0 ? Math.max(...newItem.map(item => item.Id)) + 1 : 1;
        if (newItem.trim()) {
            const newItem = {
                Id: newId,
                ItemName: newItem,
                ExpDate: 'No Expiry Date',
                Status: 'C',
            };

            setModalVisible(false);  // Close modal immediately
            setIsProcessing(true);  // Start processing
            try {
                const response = await saveItem(newItem);
                if (response.ok) {
                    const updatedData = await fetchItems();
                    setnewItem(updatedData);
                    setFilteredItems(updatedData);
                } else {
                    console.error('Failed to save to-do item');
                }
            } catch (err) {
                console.error('Error during save or fetch:', err);
            } finally {
                setIsProcessing(false);  // Stop processing
                setNewItem('');  // Reset input
            }
        }
    };

    const toggleStatus = async (item) => {
        const updatedItem = {
            Id: item.Id,
            Status: item.Status === 'C' ? 'U' : 'C',
        };

        setIsProcessing(true);  // Start processing
        try {
            const response = await updategroceries(updatedItem);
            if (response.ok) {
                const updatedData = await fetchgroceries();
                setTodoItems(updatedData);
                setFilteredItems(updatedData);
            } else {
                console.error('Failed to update to-do item');
            }
        } catch (err) {
            console.error('Error updating to-do item:', err);
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
                const response = await updategroceries(deleteItem);
                if (response.ok) {
                    const updatedData = await fetchgroceries();
                    setTodoItems(updatedData);
                    setFilteredItems(updatedData);
                } else {
                    console.error('Failed to delete to-do item');
                }
            } catch (err) {
                console.error('Error deleting to-do item:', err);
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
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search Shopping list"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.Id.toString()}
                renderItem={renderItem}
            />

            {/* Add Button */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setModalVisible(true)}>
                    <MaterialIcons name="edit" size={24} color="white" />
                    <Text style={styles.actionText}>Add</Text>
                </TouchableOpacity>
            </View>

            {/* Add Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            placeholder="Enter to-do item"
                            value={newItem}
                            onChangeText={setNewItem}
                            style={styles.input}
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
    );
}
