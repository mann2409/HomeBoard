import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { formatTransactions } from '../utils/transactionUtils';

const TransactionsSection = ({ transactions }) => {
  const [formattedTransactions, setFormattedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format transactions when the component mounts or when transactions prop changes
  useEffect(() => {
    const processTransactions = () => {
      if (transactions && transactions.length > 0) {
        const formattedData = formatTransactions(transactions);
        setFormattedTransactions(formattedData);
        console.log('Formatted Transactions:', formattedData);
      } else {
        console.log('No transactions provided.');
        setFormattedTransactions([]); // Clear if no transactions are provided
      }
      setLoading(false);
    };

    processTransactions();
  }, [transactions]); // Re-run whenever transactions prop changes

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  if (formattedTransactions.length === 0) {
    return (
      <View style={styles.noTransactionsContainer}>
        <Text style={styles.noTransactionsText}>No transactions to display.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {formattedTransactions.map((group, index) => (
          <View key={index} style={styles.dateGroup}>
            <Text style={styles.date}>{group.date}</Text>
            {Array.isArray(group.data) &&
              group.data.map((item, idx) => (
                <TouchableOpacity key={idx} style={styles.transactionItem}>
                  <View style={styles.detailsContainer}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionDescription}>{item.description}</Text>
                    {item.category && <Text style={styles.transactionCategory}>{item.category}</Text>}
                  </View>
                  <Text style={styles.transactionAmount}>{item.amount}</Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noTransactionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTransactionsText: {
    fontSize: 16,
    color: '#666',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  dateGroup: {
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 15,
    color: '#333',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailsContainer: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  transactionDescription: {
    fontSize: 12,
    color: 'black',
    marginTop: 3,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
});

export default TransactionsSection;
