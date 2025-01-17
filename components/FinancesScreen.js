import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import TransactionsSection from '../components/TransactionsSection';
import { calculateTotalAmount } from '../utils/transactionUtils';
import { getTransactions } from '../services/FinancesAPI';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

const FinanceScreen = ({ navigation, route }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [totalSpending, setTotalSpending] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const currentMonthYear = moment().format("MMM'YY");

    const fetchTransactions = async () => {
        try {
            setIsProcessing(true);
            setRefreshing(true);
            const apiResponse = await getTransactions();
            setTransactions(apiResponse);
            const spending = calculateTotalAmount(apiResponse);
            setTotalSpending(spending);

            const data = generateMonthlyTotals(apiResponse);
            setMonthlyData(data);

            setIsProcessing(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setIsProcessing(false);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (route.params?.refresh) {
                fetchTransactions();
                navigation.setParams({ refresh: false });
            }
        });
        return unsubscribe;
    }, [navigation, route.params?.refresh]);

    const generatePastSixMonths = () => {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            months.push(moment().subtract(i, 'months').format('MMM'));
        }
        return months;
    };

    const generateMonthlyTotals = (transactions) => {
        if (!transactions || transactions.length === 0) return Array(6).fill(0);
        const pastSixMonths = generatePastSixMonths();
        const monthlyTotals = pastSixMonths.reduce((acc, month) => {
            acc[month] = 0;
            return acc;
        }, {});

        transactions.forEach((transaction) => {
            const transactionMonth = moment(transaction.date, 'YYYY-MM-DD').format('MMM');
            const transactionAmount = parseFloat(transaction.amount.replace(/[^0-9.]/g, ''));
            if (!isNaN(transactionAmount) && monthlyTotals[transactionMonth] !== undefined) {
                monthlyTotals[transactionMonth] += transactionAmount;
            }
        });

        return pastSixMonths.map((month) =>
            parseFloat(Math.round(monthlyTotals[month]))
        );
    };

    return (
        <LinearGradient
            colors={['#220b4e', '#81e9e6']} // Gradient colors
            style={{ flex: 1 }} // Full-screen gradient
        >
            <View style={styles.container}>
                {isProcessing && (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#4845d2" />
                    </View>
                )}
                <View>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Finance Overview</Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() =>
                                navigation.navigate('AddTransaction', {
                                    onGoBack: () => navigation.setParams({ refresh: true }),
                                })
                            }
                        >
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardsContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>{`${currentMonthYear} Spending`}</Text>
                            <Text style={styles.cardValueSpending}>-${totalSpending}</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>{`${currentMonthYear} Income`}</Text>
                            <Text style={styles.cardValue}>$3,400</Text>
                        </View>
                    </View>

                    <View style={styles.graphContainer}>
                        <Text style={styles.graphTitle}>Spending Trend</Text>
                        {/* <BarChart
                        data={{
                            labels: generatePastSixMonths(),
                            datasets: [{ data: monthlyData }],
                        }}
                        width={Dimensions.get('window').width - 40}
                        height={210}
                        yAxisLabel="$"
                        chartConfig={{
                            backgroundColor: '#fff',
                            backgroundGradientFrom: '#81e9e6',
                            backgroundGradientTo: '#220b4e',
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        }}
                        showValuesOnTopOfBars
                    /> */}
                        <BarChart
                            data={{
                                labels: generatePastSixMonths(), // Labels for the months
                                datasets: [{ data: generateMonthlyTotals(transactions) }], // Data for each bar
                            }}
                            width={Dimensions.get('window').width - 40} // Width of the chart
                            height={220} // Height of the chart
                            yAxisLabel="$"
                            chartConfig={{
                                backgroundColor: '#fff',
                                backgroundGradientFrom: '#81e9e6',
                                backgroundGradientTo: '#220b4e',
                                decimalPlaces: 0, // No decimal points
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            }}
                            showValuesOnTopOfBars
                            fromZero // Start Y-axis at zero
                            onDataPointClick={({ index, value }) => {
                                const selectedMonth = generatePastSixMonths()[index]; // Get the month based on index
                                console.log(`Clicked on month: ${selectedMonth}, Value: ${value}`);
                                navigation.navigate('DetailsScreen', { month: selectedMonth, value }); // Navigate to another screen
                            }}
                        />

                    </View>
                </View>

                <ScrollView
                    style={styles.transactionsContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={fetchTransactions}
                            colors={['#6200ee']}
                            tintColor="#6200ee"
                        />
                    }
                >
                    <TransactionsSection transactions={transactions} />
                </ScrollView>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#264e70',
        padding: 10,
        borderRadius: 50,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 5,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    cardValueSpending: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'red',
    },
    cardValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
    },
    graphContainer: {
        marginBottom: 20,
    },
    graphTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    transactionsContainer: {
        flex: 1,
    },
});

export default FinanceScreen;
