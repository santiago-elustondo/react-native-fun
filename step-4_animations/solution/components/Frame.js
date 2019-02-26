import React from 'react'
import { View } from 'react-native'

import { Drawer } from './Drawer'
import { Navbar} from './Navbar'
import s from './Frame.styles'

export const Frame = ({ children }) => 
  <>
    <Navbar/>
    <View style={s.belowNavbar}>
      <Drawer/>
      <View style={s.activeScreen}>
        {children}  
      </View>
    </View>
  </>