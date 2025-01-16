import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    TouchableOpacity,
    Switch,
    StyleSheet,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { formatDate, formatTime } from '../utils/helper'; // Utility functions
import DateTimePicker from '@react-native-community/datetimepicker';

const EditEventModal = ({ visible, onClose, onSave, event }) => {
    const [title, setTitle] = useState('');
    const [allDay, setAllDay] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [activePicker, setActivePicker] = useState(null); // Tracks active picker ("start" or "end")

    // Populate fields when the modal is opened
    useEffect(() => {
        if (event) {
            setTitle(event.EventName || '');
            setAllDay(event.allDay || false);
            setStartDate(new Date(event.StartDate || new Date()));
            setEndDate(new Date(event.EndDate || new Date()));
        }
    }, [event]);

    // const handleSave = () => {
    //     onSave({ title, allDay, startDate, endDate });
    //     resetForm();
    //     onClose();
    // };
    const handleSave = () => {
        const updatedEvent = {
            ...event, // Keep the original event data (including Id)
            EventName: title,
            StartDate: formatDate(startDate),
            EndDate: formatDate(endDate),
            StartTime: formatTime(startDate),
            EndTime: formatTime(endDate),
            allDay,
        };
        onSave(updatedEvent); // Pass the updated event to the parent
        resetForm();
        onClose();
    };


    const resetForm = () => {
        setTitle('');
        setAllDay(false);
        setStartDate(new Date());
        setEndDate(new Date());
        setActivePicker(null);
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    setActivePicker(null); // Close the picker on touch outside
                    Keyboard.dismiss(); // Dismiss the keyboard if open
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={onClose}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Update Event</Text>
                            <TouchableOpacity onPress={handleSave}>
                                <Text style={styles.addText}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Event Title */}
                        <TextInput
                            style={styles.input}
                            placeholder="Event Title"
                            value={title}
                            onChangeText={setTitle}
                        />

                        {/* All-Day Toggle */}
                        <View style={styles.row}>
                            <Text>All-day</Text>
                            <Switch value={allDay} onValueChange={setAllDay} />
                        </View>

                        {/* Start Time Picker */}
                        <TouchableOpacity
                            onPress={() => setActivePicker('start')}
                            style={styles.dateRow}
                        >
                            <Text>Starts</Text>
                            <Text style={styles.dateText}>
                                {startDate.toLocaleString()}
                            </Text>
                        </TouchableOpacity>

                        {/* End Time Picker */}
                        <TouchableOpacity
                            onPress={() => setActivePicker('end')}
                            style={styles.dateRow}
                        >
                            <Text>Ends</Text>
                            <Text style={styles.dateText}>
                                {endDate.toLocaleString()}
                            </Text>
                        </TouchableOpacity>

                        {/* Inline Picker for iOS */}
                        {Platform.OS === 'ios' && activePicker && (
                            <View style={styles.timePickerContainer}>
                                <DateTimePicker
                                    value={activePicker === 'start' ? startDate : endDate}
                                    mode="datetime"
                                    display="spinner" // Ensures wheel picker on iOS
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            if (activePicker === 'start') setStartDate(selectedDate);
                                            if (activePicker === 'end') setEndDate(selectedDate);
                                        }
                                    }}
                                />
                            </View>
                        )}
                    </View>

                    {/* Android Fullscreen Picker */}
                    {Platform.OS !== 'ios' && activePicker && (
                        <DateTimePicker
                            value={activePicker === 'start' ? startDate : endDate}
                            mode="datetime"
                            display="default" // Default dropdown picker for Android
                            onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                    if (activePicker === 'start') setStartDate(selectedDate);
                                    if (activePicker === 'end') setEndDate(selectedDate);
                                }
                                setActivePicker(null); // Auto-close for Android
                            }}
                        />
                    )}
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '60%', // Ensure space for iOS spinner
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cancelText: {
        fontSize: 18,
        color: 'red',
    },
    addText: {
        fontSize: 18,
        color: '#007AFF',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    dateText: {
        color: '#007AFF',
    },
    timePickerContainer: {
        backgroundColor: 'gray', // Black background for time picker
        borderRadius: 10,
        paddingVertical: 10,
    },
});

export default EditEventModal;
