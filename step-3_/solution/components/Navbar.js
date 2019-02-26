import React from 'react'
import { connect } from 'react-redux'

import { t } from '../transitional-redux'
import { Text, View, TouchableHighlight } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import s from './Navbar.styles'

export const Navbar = connect(
  state => ({
    auth: state.auth
  }),
  dispatch => ({
    openDrawer: () => dispatch(t(state => ({
      drawerOpen: true
    })))
  })
)(({ auth, openDrawer }) => 
  <View style={s.container}>
    <View style={s.leftSide}>
      <Text style={s.greeting}>
        Hello, {auth.user.username}!
      </Text>
    </View>
    <View style={s.rightSide}>
      <View>
        <TouchableHighlight 
          activeOpacity={1}
          underlayColor={'lightgray'}
          style={{ borderRadius: 10 }}
          onPress={() => { setTimeout(() => openDrawer(), 20) }}
        >
          <Ionicons name="md-menu" size={32} />
        </TouchableHighlight>
      </View>
    </View>
  </View>
)
