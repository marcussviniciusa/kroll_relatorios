const axios = require('axios');
const logger = require('../utils/logger');
const { MetaIntegration } = require('../models');

/**
 * Service for handling Meta (Facebook) API integrations
 */
class MetaService {
  constructor() {
    this.baseUrl = `https://graph.facebook.com/${process.env.META_API_VERSION}`;
    this.appId = process.env.META_APP_ID;
    this.appSecret = process.env.META_APP_SECRET;
  }

  /**
   * Generate an app access token for server-to-server calls
   * @returns {Promise<string>} The app access token
   */
  async getAppAccessToken() {
    try {
      const response = await axios.get(`${this.baseUrl}/oauth/access_token`, {
        params: {
          client_id: this.appId,
          client_secret: this.appSecret,
          grant_type: 'client_credentials'
        }
      });

      return response.data.access_token;
    } catch (error) {
      logger.error('Failed to get Meta app access token', { error: error.message });
      throw new Error('Failed to authenticate with Meta API');
    }
  }

  /**
   * Exchange short-lived user token for a long-lived token
   * @param {string} shortLivedToken - The short-lived user access token
   * @returns {Promise<Object>} Object containing the long-lived token and expiration
   */
  async getLongLivedUserToken(shortLivedToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/oauth/access_token`, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: this.appId,
          client_secret: this.appSecret,
          fb_exchange_token: shortLivedToken
        }
      });

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in
      };
    } catch (error) {
      logger.error('Failed to get long-lived user token', { error: error.message });
      throw new Error('Failed to exchange token with Meta API');
    }
  }

  /**
   * Save Meta integration details for a company
   * @param {string} companyId - The ID of the company
   * @param {Object} integrationData - The integration data
   * @returns {Promise<Object>} The saved integration data
   */
  async saveIntegration(companyId, integrationData) {
    try {
      const { accessToken, userProfile, adAccounts, pages } = integrationData;
      
      // Check if integration already exists
      let integration = await MetaIntegration.findOne({
        where: { CompanyId: companyId }
      });

      // Get token expiration date
      const expiresIn = integrationData.expiresIn || 5184000; // Default to 60 days if not provided
      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);

      if (integration) {
        // Update existing integration
        integration = await integration.update({
          accessToken,
          accessTokenExpires: expirationDate,
          userProfile,
          adAccounts,
          pages,
          status: 'active',
          lastSyncAt: new Date()
        });
      } else {
        // Create new integration
        integration = await MetaIntegration.create({
          CompanyId: companyId,
          accessToken,
          accessTokenExpires: expirationDate,
          userProfile,
          adAccounts,
          pages,
          status: 'active',
          lastSyncAt: new Date()
        });
      }

      logger.info(`Meta integration saved for company ${companyId}`);
      
      // Remove sensitive data from response
      const result = integration.toJSON();
      delete result.accessToken;
      
      return result;
    } catch (error) {
      logger.error('Failed to save Meta integration', { error: error.message, companyId });
      throw new Error('Failed to save Meta integration data');
    }
  }

  /**
   * Get user profile information
   * @param {string} accessToken - The user access token
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile(accessToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/me`, {
        params: {
          fields: 'id,name,email,picture',
          access_token: accessToken
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to get Meta user profile', { error: error.message });
      throw new Error('Failed to fetch user profile from Meta API');
    }
  }

  /**
   * Get ad accounts for a user
   * @param {string} accessToken - The user access token
   * @returns {Promise<Array>} List of ad accounts
   */
  async getAdAccounts(accessToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/me/adaccounts`, {
        params: {
          fields: 'id,name,account_id,account_status,business_name,currency,timezone_name',
          access_token: accessToken
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Failed to get Meta ad accounts', { error: error.message });
      throw new Error('Failed to fetch ad accounts from Meta API');
    }
  }

  /**
   * Get pages a user has access to
   * @param {string} accessToken - The user access token
   * @returns {Promise<Array>} List of pages
   */
  async getPages(accessToken) {
    try {
      const response = await axios.get(`${this.baseUrl}/me/accounts`, {
        params: {
          fields: 'id,name,access_token,category,fan_count,picture',
          access_token: accessToken
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Failed to get Meta pages', { error: error.message });
      throw new Error('Failed to fetch pages from Meta API');
    }
  }

  /**
   * Get ad campaign insights
   * @param {string} accessToken - The user access token
   * @param {string} adAccountId - The ad account ID (with 'act_' prefix)
   * @param {Object} params - Query parameters for insights
   * @returns {Promise<Array>} Campaign insights data
   */
  async getCampaignInsights(accessToken, adAccountId, params = {}) {
    try {
      const defaultParams = {
        time_range: JSON.stringify({ since: '2023-01-01', until: '2023-01-31' }),
        level: 'campaign',
        fields: 'campaign_name,spend,impressions,clicks,reach,cpc,ctr,cpp'
      };

      const queryParams = {
        ...defaultParams,
        ...params,
        access_token: accessToken
      };

      const response = await axios.get(`${this.baseUrl}/${adAccountId}/insights`, {
        params: queryParams
      });

      return response.data.data;
    } catch (error) {
      logger.error('Failed to get Meta campaign insights', { 
        error: error.message, 
        adAccountId,
        responseData: error.response?.data 
      });
      throw new Error('Failed to fetch campaign insights from Meta API');
    }
  }

  /**
   * Get a company's Meta integration
   * @param {string} companyId - The company ID
   * @returns {Promise<Object|null>} The integration data or null if not found
   */
  async getCompanyIntegration(companyId) {
    try {
      const integration = await MetaIntegration.findOne({
        where: { CompanyId: companyId }
      });

      if (!integration) {
        return null;
      }

      // Check if token is expired
      const now = new Date();
      if (integration.accessTokenExpires && integration.accessTokenExpires < now) {
        integration.status = 'expired';
        await integration.save();
      }

      return integration;
    } catch (error) {
      logger.error('Failed to get company Meta integration', { error: error.message, companyId });
      throw new Error('Failed to retrieve Meta integration data');
    }
  }
}

module.exports = new MetaService();
