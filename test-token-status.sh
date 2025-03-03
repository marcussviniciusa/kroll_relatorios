#!/bin/bash

# Script para testar a funcionalidade de status de token Meta

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Iniciando teste da funcionalidade de status de token Meta ===${NC}"

# Verificar se as variáveis de ambiente necessárias estão configuradas
echo -e "\n${YELLOW}Verificando configurações de ambiente...${NC}"

# Backend
if [ ! -f "./backend/.env" ]; then
  echo -e "${RED}Arquivo .env do backend não encontrado!${NC}"
  echo -e "Por favor, crie o arquivo backend/.env com base no backend/.env.example"
  exit 1
fi

# Verificar variáveis específicas no backend
grep -q "TOKEN_ENCRYPTION_KEY" ./backend/.env
if [ $? -ne 0 ]; then
  echo -e "${RED}TOKEN_ENCRYPTION_KEY não encontrada no arquivo .env do backend!${NC}"
  echo -e "Por favor, adicione TOKEN_ENCRYPTION_KEY=your_secure_encryption_key_min_32_chars ao arquivo backend/.env"
  exit 1
fi

grep -q "TOKEN_REFRESH_ENABLED" ./backend/.env
if [ $? -ne 0 ]; then
  echo -e "${RED}TOKEN_REFRESH_ENABLED não encontrada no arquivo .env do backend!${NC}"
  echo -e "Por favor, adicione TOKEN_REFRESH_ENABLED=true ao arquivo backend/.env"
  exit 1
fi

# Frontend
if [ ! -f "./frontend/.env" ]; then
  echo -e "${RED}Arquivo .env do frontend não encontrado!${NC}"
  echo -e "Por favor, crie o arquivo frontend/.env com base no frontend/.env.example"
  exit 1
fi

# Verificar variáveis específicas no frontend
grep -q "REACT_APP_META_APP_ID" ./frontend/.env
if [ $? -ne 0 ]; then
  echo -e "${RED}REACT_APP_META_APP_ID não encontrada no arquivo .env do frontend!${NC}"
  echo -e "Por favor, adicione REACT_APP_META_APP_ID=your_meta_app_id ao arquivo frontend/.env"
  exit 1
fi

echo -e "${GREEN}Configurações de ambiente verificadas com sucesso!${NC}"

# Iniciar o backend
echo -e "\n${YELLOW}Iniciando o servidor backend...${NC}"
cd backend
npm install
npm start &
BACKEND_PID=$!
cd ..

# Aguardar o backend iniciar
echo -e "Aguardando o servidor backend iniciar..."
sleep 5

# Iniciar o frontend
echo -e "\n${YELLOW}Iniciando o servidor frontend...${NC}"
cd frontend
npm install
npm start &
FRONTEND_PID=$!
cd ..

echo -e "\n${GREEN}Servidores iniciados com sucesso!${NC}"
echo -e "Backend PID: ${BACKEND_PID}"
echo -e "Frontend PID: ${FRONTEND_PID}"

echo -e "\n${YELLOW}Instruções para teste:${NC}"
echo -e "1. Acesse http://localhost:3000/integrations/tester no navegador"
echo -e "2. Clique na aba 'Status de Token'"
echo -e "3. Insira o ID de uma integração existente e clique em 'Verificar Token'"
echo -e "4. Observe o status do token e as informações exibidas"

echo -e "\n${YELLOW}Para encerrar os servidores, pressione Ctrl+C${NC}"

# Aguardar o usuário encerrar o script
wait $BACKEND_PID $FRONTEND_PID
