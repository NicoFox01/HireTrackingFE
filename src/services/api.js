const API_URL = 'http://localhost:8000/api/v1'

export async function login(username, password) {
  const formData = new FormData()
  formData.append('username', username)
  formData.append('password', password)

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Login failed')
  }

  return response.json()
}

export async function getUsers(token) {
  const response = await fetch(`${API_URL}/users/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  return response.json()
}

export async function createUser(token, userData) {
  const response = await fetch(`${API_URL}/users/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to create user')
  }

  return response.json()
}

export async function updateUser(token, userId, userData) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to update user')
  }

  return response.json()
}

export async function deleteUser(token, userId) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete user')
  }

  return true
}

export async function disableUser(token, userId) {
  const response = await fetch(`${API_URL}/users/desactivar/${userId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to disable user')
  }

  return response.json()
}

export async function enableUser(token, userId) {
  const response = await fetch(`${API_URL}/users/activar/${userId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to enable user')
  }

  return response.json()
}