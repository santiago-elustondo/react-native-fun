import React from 'react'
import { View } from 'react-native'

import { thinker } from '../thinker-sdk.singleton'
import { AuthScreen } from './AuthScreen'
import { Navbar } from './Navbar'
import { FeedScreen } from './FeedScreen'
import { LoadingSpinner } from './LoadingSpinner'
import s from './Root.styles'

export class Root extends React.PureComponent {

  state = { auth: thinker.auth() }

  componentDidMount() {
    thinker.subscribeToAuth(auth => {
      this.setState({ auth })
    })    
  }

  render() {
    const { auth } = this.state

    return (
      <View style={s.appContainer}>
         <View style={s.topPadding}></View>
        {
          auth.state === 'LOADING' ? (
            <LoadingSpinner/>
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
}