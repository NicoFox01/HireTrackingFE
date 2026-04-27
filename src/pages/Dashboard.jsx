import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUsers, createUser, updateUser, deleteUser, disableUser, enableUser } from '../services/api'

function UserCard({ user, onClick }) {
  return (
    <div
      onClick={onClick}
      className="col-span-1 bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition flex flex-col items-center text-center min-h-[180px] justify-center"
    >
      <h3 className="font-semibold text-white">{user.username}</h3>
      <p className="text-gray-400 text-sm capitalize">{user.role}</p>
      <span
        className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
          user.is_active
            ? 'bg-green-900 text-green-300'
            : 'bg-red-900 text-red-300'
        }`}
      >
        {user.is_active ? 'Activo' : 'Inactivo'}
      </span>
    </div>
  )
}

function UserModal({ user, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    username: '',
    role: 'selector',
    password: '',
    is_active: true,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.id) {
      setFormData({
        username: user.username || '',
        role: user.role || 'selector',
        password: '',
        is_active: user.is_active ?? true,
      })
    } else {
      setFormData({
        username: '',
        role: 'selector',
        password: '',
        is_active: true,
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSave(formData)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold text-white mb-4">
          {user?.id ? 'Editar Usuario' : 'Crear Usuario'}
        </h2>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Nombre de usuario</label>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
              autoComplete="off"
              required
            />
          </div>

          {!user?.id && (
            <div>
              <label className="block text-gray-300 mb-1">Contraseña</label>
              <input
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
                autoComplete="new-password"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-1">Rol</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600"
            >
              <option value="" disabled>Elegir rol</option>
              <option value="admin">Admin</option>
              <option value="selector">Selector</option>
              <option value="head">Head</option>
            </select>
          </div>

          {user?.id && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label className="text-gray-300">Usuario activo</label>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creando...' : user?.id ? 'Guardar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>

        {user?.id && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            <button
              onClick={() => onDelete(user.id)}
              className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Eliminar Usuario
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { token, user, logout, setUserData } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalKey, setModalKey] = useState(0)
  const [menuKey, setMenuKey] = useState('dashboard')

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const usersData = await getUsers(token)
      setUsers(usersData)
      if (usersData.length > 0 && !user) {
        setUserData(usersData[0])
      }
    } catch (err) {
      console.error('Error loading users:', err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSaveUser = async (formData) => {
    if (selectedUser?.id) {
      const { password, ...updateData } = formData
      await updateUser(token, selectedUser.id, updateData)
    } else {
      await createUser(token, formData)
    }
    setShowModal(false)
    setSelectedUser(null)
    loadUserData()
  }

  const handleDeleteUser = async (userId) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      await deleteUser(token, userId)
      setShowModal(false)
      setSelectedUser(null)
      loadUserData()
    }
  }

  const openNewUserModal = () => {
    setSelectedUser(null)
    setModalKey(prev => prev + 1)
    setShowModal(true)
  }

  const openEditUserModal = (u) => {
    setSelectedUser(u)
    setModalKey(prev => prev + 1)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <aside className="w-64 bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">HireTracker</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setMenuKey('dashboard')}
            className={`w-full text-left px-4 py-2 rounded ${
              menuKey === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Dashboard
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => setMenuKey('usuarios')}
              className={`w-full text-left px-4 py-2 rounded ${
                menuKey === 'usuarios'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              Usuarios
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <p className="text-gray-400 text-sm">Logged as:</p>
          <p className="text-white font-semibold">{user?.username || 'User'}</p>
          <p className="text-gray-400 text-sm capitalize">
            {user?.role || 'Role'}
          </p>
          <button
            onClick={handleLogout}
            className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        {menuKey === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
            <p className="text-gray-400">Bienvenido a HireTracker</p>
          </div>
        )}

        {menuKey === 'usuarios' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Usuarios</h2>
              <button
                onClick={openNewUserModal}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Nuevo Usuario
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {users.map((u) => (
                <UserCard key={u.id} user={u} onClick={() => openEditUserModal(u)} />
              ))}
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <UserModal
          key={modalKey}
          user={selectedUser}
          onClose={() => {
            setShowModal(false)
            setSelectedUser(null)
          }}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  )
}