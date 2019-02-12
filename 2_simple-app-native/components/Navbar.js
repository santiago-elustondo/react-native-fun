import React from 'react'
import { StyleSheet, Text, View, Image, TouchableNativeFeedback, TouchableHighlight, Button } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

export const Navbar = ({ loggedInUser, onLogout, onOpenDrawer, onBackButtonPress, showBackButton }) => 
  <View style={styles.container}>
    <View style={styles.leftSide}>
      <View>
        <Image
          style={{ height: 35, width: 30 }}  
          source={require('../assets/icon.png')}
        />
      </View>
      <View style={{ marginLeft: 15}}>
        {
          showBackButton ? (
            <TouchableHighlight 
              activeOpacity={1}
              underlayColor={'lightgray'}
              style={{borderRadius: 10 }}
              onPress={() => { setTimeout(() => onBackButtonPress(), 20) }}
            >
              <Text style={styles.username}>
                {'back'}
              </Text>
            </TouchableHighlight>
          ) : null
        }
      </View>
    </View>
    <View style={styles.rightSide}>
      <View style={{flex:1}}></View>
      <View>
        <TouchableHighlight 
          activeOpacity={1}
          underlayColor={'lightgray'}
          style={{borderRadius: 10 }}
          onPress={() => { setTimeout(() => onOpenDrawer(), 20) }}
        >
          <Ionicons name="md-menu" size={32} />
        </TouchableHighlight>
      </View>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 10
  },
  username: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  rightSide: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  }
})