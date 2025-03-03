import axios from 'axios';
import { handleApiError, handleMetaApiError } from '../utils/errorHandler';

/**
 * Base API URL from environment
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Meta Facebook Integration API Service
 */
class MetaApiService {
  /**
   * Initialize the Facebook SDK
   * @returns {Promise<void>}
   */
  async initializeFbSdk() {
    return new Promise((resolve) => {
      // Check if FB SDK is already loaded
      if (window.FB) {
        resolve();
        return;
      }
      
      // Load the Facebook SDK asynchronously
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: process.env.REACT_APP_META_APP_ID,
          cookie: true,
          xfbml: true,
          version: process.env.REACT_APP_META_API_VERSION || 'v18.0'
        });
        
        resolve();
      };
      
      // Load the SDK script
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    });
  }
  
  /**
   * Trigger Facebook login dialog
   * @returns {Promise<{ accessToken: string, userID: string }>}
   */
  loginWithFacebook() {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(handleMetaApiError(new Error('Facebook SDK not initialized')));
        return;
      }
      
      // Obter escopos das variáveis de ambiente ou usar padrão
      const scopes = process.env.REACT_APP_META_SCOPES || 'public_profile,email,ads_management,ads_read,business_management';
      const authType = process.env.REACT_APP_META_AUTH_TYPE || 'rerequest';
      
      window.FB.login((response) => {
        if (response.authResponse) {
          resolve({
            accessToken: response.authResponse.accessToken,
            userID: response.authResponse.userID
          });
        } else {
          if (response.error) {
            reject(handleMetaApiError(response));
          } else {
            reject(handleMetaApiError(new Error('Facebook login canceled or failed')));
          }
        }
      }, {
        scope: scopes,
        auth_type: authType
      });
    });
  }
  
  /**
   * Get list of integrations for a company
   * @param {string} companyId 
   * @returns {Promise<Array>}
   */
  async getCompanyIntegrations(companyId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/integrations/meta/company/${companyId}`);
      return response.data;
    } catch (error) {
      throw handleMetaApiError(error);
    }
  }
  
  /**
   * Verify the status of a Meta integration token
   * @param {string} integrationId - ID da integração
   * @returns {Promise<Object>} - Objeto com informações do status do token
   */
  async verifyIntegrationStatus(integrationId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/meta/integrations/${integrationId}/status`);
      return response.data;
    } catch (error) {
      throw handleMetaApiError(error);
    }
  }
  
  /**
   * Connect Meta account with a company
   * @param {string} companyId
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async connectAccount(companyId, data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/meta/connect`, {
        companyId,
        accessToken: data.accessToken,
        name: data.name
      });
      return response.data;
    } catch (error) {
      throw handleMetaApiError(error);
    }
  }
  
  /**
   * Disconnect Meta integration
   * @param {string} integrationId
   * @returns {Promise<void>}
   */
  async disconnectAccount(integrationId) {
    try {
      await axios.delete(`${API_BASE_URL}/meta/integrations/${integrationId}`);
    } catch (error) {
      throw handleMetaApiError(error);
    }
  }
  
  /**
   * Get ad accounts available for the integration
   * @param {string} integrationId
   * @returns {Promise<Array>}
   */
  async getAdAccounts(integrationId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/meta/integrations/${integrationId}/ad-accounts`);
      return response.data;
    } catch (error) {
      throw handleMetaApiError(error);
    }
  }
  
  /**
   * Get campaigns for an ad account
   * @param {string} integrationId
   * @param {string} adAccountId
   * @param {Object} params
   * @returns {Promise<Array>}
   */
  async getCampaigns(integrationId, adAccountId, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/integrations/meta/${integrationId}/adaccounts/${adAccountId}/campaigns`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleMetaApiError(error);
    }
  }
  
  /**
   * Get campaign insights
   * @param {string} integrationId
   * @param {string} adAccountId
   * @param {string} campaignId
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async getCampaignInsights(integrationId, adAccountId, campaignId, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/integrations/meta/${integrationId}/adaccounts/${adAccountId}/campaigns/${campaignId}/insights`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleMetaApiError(error);
    }
  }
  
  /**
   * Get ad sets for a campaign
   * @param {string} integrationId
   * @param {string} adAccountId
   * @param {string} campaignId
   * @param {Object} params
   * @returns {Promise<Array>}
   */
  async getAdSets(integrationId, adAccountId, campaignId, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/integrations/meta/${integrationId}/adaccounts/${adAccountId}/campaigns/${campaignId}/adsets`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleMetaApiError(error);
    }
  }
  
  /**
   * Get ads for an ad set
   * @param {string} integrationId
   * @param {string} adAccountId
   * @param {string} adSetId
   * @param {Object} params
   * @returns {Promise<Array>}
   */
  async getAds(integrationId, adAccountId, adSetId, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/integrations/meta/${integrationId}/adaccounts/${adAccountId}/adsets/${adSetId}/ads`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleMetaApiError(error);
    }
  }
  
  /**
   * Get aggregated insights
   * @param {string} integrationId
   * @param {string} adAccountId
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async getAggregatedInsights(integrationId, adAccountId, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/integrations/meta/${integrationId}/adaccounts/${adAccountId}/insights/aggregate`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleMetaApiError(error);
    }
  }
  
  /**
   * Get metrics for an ad account
   * @param {string} integrationId - ID da integração
   * @param {string} adAccountId - ID da conta de anúncios
   * @param {string} startDate - Data inicial no formato YYYY-MM-DD
   * @param {string} endDate - Data final no formato YYYY-MM-DD
   * @returns {Promise<Object>} - Métricas da conta de anúncios
   */
  async getAdAccountMetrics(integrationId, adAccountId, startDate, endDate) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/integrations/meta/${integrationId}/ad-accounts/${adAccountId}/metrics/${startDate}/${endDate}`
      );
      return response.data;
    } catch (error) {
      throw handleMetaApiError(error);
    }
  }
  
  /**
   * Verifica se a integração com o Meta está habilitada
   * @returns {boolean} - True se a integração estiver habilitada
   */
  isMetaIntegrationEnabled() {
    return process.env.REACT_APP_META_INTEGRATION_ENABLED === 'true';
  }
}

// Criar e exportar uma instância do serviço
const metaApiService = new MetaApiService();
export default metaApiService;
