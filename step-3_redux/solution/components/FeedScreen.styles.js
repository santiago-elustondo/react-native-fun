import { StyleSheet } from 'react-native'
import { Dimensions } from 'react-native'

export default StyleSheet.create({
  container: {
    alignItems: 'center',  
    flexDirection: 'column'
  },
  feedContainer: {
    flex: 1
  },
  feedSpinner: {
    marginTop: 50
  },
  newThoughtContainer: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    padding: 10,
    // android
    elevation: 10,
    // ios
    shadowOffset:{  width: 10,  height: 10,  },
    shadowColor: 'gray',
    shadowOpacity: 0.5,
  },
  feedTitle: {
    marginTop: 10,
    fontSize: 25
  }, 
  newThoughtTitle: {
    fontSize: 20,
  },
  newThoughtInput: {
    padding: 10,
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  newThoughtButton: {

  },
  thoughtsContainer: {
    width: '90%',
    marginTop: 10
  }
})