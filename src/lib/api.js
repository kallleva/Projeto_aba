const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://auroraclin.com.br/api').replace(/\/$/, '')
//const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://auroraclin.com.br/api').replace(/\/$/, '')
class ApiService {
  async request(endpoint, options = {}) {
    // Remove barra inicial e final para evitar duplas barras
    const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, '')
    const url = `${API_BASE_URL}/${cleanEndpoint}`
    const token = localStorage.getItem('token')
    // console.log('🔐 Token obtido:', token ? '✓ Presente' : '✗ Ausente')
    
    // Se for FormData, não definir Content-Type (browser define automaticamente)
    const headers = options.isFormData 
      ? {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        }
      : {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        }
    
    const config = {
      headers,
      ...options,
    }
    
    // Remover a flag isFormData do config
    delete config.isFormData

    try {
      // console.log('🔗 [API] Requisição:', { url, endpoint, cleanEndpoint })
      const response = await fetch(url, config)
      // console.log('📨 [API] Resposta recebida:', { status: response.status, ok: response.ok })
      
      // Log do Content-Type para debug
      const contentType = response.headers.get('content-type')
      // console.log('📄 [API] Content-Type:', contentType)
      
      // Log de headers importantes
      // console.log('🔐 [API] Headers:', {
      //     authorization: config.headers.Authorization ? '✓ Presente' : '✗ Ausente',
      //     contentType: contentType,
      //     statusCode: response.status
      // })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // console.error('API Error:', errorData)
        
        // Log especial para erro 401
        if (response.status === 401) {
          // console.error('❌ [401 UNAUTHORIZED] Token inválido ou ausente. Verifique o localStorage "token".')
        }
        
        // Criar erro com código de status
        const error = new Error(errorData.erro || `HTTP error! status: ${response.status}`)
        error.status = response.status
        error.data = errorData
        throw error
      }

      // Log do body antes de fazer parse
      const text = await response.text()
      // console.log('API Response Body (first 500 chars):', text.substring(0, 500))
      
