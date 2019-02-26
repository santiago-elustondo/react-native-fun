import React from 'react'
import { Provider } from 'react-redux'

import { transition } from './transitional-redux'
import { createThinkerStore } from './store'
import { thinker } from './thinker-sdk.singleton'
import { Root } from './components/Root'

const store = createThinkerStore(thinker.auth())

thinker.subscribeToAuthState(auth => {
  store.dispatch(transition(() => ({ auth })))
})

export default () =>
  <Provider store={store}>
    <Root/>
  </Provider>