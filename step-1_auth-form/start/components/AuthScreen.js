import React from 'react'
import { View, Text, Image, TextInput, Button } from 'react-native'

import { thinker } from '../thinker-sdk.singleton'
import s from './AuthScreen.styles'

export class AuthScreen extends React.Component {

  render() {
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
          value={''}
          placeholder='username'
        />
        <TextInput 
          style={s.formInput}
          value={''}
          secureTextEntry={true}
          placeholder='password'
        />
        <TextInput 
          style={s.formInput}
          value={''}
          secureTextEntry={true}
          placeholder='repeat password'
        /> 
        <Text style={s.errMsg}>
          {'this is an error message'}
        </Text>
        <View style={s.buttonContainer}>
          <Button 
            style={s.formButton} 
            title={'Register'}
            disabled={true}
            onPress={() => null}
          />
        </View>
        <View style={s.buttonContainer}>
          <Button 
            style={s.formButton} 
            title={'Already have an account?'}
            color='lightgray'
            onPress={() => null}
          />
        </View>
      </View>
    )
  }
}