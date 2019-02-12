import React from 'react'
import { Animated, Easing, View, Text, StyleSheet, Button, Dimensions } from 'react-native'
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { functionalActionsReducer} from './functional-redux'
import { Root } from './components/Root'

const store = createStore(
  functionalActionsReducer,
  { navigation: { stack: [] } },
  applyMiddleware(thunk)
)

export default () =>
  <Provider store={store}>
    <Root/>
  </Provider>