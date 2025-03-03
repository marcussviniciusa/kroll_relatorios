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

## Integração com Meta (Facebook)

A integração com o Meta permite que os usuários conectem suas contas do Facebook para acessar dados de páginas, campanhas publicitárias e insights de desempenho.

### Configuração da Integração Meta

1. Crie um aplicativo no [Meta for Developers](https://developers.facebook.com/)
2. Configure as seguintes permissões no aplicativo:
   - `public_profile`
   - `email`
   - `ads_management`
   - `ads_read`
   - `business_management`
3. Adicione o ID do aplicativo Meta ao arquivo `.env`:
   ```
   REACT_APP_META_APP_ID=seu_app_id_aqui
   ```

### Funcionalidades da Integração Meta

- **Login com Facebook**: Autenticação segura usando o SDK oficial do Facebook
- **Conexão de Contas**: Vincule múltiplas contas do Facebook a uma empresa
- **Métricas de Páginas**: Visualize dados de alcance, engajamento e crescimento
- **Métricas de Anúncios**: Acompanhe o desempenho de campanhas publicitárias
- **Insights Agregados**: Obtenha visões consolidadas do desempenho de marketing
- **Testador de Integração**: Interface dedicada para testar a conexão e obter métricas em tempo real

### Fluxo de Autenticação

1. O usuário clica em "Conectar com Facebook" na página de integrações
2. Uma janela de autenticação do Facebook é aberta solicitando permissões
3. Após a autenticação bem-sucedida, o token de acesso é armazenado com segurança
4. O sistema usa o token para fazer chamadas à API do Facebook em nome do usuário

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

## Sistema de Notificações

O projeto inclui um sistema de notificações moderno e centralizado para fornecer feedback ao usuário:

### Características do Sistema de Notificações

- **Notificações Contextuais**: Exibição de mensagens de sucesso, erro, aviso e informação
- **Gerenciamento Centralizado**: Contexto React para gerenciar notificações em toda a aplicação
- **Tratamento de Erros Específicos**: Mensagens amigáveis para erros comuns das APIs
- **Suporte Multi-plataforma**: Tratamento específico para erros do Meta e Google Analytics
- **Personalização**: Controle de duração, posição e aparência das notificações
- **Feedback em Tempo Real**: Notificações durante operações assíncronas

### Como Usar o Sistema de Notificações

```jsx
// Exemplo de uso do hook de notificações
import { useNotification } from '../contexts/NotificationContext';

const MeuComponente = () => {
  const { showSuccess, showError, showInfo, showWarning } = useNotification();
  
  const handleAction = async () => {
    try {
      // Alguma operação
      showSuccess('Operação realizada com sucesso!');
    } catch (error) {
      showError(error); // Tratamento automático do erro
    }
  };
  
  return (
    <Button onClick={handleAction}>Executar Ação</Button>
  );
};
```

## Testador de Integrações

O projeto inclui uma interface dedicada para testar as integrações com plataformas externas:

### Funcionalidades do Testador de Integrações

- **Seleção de Integração**: Escolha entre diferentes contas conectadas
- **Teste de Conexão**: Verifique se a autenticação está funcionando corretamente
- **Visualização de Métricas**: Obtenha dados em tempo real das plataformas
- **Seleção de Período**: Escolha o intervalo de datas para as métricas
- **Visualização de Resultados**: Interface amigável para exibir os dados obtidos

### Como Acessar o Testador de Integrações

1. Acesse a página de integrações em `/integrations`
2. Clique no botão "Testar Integrações" no topo da página
3. Selecione a integração que deseja testar
4. Escolha as opções de teste e visualize os resultados

## Sistema de Tokens Seguro

O projeto implementa um sistema avançado para gerenciamento seguro de tokens de acesso para integrações externas:

### Funcionalidades do Sistema de Tokens

- **Criptografia Avançada**: Tokens armazenados com criptografia AES-256-GCM
- **Renovação Automática**: Renovação de tokens expirados quando possível
- **Verificação de Validade**: Verificação periódica da validade dos tokens
- **Separação de Responsabilidades**: Modelo dedicado para armazenamento de tokens
- **Gerenciamento de Ciclo de Vida**: Controle completo do ciclo de vida dos tokens
- **Segurança Aprimorada**: Tokens nunca expostos na interface do usuário

### Implementação Técnica

```javascript
// Exemplo de uso do TokenManager
const tokenManager = require('../utils/tokenManager');

// Armazenar um token de forma segura
const tokenData = tokenManager.prepareTokenForStorage(accessToken);

// Recuperar um token armazenado
const { token, isValid } = tokenManager.retrieveToken(storedTokenData);
```

### Benefícios de Segurança

- Proteção contra vazamento de tokens em logs e interfaces
- Conformidade com melhores práticas de segurança
- Auditoria de uso e validade de tokens
- Proteção contra ataques de interceptação

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
