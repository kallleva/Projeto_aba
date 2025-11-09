import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import ApiService from '@/lib/api'
import '@/App.css'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tipo_usuario: '',
    senha: '',
    ativo: true
  })

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getUsuarios()
      setUsuarios(data)
    } catch (error) {
      toast.error('Erro ao carregar usuários: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (value) => {
    setSearchQuery(value)
    if (value.trim()) {
      try {
        const data = await ApiService.getUsuarios(value)
        setUsuarios(data)
      } catch (error) {
        toast.error('Erro ao buscar: ' + error.message)
      }
    } else {
      loadUsuarios()
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      tipo_usuario: '',
      senha: '',
      ativo: true
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (usuario) => {
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      senha: '',
      ativo: usuario.ativo
    })
    setEditingId(usuario.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validações
    if (!formData.nome || !formData.email || !formData.tipo_usuario) {
      toast.error('Nome, email e tipo de usuário são obrigatórios')
      return
    }

    if (!editingId && !formData.senha) {
      toast.error('Senha é obrigatória para novo usuário')
      return
    }

    try {
      if (editingId) {
        // Atualizar
        const updateData = {
          nome: formData.nome,
          email: formData.email,
          tipo_usuario: formData.tipo_usuario,
          ativo: formData.ativo
        }
        if (formData.senha) {
          updateData.senha = formData.senha
        }
        await ApiService.updateUsuario(editingId, updateData)
        toast.success('Usuário atualizado com sucesso')
      } else {
        // Criar
        await ApiService.createUsuario(formData)
        toast.success('Usuário criado com sucesso')
      }
      resetForm()
      loadUsuarios()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await ApiService.deleteUsuario(id)
        toast.success('Usuário deletado com sucesso')
        loadUsuarios()
      } catch (error) {
        toast.error('Erro ao deletar: ' + error.message)
      }
    }
  }

  const getTipoUsuarioBadge = (tipo) => {
    const colors = {
      ADMIN: 'bg-red-100 text-red-800',
      PROFISSIONAL: 'bg-blue-100 text-blue-800',
      RESPONSAVEL: 'bg-green-100 text-green-800'
    }
    return colors[tipo] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="page-section">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Gestão de Usuários</h1>
          <p className="page-subtitle">Gerencie os usuários do sistema</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="h-10 px-4 bg-[#0ea5e9] text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Busque por nome ou email..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Modal/Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="form-group">
                <Label className="block text-sm font-medium text-gray-700 mb-1">Nome *</Label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Digite o nome"
                  className="h-10"
                />
              </div>

              <div className="form-group">
                <Label className="block text-sm font-medium text-gray-700 mb-1">Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Digite o email"
                  className="h-10"
                />
              </div>

              <div className="form-group">
                <Label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuário *</Label>
                <Select value={formData.tipo_usuario} onValueChange={(value) => setFormData({ ...formData, tipo_usuario: value })}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="PROFISSIONAL">Profissional</SelectItem>
                    <SelectItem value="RESPONSAVEL">Responsável</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha {editingId ? '(deixe em branco para não alterar)' : '*'}
                </Label>
                <Input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  placeholder={editingId ? 'Nova senha (opcional)' : 'Digite a senha'}
                  className="h-10"
                />
              </div>

              <div className="form-group">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700">Usuário ativo</span>
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-lg bg-[#0ea5e9] text-white hover:bg-blue-600 font-medium"
                >
                  {editingId ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card-spacing">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Carregando...</div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Nenhum usuário encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="font-medium text-gray-900">{usuario.nome}</td>
                    <td className="text-gray-600">{usuario.email}</td>
                    <td>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getTipoUsuarioBadge(usuario.tipo_usuario)}`}>
                        {usuario.tipo_usuario}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${usuario.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {usuario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="p-2 text-[#0ea5e9] hover:bg-blue-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(usuario.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
