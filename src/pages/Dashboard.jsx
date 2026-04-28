import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUsers, createUser, updateUser, deleteUser, getCompanies, createCompany, updateCompany, deleteCompany, toggleCompanyActive } from '../services/api'
import toast, { Toaster } from 'react-hot-toast'

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-4">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

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

function CompanyCard({ company, onClick }) {
  return (
    <div
      onClick={onClick}
      className="col-span-1 bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition flex flex-col items-center text-center min-h-[120px] justify-center"
    >
      <h3 className="font-semibold text-white">{company.name}</h3>
      <span
        className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
          company.is_active
            ? 'bg-green-900 text-green-300'
            : 'bg-red-900 text-red-300'
        }`}
      >
        {company.is_active ? 'Activa' : 'Inactiva'}
      </span>
    </div>
  )
}

function CompanyModal({ company, onClose, onSave, onToggle, onDelete }) {
  const [formData, setFormData] = useState({ name: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (company?.id) {
      setFormData({ name: company.name || '' })
    } else {
      setFormData({ name: '' })
    }
  }, [company])

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
          {company?.id ? 'Editar Empresa' : 'Crear Empresa'}
        </h2>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Nombre de empresa</label>
            <input
              type="text"
              placeholder="Nombre de empresa"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 placeholder-gray-400"
              autoComplete="off"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : company?.id ? 'Guardar' : 'Crear'}
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

        {company?.id && (
          <div className="mt-4 pt-4 border-t border-gray-600 flex gap-2">
            <button
              onClick={() => onToggle(company.id)}
              className={`flex-1 py-2 text-white rounded hover:opacity-90 ${
                company.is_active ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {company.is_active ? 'Inactivar' : 'Activar'}
            </button>
            <button
              onClick={() => onDelete(company.id)}
              className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Eliminar
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
  const [companies, setCompanies] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [companyModalKey, setCompanyModalKey] = useState(0)
  const [menuKey, setMenuKey] = useState('dashboard')
  const [modalKey, setModalKey] = useState(0)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null })

  const handleDeleteCompany = async (companyId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Empresa',
      message: '¿Estás seguro de eliminar esta empresa? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        try {
          await deleteCompany(token, companyId)
          setShowCompanyModal(false)
          setSelectedCompany(null)
          loadCompanyData()
          toast.success('Empresa eliminada')
        } catch (err) {
          toast.error(err.message || 'Error al eliminar empresa')
        }
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })
      }
    })
  }

  const [companyFilter, setCompanyFilter] = useState(undefined)

  const loadCompanyData = async () => {
    try {
      const companiesData = await getCompanies(token, companyFilter)
      setCompanies(companiesData)
    } catch (err) {
      console.error('Error loading companies:', err)
    }
  }

  const loadUserData = async () => {
    try {
      const usersData = await getUsers(token)
      setUsers(usersData)
    } catch (err) {
      console.error('Error loading users:', err)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    if (menuKey === 'empresas') {
      loadCompanyData()
    }
  }, [menuKey])

  const handleFilterChange = (e) => {
    const value = e.target.value
    setCompanyFilter(value === '' ? undefined : value === 'true')
    loadCompanyData()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSaveUser = async (formData) => {
    try {
      if (selectedUser?.id) {
        const { password, ...updateData } = formData
        await updateUser(token, selectedUser.id, updateData)
      } else {
        await createUser(token, formData)
      }
      setShowModal(false)
      setSelectedUser(null)
      loadUserData()
    } catch (err) {
      alert(err.message || 'Error al guardar usuario')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await deleteUser(token, userId)
        setShowModal(false)
        setSelectedUser(null)
        loadUserData()
      } catch (err) {
        alert(err.message || 'Error al eliminar usuario')
      }
    }
  }

  const openNewUserModal = () => {
    setSelectedUser(null)
    setSelectedCompany(null)
    setModalKey(prev => prev + 1)
    setShowModal(true)
  }

  const openEditUserModal = (u) => {
    setSelectedUser(u)
    setSelectedCompany(null)
    setModalKey(prev => prev + 1)
    setShowModal(true)
  }

  const handleSaveCompany = async (formData) => {
    try {
      if (selectedCompany?.id) {
        await updateCompany(token, selectedCompany.id, formData)
      } else {
        await createCompany(token, formData)
      }
      setShowCompanyModal(false)
      setSelectedCompany(null)
      loadCompanyData()
    } catch (err) {
      alert(err.message || 'Error al guardar empresa')
    }
  }

  const handleToggleCompany = async (companyId) => {
    try {
      await toggleCompanyActive(token, companyId)
      setShowCompanyModal(false)
      setSelectedCompany(null)
      loadCompanyData()
      toast.success('Estado actualizado')
    } catch (err) {
      toast.error(err.message || 'Error al cambiar estado de empresa')
    }
  }

  const openNewCompanyModal = () => {
    setSelectedCompany(null)
    setSelectedUser(null)
    setCompanyModalKey(prev => prev + 1)
    setShowCompanyModal(true)
  }

  const openEditCompanyModal = (c) => {
    setSelectedCompany(c)
    setSelectedUser(null)
    setCompanyModalKey(prev => prev + 1)
    setShowCompanyModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Toaster position="top-right" />
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

          {user?.role === 'admin' && (
            <button
              onClick={() => setMenuKey('empresas')}
              className={`w-full text-left px-4 py-2 rounded ${
                menuKey === 'empresas'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              Empresas
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

        {menuKey === 'empresas' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Empresas</h2>
              <div className="flex gap-2">
                <select
                  value={companyFilter === undefined ? '' : String(companyFilter)}
                  onChange={handleFilterChange}
                  className="px-4 py-2 bg-gray-700 text-white rounded border border-gray-600"
                >
                  <option value="">Todas</option>
                  <option value="true">Activas</option>
                  <option value="false">Inactivas</option>
                </select>
                <button
                  onClick={openNewCompanyModal}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  + Nueva Empresa
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {companies.length === 0 ? (
                <p className="text-gray-400 col-span-4">No hay empresas</p>
              ) : (
                companies.map((c) => (
                  <CompanyCard key={c.id} company={c} onClick={() => openEditCompanyModal(c)} />
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {showModal && selectedUser && (
        <UserModal
          key={`user-${modalKey}`}
          user={selectedUser}
          onClose={() => {
            setShowModal(false)
            setSelectedUser(null)
          }}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      )}

      {showCompanyModal && (
        <CompanyModal
          key={`company-${companyModalKey}`}
          company={selectedCompany}
          onClose={() => {
            setShowCompanyModal(false)
            setSelectedCompany(null)
          }}
          onSave={handleSaveCompany}
          onToggle={handleToggleCompany}
          onDelete={handleDeleteCompany}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
      />
    </div>
  )
}