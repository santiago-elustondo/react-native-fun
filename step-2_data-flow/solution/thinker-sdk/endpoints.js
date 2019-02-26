const API_DOMAIN = 'node200.eastus.cloudapp.azure.com:8080'

export const parseBody = async response => { 
  let body = await response.text()
  try {
    body = JSON.parse(body)
  } catch (e) { }
  return { response, body }
}
 
export const signUp = async ({ username, password }) => 
  parseBody(await fetch(`http://${API_DOMAIN}/signup`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify({ username, password })
  }))

export const logIn = async ({ username, password }) =>
  parseBody(await fetch(`http://${API_DOMAIN}/login`, { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json', 
      'cache-control': 'no-cache'
    },
    body: JSON.stringify({ username, password })
  }))

export const getUsers = async ({ token }) => 
  parseBody(await fetch(`http://${API_DOMAIN}/api/v1/users`, { 
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`, 
    }
  }))

export const getUser = async ({ token, userId }) => 
  parseBody(await fetch(`http://${API_DOMAIN}/api/v1/users/${userId}`, { 
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`, 
    }
  }))

export const getThoughts = async ({ token }) =>
  parseBody(await fetch(`http://${API_DOMAIN}/api/v1/thoughts`, { 
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`, 
    }
  }))

export const addThought = async ({ token, authorId, authorUsername, content }) => 
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

export const getThought = async ({ token, thoughtId }) =>
  parseBody(await fetch(`http://${API_DOMAIN}/api/v1/thoughts/${thoughtId}`, { 
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`, 
    }
  }))

export const getComments = async ({ token, thoughtId }) => 
  parseBody(await fetch(`http://${API_DOMAIN}/api/v1/thoughts/${thoughtId}/comments`, { 
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`, 
    }
  }))

export const addComment = async ({ token, thoughtId, authorId, authorUsername, content }) => 
  parseBody(await fetch(`http://${API_DOMAIN}/api/v1/thoughts/${thoughtId}/comments`, { 
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