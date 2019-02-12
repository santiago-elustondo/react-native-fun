export const functionalActionsReducer = (state, action) => {
  return action.type === 'functional' ? ({
    ...state,
    ...action.update(state)
  }) : state
}

export const functionalAction = (update) => ({
  type: 'functional',
  update
})

export const fa = functionalAction