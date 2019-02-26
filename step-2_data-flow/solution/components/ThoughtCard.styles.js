import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  card: {
    margin: 5,
    padding: 5,
    backgroundColor: 'white',
    // android
    elevation: 5,
    // ios
    shadowOffset: { 
      width: 10, 
      height: 10,  
    },
    shadowColor: 'gray',
    shadowOpacity: 0.5,
  },
  heading: {
    flexDirection: 'row'
  },
  usernameContainer: {
    flex: 1,
    alignItems: 'flex-start'
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18
  },
  creationDateContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  creationDate: {
    fontSize: 18
  },
  content: {
    padding: 5,
    fontSize: 24,
  }
})