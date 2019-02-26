import { createStore } from 'redux'
import { createTransitionalReducer } from './transitional-redux'

export const createThinkerStore = initialAuth => createStore(
  createTransitionalReducer({
    initialState: { 
      auth: initialAuth 
    }
  })
)