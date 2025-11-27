import { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  UserPlus, 
  TrendingUp, 
  Calendar,
  Activity,
  ChevronDown,
  ChevronUp,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import ApiService from '@/lib/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardSuperAdmin() {
  const [loading, setLoading] = useState(true);
  const [expandedEmpresa, setExpandedEmpresa] = useState(null);
  const [timeRange, setTimeRange] = useState('30'); // dias
  const [stats, setStats] = useState({
    totalEmpresas: 0,
    totalUsuarios: 0,
    totalPacientes: 0,
    empresasAtivas: 0,
    novasEmpresasMes: 0,
    crescimentoUsuarios: 0
  });
  const [empresas, setEmpresas] = useState([]);
  const [evolucaoEmpresas, setEvolucaoEmpresas] = useState([]);
  const [evolucaoUsuarios, setEvolucaoUsuarios] = useState([]);

  useEffect(() => {
    carregarDados();
  }, [timeRange]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // console.log('[DashboardSuperAdmin] Iniciando carregamento de dados...');
      
      // Carregar estatísticas gerais
      // console.log('[DashboardSuperAdmin] Carregando estatísticas...');
      const statsData = await ApiService.request(`/superadmin/stats?days=${timeRange}`);
      // console.log('[DashboardSuperAdmin] Stats carregadas:', statsData);
      setStats(statsData);

      // Carregar lista de empresas com detalhes
      // console.log('[DashboardSuperAdmin] Carregando empresas...');
      const empresasData = await ApiService.request('/superadmin/empresas');
      // console.log('[DashboardSuperAdmin] Empresas carregadas:', empresasData.length);
      setEmpresas(empresasData);

      // Carregar evolução de empresas
      // console.log('[DashboardSuperAdmin] Carregando evolução de empresas...');
      const evolucaoEmpresasData = await ApiService.request(`/superadmin/evolucao-empresas?days=${timeRange}`);
      // console.log('[DashboardSuperAdmin] Evolução empresas:', evolucaoEmpresasData.length, 'pontos');
      setEvolucaoEmpresas(evolucaoEmpresasData);

      // Carregar evolução de usuários
      // console.log('[DashboardSuperAdmin] Carregando evolução de usuários...');
      const evolucaoUsuariosData = await ApiService.request(`/superadmin/evolucao-usuarios?days=${timeRange}`);
      // console.log('[DashboardSuperAdmin] Evolução usuários:', evolucaoUsuariosData.length, 'pontos');
      setEvolucaoUsuarios(evolucaoUsuariosData);

      // console.log('[DashboardSuperAdmin] ✓ Todos os dados carregados com sucesso!');

    } catch (error) {
      // console.error('[DashboardSuperAdmin] ✗ Erro ao carregar dados:', error);
      alert(`Erro ao carregar dados do Super Admin Dashboard:\n\n${error.message}\n\nVerifique se:\n1. O backend está rodando\n2. Você está logado como SUPERADMIN`);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmpresa = (empresaId) => {
    setExpandedEmpresa(expandedEmpresa === empresaId ? null : empresaId);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Dashboard Super Admin
        </h1>
        <p className="text-gray-600">
          Visão completa do sistema e evolução das empresas
        </p>
      </div>

      {/* Filtro de período */}
      <div className="mb-6 flex gap-2">
        {['7', '30', '90', '365'].map((days) => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === days
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {days === '7' ? '7 dias' : days === '30' ? '30 dias' : days === '90' ? '3 meses' : '1 ano'}
          </button>
        ))}
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Empresas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEmpresas}</p>
              <p className="text-green-600 text-sm mt-1">
                +{stats.novasEmpresasMes} este mês
              </p>
            </div>
            <Building2 className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Usuários</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsuarios}</p>
              <p className="text-green-600 text-sm mt-1">
                +{stats.crescimentoUsuarios}% crescimento
              </p>
            </div>
            <Users className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Pacientes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPacientes}</p>
                <p className="text-gray-500 text-sm mt-1">
                Média {stats.totalEmpresas > 0 ? Math.round(stats.totalPacientes / stats.totalEmpresas) : 0} por empresa
              </p>
            </div>
            <UserPlus className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Empresas Ativas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.empresasAtivas}</p>
                <p className="text-gray-500 text-sm mt-1">
                {stats.totalEmpresas > 0 ? Math.round((stats.empresasAtivas / stats.totalEmpresas) * 100) : 0}% do total
              </p>
            </div>
            <Activity className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Gráficos de evolução */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Evolução de Empresas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Evolução de Empresas
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucaoEmpresas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Total de Empresas"
              />
              <Line 
                type="monotone" 
                dataKey="novas" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Novas Empresas"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Evolução de Usuários */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-600" />
            Evolução de Usuários e Pacientes
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={evolucaoUsuarios}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="usuarios" fill="#10b981" name="Usuários" />
              <Bar dataKey="pacientes" fill="#8b5cf6" name="Pacientes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lista de empresas detalhada */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          Empresas Cadastradas
        </h2>

        <div className="space-y-4">
          {empresas.map((empresa) => (
            <div key={empresa.id} className="border rounded-lg overflow-hidden">
              {/* Header da empresa */}
              <button
                onClick={() => toggleEmpresa(empresa.id)}
                className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${empresa.ativo ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div className="text-left">
                    <h3 className="font-bold text-lg text-gray-900">{empresa.nome}</h3>
                    <p className="text-sm text-gray-600">{empresa.cnpj}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Criada em</p>
                    <p className="font-medium text-gray-900">{formatarData(empresa.criado_em)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{empresa.total_usuarios}</p>
                      <p className="text-xs text-gray-600">Usuários</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{empresa.total_pacientes}</p>
                      <p className="text-xs text-gray-600">Pacientes</p>
                    </div>
                  </div>
                  {expandedEmpresa === empresa.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Detalhes expandidos */}
              {expandedEmpresa === empresa.id && (
                <div className="px-6 py-4 border-t bg-white">
                  {/* Informações da empresa */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Informações da Empresa</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 text-gray-900">{empresa.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Telefone:</span>
                        <span className="ml-2 text-gray-900">{empresa.telefone}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Endereço:</span>
                        <span className="ml-2 text-gray-900">{empresa.endereco}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className={`ml-2 font-medium ${empresa.ativo ? 'text-green-600' : 'text-red-600'}`}>
                          {empresa.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Usuários */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Usuários ({empresa.usuarios?.length || 0})
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {empresa.usuarios?.map((usuario) => (
                        <div key={usuario.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{usuario.nome}</p>
                            <p className="text-sm text-gray-600">{usuario.email}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              usuario.tipo_usuario === 'ADMIN' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {usuario.tipo_usuario}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              usuario.ativo 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {usuario.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pacientes */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Pacientes ({empresa.pacientes?.length || 0})
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {empresa.pacientes?.map((paciente) => (
                        <div key={paciente.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{paciente.nome}</p>
                            <p className="text-sm text-gray-600">
                              {paciente.data_nascimento ? `Nascido em ${formatarData(paciente.data_nascimento)}` : 'Data não informada'}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              paciente.ativo 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {paciente.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
