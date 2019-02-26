import React from 'react'
import { Provider } from 'react-redux'

import { t } from './transitional-redux'
import { store } from './store'
import { thinker } from './thinker-sdk.singleton'
import { Root } from './components/Root'

thinker.subscribeToAuthState(authState => {
  store.dispatch(t(() => ({
    auth: {
      state: authState,
      user: authState === 'LOGGED-IN' ? thinker.user() : null
    }
  })))
})

export default () =>
  <Provider store={store}>
    <Root/>
  </Provider>