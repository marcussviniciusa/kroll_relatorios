// Mock data for frontend testing without backend

// User mock data
export const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Usuário Teste',
  email: 'usuario@teste.com',
  role: 'admin',
  permissions: ['view_all', 'edit_all', 'create_all', 'delete_all'],
  companies: [
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Empresa Teste',
      industry: 'Tecnologia',
      website: 'https://empresateste.com',
      UserCompany: {
        role: 'admin'
      }
    }
  ],
  settings: {
    theme: 'light',
    language: 'pt-BR',
    notifications: true
  }
};

// Companies mock data
export const mockCompanies = [
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Empresa Teste',
    industry: 'Tecnologia',
    website: 'https://empresateste.com',
    logo: 'https://via.placeholder.com/150',
    address: {
      street: 'Rua Exemplo, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil'
    },
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Empresa Dois',
    industry: 'E-commerce',
    website: 'https://empresadois.com',
    logo: 'https://via.placeholder.com/150',
    address: {
      street: 'Rua Outro Exemplo, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20000-000',
      country: 'Brasil'
    },
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z'
  }
];

// Dashboard mock data
export const mockDashboards = [
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'Dashboard Principal',
    description: 'Visão geral de métricas principais',
    companyId: '123e4567-e89b-12d3-a456-426614174001',
    createdBy: '123e4567-e89b-12d3-a456-426614174000',
    layout: 'grid',
    isPublic: false,
    shareLink: null,
    createdAt: '2023-01-03T00:00:00.000Z',
    updatedAt: '2023-01-03T00:00:00.000Z'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    name: 'Análise de Campanhas',
    description: 'Métricas detalhadas de campanhas de marketing',
    companyId: '123e4567-e89b-12d3-a456-426614174001',
    createdBy: '123e4567-e89b-12d3-a456-426614174000',
    layout: 'grid',
    isPublic: false,
    shareLink: null,
    createdAt: '2023-01-04T00:00:00.000Z',
    updatedAt: '2023-01-04T00:00:00.000Z'
  }
];

// Widgets mock data
export const mockWidgets = [
  {
    id: '123e4567-e89b-12d3-a456-426614174005',
    dashboardId: '123e4567-e89b-12d3-a456-426614174003',
    title: 'Visualizações de Página',
    type: 'line-chart',
    source: 'google-analytics',
    metric: 'pageviews',
    period: 'last-30-days',
    settings: {
      colors: ['#5C6BC0'],
      showLegend: true,
      showGrid: true
    },
    position: {
      x: 0,
      y: 0,
      w: 6,
      h: 4
    },
    createdAt: '2023-01-05T00:00:00.000Z',
    updatedAt: '2023-01-05T00:00:00.000Z'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174006',
    dashboardId: '123e4567-e89b-12d3-a456-426614174003',
    title: 'Engajamento no Facebook',
    type: 'bar-chart',
    source: 'meta',
    metric: 'page_engagement',
    period: 'last-30-days',
    settings: {
      colors: ['#26A69A'],
      showLegend: true,
      showGrid: true
    },
    position: {
      x: 6,
      y: 0,
      w: 6,
      h: 4
    },
    createdAt: '2023-01-06T00:00:00.000Z',
    updatedAt: '2023-01-06T00:00:00.000Z'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174007',
    dashboardId: '123e4567-e89b-12d3-a456-426614174003',
    title: 'Usuários Ativos',
    type: 'kpi',
    source: 'google-analytics',
    metric: 'active-users',
    period: 'current-day',
    settings: {
      color: '#5C6BC0',
      showChange: true,
      changeTimeframe: 'last-day'
    },
    position: {
      x: 0,
      y: 4,
      w: 3,
      h: 2
    },
    createdAt: '2023-01-07T00:00:00.000Z',
    updatedAt: '2023-01-07T00:00:00.000Z'
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174008',
    dashboardId: '123e4567-e89b-12d3-a456-426614174003',
    title: 'Alcance no Facebook',
    type: 'kpi',
    source: 'meta',
    metric: 'page_impressions',
    period: 'current-day',
    settings: {
      color: '#26A69A',
      showChange: true,
      changeTimeframe: 'last-day'
    },
    position: {
      x: 3,
      y: 4,
      w: 3,
      h: 2
    },
    createdAt: '2023-01-08T00:00:00.000Z',
    updatedAt: '2023-01-08T00:00:00.000Z'
  }
];

