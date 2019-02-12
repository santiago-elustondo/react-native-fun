import { AsyncStorage } from 'react-native'

// ENDPOINTS -------------

const API_DOMAIN = 'node200.eastus.cloudapp.azure.com:8080'

const parseBody = async response => { 
  let body = await response.text()
  try {
    body = JSON.parse(body)
  } catch (e) { }
  return { response, body }
}
 
const signUp = async ({ username, password }) => 
  parseBody(await fetch(`http://${API_DOMAIN}/signup`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify({ username, password })
  }))

const logIn = async ({ username, password }) =>
  parseBody(await fetch(`http://${API_DOMAIN}/login`, { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json', 
      'cache-control': 'no-cache'
    },
    body: JSON.stringify({ username, password })
  }))

const getUsers = async ({ token }) => 
  parseBody(await fetch(`http://${API_DOMAIN}/api/v1/users`, { 
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`, 
    }
  }))

const getUser = async ({ token, userId }) => 
  parseBody(await fetch(`http://${API_DOMAIN}/api/v1/users/${userId}`, { 
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`, 
    }
  }))

const getThoughts = async ({ token }) =>
  parseBody(await fetch(`http://${API_DOMAIN}/api/v1/thoughts`, { 
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`, 
    }
  }))

const addThought = async ({ token, authorId, authorUsername, content }) => 
  parseBody(await fetch(`http://${API_DOMAIN}/api/v1/thoughts`, { 
    method: 'POST', 
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', 
      'cache-control': 'no-cache'
    },
    body: JSON.stringify({
      content,
      author: {
        id: authorId,
        username: authorUsername
      }
    })
  }))

const getThought = async ({ token, thoughtId }) =>
  parseBody(await fetch(`http://${API_DOMAIN}/api/v1/thoughts/${thoughtId}`, { 
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`, 
    }
  }))

const getComments = async ({ token, thoughtId }) => 
  parseBody(await fetch(`http://${API_DOMAIN}/api/v1/thoughts/${thoughtId}/comments`, { 
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`, 
    }
  }))

// SERVICE -------------

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

  user() {
    return this._user
  }

  subscribeToAuthState(handler) {
    this._authhandlers.push(handler)
    setTimeout(() => handler(this._authState))
  }


  async tokenIsValid() {
    if (!this._token) return false
    const validateResponse = await validateToken({ token: this._token })
    return (
      validateResponse.response.status === 200 &&
      validateResponse.body._id === this._user._id 
    )
  }

  async signup({ username, password }) {
    const signUpResponse = await signUp({ username, password })
    if (signUpResponse.response.ok) {
      this._setUser(signUpResponse.body)
      return this.login({ username, password })
    } else return { success: false }
  }

  async login({ username, password }) {
    const loginResponse = await logIn({ username, password })
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
    const response = await getUsers({ token: this._token })
    return response.body
  }

  async fetchUser({ userId }) {
    console.log('userId', userId)
    const response = await getUsers({ token: this._token })
    return response.body.find(user => user._id === userId)
  }

  async fetchThoughts(thoughtIds) {
    let thoughts
    if (!thoughtIds) {
      const response = await getThoughts({ token: this._token })
      thoughts = response.body
    } else {
      const responses = await Promise.all(
        thoughtIds.map(
          thoughtId => getThought({ token: this._token, thoughtId })
        )
      )
      thoughts = responses.map(res => res.body)
    }
    thoughts.reverse()
    return thoughts
  }

  async addThought({ content }) {
    const response = await addThought({ 
      authorId: this._user._id, 
      authorUsername: this._user.username,
      content, 
      token: this._token 
    })
    const thought = response.body
    return { ...thought, user: this._user, comments: [] }
  }

  async fetchThought(thoughtId) {
    const response = await getThought({ token: this._token, thoughtId })
    return response.body
  }

  async fetchComments({ thoughtId }) {
    const response = await getComments({ token: this._token, thoughtId })
    return response.body
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
    this._authhandlers.forEach(h => setTimeout(() => h(state)))
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

// INSTANTIATE -------------

export const thinker = new ThinkerSDK(AsyncStorage)