const axios = require('axios');
const { google } = require('googleapis');
const logger = require('../utils/logger');
const { GoogleAnalyticsIntegration } = require('../models');

/**
 * Service for handling Google Analytics API integrations
 */
class GoogleAnalyticsService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GA_CLIENT_ID,
      process.env.GA_CLIENT_SECRET,
      process.env.GA_REDIRECT_URI
    );
    
    this.analyticsData = google.analyticsdata('v1beta');
    this.analyticsAdmin = google.analyticsadmin('v1alpha');
  }

  /**
   * Generate the OAuth 2.0 authorization URL
   * @param {string} companyId - The company ID for state parameter
   * @returns {string} The authorization URL
   */
  getAuthUrl(companyId) {
    const scopes = [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/analytics.edit'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Forces to ask for refresh token
      state: companyId
    });
  }

  /**
   * Exchange authorization code for tokens
   * @param {string} code - The authorization code
   * @returns {Promise<Object>} The token response
   */
  async getTokensFromCode(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      logger.error('Failed to exchange code for tokens', { error: error.message });
      throw new Error('Failed to authenticate with Google Analytics');
    }
  }

  /**
   * Refresh access token using refresh token
   * @param {string} refreshToken - The refresh token
   * @returns {Promise<Object>} The new token response
   */
  async refreshAccessToken(refreshToken) {
    try {
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken
      });

      const { credentials } = await this.oauth2Client.refreshAccessToken();
      return credentials;
    } catch (error) {
      logger.error('Failed to refresh access token', { error: error.message });
      throw new Error('Failed to refresh Google Analytics access token');
    }
  }

  /**
   * Save Google Analytics integration for a company
   * @param {string} companyId - The company ID
   * @param {Object} tokenData - The token data from OAuth
   * @param {Object} accountData - The account data
   * @returns {Promise<Object>} The saved integration
   */
  async saveIntegration(companyId, tokenData, accountData) {
    try {
      // Check if integration exists
      let integration = await GoogleAnalyticsIntegration.findOne({
        where: { CompanyId: companyId }
      });

      // Calculate token expiration
      const expiresIn = tokenData.expires_in || 3600;
      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);

      if (integration) {
        // Update existing integration
        integration = await integration.update({
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || integration.refreshToken,
          accessTokenExpires: expirationDate,
          properties: accountData.properties,
          accountDetails: accountData.accountDetails,
          status: 'active',
          lastSyncAt: new Date()
        });
      } else {
        // Create new integration
        integration = await GoogleAnalyticsIntegration.create({
          CompanyId: companyId,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          accessTokenExpires: expirationDate,
          properties: accountData.properties,
          accountDetails: accountData.accountDetails,
          status: 'active',
          lastSyncAt: new Date()
        });
      }

      logger.info(`Google Analytics integration saved for company ${companyId}`);
      
      // Remove sensitive data from response
      const result = integration.toJSON();
      delete result.accessToken;
      delete result.refreshToken;
      
      return result;
    } catch (error) {
      logger.error('Failed to save Google Analytics integration', { error: error.message, companyId });
      throw new Error('Failed to save Google Analytics integration data');
    }
  }

  /**
   * Get Google Analytics account and property data
   * @param {string} accessToken - The access token
   * @returns {Promise<Object>} The account and property data
   */
  async getAccountData(accessToken) {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      
      // Get account information
      const accountResponse = await this.analyticsAdmin.accounts.list({
        auth: this.oauth2Client
      });

      const accounts = accountResponse.data.accounts || [];
      
      // Get properties for each account
      const properties = [];
      for (const account of accounts) {
        const propertiesResponse = await this.analyticsAdmin.properties.list({
          auth: this.oauth2Client,
          parent: account.name
        });
        
        if (propertiesResponse.data.properties) {
          properties.push(...propertiesResponse.data.properties);
        }
      }

      return {
        accountDetails: accounts,
        properties
      };
    } catch (error) {
      logger.error('Failed to get Google Analytics account data', { error: error.message });
      throw new Error('Failed to fetch account data from Google Analytics');
    }
  }

  /**
   * Run GA4 report for a property
   * @param {string} accessToken - The access token
   * @param {string} propertyId - The GA4 property ID (format: properties/123456789)
   * @param {Object} reportConfig - The report configuration
   * @returns {Promise<Object>} The report data
   */
  async runReport(accessToken, propertyId, reportConfig = {}) {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      
      // Default report configuration
      const defaultConfig = {
        dateRanges: [
          {
            startDate: '7daysAgo',
            endDate: 'today'
          }
        ],
        dimensions: [
          {
            name: 'date'
          }
        ],
        metrics: [
          {
            name: 'sessions'
          },
          {
            name: 'activeUsers'
          },
          {
            name: 'screenPageViews'
          }
        ]
      };
      
      // Merge with custom config
      const finalConfig = {
        ...defaultConfig,
        ...reportConfig
      };

      const response = await this.analyticsData.properties.runReport({
        auth: this.oauth2Client,
        property: propertyId,
        requestBody: finalConfig
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to run Google Analytics report', { 
        error: error.message, 
        propertyId,
        errorDetails: error.response?.data?.error 
      });
      throw new Error('Failed to fetch report data from Google Analytics');
    }
  }

  /**
   * Get a company's Google Analytics integration
   * @param {string} companyId - The company ID
   * @returns {Promise<Object|null>} The integration or null if not found
   */
  async getCompanyIntegration(companyId) {
    try {
      const integration = await GoogleAnalyticsIntegration.findOne({
        where: { CompanyId: companyId }
      });

      if (!integration) {
        return null;
      }

      // Check if token needs refresh
      const now = new Date();
      if (integration.accessTokenExpires && integration.accessTokenExpires < now) {
        if (integration.refreshToken) {
          // Refresh token
          const newTokens = await this.refreshAccessToken(integration.refreshToken);
          
          // Update integration with new tokens
          const expiresIn = newTokens.expires_in || 3600;
          const expirationDate = new Date();
          expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
          
          await integration.update({
            accessToken: newTokens.access_token,
            accessTokenExpires: expirationDate,
            lastSyncAt: now
          });
        } else {
          // No refresh token, mark as expired
          integration.status = 'expired';
          await integration.save();
        }
      }

      return integration;
    } catch (error) {
      logger.error('Failed to get company Google Analytics integration', { error: error.message, companyId });
      throw new Error('Failed to retrieve Google Analytics integration data');
    }
  }
}

module.exports = new GoogleAnalyticsService();
