import React from 'react'
import { connect } from 'react-redux'
import { View, Text, ProgressViewIOS, ProgressBarAndroid, Platform } from 'react-native'

import { thinker } from '../thinker-sdk.singleton'
import { AuthScreen } from './AuthScreen'
import { Navbar } from './Navbar'
import { FeedScreen } from './FeedScreen'
import { LoadingSpinner } from './LoadingSpinner'
import { Drawer } from './Drawer'
import { Frame } from './Frame'
import s from './Root.styles'

export const Root = connect(
  state => ({
    auth: state.auth
  })
)(
class extends React.PureComponent {

  render() {
    const { auth } = this.props

    return (
      <View style={s.appContainer}>
         <View style={s.topPadding}></View>
        {
          auth.state === 'LOADING' ? (
            <LoadingSpinner/>
          ) : auth.state === 'LOGGED-IN' ? (
            <Frame>
              <FeedScreen/>
            </Frame>
          ) : (
            <AuthScreen/>
          )
        }
      </View>
    )
  }
})