      try {
        return JSON.parse(text)
      } catch (parseError) {
        // console.error('JSON Parse Error:', parseError)
        // console.error('Raw response:', text)
        throw new Error(`Invalid JSON response: ${parseError.message}`)
      }
    } catch (error) {
      // console.error('API Request Failed:', error)
      
      // Verificar se é erro de conectividade
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Erro de conectividade. Verifique se o servidor está acessível em ${API_BASE_URL}`)
      }
      
      // Verificar se é erro de rede
      if (error.message.includes('ERR_FAILED') || error.message.includes('Failed to fetch')) {
        throw new Error('Erro de rede. Verifique sua conexão e se o servidor está rodando.')
      }
      
      throw error
    }
  }

  // ========================
  // Métodos genéricos
  // ========================
  async get(endpoint) {
    return this.request(endpoint)
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    })
  }

  // ========================
  // Usuários
  // ========================
  async getUsers() {
    return this.request('/users')
  }

  // API para listar usuarios completos (backend 'usuarios' para model Usuario)
  async getUsuarios(q = '') {
    const params = q ? `?q=${encodeURIComponent(q)}` : ''
    return this.request(`/usuarios${params}`)
  }

  async getUsuario(id) {
    return this.request(`/usuarios/${id}`)
  }

  async createUsuario(data) {
    return this.request('/usuarios', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateUsuario(id, data) {
    return this.request(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteUsuario(id) {
    return this.request(`/usuarios/${id}`, {
      method: 'DELETE',
    })
  }

  async assignUsuarioToPaciente(usuarioId, pacienteId) {
    return this.request(`/usuarios/${usuarioId}/assign-paciente/${pacienteId}`, {
      method: 'PUT'
    })
  }


  // ========================
  // Pacientes
  // ========================
  async getPacientes() {
    return this.request('/pacientes')
  }

  async getPaciente(id) {
    return this.request(`/pacientes/${id}`)
  }

  async getMetasEFormulariosPaciente(pacienteId) {
    return this.request(`/pacientes/${pacienteId}/metas-e-formularios`)
  }

  async createPaciente(data) {
    return this.request('/pacientes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePaciente(id, data) {
    return this.request(`/pacientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deletePaciente(id) {
    return this.request(`/pacientes/${id}`, {
      method: 'DELETE',
    })
  }

  // ========================
  // Profissionais
  // ========================
  async getProfissionais() {
    return this.request('/profissionais')
  }

  async createProfissional(data) {
    return this.request('/profissionais', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProfissional(id, data) {
    return this.request(`/profissionais/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProfissional(id) {
    return this.request(`/profissionais/${id}`, {
      method: 'DELETE',
    })
  }

  // ========================
  // Planos Terapêuticos
  // ========================
  async getPlanosTerapeuticos() {
    return this.request('/planos-terapeuticos')
  }

  async createPlanoTerapeutico(data) {
    return this.request('/planos-terapeuticos', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePlanoTerapeutico(id, data) {
    return this.request(`/planos-terapeuticos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deletePlanoTerapeutico(id) {
    return this.request(`/planos-terapeuticos/${id}`, {
      method: 'DELETE',
    })
  }

  // ========================
  // Metas Terapêuticas
  // ========================
  async getMetasTerapeuticas() {
    return this.request('/metas-terapeuticas')
  }

  async getMetasAtivas() {
    return this.request('/metas-terapeuticas?status=EmAndamento')
  }

  async createMetaTerapeutica(data) {
    return this.request('/metas-terapeuticas', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateMetaTerapeutica(id, data) {
    return this.request(`/metas-terapeuticas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteMetaTerapeutica(id) {
    return this.request(`/metas-terapeuticas/${id}`, {
      method: 'DELETE',
    })
  }

  async concluirMeta(id) {
    return this.request(`/metas-terapeuticas/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'Concluida' }),
    })
  }

  // ========================
  // Checklist Diário
  // ========================
  async getChecklistsDiarios() {
    return this.request('/checklists-diarios')
  }

  // Endpoint otimizado para grid - sem respostas, mais rápido
  async getChecklistsDiariosResumo() {
    return this.request('/checklists-diarios/resumo')
  }

  async getChecklistDiario(id) {
    return this.request(`/checklists-diarios/${id}`)
  }

  async getChecklistsPorMeta(metaId) {
    return this.request(`/checklists-diarios/meta/${metaId}`)
  }

  async createChecklistDiario(data) {
    return this.request('/checklists-diarios', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateChecklistDiario(id, data) {
    return this.request(`/checklists-diarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteChecklistDiario(id) {
    return this.request(`/checklists-diarios/${id}`, {
      method: 'DELETE',
    })
  }

  // ========================
  // Anexos de Checklist
  // ========================
  async uploadAnexoChecklist(checklistId, arquivo, descricao = '') {
    const formData = new FormData()
    formData.append('arquivo', arquivo)
    formData.append('checklist_id', checklistId)
    if (descricao) formData.append('descricao', descricao)
    
    return this.request('/anexos-checklist', {
      method: 'POST',
      body: formData,
      // Não enviar Content-Type, o browser define automaticamente para multipart/form-data
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      isFormData: true
    })
  }

  async getAnexosChecklist(checklistId) {
    return this.request(`/checklists-diarios/${checklistId}/anexos`)
  }

  async deleteAnexoChecklist(anexoId) {
    return this.request(`/anexos-checklist/${anexoId}`, {
      method: 'DELETE',
    })
  }

  getAnexoDownloadUrl(anexoId) {
    return `${this.baseURL}/anexos-checklist/${anexoId}/download`
  }

  // Métodos para fórmulas de checklist
  async getFormulasChecklist(checklistId) {
    return this.request(`/checklists-diarios/${checklistId}/formulas`)
  }

  async getFormulasMetaChecklist(metaId, dataInicio = null, dataFim = null) {
    let url = `/checklists-diarios/meta/${metaId}/formulas`
    const params = new URLSearchParams()
    
    if (dataInicio) params.append('data_inicio', dataInicio)
    if (dataFim) params.append('data_fim', dataFim)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    return this.request(url)
  }

  // ========================
  // Relatórios
  // ========================
  async getDadosDashboard() {
    return this.request('/relatorios/dashboard')
  }

  async getEvolucaoMeta(metaId, dataInicio = null, dataFim = null) {
    let url = `/relatorios/evolucao-meta/${metaId}`
    const params = new URLSearchParams()
    
    if (dataInicio) params.append('data_inicio', dataInicio)
    if (dataFim) params.append('data_fim', dataFim)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    return this.request(url)
  }

  async getRelatorioPaciente(pacienteId) {
    return this.request(`/relatorios/paciente/${pacienteId}`)
  }

  async getRelatorioProfissional(profissionalId) {
    return this.request(`/relatorios/profissional/${profissionalId}`)
  }

  async getRelatorioPeriodo(dataInicio, dataFim) {
    const params = new URLSearchParams({
      data_inicio: dataInicio,
      data_fim: dataFim
    })
    return this.request(`/relatorios/periodo?${params.toString()}`)
  }

  // ========================
  // Relatórios de Fórmulas
  // ========================
  async getFormulasMeta(metaId, dataInicio = null, dataFim = null) {
    let url = `/relatorios/formulas/${metaId}`
    const params = new URLSearchParams()
    
    if (dataInicio) params.append('data_inicio', dataInicio)
    if (dataFim) params.append('data_fim', dataFim)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    return this.request(url)
  }

  async getEvolucaoFormula(perguntaId, dataInicio = null, dataFim = null) {
    let url = `/relatorios/formulas/evolucao/${perguntaId}`
    const params = new URLSearchParams()
    
    if (dataInicio) params.append('data_inicio', dataInicio)
    if (dataFim) params.append('data_fim', dataFim)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    return this.request(url)
  }

  async getFormulasChecklist(checklistId) {
    return this.request(`/checklists-diarios/${checklistId}/formulas`)
  }

  async getFormulasMetaChecklist(metaId, dataInicio = null, dataFim = null) {
    let url = `/checklists-diarios/meta/${metaId}/formulas`
    const params = new URLSearchParams()
    
    if (dataInicio) params.append('data_inicio', dataInicio)
    if (dataFim) params.append('data_fim', dataFim)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    return this.request(url)
  }

  // ========================
  // Formulários
  // ========================
  async getFormularios() {
    return this.request('/formularios')
  }

  async getFormulario(id) {
    return this.request(`/formularios/${id}`)
  }

  async createFormulario(data) {
    return this.request('/formularios', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateFormulario(id, data) {
    return this.request(`/formularios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteFormulario(id) {
    return this.request(`/formularios/${id}`, {
      method: 'DELETE',
    })
  }

  // ========================
  // Agenda
  // ========================
  async getAgendamentos(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    const url = params.toString() ? `/agenda?${params.toString()}` : '/agenda'
    return this.request(url)
  }

  async getAgendamento(id) {
    return this.request(`/agenda/${id}`)
  }

  async createAgendamento(data) {
    return this.request('/agenda', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateAgendamento(id, data) {
    return this.request(`/agenda/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteAgendamento(id) {
    return this.request(`/agenda/${id}`, {
      method: 'DELETE',
    })
  }

  async updateStatusAgendamento(id, status) {
    try {
      // Tenta primeiro o endpoint específico de status
      return await this.request(`/agenda/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
    } catch (error) {
        // console.warn('Endpoint específico de status não encontrado, usando PUT completo:', error.message)
      // Fallback: busca o agendamento atual e atualiza apenas o status
      try {
        const agendamento = await this.getAgendamento(id)
        if (!agendamento) {
          throw new Error('Agendamento não encontrado')
        }
        return await this.updateAgendamento(id, { ...agendamento, status })
      } catch (fallbackError) {
          // console.error('Erro no fallback de atualização de status:', fallbackError)
        throw new Error(`Erro ao atualizar status: ${fallbackError.message}`)
      }
    }
  }

  async updatePresencaAgendamento(id, presente) {
    try {
      // Tenta primeiro o endpoint específico de presença
      return await this.request(`/agenda/${id}/presenca`, {
        method: 'PATCH',
        body: JSON.stringify({ presente }),
      })
    } catch (error) {
        // console.warn('Endpoint específico de presença não encontrado, usando PUT completo:', error.message)
      // Fallback: busca o agendamento atual e atualiza apenas a presença
      try {
        const agendamento = await this.getAgendamento(id)
        if (!agendamento) {
          throw new Error('Agendamento não encontrado')
        }
        return await this.updateAgendamento(id, { ...agendamento, presente })
      } catch (fallbackError) {
          // console.error('Erro no fallback de atualização de presença:', fallbackError)
        throw new Error(`Erro ao atualizar presença: ${fallbackError.message}`)
      }
    }
  }

  async getAgendamentosPorMes(ano, mes, filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    const url = params.toString() 
      ? `/agenda/mes/${ano}/${mes}?${params.toString()}`
      : `/agenda/mes/${ano}/${mes}`
    return this.request(url)
  }

  async getAgendamentosPorDia(data, filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    const url = params.toString() 
      ? `/agenda/dia/${data}?${params.toString()}`
      : `/agenda/dia/${data}`
    return this.request(url)
  }

  // ========================
  // Vínculos Profissional-Paciente
  // ========================
  async getVinculos(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    const url = params.toString() ? `/vinculos?${params.toString()}` : '/vinculos'
    return this.request(url)
  }

  async getVinculo(id) {
    return this.request(`/vinculos/${id}`)
  }

  async createVinculo(data) {
    return this.request('/vinculos', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateVinculo(id, data) {
    return this.request(`/vinculos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteVinculo(id) {
    return this.request(`/vinculos/${id}`, {
      method: 'DELETE',
    })
  }

  async ativarVinculo(id) {
    return this.request(`/vinculos/${id}/ativar`, {
      method: 'POST',
    })
  }

  async inativarVinculo(id, dataFim = null) {
    return this.request(`/vinculos/${id}/inativar`, {
      method: 'POST',
      body: JSON.stringify({ data_fim: dataFim }),
    })
  }

  async suspenderVinculo(id) {
    return this.request(`/vinculos/${id}/suspender`, {
      method: 'POST',
    })
  }

  async getPacientesProfissional(profissionalId, apenasAtivos = false) {
    const params = new URLSearchParams()
    if (apenasAtivos !== undefined) params.append('apenas_ativos', apenasAtivos)
    
    const url = params.toString() 
      ? `/profissionais/${profissionalId}/pacientes?${params.toString()}`
      : `/profissionais/${profissionalId}/pacientes`
    return this.request(url)
  }

  async getProfissionaisPaciente(pacienteId, apenasAtivos = false) {
    const params = new URLSearchParams()
    if (apenasAtivos !== undefined) params.append('apenas_ativos', apenasAtivos)
    
    const url = params.toString() 
      ? `/pacientes/${pacienteId}/profissionais?${params.toString()}`
      : `/pacientes/${pacienteId}/profissionais`
    return this.request(url)
  }

  // ========================
  // Empresas (Multi-Tenancy)
  // ========================
  async getEmpresas() {
    return this.request('/empresas')
  }

  async getEmpresa(id) {
    return this.request(`/empresas/${id}`)
  }

  async createEmpresa(data) {
    return this.request('/empresas', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateEmpresa(id, data) {
    return this.request(`/empresas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteEmpresa(id) {
    return this.request(`/empresas/${id}`, {
      method: 'DELETE',
    })
  }

  async getUsuariosEmpresa(empresaId) {
    return this.request(`/empresas/${empresaId}/usuarios`)
  }

  async getEstatisticasEmpresa(empresaId) {
    return this.request(`/empresas/${empresaId}/estatisticas`)
  }

  // ========================
  // Assistente IA
  // ========================
  async askAI(question, pacienteId = null, contextoAdicional = null) {
    const body = { question }
    if (pacienteId) body.paciente_id = pacienteId
    if (contextoAdicional) body.contexto_adicional = contextoAdicional
    return this.request('/ai/ask', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  // ========================
  // Tabulação de Formulários
  // ========================
  async getTabulacoes(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    const url = params.toString() ? `/tabulacao?${params.toString()}` : '/tabulacao'
    return this.request(url)
  }

  async getTabulacao(id) {
    return this.request(`/tabulacao/${id}`)
  }

  async createTabulacao(data) {
    return this.request('/tabulacao', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTabulacao(id, data) {
    return this.request(`/tabulacao/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTabulacao(id) {
    return this.request(`/tabulacao/${id}`, {
      method: 'DELETE',
    })
  }

  // ========================
  // Respostas de Tabulação
  // ========================
  async listarRespostasTabulacao(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    const url = params.toString() ? `/resposta-tabulacao?${params.toString()}` : '/resposta-tabulacao'
    return this.request(url)
  }

  async getRespostaTabulacao(id) {
    return this.request(`/resposta-tabulacao/${id}`)
  }

  async createRespostaTabulacao(data) {
    return this.request('/resposta-tabulacao', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateRespostaTabulacao(id, data) {
    return this.request(`/resposta-tabulacao/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteRespostaTabulacao(id) {
    return this.request(`/resposta-tabulacao/${id}`, {
      method: 'DELETE',
    })
  }
}

export default new ApiService()
