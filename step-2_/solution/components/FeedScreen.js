import React from 'react'
import { connect } from 'react-redux'
import { KeyboardAvoidingView, Dimensions, Animated, Keyboard, ScrollView, View, Text, TextInput, Button, StyleSheet, FlatList, ProgressBarAndroid } from 'react-native'

// import { fa } from '../functional-redux'
import { ThoughtCard } from './ThoughtCard'
import { thinker } from '../thinker-sdk.singleton'

// // put in actions
// const pushNav = (dispatch, frame) => {
//   dispatch(fa(
//     state => ({
//       navigation: {
//         stack: state.navigation.stack.concat([ frame ])
//       }
//     })
//   ))
// } 

export const FeedScreen = connect(
  ({ navigation }) => ({ navigation }) 
)(class extends React.Component {

  state = { 
    thoughts: [],
    loading: true,
    submitting: false,
    newThoughtText: ''
  }

  keyboardHeight = new Animated.Value(0)

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
    Keyboard.dismiss()
  }

  handleThoughtsData = async thoughts => {
    this.setState({
      thoughts,
      loading: false
    })
  }

  componentDidMount() {
    thinker.subscribeToThoughts(this.handleThoughtsData)
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
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
  }

  keyboardWillHide = (event) => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: 200,
        toValue: 0,
      })
    ]).start()
  }

  render() {
    const { newThoughtText, thoughts, loading, submitting } = this.state
    const { pushFrame } = this.props

    return (
      <Animated.View style={{ alignItems: 'center', paddingBottom: this.keyboardHeight }}>
        <View style={{alignItems: 'center',  flexDirection: 'column'}}>
          <View style={{flex: 1}}>
            {
              loading ? (
                <ProgressBarAndroid style={{marginTop: 50}}/>
              ) : (
                <FlatList
                  data={thoughts}
                  renderItem={
                    ({ item }) => 
                      <ThoughtCard 
                        thought={item} 
                        onPress={thought => pushFrame({ props: { thought } })}
                      />
                  }
                  keyExtractor={item => item._id}
                  style={styles.thoughtsContainer}
                  showsVerticalScrollIndicator={false}
                />
              )
            }
          </View>
          <View style={styles.newThoughtContainer}>
            <Text style={styles.newThoughtTitle}>
              What are you thinking about?
            </Text>
            <TextInput 
              style={styles.newThoughtInput}
              value={newThoughtText}
              multiline={true}
              numberOfLines={2}
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
        </View>
      </Animated.View>
    )
  }
})

const styles = StyleSheet.create({
  newThoughtContainer: {
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
  feedTitle: {
    marginTop: 10,
    fontSize: 25
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
    marginTop: 10
  }
})