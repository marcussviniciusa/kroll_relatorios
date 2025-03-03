# Guia de Teste: Sistema de Status de Token Meta

Este documento fornece instruções para testar o sistema de status de token Meta implementado no Kroll Relatórios.

## Pré-requisitos

1. Ambiente de desenvolvimento configurado
2. Variáveis de ambiente configuradas:
   - Backend: `TOKEN_ENCRYPTION_KEY`, `TOKEN_REFRESH_ENABLED`, `TOKEN_REFRESH_THRESHOLD_DAYS`
   - Frontend: `REACT_APP_META_APP_ID`, `REACT_APP_META_API_VERSION`, `REACT_APP_META_SCOPES`
3. Pelo menos uma integração Meta configurada no sistema

## Componentes a Testar

### 1. Componente MetaTokenStatus

Este componente exibe o status atual do token de uma integração Meta, incluindo:
- Status do token (ativo, expirado, inválido)
- Data de expiração
- Permissões concedidas
- Botão para atualizar o status em tempo real
- Opção de reconexão para tokens com problemas

### 2. Serviço de Token Meta

O serviço `metaTokenService.js` inclui o método `verifyToken` que:
- Verifica se o token existe no banco de dados
- Checa se o token está expirado e tenta renová-lo automaticamente quando possível
- Verifica a validade do token com a API do Meta
- Atualiza o status do token no banco de dados
- Retorna informações detalhadas sobre o estado do token

### 3. API de Status de Token

Endpoint `GET /api/integrations/meta/:id/status` que retorna o status detalhado de um token.

## Cenários de Teste

### Cenário 1: Token Ativo

1. Selecione uma integração com token válido
2. Verifique se o status exibido é "Ativo"
3. Verifique se a data de expiração é exibida corretamente
4. Clique no botão "Atualizar" e verifique se o status permanece "Ativo"

### Cenário 2: Token Expirado

1. Modifique manualmente a data de expiração de um token no banco de dados para uma data passada
2. Verifique se o status exibido é "Expirado"
3. Verifique se o botão "Reconectar Conta" é exibido
4. Clique no botão "Reconectar Conta" e verifique se o diálogo de confirmação é exibido

### Cenário 3: Token Inválido

1. Modifique manualmente o token armazenado no banco de dados para um valor inválido
2. Verifique se o status exibido é "Inválido"
3. Verifique se o botão "Reconectar Conta" é exibido
4. Clique no botão "Reconectar Conta" e verifique se o diálogo de confirmação é exibido

### Cenário 4: Token Não Encontrado

1. Tente verificar o status de uma integração que não possui token armazenado
2. Verifique se o status exibido é "Não encontrado"
3. Verifique se o botão "Reconectar Conta" é exibido

### Cenário 5: Renovação Automática de Token

1. Configure `TOKEN_REFRESH_ENABLED=true` e `TOKEN_REFRESH_THRESHOLD_DAYS=5`
2. Modifique manualmente a data de expiração de um token para estar próxima do limite de renovação
3. Verifique se o sistema tenta renovar automaticamente o token
4. Verifique se o status é atualizado para "Ativo" após a renovação

## Executando os Testes

1. Execute o script `test-token-status.sh` para iniciar os servidores backend e frontend
2. Acesse http://localhost:3000/integrations/tester no navegador
3. Clique na aba "Status de Token"
4. Insira o ID de uma integração existente e clique em "Verificar Token"
5. Observe o status do token e as informações exibidas
6. Teste os diferentes cenários descritos acima

## Registro de Resultados

Para cada cenário de teste, registre:
- Se o comportamento corresponde ao esperado
- Quaisquer erros ou comportamentos inesperados
- Screenshots de evidência, se necessário

## Resolução de Problemas

Se encontrar problemas durante o teste:

1. Verifique os logs do console do navegador
2. Verifique os logs do servidor backend
3. Confirme que todas as variáveis de ambiente estão configuradas corretamente
4. Verifique se o banco de dados está acessível e os tokens estão armazenados corretamente

## Conclusão do Teste

Após concluir todos os cenários de teste, documente:
- Quais cenários foram bem-sucedidos
- Quais cenários falharam e por quê
- Recomendações para melhorias ou correções
