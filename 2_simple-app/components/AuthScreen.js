import React from 'react'
import {View, Text, Image, TextInput, Button, StyleSheet, ProgressBarAndroid } from 'react-native'

import { thinker } from '../thinker-sdk.singleton'

export class AuthScreen extends React.Component {

  state = { 
    username: '',
    password: '',
    submitting: false
  }

  async login() {
    const { username, password } = this.state
    thinker.login({ username, password })
    this.setState({ submitting: true })
  }

  render() {
    const { username, password, submitting } = this.state

    return (
      <View style={{ width: '70%', marginTop: '10%', flexDirection: 'column' }}>
          <View style={{ alignItems: 'center'}}>
            <Image
              source={require('../assets/icon.png')}
              style={{ width: 150, height: 150 }}
            />
            <Text style={styles.formTitle}>
              Welcome to Thinker™!
            </Text>
          </View>
          <TextInput 
            style={styles.formInput}
            value={username}
            placeholder='username'
            onChangeText={username => this.setState({ username })}
          />
          <TextInput 
            style={styles.formInput}
            value={password}
            secureTextEntry={true}
            placeholder='password'
            onChangeText={password => this.setState({ password })}
          />
          {
            submitting ? (
              <ProgressBarAndroid style={styles.formButton}/>
            ) : (
              <Button 
                style={styles.formButton} 
                title='Sign In'
                onPress={() => this.login()}
              />
            )
          }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: 'white',
    width: '100%',
    padding: 10,
    // android
    elevation: 10,
    // ios
    shadowOffset:{  width: 10,  height: 10,  },
    shadowColor: 'gray',
    shadowOpacity: 0.5,
  },
  formTitle: {
    fontSize: 20,
  },
  formInput: {
    padding: 10,
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    borderBottomColor: 'blue',
    borderBottomWidth: 0.3,
  },
  formButton: {
    width: '100%'
  },
})