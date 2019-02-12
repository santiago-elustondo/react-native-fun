import React from 'react'
import { Animated, Dimensions, TouchableHighlight, Keyboard, View, Text, TextInput, Button, StyleSheet, FlatList, ProgressBarAndroid } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { ThoughtCard } from './ThoughtCard'
import { thinker } from '../thinker-sdk.singleton'

export class ThoughtScreen extends React.Component {

  state = { 
    loading: true,
    submitting: false,
    newCommentText: '',
  }

  keyboardHeight = new Animated.Value(0)

  async addNewComment() {
    const { thought } = this.props
    const { newCommentText, comments } = this.state
    if (!newCommentText) return
    this.setState({ submitting: true })
    const newComment = await thinker.addComment({ content: newCommentText, thoughtId: thought._id })
    this.setState({
      comments: [newComment].concat(comments),
      submitting: false,
      newCommentText: ''
    })
    Keyboard.dismiss()
  }

  async componentDidMount() {
    const { thought } = this.props
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    const comments = await thinker.fetchComments({ thoughtId: thought._id })
    this.setState({ comments })
  }

  componentWillUnmount() {
    thinker.unsubscribeToThoughts(this.handleThoughtsData)
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
  }

  keyboardWillShow = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: 150,
        toValue: event.endCoordinates.height + 5,
      })
    ]).start()
    this.setState({ keyboardOpen: true })
  }

  keyboardWillHide = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: 200,
        toValue: 0,
      })
    ]).start()
    this.setState({ keyboardOpen: false })
  }


  render() {
    const { newCommentText, submitting, comments, keyboardOpen } = this.state
    const { style, thought, dispatch, pushFrame } = this.props

    return (
      <Animated.View style={{ alignItems: 'center', paddingBottom: this.keyboardHeight }}>
        <View style={{ alignItems: 'center', flexDirection: 'column' }}>
          {
            keyboardOpen ? null : (
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
            )
          }
          <View style={{ width: Dimensions.get('window').width, paddingTop: 8, paddingLeft: 29, flexDirection: 'row', alignItems: 'flex-start' }}>
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
                    keyExtractor={item => item._id || 'new-comment'}
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
      </Animated.View>
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