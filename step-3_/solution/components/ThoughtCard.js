import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import s from './ThoughtCard.styles'

export const ThoughtCard = ({ thought }) => 
  <View style={s.card}>
    <View style={s.heading}>
      <View style={s.usernameContainer}>
        <Ionicons style={s.icon} name="md-person" size={15}/> 
        <Text style={s.username}>
          {thought.author.username} 
        </Text>
      </View>
      <View style={s.creationDateContainer}>
        <Text style={s.creationDate}>2019-02-??</Text>
      </View>
    </View>
    <Text style={s.content}>{thought.content}</Text>
  </View>