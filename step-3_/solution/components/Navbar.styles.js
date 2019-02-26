import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    padding: 13,
    elevation: 10,
    flexDirection: 'row'
  },
  leftSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 10
  },
  username: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  rightSide: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  greeting: {
    fontSize: 20
  }
})