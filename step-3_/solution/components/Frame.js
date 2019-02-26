import React from 'react'
import { connect } from 'react-redux'
import { TouchableHighlight, View, Text, Button, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { t } from '../transitional-redux'
import { thinker } from '../thinker-sdk.singleton'
import { Drawer } from './Drawer'
import { Navbar} from './Navbar'
import s from './Drawer.styles'

export const Frame = connect(
  state => ({
    auth: state.auth,
    drawerOpen: state.drawerOpen
  }),
  dispatch => ({
    closeDrawer: () => dispatch(t(state => ({
      drawerOpen: false
    })))
  })
)(({ auth, closeDrawer, drawerOpen, children }) => 
  <>
    <Navbar/>
    <View style={{
      width: Dimensions.get('window').width,
      height: '100%'
    }}>
      <Drawer/>
      <View style={{
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        height: '100%'
      }}>
        {children}  
      </View>
    </View>
  </>
)