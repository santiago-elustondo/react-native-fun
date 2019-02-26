import { createStore } from 'redux'
import { createTransitionalReducer } from './transitional-redux'

export const store = createStore(
  createTransitionalReducer({
    initialState: { auth: { state: 'LOADING' } }
  })
)