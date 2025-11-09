import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertCircle, Building2, Plus, Edit2, Trash2, Eye, X } from 'lucide-react'
import ApiService from '@/lib/api'

const STATUS_OPTIONS = {
  ATIVA: { label: 'Ativa', color: 'bg-green-100 text-green-800' },
  INATIVA: { label: 'Inativa', color: 'bg-gray-100 text-gray-800' },
  SUSPENSA: { label: 'Suspensa', color: 'bg-red-100 text-red-800' },
}

const PLANO_OPTIONS = {
  BASICO: { label: 'Básico', features: ['Até 10 pacientes', 'Funcionalidades básicas'] },
  PROFISSIONAL: { label: 'Profissional', features: ['Até 50 pacientes', 'Todos os relatórios'] },
  ENTERPRISE: { label: 'Enterprise', features: ['Pacientes ilimitados', 'Suporte dedicado'] },
}

export default function Empresas() {
  const { user } = useAuth()
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedEmpresa, setSelectedEmpresa] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    responsavel: '',
    status: 'ATIVA',
    plano: 'PROFISSIONAL',
  })

  useEffect(() => {
    loadEmpresas()
  }, [])

  const loadEmpresas = async () => {
    try {
      setLoading(true)
      console.log('Iniciando carregamento de empresas...')
      const data = await ApiService.getEmpresas()
      console.log('Dados retornados pela API:', data)
      console.log('Tipo de data:', typeof data)
      console.log('data.empresas:', data.empresas)
      setEmpresas(data.empresas || data || [])
      setError(null)
    } catch (err) {
      console.error('Erro completo:', err)
      console.error('Erro message:', err.message)
      console.error('Erro data:', err.data)
      console.error('Erro status:', err.status)
      console.error('Erro stack:', err.stack)
      
      // Exibir erro detalhado na tela
      let mensagemErro = 'Erro ao carregar empresas'
      if (err.data?.erro) {
        mensagemErro = `Erro ao carregar empresas: ${err.data.erro}`
      } else if (err.message) {
        mensagemErro = `Erro ao carregar empresas: ${err.message}`
      }
      setError(mensagemErro)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      if (editingId) {
        await ApiService.updateEmpresa(editingId, formData)
      } else {
        await ApiService.createEmpresa(formData)
      }
      
      await loadEmpresas()
      setFormData({
        nome: '',
        cnpj: '',
        email: '',
        telefone: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        responsavel: '',
        status: 'ATIVA',
        plano: 'PROFISSIONAL',
      })
      setShowForm(false)
      setEditingId(null)
      setError(null)
    } catch (err) {
      setError(err.message || 'Erro ao salvar empresa')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (empresa) => {
    setFormData(empresa)
    setEditingId(empresa.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta empresa? Esta ação é irreversível!')) {
      try {
        setLoading(true)
        await ApiService.deleteEmpresa(id)
        await loadEmpresas()
      } catch (err) {
        setError('Erro ao deletar empresa')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleViewDetails = async (id) => {
    try {
      const empresa = await ApiService.getEmpresa(id)
      setSelectedEmpresa(empresa)
      setShowDetails(true)
    } catch (err) {
      setError('Erro ao carregar detalhes da empresa')
      console.error(err)
    }
  }

  // Verificar permissão de ADMIN
  if (user?.tipo_usuario !== 'ADMIN') {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              Acesso Negado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-red-600">
            Apenas administradores podem gerenciar empresas.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            Gerenciamento de Empresas
          </h1>
          <p className="text-gray-500 mt-1">Gerencie todas as empresas do sistema</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-600">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Empresa' : 'Nova Empresa'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Empresa *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Clínica Aurora"
                    required
                  />
                </div>

                {/* CNPJ */}
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    placeholder="Ex: 00.000.000/0000-00"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ex: contato@empresa.com"
                    required
                  />
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="Ex: (11) 99999-9999"
                  />
                </div>

                {/* Endereço */}
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    placeholder="Ex: Rua Principal, 100"
                  />
                </div>

                {/* Cidade */}
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    placeholder="Ex: São Paulo"
                  />
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    placeholder="Ex: SP"
                    maxLength="2"
                  />
                </div>

                {/* CEP */}
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    placeholder="Ex: 01310-100"
                  />
                </div>

                {/* Responsável */}
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input
                    id="responsavel"
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    placeholder="Ex: João Silva"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_OPTIONS).map(([key, val]) => (
                        <SelectItem key={key} value={key}>{val.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Plano */}
                <div className="space-y-2">
                  <Label htmlFor="plano">Plano</Label>
                  <Select value={formData.plano} onValueChange={(value) => setFormData({ ...formData, plano: value })}>
                    <SelectTrigger id="plano">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PLANO_OPTIONS).map(([key, val]) => (
                        <SelectItem key={key} value={key}>{val.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Empresas Grid */}
      {loading && !empresas.length ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            Carregando empresas...
          </CardContent>
        </Card>
      ) : empresas.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            Nenhuma empresa encontrada. Crie uma nova empresa para começar.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {empresas.map((empresa) => (
            <Card key={empresa.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{empresa.nome}</CardTitle>
                    <CardDescription className="mt-1">
                      {empresa.cnpj && `CNPJ: ${empresa.cnpj}`}
                    </CardDescription>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_OPTIONS[empresa.status]?.color}`}>
                    {STATUS_OPTIONS[empresa.status]?.label}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Plano */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Plano:</span>
                  <span className="text-sm font-semibold text-blue-600">{PLANO_OPTIONS[empresa.plano]?.label}</span>
                </div>

                {/* Email */}
                {empresa.email && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm truncate">{empresa.email}</span>
                  </div>
                )}

                {/* Telefone */}
                {empresa.telefone && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Telefone:</span>
                    <span className="text-sm">{empresa.telefone}</span>
                  </div>
                )}

                {/* Cidade */}
                {empresa.cidade && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cidade:</span>
                    <span className="text-sm">{empresa.cidade} - {empresa.estado}</span>
                  </div>
                )}

                {/* Estatísticas */}
                <div className="pt-2 border-t border-gray-200 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{empresa.total_usuarios || 0}</div>
                    <div className="text-xs text-gray-500">Usuários</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{empresa.total_profissionais || 0}</div>
                    <div className="text-xs text-gray-500">Profissionais</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{empresa.total_pacientes || 0}</div>
                    <div className="text-xs text-gray-500">Pacientes</div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(empresa.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Detalhes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(empresa)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(empresa.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detalhes Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEmpresa?.nome}</DialogTitle>
            <DialogDescription>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${STATUS_OPTIONS[selectedEmpresa?.status]?.color}`}>
                {STATUS_OPTIONS[selectedEmpresa?.status]?.label}
              </span>
            </DialogDescription>
          </DialogHeader>
          {selectedEmpresa && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">CNPJ</label>
                  <p className="font-semibold">{selectedEmpresa.cnpj || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="font-semibold">{selectedEmpresa.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Telefone</label>
                  <p className="font-semibold">{selectedEmpresa.telefone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Plano</label>
                  <p className="font-semibold text-blue-600">{PLANO_OPTIONS[selectedEmpresa.plano]?.label}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Endereço</label>
                  <p className="font-semibold">
                    {selectedEmpresa.endereco}, {selectedEmpresa.cidade} - {selectedEmpresa.estado}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Responsável</label>
                  <p className="font-semibold">{selectedEmpresa.responsavel || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
