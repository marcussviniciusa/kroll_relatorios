# Sistema de Relatórios em Tempo Real (Kroll Analytics)

Um sistema web para monitoramento e geração de relatórios em tempo real que integra dados do Meta (Facebook) e Google Analytics, permitindo visualização centralizada de métricas de marketing digital e desempenho de sites/aplicativos.

## Visão Geral

Este projeto implementa uma plataforma completa para:
- Integração com APIs de Meta (Facebook) e Google Analytics
- Dashboard moderno e interativo com visualização de métricas em tempo real
- Sistema de gerenciamento de empresas e usuários
- Geração e compartilhamento de relatórios automáticos
- Alertas e notificações baseados em métricas

## Arquitetura

O projeto segue uma arquitetura moderna com:
- Frontend em React com Material-UI e Chart.js
- Backend em Node.js
- PostgreSQL como banco de dados principal
- Redis para caching e dados em tempo real

## Começando

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL
- Redis
- Conta de desenvolvedor no Meta e Google Analytics

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/marcussviniciusa/kroll_relatorios.git
cd kroll_relatorios
```

2. Instale as dependências
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure as variáveis de ambiente
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Inicie os serviços
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

## Módulos Principais

- **Administrativo**: Gerenciamento de empresas e usuários
- **Integrações**: Conexão com APIs externas
- **Dashboard**: Visualização e manipulação de dados com gráficos interativos
- **Relatórios**: Geração e compartilhamento de relatórios
- **Alertas**: Sistema de notificações baseado em métricas

## Ambiente de Teste

O projeto inclui um ambiente de teste completo que pode ser usado sem um backend funcional:

### Funcionalidades do Ambiente de Teste

- **API Mockada**: Serviço que simula todas as respostas da API
- **Testes de Autenticação**: Login, registro e recuperação de senha simulados
- **Testes de Dashboard**: Visualização de widgets modernos com dados fictícios
  - Gráficos de linha com gradientes
  - Gráficos de barra interativos
  - Gráficos de rosca para dados categóricos
  - Cards de métricas com indicadores de tendência
- **Testes de Integrações**: Simulação de conexões com Meta e Google Analytics

### Como Usar o Ambiente de Teste

1. Certifique-se de que a variável `REACT_APP_USE_MOCK_API` está definida como `true` no arquivo `.env` do frontend
2. Execute o frontend normalmente com `npm start`
3. Acesse a interface em `http://localhost:3000/test`
4. Explore as diferentes abas para testar as funcionalidades

### Credenciais de Teste

- **Email**: usuario@teste.com
- **Senha**: senha123

## Dashboard Modernizado

Recentemente, o dashboard foi completamente redesenhado com:

- Interface moderna e responsiva usando Material-UI
- Gráficos interativos com Chart.js e react-chartjs-2
- Widgets dinâmicos com múltiplos tipos de visualização
- Efeitos visuais como gradientes e animações
- Funcionalidade de atualização em tempo real
- Cards informativos com indicadores de tendência
- Layout responsivo para diferentes tamanhos de tela

## Licença

[Inserir informação de licença]
