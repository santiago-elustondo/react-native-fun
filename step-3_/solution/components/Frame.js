import React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'

import { t } from '../transitional-redux'
import { Drawer } from './Drawer'
import { Navbar} from './Navbar'
import s from './Frame.styles'

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
    <View style={s.belowNavbar}>
      <Drawer/>
      <View style={s.activeScreen}>
        {children}  
      </View>
    </View>
  </>
)