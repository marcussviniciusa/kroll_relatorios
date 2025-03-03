import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TestPage from './pages/TestPage';
import IntegrationsPage from './pages/Integrations/IntegrationsPage';
import IntegrationsTester from './pages/Integrations/IntegrationsTester';

// Este arquivo será expandido para incluir mais rotas no futuro
// Atualmente, apenas redireciona para a página de teste 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rota de testes */}
        <Route path="/test" element={<TestPage />} />
        
        {/* Rotas de integrações */}
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/integrations/tester" element={<IntegrationsTester />} />
        
        {/* Redirecionar para a página de teste por enquanto */}
        <Route path="*" element={<Navigate to="/test" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
