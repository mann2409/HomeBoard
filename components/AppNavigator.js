import { createStackNavigator } from '@react-navigation/stack';
import FridgeItemsScreen from './FridgeItemsScreen';
import AddItemScreen from './AddItemScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FridgeItems" component={FridgeItemsScreen} />
      <Stack.Screen name="AddItemScreen" component={AddItemScreen} />
    </Stack.Navigator>
  );
}
