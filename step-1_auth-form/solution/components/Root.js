import React from 'react'
import { View } from 'react-native'

import { AuthScreen } from './AuthScreen'
import s from './Root.styles'

export class Root extends React.PureComponent {
  render() {
    return (
      <View style={s.appContainer}>
        <View style={s.topPadding}></View>
        <AuthScreen/>
      </View>
    )
  }
}