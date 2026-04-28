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

export async function getCurrentUser(token) {
  const response = await fetch(`${API_URL}/users/mi-usuario`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch current user')
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

export async function getCompanies(token, isActive = undefined) {
  const params = new URLSearchParams()
  if (isActive !== undefined) {
    params.append('is_active', isActive)
  }
  const queryString = params.toString()
  const response = await fetch(`${API_URL}/companies/${queryString ? `?${queryString}` : ''}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch companies')
  }

  return response.json()
}

export async function createCompany(token, companyData) {
  const response = await fetch(`${API_URL}/companies/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(companyData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to create company')
  }

  return response.json()
}

export async function updateCompany(token, companyId, companyData) {
  const response = await fetch(`${API_URL}/companies/${companyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(companyData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to update company')
  }

  return response.json()
}

export async function deleteCompany(token, companyId) {
  const response = await fetch(`${API_URL}/companies/${companyId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete company')
  }

  return true
}

export async function toggleCompanyActive(token, companyId) {
  const response = await fetch(`${API_URL}/companies/${companyId}/toggle-active`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to toggle company active status')
  }

  return response.json()
}