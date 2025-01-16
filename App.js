import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './components/HomeScreen';
import FridgeItemsScreen from './components/FridgeItemsScreen';
import AddItemScreen from './components/AddItemScreen';
import GroceryScreen from './components/GroceryScreen';
import ToDoListScreen from './components/ToDoListScreen';
import MealsScreen from './components/MealsScreen';
import Calendar from './components/CalendarScreen';
import Finances from './components/FinancesScreen';
import 'react-native-reanimated';
import LoginScreen from './components/LoginScreen';
import 'react-native-get-random-values';
import AddTransactionModal from './components/AddTransactionScreen';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Items in my Fridge" component={FridgeItemsScreen} />
        <Stack.Screen name="AddItemScreen" component={AddItemScreen} />
        <Stack.Screen name="Groceries" component={GroceryScreen} />
        <Stack.Screen name="To-Do List" component={ToDoListScreen} />
        <Stack.Screen name="Meals" component={MealsScreen} />
        <Stack.Screen name="Events" component={Calendar} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Finances" component={Finances} />
        <Stack.Screen name="AddTransaction" component={AddTransactionModal} options={{ title: 'Add Transaction' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}