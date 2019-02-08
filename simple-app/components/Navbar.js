import React from 'react'
import { StyleSheet, Text, View, TouchableHighlight, Button } from 'react-native'

export const Navbar = ({ loggedInUser, onLogout }) => 
  <View style={styles.container}>
    <View style={styles.leftSide}>
      <TouchableHighlight>
        <Text style={styles.username}>
          {loggedInUser.username}
        </Text>
      </TouchableHighlight>
    </View>
    <View style={styles.rightSide}>
      <Button
        title='logout'
        onPress={onLogout}
      />
    </View>
  </View>

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    padding: 13,
    elevation: 10,
    flexDirection: 'row'
  },
  leftSide: {
    flex: 1,
    alignItems: 'flex-start'
  },
  username: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  rightSide: {
    flex: 1,
    alignItems: 'flex-end'
  }
})