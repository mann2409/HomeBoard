import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

const BinSchedule = ({ schedule }) => {
    const currentDate = moment(); // Current local date

    // Find the next event
    const nextEvent = schedule
        .map(event => ({
            ...event,
            daysUntil: moment(event.start || event.start_date).diff(currentDate, 'days'),
        }))
        .filter(event => event.daysUntil >= 0) // Only future or today events
        .sort((a, b) => a.daysUntil - b.daysUntil)[0]; // Get the closest event

    if (!nextEvent) {
        return (
            <View style={styles.container}>
                {/* <Text style={styles.title}>Bin Truck Schedule</Text> */}
                <Text style={styles.message}>No upcoming schedule available.</Text>
            </View>
        );
    }

    const { event_type, color, borderColor, daysUntil, start } = nextEvent;
    // Choose singular or plural for the "day" text
    const dayText = daysUntil < 2 ? 'day' : 'days';

    return (
        <View style={[styles.container, { borderColor, borderWidth: 2 }]}>
            {/* <Text style={styles.title}>Bin Truck Schedule</Text> */}
            <View
                style={[styles.eventBox, { backgroundColor: color }]}
            >
                <Text style={styles.eventText}>
                    {event_type.charAt(0).toUpperCase() + event_type.slice(1)} Bin in {daysUntil} {dayText}
                </Text>
            </View>
            <Text style={styles.eventDetails}>
                Date: {moment(start).format('dddd, MMMM D, YYYY')}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#220b4e',
    },
    message: {
        fontSize: 16,
        color: '#888',
    },
    eventBox: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    eventText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    eventDetails: {
        fontSize: 14,
        color: '#333',
    },
});

export default BinSchedule;
