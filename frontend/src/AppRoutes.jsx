import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TestPage from './pages/TestPage';

// Este arquivo será expandido para incluir mais rotas no futuro
// Atualmente, apenas redireciona para a página de teste 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rota de testes */}
        <Route path="/test" element={<TestPage />} />
        
        {/* Redirecionar para a página de teste por enquanto */}
        <Route path="*" element={<Navigate to="/test" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
