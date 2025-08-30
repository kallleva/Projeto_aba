import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck, Target, ClipboardList, TrendingUp, Calendar } from 'lucide-react'

export default function Dashboard() {
  // Dados mockados para demonstração
  const stats = [
    {
      title: 'Total de Pacientes',
      value: '24',
      description: 'Pacientes ativos no sistema',
      icon: Users,
      trend: '+2 este mês'
    },
    {
      title: 'Profissionais',
      value: '8',
      description: 'Profissionais cadastrados',
      icon: UserCheck,
      trend: '+1 este mês'
    },
    {
      title: 'Metas Ativas',
      value: '47',
      description: 'Metas em andamento',
      icon: Target,
      trend: '+5 esta semana'
    },
    {
      title: 'Registros Hoje',
      value: '12',
      description: 'Registros diários feitos hoje',
      icon: ClipboardList,
      trend: '75% das metas'
    }
  ]

  const recentActivities = [
    {
      patient: 'Ana Silva',
      activity: 'Registro diário completado',
      meta: 'Comunicação verbal',
      score: 4,
      time: '2 horas atrás'
    },
    {
      patient: 'João Santos',
      activity: 'Nova meta criada',
      meta: 'Concentração em atividades',
      score: null,
      time: '4 horas atrás'
    },
    {
      patient: 'Maria Oliveira',
      activity: 'Registro diário completado',
      meta: 'Interação social',
      score: 5,
      time: '6 horas atrás'
    }
  ]

  const upcomingTasks = [
    {
      task: 'Revisão do plano terapêutico - Ana Silva',
      date: 'Amanhã',
      priority: 'alta'
    },
    {
      task: 'Relatório mensal - João Santos',
      date: 'Em 2 dias',
      priority: 'média'
    },
    {
      task: 'Avaliação de progresso - Maria Oliveira',
      date: 'Em 3 dias',
      priority: 'baixa'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do sistema de acompanhamento terapêutico
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="flex items-center pt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Atividades recentes */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas atividades registradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.patient}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.activity} - {activity.meta}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {activity.score && (
                      <Badge variant="secondary">
                        Nota: {activity.score}/5
                      </Badge>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tarefas pendentes */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Próximas Tarefas</CardTitle>
            <CardDescription>
              Tarefas e compromissos agendados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {task.task}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {task.date}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      task.priority === 'alta' ? 'destructive' :
                      task.priority === 'média' ? 'default' : 'secondary'
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

