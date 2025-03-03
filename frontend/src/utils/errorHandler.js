/**
 * Utility for handling API errors in a standardized way
 */

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, status, details = null, code = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.code = code;
  }
}

/**
 * Parse and handle API errors from axios
 * @param {Error} error - Axios error object
 * @returns {ApiError} Standardized API error
 */
export const handleApiError = (error) => {
  // Default error values
  let message = 'Um erro inesperado ocorreu';
  let status = 500;
  let details = null;
  let code = null;

  // Handle axios error response
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    status = error.response.status;
    
    // Try to extract error details from response
    const responseData = error.response.data;
    
    if (responseData) {
      if (responseData.message) {
        message = responseData.message;
      } else if (responseData.error && responseData.error.message) {
        message = responseData.error.message;
      }
      
      if (responseData.details) {
        details = responseData.details;
      } else if (responseData.error && responseData.error.details) {
        details = responseData.error.details;
      }
      
      if (responseData.code) {
        code = responseData.code;
      } else if (responseData.error && responseData.error.code) {
        code = responseData.error.code;
      }
    }
    
    // Set appropriate message for common HTTP status codes
    if (!message || message === 'Um erro inesperado ocorreu') {
      switch (status) {
        case 400:
          message = 'Requisição inválida';
          break;
        case 401:
          message = 'Não autorizado. Por favor, faça login novamente.';
          break;
        case 403:
          message = 'Acesso negado. Você não tem permissão para esta ação.';
          break;
        case 404:
          message = 'Recurso não encontrado';
          break;
        case 409:
          message = 'Conflito de dados';
          break;
        case 422:
          message = 'Dados inválidos para processar a requisição';
          break;
        case 429:
          message = 'Muitas requisições. Por favor, tente novamente mais tarde.';
          break;
        case 500:
          message = 'Erro interno do servidor';
          break;
        case 502:
          message = 'Erro ao se comunicar com servidor externo';
          break;
        case 503:
          message = 'Serviço temporariamente indisponível';
          break;
        default:
          if (status >= 500) {
            message = 'Erro no servidor';
          } else if (status >= 400) {
            message = 'Erro na requisição';
          }
      }
    }
  } else if (error.request) {
    // The request was made but no response was received
    message = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    status = 0;
  } else {
    // Something happened in setting up the request that triggered an Error
    message = error.message || 'Erro ao configurar requisição';
  }

  // Check for offline status
  if (!navigator.onLine) {
    message = 'Você está offline. Por favor, verifique sua conexão.';
    status = 0;
  }
  
  // Create and return ApiError
  return new ApiError(message, status, details, code);
};

/**
 * Get user-friendly message for error display
 * @param {Error} error - Any error object
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error) => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error.name === 'TypeError' && error.message.includes('JSON')) {
    return 'Erro ao processar dados do servidor';
  }
  
  return error.message || 'Um erro inesperado ocorreu';
};

/**
 * Log error to console and/or error tracking service
 * @param {Error} error - Any error object
 * @param {string} context - Where the error occurred
 */
export const logError = (error, context = '') => {
  // In development, show detailed error
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${context}]`, error);
  }
  
  // In production, would send to error tracking service like Sentry
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error);
    console.error(`[${context}]`, error.message);
    
    // Here you would add code to send to error tracking service
    // For example, if using Sentry:
    // Sentry.withScope(scope => {
    //   scope.setTag('context', context);
    //   Sentry.captureException(error);
    // });
  }
};

/**
 * Handle specific Meta (Facebook) API errors
 * @param {Error} error - Error from Facebook SDK
 * @returns {ApiError} Standardized API error
 */
export const handleMetaApiError = (error) => {
  let message = 'Erro na integração com o Meta';
  let status = 400;
  let details = null;
  let code = null;

  // Facebook error object structure
  if (error && error.response) {
    const fbError = error.response.error;
    
    if (fbError) {
      message = fbError.message || message;
      code = fbError.code || fbError.error_code || code;
      status = fbError.code === 190 ? 401 : status; // Token inválido = 401
      
      // Detalhes específicos do erro
      if (fbError.error_subcode) {
        details = { subcode: fbError.error_subcode };
      }
    }
  }

  // Mensagens amigáveis para códigos de erro comuns do Facebook
  if (code) {
    switch (code) {
      case 2:
        message = 'Aplicativo do Facebook não configurado corretamente';
        break;
      case 4:
        message = 'Muitas chamadas para a API do Facebook';
        break;
      case 102:
        message = 'Sessão do Facebook expirada';
        break;
      case 190:
        message = 'Token de acesso do Facebook inválido ou expirado';
        break;
      case 200:
        message = 'Permissões insuficientes para acessar este recurso do Facebook';
        break;
      case 10:
        message = 'Erro de permissão com a API do Facebook';
        break;
      case 100:
        message = 'Parâmetro inválido na chamada à API do Facebook';
        break;
      case 803:
        message = 'Algumas permissões foram negadas pelo usuário';
        break;
    }
  }

  return new ApiError(message, status, details, code);
};
