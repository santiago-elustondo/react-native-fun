import React from 'react'
import { Animated, Dimensions, TouchableHighlight, KeyboardAvoidingView, View, Text, TextInput, Button, StyleSheet, FlatList, ProgressBarAndroid } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { ThoughtCard } from './ThoughtCard'
import { thinker } from '../thinker-sdk.singleton'

export class ThoughtScreen extends React.Component {

  state = { 
    loading: true,
    submitting: false,
    newCommentText: '',
  }

  async addNewComment() {
    const { newCommentText, thoughts } = this.state
    if (!newCommentText) return
    this.setState({ submitting: true })
    const newComment = await thinker.addThought({ content: newCommentText })
    this.setState({
      thoughts: [newComment].concat(thoughts),
      submitting: false,
      newCommentText: ''
    })
  }

  async componentDidMount() {
    const { thought } = this.props
    const comments = await thinker.fetchComments({ thoughtId: thought._id })
    this.setState({ comments })
  }

  render() {
    const { newCommentText, submitting, comments } = this.state
    const { style, thought, dispatch, pushFrame } = this.props

    return (
      <View style={{ alignItems: 'center' }}>
        <View style={{ alignItems: 'center', flexDirection: 'column' }}>
          <View style={{ width: Dimensions.get('window').width }}>
            <View style={{ flexDirection: 'column', padding: 29 }}>
              <TouchableHighlight 
                style={{ borderRadius: 10 }}
                underlayColor={'lightgray'}
                onPress={() => pushFrame({  
                  screen: 'profile',
                  props: { userId: thought.author.id }
                })}
              >
                <View style={{ paddingLeft: 3, flexDirection: 'row', alignItems: 'flex-end' }}>
                  <View style={{ paddingRight: 12, paddingBottom: 1 }}><Ionicons name="md-person" size={15}/></View>
                  <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{thought.author.username}</Text>
                </View>
              </TouchableHighlight>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start'}}>
                <Text style={{ fontSize: 25, marginTop: 10 }}>{thought.content}</Text>
              </View>
            </View>
          </View>
          <View style={{ width: Dimensions.get('window').width, paddingLeft: 29, flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 20 }}>Comments:</Text>
          </View>
          <View style={{flex: 1, width: Dimensions.get('window').width, alignItems:'center'}}>
            {
              comments ? (
                comments.length ? (
                  <FlatList
                    data={comments}
                    renderItem={
                      ({ item }) => <ThoughtCard 
                        thought={item} 
                        onPress={() => pushFrame({  
                          screen: 'profile',
                          props: { userId: item.author.id }
                        })}
                      />
                    }
                    keyExtractor={item => item._id}
                    style={styles.thoughtsContainer}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <Text>(no comments)</Text>
                )
              ) : (
                <ProgressBarAndroid style={{marginTop: 50}}/>
              )
            }
          </View>
          <View style={styles.newCommentContainer}>
            <Text style={styles.newCommentTitle}>
              Leave a comment
            </Text>
            <TextInput 
              style={styles.newCommentInput}
              value={newCommentText}
              multiline = {true}
              numberOfLines = {2}
              onChangeText={newCommentText => this.setState({ newCommentText })}
            />
            {
              submitting ? (
                <ProgressBarAndroid style={styles.newCommentButton}/>
              ) : (
                <Button 
                  style={styles.newCommentButton} 
                  title='submit'
                  onPress={() => this.addNewComment()}
                />
              )
            }
          </View>
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