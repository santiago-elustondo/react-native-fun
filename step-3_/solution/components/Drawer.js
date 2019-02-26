import React from 'react'
import { connect } from 'react-redux'
import { TouchableHighlight, Animated, View, Text, Button, Easing } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { t } from '../transitional-redux'
import { thinker } from '../thinker-sdk.singleton'
import s from './Drawer.styles'

const doAnimation = animation => 
  new Promise((resolve) => animation.start(resolve))

export const Drawer = connect(
  state => ({
    auth: state.auth,
    open: state.drawerOpen
  }),
  dispatch => ({
    closeDrawer: () => dispatch(t(state => ({
      drawerOpen: false
    })))
  })
)(
class extends React.Component {

  state = {
    awaitingOpenTransition: false,
    awaitingCloseTransition: false,
    openAnimationInProgress: false,
    closeAnimationInProgress: false
  }

  drawerWidth = new Animated.Value(0)
  overlayOpacity = new Animated.Value(0)

  static getDerivedStateFromProps(props, state) {

    if (props.open && !state.prevOpen)
      return {
        awaitingOpenTransition: true,
        prevOpen: true
      }

    if (!props.open && state.prevOpen)
      return {
        awaitingCloseTransition: true,
        prevOpen: false
      }

    return null

  }

  componentDidUpdate() {
    const { 
      awaitingOpenTransition,
      awaitingCloseTransition
    } = this.state

    if (awaitingOpenTransition)
      this.setState({
        awaitingOpenTransition: false
      }, () => this.doOpenAnimation())

    if (awaitingCloseTransition)
      this.setState({
        awaitingCloseTransition: false,
        closeAnimationInProgress: true
      }, async () => {
        await this.doCloseAnimation()
        this.setState({
          closeAnimationInProgress: false
        })
      })
  
  }

  doOpenAnimation() {
    return Promise.all([
      doAnimation(Animated.timing(                  
        this.drawerWidth, {
          toValue: 250,                  
          duration: 200,              
          easing: Easing.ease
        }
      )),
      doAnimation(Animated.timing(                  
        this.overlayOpacity, {
          toValue: 0.8,                  
          duration: 200,              
          easing: Easing.ease
        }
      ))
    ])
  }

  doCloseAnimation() {
    return Promise.all([
      doAnimation(Animated.timing(                  
        this.drawerWidth, {
          toValue: 0,                  
          duration: 200,              
          easing: Easing.ease
        }
      )),
      doAnimation(Animated.timing(                  
        this.overlayOpacity, {
          toValue: 0,                  
          duration: 200,              
          easing: Easing.ease
        }
      ))
    ])
  }

  render () {
    const { auth, closeDrawer, open } = this.props
    const { closeAnimationInProgress } = this.state

    return open || closeAnimationInProgress ? (
      <>
        <TouchableHighlight style={s.overlayTouchable} onPress={() => closeDrawer()}>
          <Animated.View style={{ ...s.overlayColor, opacity: this.overlayOpacity }}></Animated.View>
        </TouchableHighlight>
        <Animated.View style={{ ...s.drawerOuter, width: this.drawerWidth }}>
          <View style={s.drawerInner}>
            <View style={s.usernameRowOuter}>
              <View style={s.usernameRowInner}>
                <Text style={s.usernameIcon}>
                  <Ionicons name="md-person" size={32} />
                </Text>
                <View style={s.space}></View>
                <Text style={s.usernameText}>
                  {auth.user.username}
                </Text>
              </View>
            </View>
            <View style={s.space}></View>
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
})