import React from 'react'
import { connect } from 'react-redux'
import {View, Text, Image, TextInput, Button, ProgressBarAndroid } from 'react-native'

import { thinker } from '../thinker-sdk.singleton'
import s from './AuthScreen.styles'

export const AuthScreen = connect(
  state => ({
    auth: state.auth
  }),
)(
class extends React.Component {

  state = { 
    username: '',
    password: '',
    repeatPassword: '',
    registerMode: false,
    submitting: false
  }

  tryToSubmit() {
    const { registerMode } = this.state
    if (registerMode) this.tryToRegister()
    else return this.tryToLogin()
  }
  
  async tryToLogin() {
    const { username, password } = this.state

    if (!username) return this.showError('need username')
    if (!password) return this.showError('need password')

    this.setState({ submitting: true })
    const response = await thinker.login({ username, password })
        
    if (!response.success) 
      return this.showError('login failed, check credentials')
    else console.log(response)
  }

  async tryToRegister() {
    const { username, password, repeatPassword } = this.state

    if (!username) return this.showError('need username')
    if (!password) return this.showError('need password')
    if (password !== repeatPassword) return this.showError('passwords not equal')

    this.setState({ submitting: true })
    const response = await thinker.signup({ username, password })
    
    if (!response.success)
      return this.showError('registration failed, maybe username taken')
    else console.log(response)
  }

  async showError(msg) {
    this.setState({ errMsg: msg, submitting: false })
    setTimeout(() => this.setState({ errMsg: '' }), 4000)
  }

  toggleMode() {
    const { registerMode } = this.state
    this.setState({ registerMode: !registerMode })
  }

  formIsValid() {
    const { registerMode, username, password, repeatPassword } = this.state
    if (!username || !password) return false
    if (registerMode && !repeatPassword && repeatPassword !== password) return false
    return true
  }

  render() {
    const { 
      registerMode, username, password, 
      repeatPassword, submitting, errMsg 
    } = this.state

    return (
      <View style={s.authScreenContainer}>
        <View style={s.logoArea}>
          <Image
            source={require('../assets/icon.png')}
            style={s.logoImage}
          />
          <Text style={s.formTitle}>
            Welcome to Thinker™!
          </Text>
        </View>
        <TextInput 
          style={s.formInput}
          value={username}
          placeholder='username'
          onChangeText={username => this.setState({ username })}
        />
        <TextInput 
          style={s.formInput}
          value={password}
          secureTextEntry={true}
          placeholder='password'
          onChangeText={password => this.setState({ password })}
        />
        {
          registerMode ? (
            <TextInput 
              style={s.formInput}
              value={repeatPassword}
              secureTextEntry={true}
              placeholder='repeat password'
              onChangeText={repeatPassword => this.setState({ repeatPassword })}
            /> 
          ): null
        }
        {
          submitting ? (
            <ProgressBarAndroid style={s.formButton}/>
          ) : (
            <>
              <Text style={s.errMsg}>
                {errMsg}
              </Text>
              <View style={s.buttonContainer}>
                <Button 
                  style={s.formButton} 
                  disabled={!this.formIsValid()}
                  title={registerMode ? 'Register' : 'Sign In'}
                  onPress={() => this.tryToSubmit()}
                />
              </View>
              <View style={s.buttonContainer}>
                <Button 
                  style={s.formButton} 
                  title={registerMode ? 'Already have an account?' : 'Need to register?'}
                  color='lightgray'
                  onPress={() => this.toggleMode()}
                />
              </View>
            </>
          )
        }
      </View>
    )
  }
})