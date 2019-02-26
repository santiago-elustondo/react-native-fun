import * as endpoints from './endpoints'

export class ThinkerSDK {

  constructor(storage) {
    this._storage = storage
    this._authState = 'LOADING'
    this._authhandlers = []
    this._thoughtsHandlers = []
    this._thoughtsInterval = undefined
    this._thoughtsLastResult = undefined
    this._tryToGetAuthFromStorage()
  }

  auth() {
    return {
      state: this.authState(),
      user: this.user()
    }
  }

  authState() {
    return this._authState
  }

  user() {
    return this._user
  }

  subscribeToAuth(handler) {
    return this.subscribeToAuthState(handler)
  }

  subscribeToAuthState(handler) {
    this._authhandlers.push(handler)
    setTimeout(() => handler(this.auth()))
  }

  async tokenIsValid() {
    if (!this._token) return false
    const validateResponse = await endpoints.validateToken({ token: this._token })
    return (
      validateResponse.response.status === 200 &&
      validateResponse.body._id === this._user._id 
    )
  }

  async signup({ username, password }) {
    const signUpResponse = await endpoints.signUp({ username, password })
    if (signUpResponse.response.ok) {
      this._setUser(signUpResponse.body)
      return this.login({ username, password })
    } else return { success: false }
  }

  async login({ username, password }) {
    const loginResponse = await endpoints.logIn({ username, password })
    if (loginResponse.response.ok) {
      this._setToken(loginResponse.body.token)
      this._setUser(loginResponse.body.user)
      this._updateAuthState('LOGGED-IN')
      return { success: true, user: this._user }
    } else {
      return { success: false }
    }
  }

  async logout() {
    this._setUser(null)
    this._setToken(null)
    this._updateAuthState('LOGGED-OUT')
  }
  
  async fetchUsers() {
    const response = await endpoints.getUsers({ token: this._token })
    return response.body
  }

  async fetchUser({ userId }) {
    console.log('userId', userId)
    const response = await endpoints.getUsers({ token: this._token })
    return response.body.find(user => user._id === userId)
  }

  async fetchThoughts(thoughtIds) {
    let thoughts
    if (!thoughtIds) {
      const response = await endpoints.getThoughts({ token: this._token })
      thoughts = response.body
    } else {
      const responses = await Promise.all(
        thoughtIds.map(
          thoughtId => endpoints.getThought({ token: this._token, thoughtId })
        )
      )
      thoughts = responses.map(res => res.body)
    }
    thoughts.reverse()
    return thoughts
  }

  async addThought({ content }) {
    const response = await endpoints.addThought({ 
      authorId: this._user._id, 
      authorUsername: this._user.username,
      content, 
      token: this._token 
    })
    const thought = response.body
    return { ...thought, user: this._user, comments: [] }
  }

  async fetchThought(thoughtId) {
    const response = await endpoints.getThought({ token: this._token, thoughtId })
    return response.body
  }

  async fetchComments({ thoughtId }) {
    const response = await endpoints.getComments({ token: this._token, thoughtId })
    return response.body
  }

  async addComment({ content, thoughtId }) {
    const response = await endpoints.addComment({ 
      authorId: this._user._id, 
      authorUsername: this._user.username,
      content, 
      thoughtId,
      token: this._token 
    })
    console.log(response)
    const comment = response.body
    return { content, author: { id: this._user._id, username: this._user.username } }
  }

  subscribeToThoughts(handler){
    const fetchUpdate = async () => {
      this._thoughtsLastResult = await this.fetchThoughts()
      const thoughts = Array.from(this._thoughtsLastResult)
      this._thoughtsHandlers.forEach(handler => handler(thoughts))
    }

    if (!this._thoughtsInterval)
      this._thoughtsInterval = setInterval(fetchUpdate, 1000)

    this._thoughtsHandlers.push(handler)
    fetchUpdate()
  }

  unsubscribeToThoughts(handler) {
    this._thoughtsHandlers = 
      this._thoughtsHandlers.filter(h => h !== handler)

    if (!this._thoughtsHandlers.length)
      clearInterval(this._thoughtsInterval)
  }

  async _tryToGetAuthFromStorage() {
    const userStringified = await this._storage.getItem('thinker-user')
    this._user = JSON.parse(userStringified)
    this._token = await this._storage.getItem('thinker-token')
    if (this._user && this._token)
      this._updateAuthState('LOGGED-IN')
    else this.logout()
  }

  _updateAuthState(state) {
    this._authState = state
    this._authhandlers.forEach(h => setTimeout(() => h(this.auth())))
  }

  _setUser(user) {
    this._storage.setItem('thinker-user', JSON.stringify(user))
    this._user = user
  }

  _setToken(token) {
    this._storage.setItem('thinker-token', token)
    this._token = token
  }

}