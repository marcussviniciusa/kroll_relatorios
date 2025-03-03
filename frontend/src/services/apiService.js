import axios from 'axios';

// Configuração base do axios
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Criar instância do axios com configuração base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Tratamento de erros específicos (ex: 401 Unauthorized)
    if (error.response) {
      if (error.response.status === 401) {
        // Redirecionar para login ou limpar o estado de autenticação
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Serviço de API real que comunica com o backend
const apiService = {
  // Auth endpoints
  auth: {
    login: async (email, password) => {
      return api.post('/auth/login', { email, password });
    },
    register: async (userData) => {
      return api.post('/auth/register', userData);
    },
    me: async () => {
      return api.get('/auth/me');
    },
    forgotPassword: async (email) => {
      return api.post('/auth/forgot-password', { email });
    },
    resetPassword: async (token, password) => {
      return api.post('/auth/reset-password', { token, password });
    },
  },

  // Users endpoints
  users: {
    getAll: async () => {
      return api.get('/users');
    },
    getById: async (id) => {
      return api.get(`/users/${id}`);
    },
    update: async (id, userData) => {
      return api.put(`/users/${id}`, userData);
    },
    updateProfile: async (userData) => {
      return api.put('/users/profile', userData);
    },
    changePassword: async (currentPassword, newPassword) => {
      return api.post('/users/change-password', { currentPassword, newPassword });
    },
  },

  // Companies endpoints
  companies: {
    getAll: async () => {
      return api.get('/companies');
    },
    getById: async (id) => {
      return api.get(`/companies/${id}`);
    },
    create: async (companyData) => {
      return api.post('/companies', companyData);
    },
    update: async (id, companyData) => {
      return api.put(`/companies/${id}`, companyData);
    },
    delete: async (id) => {
      return api.delete(`/companies/${id}`);
    },
  },

  // Dashboards endpoints
  dashboards: {
    getAll: async () => {
      return api.get('/dashboards');
    },
    getById: async (id) => {
      return api.get(`/dashboards/${id}`);
    },
    create: async (dashboardData) => {
      return api.post('/dashboards', dashboardData);
    },
    update: async (id, dashboardData) => {
      return api.put(`/dashboards/${id}`, dashboardData);
    },
    delete: async (id) => {
      return api.delete(`/dashboards/${id}`);
    },
    share: async (id, shareOptions) => {
      return api.post(`/dashboards/${id}/share`, shareOptions);
    },
  },

  // Widgets endpoints
  widgets: {
    create: async (widgetData) => {
      return api.post('/widgets', widgetData);
    },
    update: async (id, widgetData) => {
      return api.put(`/widgets/${id}`, widgetData);
    },
    delete: async (id) => {
      return api.delete(`/widgets/${id}`);
    },
    getData: async (id, params) => {
      return api.get(`/widgets/${id}/data`, { params });
    },
  },

  // Meta integrations endpoints
  meta: {
    getAll: async () => {
      return api.get('/integrations/meta');
    },
    getById: async (id) => {
      return api.get(`/integrations/meta/${id}`);
    },
    connect: async (integrationData) => {
      return api.post('/integrations/meta/connect', integrationData);
    },
    disconnect: async (id) => {
      return api.post(`/integrations/meta/${id}/disconnect`);
    },
    getMetrics: async (id, params) => {
      return api.get(`/integrations/meta/${id}/metrics`, { params });
    },
  },

  // Google Analytics integrations endpoints
  googleAnalytics: {
    getAll: async () => {
      return api.get('/integrations/google-analytics');
    },
    getById: async (id) => {
      return api.get(`/integrations/google-analytics/${id}`);
    },
    connect: async (integrationData) => {
      return api.post('/integrations/google-analytics/connect', integrationData);
    },
    disconnect: async (id) => {
      return api.post(`/integrations/google-analytics/${id}/disconnect`);
    },
    getMetrics: async (id, params) => {
      return api.get(`/integrations/google-analytics/${id}/metrics`, { params });
    },
  },

  // Reports endpoints
  reports: {
    getAll: async () => {
      return api.get('/reports');
    },
    getById: async (id) => {
      return api.get(`/reports/${id}`);
    },
    create: async (reportData) => {
      return api.post('/reports', reportData);
    },
    update: async (id, reportData) => {
      return api.put(`/reports/${id}`, reportData);
    },
    delete: async (id) => {
      return api.delete(`/reports/${id}`);
    },
    generate: async (id, params) => {
      return api.post(`/reports/${id}/generate`, params);
    },
    schedule: async (id, scheduleData) => {
      return api.post(`/reports/${id}/schedule`, scheduleData);
    },
  },

  // Alerts endpoints
  alerts: {
    getAll: async () => {
      return api.get('/alerts');
    },
    getById: async (id) => {
      return api.get(`/alerts/${id}`);
    },
    create: async (alertData) => {
      return api.post('/alerts', alertData);
    },
    update: async (id, alertData) => {
      return api.put(`/alerts/${id}`, alertData);
    },
    delete: async (id) => {
      return api.delete(`/alerts/${id}`);
    },
    toggleStatus: async (id, active) => {
      return api.patch(`/alerts/${id}/status`, { active });
    },
  },
};

export default apiService;
