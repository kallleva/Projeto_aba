const API_BASE_URL = 'https://zmhqivcg0d3q.manus.space/api'

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

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.erro || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Métodos para Pacientes
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

  // Métodos para Profissionais
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

  // Métodos para Planos Terapêuticos
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

  // Métodos para Metas Terapêuticas
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

  // Métodos para Checklist Diário
  async getChecklistsDiarios() {
    return this.request('/checklists-diarios')
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

  // Métodos para Relatórios
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
}

export default new ApiService()

