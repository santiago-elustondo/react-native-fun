import React from 'react'
import {  View, Text, TextInput, Button, FlatList, Keyboard } from 'react-native'

import { thinker } from '../thinker-sdk.singleton'
import { LoadingSpinner } from './LoadingSpinner'
import { ThoughtCard } from './ThoughtCard'
import s from './FeedScreen.styles'

export class FeedScreen extends React.Component {

  state = { 
    thoughts: [],
    loading: true,
    submitting: false,
    newThoughtText: '',
    keyboardHeight: 0
  }

  async addNewThought() {
    const { newThoughtText, thoughts } = this.state
    if (!newThoughtText) return
    this.setState({ submitting: true })
    const newThought = await thinker.addThought({ content: newThoughtText })
    this.setState({
      thoughts: [newThought].concat(thoughts),
      submitting: false,
      newThoughtText: ''
    })
  }

  handleThoughtsData = async thoughts => {
    this.setState({
      thoughts,
      loading: false
    })
  }

  componentDidMount() {
    thinker.subscribeToThoughts(this.handleThoughtsData)
    Keyboard.addListener('keyboardDidHide', () => this.setState({ keyboardHeight: 0 }))
    Keyboard.addListener('keyboardDidShow', ({ endCoordinates }) => {
      this.setState({ keyboardHeight: endCoordinates.height})
    })
  }

  componentWillUnmount() {
    thinker.unsubscribeToThoughts(this.handleThoughtsData)
  }

  render() {
    const { newThoughtText, thoughts, loading, submitting, keyboardHeight } = this.state

    return (
      <View style={{ ...s.container, paddingBottom: keyboardHeight }}>
        <View style={s.feedContainer}>
          {
            loading ? (
              <LoadingSpinner style={s.feedSpinner}/>
            ) : (
              <FlatList
                data={thoughts}
                renderItem={
                  ({ item }) => <ThoughtCard thought={item}/>
                }
                keyExtractor={item => item._id}
                style={s.thoughtsContainer}
                showsVerticalScrollIndicator={false}
              />
            )
          }
        </View>
        <View style={s.newThoughtContainer}>
          <Text style={s.newThoughtTitle}>
            What are you thinking about?
          </Text>
          <TextInput 
            style={s.newThoughtInput}
            value={newThoughtText}
            multiline={true}
            numberOfLines={2}
            onChangeText={newThoughtText => this.setState({ newThoughtText })}
          />
          {
            submitting ? (
              <LoadingSpinner style={s.newThoughtButton}/>
            ) : (
              <Button 
                style={s.newThoughtButton} 
                title='submit'
                onPress={() => this.addNewThought()}
              />
            )
          }
        </View>
      </View>
    )
  }
}