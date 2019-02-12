import React from 'react'
import { Animated, Easing, View, Text, StyleSheet, Button, Dimensions } from 'react-native'
import { connect } from 'react-redux'

import { fa } from '../functional-redux'
import { thinker } from '../thinker-sdk.singleton'
import { FeedScreen } from './FeedScreen'
import { AuthScreen } from './AuthScreen'
import { ThoughtScreen } from './ThoughtScreen'
import { Navbar } from './Navbar'

export const Root = connect(
  ({ navigation }) => ({ navigation }) 
)(class App extends React.Component {

  state = { 
    authState: 'LOADING',
    nav: {
      lastAction: null,
      stack: []
    }
  }
  a = new Animated.Value(0)
  b = new Animated.Value(Dimensions.get('window').width)

  pushNav(frame) {
    this.props.dispatch(fa(
      state => ({
        navigation: {
          stack: state.navigation.stack.concat([ frame ])
        }
      })
    ))
  }

  _pushNav(frame) {
    const { nav: { stack } } = this.state
    this.setState({
      nav: {
        lastAction: 'push',
        stack: stack.concat([ frame ])
      }
    })
    Animated.timing(                  
      this.a,            
      {
        toValue: -(Dimensions.get('window').width * (stack.length + 1)),                  
        duration: 300,              
        easing: Easing.ease
      }
    ).start();   
  }

  popNav() {
    const { nav: { stack } } = this.state
    this.setState({
      nav: {
        transition: 'back',
        stack
      }
    })
    Animated.timing(                  
      this.a,            
      {
        toValue: -(Dimensions.get('window').width * (stack.length - 1)),                  
        duration: 300,              
        easing: Easing.ease
      }
    ).start();  
    setTimeout(() => {
      this.setState({
        nav: {
          transition: null,
          stack: (stack || []).slice(0, stack.length - 1)
        }
      })
    }, 300)
  }

  constructor() {
    super()
    debugger
    this.go = () => {
      this.setState({ s: true })
      Animated.timing(                  
        this.a,            
        {
          toValue: -(Dimensions.get('window').width),                  
          duration: 300,              
          easing: Easing.ease
        }
      ).start();   
      Animated.timing(                  
        this.b,            
        {
          toValue: 0,                  
          duration: 300,              
          easing: Easing.ease
        }
      ).start();   
    }
    this.back = () => {
      this.setState({ s: false })
      Animated.timing(                  
        this.a,            
        {
          toValue: 0,                  
          duration: 300,              
          easing: Easing.ease
        }
      ).start();   
      Animated.timing(                  
        this.b,            
        {
          toValue: Dimensions.get('window').width,                  
          duration: 300,              
          easing: Easing.ease
        }
      ).start();
    }
  }

  componentDidMount() {
    thinker.subscribeToAuthState(authState => this.setState({ authState }))
    // Animated.timing(                  
    //   this.a,            
    //   {
    //     toValue: Dimensions.get('window').width,                  
    //     duration: 300,              
    //     easing: Easing.ease
    //   }
    // ).start();   
  }

  render() {
    console.log(this.props)
    const { authState, s, nav } = this.state

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
              <View style={{flexDirection:'row'}}>
                <Button
                  title='go to thought'
                  onPress={() => {
                    this.pushNav({ screen: 'thought' })
                    // s ? this.back() : this.go()
                  }}
                />
                <Button
                  title='go back'
                  onPress={() => {
                    this.popNav()
                    // s ? this.back() : this.go()
                  }}
                />
              </View>
              <Navbar 
                loggedInUser={thinker.user()} 
                onLogout={() => thinker.logout()}
              />
            
              <View style={{
                width: Dimensions.get('window').width
              }}>
                <Animated.View style={{
                  width: Dimensions.get('window').width * (nav.stack.length + 1),
                  flexDirection: 'row',
                  left: this.a
                }}>
                  <View style={{ width: Dimensions.get('window').width }}>
                    <FeedScreen/>
                  </View>
                  {
                    nav.stack.map((_, i) => (
                      <View key={i} style={{ width: Dimensions.get('window').width }}>
                        <ThoughtScreen/>
                      </View>
                    ))
                  }
                </Animated.View>
              </View>
        
            </>
          )
        }
      </View>
    )
  }
})

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
