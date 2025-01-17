import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d3e6f5',
    paddingTop: 50,
    paddingHorizontal: 20,
    alignContent: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  widgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#004D4D', // Consistent with the gradient background
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 10,
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#4845d2',
  },
  tabBar: {
    flexDirection: 'row',
    marginLeft: -20,
    marginRight: -20,
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 15,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    elevation: 5,
  },

  // New styles for Fridge Items Screen
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    marginHorizontal: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
  },
  iconContainer: {
    marginRight: 15,
  },
  itemIcon: {
    fontSize: 40,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemExpiry: {
    color: '#888',
    marginTop: 5,
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#00aaff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  actionText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'begin',
    marginBottom: 5,
  },
  condition: {
    fontSize: 18,
    color: '#666',
    textAlign: 'begin',
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  widgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherContainer: {
    alignItems: 'end',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    width: 50,
    height: 50,
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 12,
    // backgroundColor: '#fff',
    backgroundColor: '#ffffff',
    // backgroundColor: '#bbd4ce',
    width: 120,
    height: 70,
  },
  day: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  temp: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  condition: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginTop: 10,
  },
  cancelButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  cancelText: {
    fontSize: 18,
    color: 'red',
  },
  saveButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#00aaff',
    padding: 15,
    borderRadius: 25,
  },
  saveText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    padding: 10,
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 20,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  CalendarContainer: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  fab: {
    backgroundColor: 'red',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    width: 20,
    height: 4,
    backgroundColor: 'white',
    borderRadius: 2,
  },// Unique background colors for each section
  expiringSoon: {
    backgroundColor: '#ffe6e6',  // Light red - urgency (Expiring Soon)
  },
  grocerySection: {
    backgroundColor: '#e6f7ff',  // Light blue - calm (Grocery List)
  },
  mealPlannerSection: {
    backgroundColor: '#e6ffe6',  // Light green - fresh (Meal Planner)
  },
  eventsSection: {
    backgroundColor: '#fff4e6',  // Light orange - neutral (Upcoming Events)
  },
  todoSection: {
    backgroundColor: '#f3e6ff',  // Light purple - focus (To-Do List)
    marginBottom: 30,
    // backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionBase: {
    marginBottom: 30,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between', // Adjust layout
    paddingHorizontal: 20, // Add padding for content
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: -20,
    marginBottom: 1,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  addButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#264e70',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }, rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10, // Optional for some spacing
  },
  searchInput: {
    flex: 1, // Takes the remaining space
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10, // Space between input and button
    backgroundColor: '#fff', // To make it stand out
  },
  addButton: {
    height: 40,
    width: 40,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#264e70',
    padding: 10,
    borderRadius: 50,
},


});

export default styles;