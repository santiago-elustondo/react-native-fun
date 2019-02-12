import React from 'react'
import { Animated, Dimensions, KeyboardAvoidingView, View, Text, TextInput, Button, StyleSheet, FlatList, ProgressBarAndroid } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { ThoughtCard } from './ThoughtCard'
import { thinker } from '../thinker-sdk.singleton'

export class SettingsScreen extends React.Component {

  state = {}

  render() {
    const { } = this.state
    const { } = this.props

    const me = thinker.user()

    return (
      <View style={{ alignItems: 'center', flexDirection: 'column' }}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 40, fontWeight: 'bold' }}>{me.username}</Text>
        </View>
        <View style={{ padding: 20 }}>
          <Ionicons name="md-person" size={32} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  newCommentContainer: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    padding: 10,
    // android
    elevation: 10,
    // ios
    shadowOffset:{  width: 10,  height: 10,  },
    shadowColor: 'gray',
    shadowOpacity: 0.5,
  },
  newCommentTitle: {
    fontSize: 20,
  },
  newCommentInput: {
    padding: 10,
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  newCommentButton: {

  },
  thoughtsContainer: {
    width: '90%',
    marginTop: 10
  }
})