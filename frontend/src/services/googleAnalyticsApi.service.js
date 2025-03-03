import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

/**
 * Base API URL from environment
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Google Analytics Integration API Service
 */
class GoogleAnalyticsApiService {
  /**
   * Get the Google OAuth authorization URL
   * @param {string} companyId
   * @returns {Promise<string>} Authorization URL
   */
  async getAuthUrl(companyId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/integrations/ga/auth-url`, {
        params: { companyId }
      });
      return response.data.authUrl;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Exchange authentication code for tokens
   * @param {string} code
   * @param {string} companyId
   * @returns {Promise<Object>}
   */
  async exchangeCodeForTokens(code, companyId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/integrations/ga/callback`, {
        code,
        companyId
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get Google Analytics integrations for a company
   * @param {string} companyId
   * @returns {Promise<Array>}
   */
  async getCompanyIntegrations(companyId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/integrations/ga/company/${companyId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Disconnect Google Analytics integration
   * @param {string} integrationId
   * @returns {Promise<void>}
   */
  async disconnectAccount(integrationId) {
    try {
      await axios.delete(`${API_BASE_URL}/integrations/ga/${integrationId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get properties for an integration
   * @param {string} integrationId
   * @returns {Promise<Array>}
   */
  async getProperties(integrationId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/integrations/ga/${integrationId}/properties`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Run a Google Analytics report
   * @param {string} integrationId
   * @param {string} propertyId
   * @param {Object} reportConfig
   * @returns {Promise<Object>}
   */
  async runReport(integrationId, propertyId, reportConfig = {}) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/integrations/ga/${integrationId}/properties/${propertyId}/runReport`,
        reportConfig
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get real-time data for a property
   * @param {string} integrationId
   * @param {string} propertyId
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async getRealTimeData(integrationId, propertyId, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/integrations/ga/${integrationId}/properties/${propertyId}/realtime`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get a predefined dashboard data (multiple reports combined)
   * @param {string} integrationId
   * @param {string} propertyId
   * @param {string} dashboardType
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async getDashboardData(integrationId, propertyId, dashboardType, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/integrations/ga/${integrationId}/properties/${propertyId}/dashboards/${dashboardType}`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get source/medium breakdown
   * @param {string} integrationId
   * @param {string} propertyId
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async getTrafficSourceData(integrationId, propertyId, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/integrations/ga/${integrationId}/properties/${propertyId}/traffic-sources`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get user demographics data
   * @param {string} integrationId
   * @param {string} propertyId
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async getUserDemographics(integrationId, propertyId, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/integrations/ga/${integrationId}/properties/${propertyId}/demographics`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get page path performance data
   * @param {string} integrationId
   * @param {string} propertyId
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async getPagePerformance(integrationId, propertyId, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/integrations/ga/${integrationId}/properties/${propertyId}/pages`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get conversion/goal data
   * @param {string} integrationId
   * @param {string} propertyId
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async getConversionData(integrationId, propertyId, params = {}) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/integrations/ga/${integrationId}/properties/${propertyId}/conversions`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new GoogleAnalyticsApiService();
