import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Modal, Button } from 'react-native';
import { fetchgroceries, savegroceries, updategroceries } from '../services/GroceriesApi';
import styles from '../styles/styles';
import { MaterialIcons } from '@expo/vector-icons';
import { showDeleteConfirmation } from '../components/DeleteConfirmation';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { getEmojiForItem } from '../utils/emojiUtils';  // Import utility function
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function GroceryScreen() {
    const [todoItems, setTodoItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);  // Global processing state
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newItem, setNewItem] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsProcessing(true);
                setLoading(true);
                const data = await fetchgroceries();
                setTodoItems(data);
                setFilteredItems(data);
                setIsProcessing(false);
            } catch (err) {
                console.error('Error fetching to-do items:', err);
                setError('Failed to fetch to-do list');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
        const newId = todoItems.length > 0 ? Math.max(...todoItems.map(item => item.Id)) + 1 : 1;
        if (newItem.trim()) {
            const newTodo = {
                Id: newId,
                ItemName: newItem,
                ExpDate: 'No Expiry Date',
                Status: 'C',
            };

            setModalVisible(false);  // Close modal immediately
            setIsProcessing(true);  // Start processing
            try {
                const response = await savegroceries(newTodo);
                if (response.ok) {
                    const updatedData = await fetchgroceries();
                    setTodoItems(updatedData);
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
    //   // Normalize item names for emoji lookup
    //   const getEmojiForItem = (itemName) => {
    //     const normalizedItem = itemName.toLowerCase().replace(/\s+/g, '_');  // almond milk -> almond_milk
    //     return (
    //         emojiMapping[normalizedItem] ||
    //         emojiMapping[itemName.toLowerCase().split(' ')[1]] ||  // fallback to second word (milk)
    //         '🛒'  // default emoji
    //     );
    // };

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
