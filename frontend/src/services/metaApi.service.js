import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

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
          version: 'v18.0'
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
        reject(new Error('Facebook SDK not initialized'));
        return;
      }
      
      window.FB.login((response) => {
        if (response.authResponse) {
          resolve({
            accessToken: response.authResponse.accessToken,
            userID: response.authResponse.userID
          });
        } else {
          reject(new Error('Facebook login canceled or failed'));
        }
      }, {
        scope: 'public_profile,email,ads_management,ads_read,business_management'
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
      throw handleApiError(error);
    }
  }
  
  /**
   * Connect Meta account with a company
   * @param {string} companyId
   * @param {Object} tokenData
   * @returns {Promise<Object>}
   */
  async connectAccount(companyId, tokenData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/integrations/meta/connect`, {
        companyId,
        accessToken: tokenData.accessToken
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
  
  /**
   * Disconnect Meta integration
   * @param {string} integrationId
   * @returns {Promise<void>}
   */
  async disconnectAccount(integrationId) {
    try {
      await axios.delete(`${API_BASE_URL}/integrations/meta/${integrationId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }
  
  /**
   * Get ad accounts available for the integration
   * @param {string} integrationId
   * @returns {Promise<Array>}
   */
  async getAdAccounts(integrationId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/integrations/meta/${integrationId}/adaccounts`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
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
      throw handleApiError(error);
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
      throw handleApiError(error);
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
      throw handleApiError(error);
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
      throw handleApiError(error);
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
      throw handleApiError(error);
    }
  }
}

export default new MetaApiService();