// Mock data for chart widgets
export const mockChartData = {
  'pageviews': {
    labels: ['01/01', '02/01', '03/01', '04/01', '05/01', '06/01', '07/01', '08/01', '09/01', '10/01'],
    datasets: [
      {
        label: 'Visualizações de Página',
        data: [1200, 1500, 1300, 1700, 1600, 1800, 2000, 1900, 2100, 2200],
        borderColor: '#5C6BC0',
        backgroundColor: 'rgba(92, 107, 192, 0.2)'
      }
    ]
  },
  'page_engagement': {
    labels: ['01/01', '02/01', '03/01', '04/01', '05/01', '06/01', '07/01', '08/01', '09/01', '10/01'],
    datasets: [
      {
        label: 'Engajamento',
        data: [320, 350, 300, 380, 410, 390, 420, 380, 450, 470],
        borderColor: '#26A69A',
        backgroundColor: 'rgba(38, 166, 154, 0.7)'
      }
    ]
  },
  'active-users': {
    value: 1250,
    previousValue: 1100,
    change: 13.64,
    trend: 'up'
  },
  'page_impressions': {
    value: 5800,
    previousValue: 5200,
    change: 11.54,
    trend: 'up'
  }
};

// Meta integrations mock data
export const mockMetaIntegrations = [
  {
    id: '123e4567-e89b-12d3-a456-426614174009',
    companyId: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Facebook Principal',
    accountId: '12345678',
    isActive: true,
    lastSyncedAt: '2023-01-09T00:00:00.000Z',
    createdAt: '2023-01-09T00:00:00.000Z',
    updatedAt: '2023-01-09T00:00:00.000Z'
  }
];

// Google Analytics integrations mock data
export const mockGAIntegrations = [
  {
    id: '123e4567-e89b-12d3-a456-426614174010',
    companyId: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Google Analytics Principal',
    propertyId: 'UA-12345678-1',
    viewId: '123456789',
    isActive: true,
    lastSyncedAt: '2023-01-10T00:00:00.000Z',
    createdAt: '2023-01-10T00:00:00.000Z',
    updatedAt: '2023-01-10T00:00:00.000Z'
  }
];

// Reports mock data
export const mockReports = [
  {
    id: '123e4567-e89b-12d3-a456-426614174011',
    name: 'Relatório Mensal',
    description: 'Relatório completo de performance do mês',
    companyId: '123e4567-e89b-12d3-a456-426614174001',
    dashboardId: '123e4567-e89b-12d3-a456-426614174003',
    format: 'pdf',
    status: 'published',
    createdBy: '123e4567-e89b-12d3-a456-426614174000',
    createdAt: '2023-01-11T00:00:00.000Z',
    updatedAt: '2023-01-11T00:00:00.000Z'
  }
];

// Alerts mock data
export const mockAlerts = [
  {
    id: '123e4567-e89b-12d3-a456-426614174012',
    name: 'Alerta de Baixo Engajamento',
    description: 'Alerta quando o engajamento cair abaixo do limite',
    companyId: '123e4567-e89b-12d3-a456-426614174001',
    metric: 'page_engagement',
    condition: 'less_than',
    threshold: 100,
    frequency: 'daily',
    recipients: ['usuario@teste.com'],
    active: true,
    createdBy: '123e4567-e89b-12d3-a456-426614174000',
    lastTriggeredAt: null,
    createdAt: '2023-01-12T00:00:00.000Z',
    updatedAt: '2023-01-12T00:00:00.000Z'
  }
];
