import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AuthScreen } from './components/AuthScreen'

export default class App extends React.Component {
  render() {
    return (
      <View style={s.appContainer}>
        <AuthScreen/>
      </View>
    )
  }
}

const s = StyleSheet.create({
  appContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    paddingBottom: 85
  },
  topPadding: {
    height: 25,
    backgroundColor: 'white'
  }
})