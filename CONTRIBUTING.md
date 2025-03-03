# Contribuindo para o Kroll Relatórios

Obrigado pelo seu interesse em contribuir para o projeto Kroll Relatórios! Este documento fornece diretrizes para contribuir com o projeto.

## Configuração do Ambiente de Desenvolvimento

1. Clone o repositório:
```bash
git clone https://github.com/marcussviniciusa/kroll_relatorios.git
cd kroll_relatorios
```

2. Instale as dependências:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Inicie os serviços:
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

## Fluxo de Trabalho Git

1. Crie uma nova branch para sua feature ou correção:
```bash
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

2. Faça suas alterações e commit seguindo as convenções de commit:
```bash
git add .
git commit -m "tipo: descrição da alteração"
```

Tipos de commit:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `style`: Alterações que não afetam o código (formatação, etc)
- `refactor`: Refatoração de código
- `perf`: Melhorias de performance
- `test`: Adição ou correção de testes
- `chore`: Alterações em ferramentas, configurações, etc

3. Envie suas alterações para o GitHub:
```bash
git push origin nome-da-sua-branch
```

4. Crie um Pull Request para a branch `main`.

## Boas Práticas

### Código
- Siga os padrões de codificação do projeto
- Escreva testes para novas funcionalidades
- Mantenha o código limpo e bem documentado
- Use nomes descritivos para variáveis e funções

### Commits
- Faça commits pequenos e focados
- Use mensagens de commit claras e descritivas
- Siga as convenções de commit mencionadas acima

### Pull Requests
- Descreva claramente o que seu PR resolve
- Referencie issues relacionadas
- Certifique-se de que todos os testes passam
- Solicite revisão de outros contribuidores

## Arquivos Grandes e .gitignore

Para evitar problemas com arquivos grandes, certifique-se de que:

1. Não faça commit de arquivos `node_modules/`
2. Não faça commit de arquivos de cache (`.cache/`)
3. Não faça commit de arquivos de ambiente (`.env`)
4. Arquivos maiores que 50MB devem ser adicionados ao `.gitignore`

## Dúvidas

Se você tiver dúvidas sobre como contribuir, abra uma issue ou entre em contato com os mantenedores do projeto.

Obrigado por contribuir!
