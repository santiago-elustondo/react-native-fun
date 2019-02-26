import { StyleSheet, Dimensions } from 'react-native'

export default StyleSheet.create({
  belowNavbar: {
    width: Dimensions.get('window').width,
    height: '100%'
  },
  activeScreen: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    height: '100%'
  }
})