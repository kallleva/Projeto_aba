const API_BASE_URL = 'http://127.0.0.1:5000/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      console.log('API Request:', { url, config })
      const response = await fetch(url, config)
      console.log('API Response:', { status: response.status, ok: response.ok })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', errorData)
        throw new Error(errorData.erro || `HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error('API Request Failed:', error)
      
      // Verificar se é erro de conectividade
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erro de conectividade. Verifique se o servidor está rodando em http://127.0.0.1:5000')
      }
      
      // Verificar se é erro de rede
      if (error.message.includes('ERR_FAILED') || error.message.includes('Failed to fetch')) {
        throw new Error('Erro de rede. Verifique sua conexão e se o servidor está rodando.')
      }
      
      throw error
    }
  }

  // ========================
  // Usuários
  // ========================
  async getUsers() {
    return this.request('/users')
  }

  async createUser(data) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  // ========================
  // Pacientes
  // ========================
  async getPacientes() {
    return this.request('/pacientes')
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
      console.warn('Endpoint específico de status não encontrado, usando PUT completo:', error.message)
      // Fallback: busca o agendamento atual e atualiza apenas o status
      try {
        const agendamento = await this.getAgendamento(id)
        if (!agendamento) {
          throw new Error('Agendamento não encontrado')
        }
        return await this.updateAgendamento(id, { ...agendamento, status })
      } catch (fallbackError) {
        console.error('Erro no fallback de atualização de status:', fallbackError)
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
      console.warn('Endpoint específico de presença não encontrado, usando PUT completo:', error.message)
      // Fallback: busca o agendamento atual e atualiza apenas a presença
      try {
        const agendamento = await this.getAgendamento(id)
        if (!agendamento) {
          throw new Error('Agendamento não encontrado')
        }
        return await this.updateAgendamento(id, { ...agendamento, presente })
      } catch (fallbackError) {
        console.error('Erro no fallback de atualização de presença:', fallbackError)
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

  async getPacientesProfissional(profissionalId, apenasAtivos = true) {
    const params = new URLSearchParams()
    if (apenasAtivos !== undefined) params.append('apenas_ativos', apenasAtivos)
    
    const url = params.toString() 
      ? `/profissionais/${profissionalId}/pacientes?${params.toString()}`
      : `/profissionais/${profissionalId}/pacientes`
    return this.request(url)
  }

  async getProfissionaisPaciente(pacienteId, apenasAtivos = true) {
    const params = new URLSearchParams()
    if (apenasAtivos !== undefined) params.append('apenas_ativos', apenasAtivos)
    
    const url = params.toString() 
      ? `/pacientes/${pacienteId}/profissionais?${params.toString()}`
      : `/pacientes/${pacienteId}/profissionais`
    return this.request(url)
  }
}

export default new ApiService()
