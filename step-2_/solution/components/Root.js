import React from 'react'
import { connect } from 'react-redux'
import { View, Text, ProgressViewIOS, ProgressBarAndroid, Platform } from 'react-native'

import { thinker } from '../thinker-sdk.singleton'
import { AuthScreen } from './AuthScreen'
import { Navbar } from './Navbar'
import { FeedScreen } from './FeedScreen'
import s from './Root.styles'

export class Root extends React.PureComponent {
  render() {
    const { auth } = this.props
    return (
      <View style={s.appContainer}>
         <View style={s.topPadding}></View>
        {
          auth.state === 'LOADING' ? (
            Platform.OS === 'android' ? (
              <ProgressBarAndroid/>
            ) : (
              <ProgressViewIOS/>
            )
          ) : auth.state === 'LOGGED-IN' ? (
            <>
              <Navbar
                loggedInUser={auth.user}
                onLogout={() => thinker.logout()}
              />
              <FeedScreen/>
            </>
          ) : (
            <AuthScreen/>
          )
        }
      </View>
    )
  }
})