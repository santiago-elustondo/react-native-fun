import React from 'react'
import { View, Text, TextInput, Button, StyleSheet, FlatList, ProgressBarAndroid } from 'react-native'

import { ThoughtCard } from './ThoughtCard'
import { thinker } from '../thinker-sdk.singleton'

export class FeedScreen extends React.Component {

  state = { 
    thoughts: [],
    loading: true,
    submitting: false,
    newThoughtText: '',
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

  async componentDidMount() {
    thinker.subscribeToThoughts(this.handleThoughtsData)
  }

  componentWillUnmount() {
    thinker.unsubscribeToThoughts(this.handleThoughtsData)
  }

  render() {
    const { newThoughtText, thoughts, loading, submitting } = this.state

    return (
      <>
        <View style={styles.newThoughtContainer}>
          <Text style={styles.newThoughtTitle}>
            What are you thinking about?
          </Text>
          <TextInput 
            style={styles.newThoughtInput}
            value={newThoughtText}
            multiline = {true}
            numberOfLines = {2}
            onChangeText={newThoughtText => this.setState({ newThoughtText })}
          />
          {
            submitting ? (
              <ProgressBarAndroid style={styles.newThoughtButton}/>
            ) : (
              <Button 
                style={styles.newThoughtButton} 
                title='submit'
                onPress={() => this.addNewThought()}
              />
            )
          }
        </View>
        {
          loading ? (
            <ProgressBarAndroid style={{marginTop: 50}}/>
          ) : (
            <FlatList
              data={thoughts}
              renderItem={({ item }) => <ThoughtCard thought={item}/>}
              keyExtractor={item => item._id}
              style={styles.thoughtsContainer}
              showsVerticalScrollIndicator={false}
            />
          )
        }
      </>
    )
  }
}

const styles = StyleSheet.create({
  newThoughtContainer: {
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
  newThoughtTitle: {
    fontSize: 20,
  },
  newThoughtInput: {
    padding: 10,
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  newThoughtButton: {

  },
  thoughtsContainer: {
    width: '90%',
    marginTop: 10,
  }
})