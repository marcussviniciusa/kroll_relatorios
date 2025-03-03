// API Configuration
// Este arquivo controla se o app deve usar dados reais ou mockados

import mockApiService from './mockApiService';
import realApiService from './apiService'; // Supondo que este seja o serviço da API real

// Determine se deve usar API mockada ou real com base na variável de ambiente
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true';

// Export do serviço apropriado baseado na configuração
const apiService = USE_MOCK_API ? mockApiService : realApiService;

export default apiService;
