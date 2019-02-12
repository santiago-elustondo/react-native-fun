import React from 'react'
import { Animated, Dimensions, KeyboardAvoidingView, View, Text, TextInput, Button, StyleSheet, FlatList, ProgressBarAndroid } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { ThoughtCard } from './ThoughtCard'
import { thinker } from '../thinker-sdk.singleton'

export class ProfileScreen extends React.Component {

  state = { 
    loading: true
  }

  async componentDidMount() {
    const { userId } = this.props
    const user = await thinker.fetchUser({ userId })
    const thoughts = await thinker.fetchThoughts(user.thoughts)
    this.setState({ thoughts, user })
  }

  render() {
    const { thoughts, user } = this.state
    const { pushFrame } = this.props

    return (
      <View style={{ alignItems: 'center' }}>
        <View style={{ alignItems: 'center', flexDirection: 'column' }}>
          {
            user ? (
              <>
                <View style={{ width: Dimensions.get('window').width }}>
                  <View style={{ flexDirection: 'column', padding: 29 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                      <View style={{ paddingRight: 15, paddingBottom: 3 }}><Ionicons name="md-person" size={25}/></View>
                      <Text style={{ fontWeight: 'bold', fontSize: 25 }}>{user.username}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ width: Dimensions.get('window').width, paddingLeft: 29, flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 20 }}>{user.username}'s thoughts:</Text>
                </View>
                <View style={{flex: 1, width: Dimensions.get('window').width, alignItems:'center'}}>
                  {
                    thoughts ? (
                      thoughts.length ? (
                        <FlatList
                          data={thoughts}
                          renderItem={
                            ({ item }) => <ThoughtCard 
                              thought={item} 
                              onPress={() => pushFrame({ screen: 'thought', props: { thought: item } })}
                            />
                          }
                          keyExtractor={item => item._id}
                          style={styles.thoughtsContainer}
                          showsVerticalScrollIndicator={false}
                        />
                      ) : (
                        <Text>(no thoughts)</Text>
                      )
                    ) : (
                      <ProgressBarAndroid style={{marginTop: 50}}/>
                    )
                  }
                </View> 
              </>
            ) : (
              <ProgressBarAndroid style={{marginTop: 50}}/>
            )
          }
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