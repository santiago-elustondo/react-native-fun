import React from 'react'
import { Animated, Easing, View, Text, StyleSheet, TouchableHighlight, Button, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'

import { fa } from '../functional-redux'
import { thinker } from '../thinker-sdk.singleton'
import { FeedScreen } from './FeedScreen'
import { AuthScreen } from './AuthScreen'
import { ThoughtScreen } from './ThoughtScreen'
import { SettingsScreen } from './SettingsScreen'
import { ProfileScreen } from './ProfileScreen'
import { Navbar } from './Navbar'

const screenWidth = Dimensions.get('window').width

// actions
const openDrawer = () => fa(state => {
  return { navigation: { ...state.navigation, drawer: true } }
})

const closeDrawer = () => fa(state => {
  return { navigation: { ...state.navigation, drawer: false } }
})

export const Root = connect(
  state => ({ 
    navStack: state.navigation.stack,
    drawer: state.navigation.drawer 
  }) 
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

    if (props.drawer && !state.prevDrawer)
      return {
        awaitingDrawerOpenTransition: true,
        prevDrawer: true
      }

    if (!props.drawer && state.prevDrawer)
      return {
        awaitingDrawerCloseTransition: true,
        prevDrawer: false
      }

    return null
  }

  state = { 
    authState: 'LOADING',
    currentNavStack: [],
    previousNavStack: [],
    sliderPosition: new Animated.Value(0)
  }

  drawerWidth = new Animated.Value(0)
  drawerOverlayOpacity = new Animated.Value(0)

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

  resetNav() {
    this.props.dispatch(fa(
      state => ({
        navigation: { stack: [] }
      })
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

  openDrawer() {
    return Promise.all([
      new Promise((resolve) => Animated.timing(                  
        this.drawerWidth,            
        {
          toValue: 250,                  
          duration: 200,              
          easing: Easing.ease
        }
      ).start(resolve)),
      new Promise((resolve) => Animated.timing(                  
        this.drawerOverlayOpacity,            
        {
          toValue: 0.8,                  
          duration: 200,              
          easing: Easing.ease
        }
      ).start(resolve))
    ])
  }

  closeDrawerAnimation() {
    return Promise.all([
      new Promise((resolve) => Animated.timing(                  
        this.drawerWidth,            
        {
          toValue: 0,                  
          duration: 200,              
          easing: Easing.ease
        }
      ).start(resolve)),
      new Promise((resolve) => Animated.timing(                  
        this.drawerOverlayOpacity,            
        {
          toValue: 0,                  
          duration: 200,              
          easing: Easing.ease
        }
      ).start(resolve))
    ])
  }

  componentDidUpdate() {
    const { 
      awaitingForwardTransition, 
      awaitingBackwardTransition,
      awaitingDrawerOpenTransition,
      awaitingDrawerCloseTransition
    } = this.state

    if (awaitingForwardTransition)
      this.setState({
        awaitingForwardTransition: false
      }, () => this.repositionSlider()) 

    if (awaitingBackwardTransition)
      this.setState({
        awaitingBackwardTransition: false,
        currentlyDoingBackwardTransition: true
      }, async () => {
        await this.repositionSlider()
        this.setState({
          currentlyDoingBackwardTransition: false
        })
      }) 

    if (awaitingDrawerOpenTransition)
      this.setState({
        awaitingDrawerOpenTransition: false
      }, () => this.openDrawer())

    if (awaitingDrawerCloseTransition)
      this.setState({
        awaitingDrawerCloseTransition: false,
        drawerCloseAnimationInProgress: true
      }, async () => {
        await this.closeDrawerAnimation()
        this.setState({
          drawerCloseAnimationInProgress: false
        })
      })
  
  }

  render() {
    const { 
      authState, currentNavStack, previousNavStack, 
      sliderPosition, currentlyDoingBackwardTransition,
      drawerCloseAnimationInProgress
    } = this.state
    const { drawer, dispatch } = this.props

    if (authState === 'LOADING') 
      return (
        <View>
          <Text>LOADING!</Text>
        </View>
      )

    console.log(currentNavStack)

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
                onHomeButtonPress={() => this.resetNav()}
                showBackButton={currentNavStack.length}
                onBackButtonPress={() => this.popNav()}
                onOpenDrawer={() => dispatch(openDrawer())}
              />
              <View style={{
                width: screenWidth,
                height: '100%'
              }}>
                {
                  (drawer || drawerCloseAnimationInProgress) ? (
                    <>
                      <TouchableHighlight 
                        onPress={() => dispatch(closeDrawer())}
                        style={{ 
                          position: 'absolute',
                          height: '100%',
                          top: 0,
                          right: 0,
                          bottom: 0,
                          left: 0, 
                          elevation: 10,
                          zIndex:999
                        }}
                      >
                        <Animated.View style={{ 
                          position: 'absolute',
                          height: '100%',
                          width: '100%',
                          top: 0,
                          right: 0,
                          bottom: 0,
                          left: 0, 
                          backgroundColor: 'gray', 
                          elevation: 10,
                          opacity: this.drawerOverlayOpacity,
                          zIndex:997
                        }}></Animated.View>
                      </TouchableHighlight>
                      <Animated.View 
                        style={{ 
                          position: 'absolute',
                          height: '100%',
                          width: this.drawerWidth,
                          top: 0,
                          left: 0,
                          backgroundColor: '#f2f2f2', 
                          elevation: 10,
                          opacity: 1,
                          zIndex:9999,
                          flexDirection: 'column',
                          overflow: 'hidden'
                        }}
                      >
                        <View style={{ 
                          width: 250,
                          padding: 10,
                          flexDirection: 'column',
                          height: '100%'
                        }}>
                          <View>
                            <TouchableHighlight 
                              style={{ flexDirection:'row', alignItems:'flex-end', borderRadius: 10 }}
                              underlayColor={'lightgray'}
                              onPress={() => {
                                setTimeout(() => dispatch(closeDrawer()), 200)
                                if (!currentNavStack.length || currentNavStack[currentNavStack.length - 1].screen !== 'settings')
                                  setTimeout(() => this.pushNav({ screen: 'settings' }), 100)
                              }}
                            >
                              <View style={{ flex:1, flexDirection: 'row', alignItems:'center' }}>
                                <View> 
                                  <Text style={{ fontSize: 30, margin: 10 }}>
                                    <Ionicons name="md-person" size={32} />
                                  </Text>
                                </View>
                                <View style={{flex:1}}></View>
                                <View> 
                                  <Text style={{ fontSize: 30, margin: 10 }}>
                                    {thinker.user().username}
                                  </Text>
                                </View>
                              </View>
                            </TouchableHighlight>
                          </View>
                          <View style={{ flex:1 }}>
                          </View>
                          <View>
                            <Button
                              title='logout'
                              onPress={() => thinker.logout()}
                            />
                          </View> 
                        </View>
                      </Animated.View>
                    </>
                  ) : null
                }
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
                          {
                            frame.screen === 'settings' ? (
                              <SettingsScreen {...frame.props}/>
                            ) : frame.screen === 'profile' ? (
                              <ProfileScreen {...frame.props} pushFrame={frame => this.pushNav(frame)}/>
                            ) : (
                              <ThoughtScreen {...frame.props} pushFrame={frame => this.pushNav(frame)}/>
                            )
                          }
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
    paddingBottom: 85
  },
  topPadding: {
    height: 25,
    backgroundColor: 'white'
  }
})
