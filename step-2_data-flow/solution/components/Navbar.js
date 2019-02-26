import React from 'react'
import { Text, View, Button } from 'react-native'

import s from './Navbar.styles'

export const Navbar = ({ loggedInUser, onLogout }) => 
  <View style={s.container}>
    <View style={s.leftSide}>
      <Text style={s.greeting}>
        Hello, {loggedInUser.username}!
      </Text>
    </View>
    <View style={s.rightSide}>
      <Button 
        onPress={onLogout}
        title='Log out'
      />
    </View>
  </View>
