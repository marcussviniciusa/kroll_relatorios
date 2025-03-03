import { 
  mockUser, 
  mockCompanies, 
  mockDashboards, 
  mockWidgets,
  mockChartData,
  mockMetaIntegrations,
  mockGAIntegrations,
  mockReports,
  mockAlerts 
} from './mockData';

// Simulando um delay de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Service
const mockApiService = {
  // Auth endpoints
  auth: {
    login: async (email, password) => {
      await delay(500);
      if (email === 'usuario@teste.com' && password === 'senha123') {
        return {
          user: mockUser,
          token: 'mock-jwt-token'
        };
      } else {
        throw new Error('Credenciais inválidas');
      }
    },
    register: async (userData) => {
      await delay(800);
      return {
        user: {
          ...mockUser,
          ...userData
        },
        token: 'mock-jwt-token'
      };
    },
    me: async () => {
      await delay(300);
      return { user: mockUser };
    },
    forgotPassword: async (email) => {
      await delay(500);
      return { message: 'Email de redefinição de senha enviado' };
    },
    resetPassword: async (token, password) => {
      await delay(500);
      return { message: 'Senha redefinida com sucesso' };
    }
  },

  // Users endpoints
  users: {
    getAll: async () => {
      await delay(500);
      return { users: [mockUser, {...mockUser, id: '999', name: 'Outro Usuário', email: 'outro@teste.com'}] };
    },
    getById: async (id) => {
      await delay(300);
      return { user: mockUser };
    },
    update: async (id, userData) => {
      await delay(500);
      return { 
        user: {
          ...mockUser,
          ...userData
        }
      };
    },
    updateProfile: async (userData) => {
      await delay(500);
      return { 
        user: {
          ...mockUser,
          ...userData
        }
      };
    },
    changePassword: async (currentPassword, newPassword) => {
      await delay(500);
      return { message: 'Senha alterada com sucesso' };
    }
  },

  // Companies endpoints
  companies: {
    getAll: async () => {
      await delay(500);
      return { companies: mockCompanies };
    },
    getById: async (id) => {
      await delay(300);
      const company = mockCompanies.find(c => c.id === id) || mockCompanies[0];
      return { company };
    },
    create: async (companyData) => {
      await delay(800);
      return { 
        company: {
          id: 'new-company-id',
          ...companyData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    },
    update: async (id, companyData) => {
      await delay(500);
      return { 
        company: {
          ...(mockCompanies.find(c => c.id === id) || mockCompanies[0]),
          ...companyData,
          updatedAt: new Date().toISOString()
        }
      };
    },
    delete: async (id) => {
      await delay(500);
      return { message: 'Empresa excluída com sucesso' };
    }
  },

  // Dashboards endpoints
  dashboards: {
    getAll: async () => {
      await delay(500);
      return { dashboards: mockDashboards };
    },
    getById: async (id) => {
      await delay(300);
      const dashboard = mockDashboards.find(d => d.id === id) || mockDashboards[0];
      const dashboardWidgets = mockWidgets.filter(w => w.dashboardId === dashboard.id);
      return { 
        dashboard,
        widgets: dashboardWidgets
      };
    },
    create: async (dashboardData) => {
      await delay(800);
      return { 
        dashboard: {
          id: 'new-dashboard-id',
          ...dashboardData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    },
    update: async (id, dashboardData) => {
      await delay(500);
      return { 
        dashboard: {
          ...(mockDashboards.find(d => d.id === id) || mockDashboards[0]),
          ...dashboardData,
          updatedAt: new Date().toISOString()
        }
      };
    },
    delete: async (id) => {
      await delay(500);
      return { message: 'Dashboard excluído com sucesso' };
    },
    share: async (id, shareOptions) => {
      await delay(500);
      return { 
        shareLink: `https://app.kroll.com/dashboard/share/${id}?token=mock-share-token`
      };
    }
  },

  // Widgets endpoints
  widgets: {
    create: async (widgetData) => {
      await delay(800);
      return { 
        widget: {
          id: 'new-widget-id',
          ...widgetData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    },
    update: async (id, widgetData) => {
      await delay(500);
      return { 
        widget: {
          ...(mockWidgets.find(w => w.id === id) || mockWidgets[0]),
          ...widgetData,
          updatedAt: new Date().toISOString()
        }
      };
    },
    delete: async (id) => {
      await delay(500);
      return { message: 'Widget excluído com sucesso' };
    },
    getData: async (id, params) => {
      await delay(700);
      const widget = mockWidgets.find(w => w.id === id) || mockWidgets[0];
      return { 
        data: mockChartData[widget.metric] || mockChartData.pageviews
      };
    }
  },

  // Meta integrations endpoints
  meta: {
    getAll: async () => {
      await delay(500);
      return { integrations: mockMetaIntegrations };
    },
    getById: async (id) => {
      await delay(300);
      return { 
        integration: mockMetaIntegrations[0]
      };
    },
    connect: async (integrationData) => {
      await delay(1000);
      return { 
        integration: {
          id: 'new-integration-id',
          ...integrationData,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    },
    disconnect: async (id) => {
      await delay(500);
      return { message: 'Integração com Meta desconectada com sucesso' };
    },
    getMetrics: async (id, params) => {
      await delay(800);
      return { 
        metrics: [
          { name: 'page_impressions', value: 1250, date: '2023-01-01' },
          { name: 'page_impressions', value: 1480, date: '2023-01-02' },
          { name: 'page_impressions', value: 1320, date: '2023-01-03' },
          { name: 'page_engagement', value: 320, date: '2023-01-01' },
          { name: 'page_engagement', value: 375, date: '2023-01-02' },
          { name: 'page_engagement', value: 290, date: '2023-01-03' }
        ]
      };
    }
  },

  // Google Analytics integrations endpoints
  googleAnalytics: {
    getAll: async () => {
      await delay(500);
      return { integrations: mockGAIntegrations };
    },
    getById: async (id) => {
      await delay(300);
      return { 
        integration: mockGAIntegrations[0]
      };
    },
    connect: async (integrationData) => {
      await delay(1000);
      return { 
        integration: {
          id: 'new-integration-id',
          ...integrationData,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    },
    disconnect: async (id) => {
      await delay(500);
      return { message: 'Integração com Google Analytics desconectada com sucesso' };
    },
    getMetrics: async (id, params) => {
      await delay(800);
      return { 
        metrics: [
          { name: 'pageviews', value: 5250, date: '2023-01-01' },
          { name: 'pageviews', value: 4980, date: '2023-01-02' },
          { name: 'pageviews', value: 5320, date: '2023-01-03' },
          { name: 'sessions', value: 1320, date: '2023-01-01' },
          { name: 'sessions', value: 1175, date: '2023-01-02' },
          { name: 'sessions', value: 1290, date: '2023-01-03' },
          { name: 'users', value: 980, date: '2023-01-01' },
          { name: 'users', value: 875, date: '2023-01-02' },
          { name: 'users', value: 1020, date: '2023-01-03' }
        ]
      };
    }
  },

  // Reports endpoints
  reports: {
    getAll: async () => {
      await delay(500);
      return { reports: mockReports };
    },
    getById: async (id) => {
      await delay(300);
      return { 
        report: mockReports[0]
      };
    },
    create: async (reportData) => {
      await delay(800);
      return { 
        report: {
          id: 'new-report-id',
          ...reportData,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    },
    update: async (id, reportData) => {
      await delay(500);
      return { 
        report: {
          ...mockReports[0],
          ...reportData,
          updatedAt: new Date().toISOString()
        }
      };
    },
    delete: async (id) => {
      await delay(500);
      return { message: 'Relatório excluído com sucesso' };
    },
    generate: async (id, params) => {
      await delay(1500);
      return { 
        reportUrl: 'https://mock-url.com/reports/report.pdf'
      };
    },
    schedule: async (id, scheduleData) => {
      await delay(800);
      return { 
        schedule: {
          id: 'new-schedule-id',
          reportId: id,
          ...scheduleData,
          active: true,
          nextRunAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    }
  },

  // Alerts endpoints
  alerts: {
    getAll: async () => {
      await delay(500);
      return { alerts: mockAlerts };
    },
    getById: async (id) => {
      await delay(300);
      return { 
        alert: mockAlerts[0]
      };
    },
    create: async (alertData) => {
      await delay(800);
      return { 
        alert: {
          id: 'new-alert-id',
          ...alertData,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    },
    update: async (id, alertData) => {
      await delay(500);
      return { 
        alert: {
          ...mockAlerts[0],
          ...alertData,
          updatedAt: new Date().toISOString()
        }
      };
    },
    delete: async (id) => {
      await delay(500);
      return { message: 'Alerta excluído com sucesso' };
    },
    toggleStatus: async (id, active) => {
      await delay(500);
      return { 
        alert: {
          ...mockAlerts[0],
          active,
          updatedAt: new Date().toISOString()
        }
      };
    }
  }
};

export default mockApiService;
