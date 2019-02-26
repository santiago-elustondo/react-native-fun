import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  authScreenContainer: {
    width: '70%', 
    marginTop: '10%', 
    flexDirection: 'column' 
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 10
  },
  logoImage: { 
    width: 150, 
    height: 150 
  },
  formTitle: {
    fontSize: 20,
  },
  formInput: {
    padding: 10,
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    borderBottomColor: 'blue',
    borderBottomWidth: 0.3,
  },
  buttonContainer: {
    marginTop: 10
  },
  formButton: {
    marginTop: 10,
    width: '100%'
  },
  errMsg: {
    color: 'red',
    height: 20
  }
})