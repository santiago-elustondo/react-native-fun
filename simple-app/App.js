import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { thinker } from './thinker-sdk.singleton'
import { FeedScreen } from './components/FeedScreen'
import { AuthScreen } from './components/AuthScreen'
import { Navbar } from './components/Navbar'

export default class App extends React.Component {

  state = { authState: 'LOADING' }

  componentDidMount() {
    thinker.subscribeToAuthState(authState => this.setState({ authState }))
  }

  render() {
    const { authState } = this.state

    if (authState === 'LOADING') 
      return (
        <View>
          <Text>LOADING!</Text>
        </View>
      )

    return (
      <View style={styles.appContainer}>
        <View style={styles.topPadding}></View>
        {
          authState === 'LOGGED-OUT' ? (
            <AuthScreen/>
          ) : (
            <>
              <Navbar 
                loggedInUser={thinker.user()} 
                onLogout={() => thinker.logout()}
              />
              <FeedScreen/>
            </>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
  },
  topPadding: {
    height: 25,
    backgroundColor: 'white'
  }
})
