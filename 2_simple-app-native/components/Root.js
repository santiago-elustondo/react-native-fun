import React from 'react'
import { Animated, Easing, View, Text, StyleSheet, Button, Dimensions } from 'react-native'
import { connect } from 'react-redux'

import { fa } from '../functional-redux'
import { thinker } from '../thinker-sdk.singleton'
import { FeedScreen } from './FeedScreen'
import { AuthScreen } from './AuthScreen'
import { ThoughtScreen } from './ThoughtScreen'
import { Navbar } from './Navbar'

const screenWidth = Dimensions.get('window').width

export const Root = connect(
  state => ({ navStack: state.navigation.stack }) 
)(class App extends React.PureComponent {

  static getDerivedStateFromProps(props, state) {

    if (props.navStack.length > state.currentNavStack.length)
      return {
        awaitingForwardTransition: true,
        currentNavStack: props.navStack
      }

    if (props.navStack.length < state.currentNavStack.length)
      return {
        awaitingBackwardTransition: true,
        previousNavStack: state.currentNavStack,
        currentNavStack: props.navStack
      }

    return null
  }

  state = { 
    authState: 'LOADING',
    currentNavStack: [],
    previousNavStack: [],
    sliderPosition: new Animated.Value(0)
  }

  pushNav(frame) {
    this.props.dispatch(fa(
      state => ({
        navigation: {
          stack: state.navigation.stack.concat([ frame ])
        }
      })
    ))
  }

  popNav() {
    this.props.dispatch(fa(
      state => {
        const { navigation: { stack } } = state
        return {
          navigation: {
            stack: stack.length ? stack.slice(0, stack.length - 1) : stack
          }
        }
      }
    ))
  }

  componentDidMount() {
    thinker.subscribeToAuthState(authState => this.setState({ authState }))
  }

  repositionSlider() {
    const { sliderPosition, currentNavStack } = this.state
    return new Promise((resolve) => Animated.timing(                  
      sliderPosition,            
      {
        toValue: -(screenWidth * currentNavStack.length),                  
        duration: 200,              
        easing: Easing.ease
      }
    ).start(resolve))
  }

  componentDidUpdate() {
    const { 
      awaitingForwardTransition, 
      awaitingBackwardTransition
    } = this.state

    if (awaitingForwardTransition) {
      this.setState({
        awaitingForwardTransition: false
      }, () => this.repositionSlider()) 
    }

    if (awaitingBackwardTransition) {
      this.setState({
        awaitingBackwardTransition: false,
        currentlyDoingBackwardTransition: true
      }, async () => {
        await this.repositionSlider()
        this.setState({
          currentlyDoingBackwardTransition: false
        })
      }) 
    }
  
  }

  render() {
    const { 
      authState, currentNavStack, previousNavStack, 
      sliderPosition, currentlyDoingBackwardTransition 
    } = this.state

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
                showBackButton={currentNavStack.length}
                onBackButtonPress={() => this.popNav()}
              />
              <View style={{
                width: screenWidth
              }}>
                <Animated.View style={{
                  width: screenWidth * (currentNavStack.length + 1),
                  flexDirection: 'row',
                  left: sliderPosition
                }}>
                  <View style={{ width: screenWidth }}>
                    <FeedScreen pushFrame={frame => setTimeout(() => this.pushNav(frame), 20)}/>
                  </View>
                  {
                    (currentlyDoingBackwardTransition ? previousNavStack : currentNavStack)
                      .map((frame, i) => (
                        <View key={i} style={{ width: screenWidth }}>
                          <ThoughtScreen {...frame.props} pushFrame={frame => this.pushNav(frame)}/>
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
    paddingBottom: 80
  },
  topPadding: {
    height: 25,
    backgroundColor: 'white'
  }
})
