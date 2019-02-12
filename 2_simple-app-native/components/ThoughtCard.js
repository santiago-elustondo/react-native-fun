import React from 'react'
import { StyleSheet, Text, View, TouchableNativeFeedback } from 'react-native'

export const ThoughtCard = ({ thought, onPress }) => 
  <TouchableNativeFeedback onPress={() => onPress(thought)}>
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.usernameContainer}>
          <Text style={styles.username}> {thought.author.username} </Text>
        </View>
        <View style={styles.creationDateContainer}>
          <Text style={styles.creationDate}> 2019-02-?? </Text>
        </View>
      </View>
      <Text style={styles.content}>{thought.content}</Text>
    </View>
  </TouchableNativeFeedback>

const styles = StyleSheet.create({
  card: {
    margin: 5,
    padding: 5,
    backgroundColor: 'white',
    // android
    elevation: 5,
    // ios
    shadowOffset:{  width: 10,  height: 10,  },
    shadowColor: 'gray',
    shadowOpacity: 0.5,
  },
  heading: {
    flexDirection: 'row'
  },
  usernameContainer: {
    flex: 1,
    alignItems: 'flex-start'
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18
  },
  creationDateContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  creationDate: {
    fontSize: 18
  },
  content: {
    padding: 5,
    fontSize: 24,
  }
})