const prefix = '__transition__'

export const createTransitionalReducer = ({ initialState }) => 
  (state = initialState, action) => 
    action.type.substr(0, prefix.length) === prefix ? ({
      ...state,
      ...action.mapState(state)
    }) : state


export const transition = (...args) => {
  let name, mapState
  
  if (typeof args[0] === 'string') {
    name = args[0]
    mapState = args[1]
  } else {
    name = ''
    mapState = args[0]
  }

  if (typeof mapState !== 'function')
    throw new Error('transitional action must define a mapState function')

  return {
    type: prefix + name,
    mapState
  }
}

export const t = transition