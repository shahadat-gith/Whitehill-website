import { useState, useCallback } from 'react';
import { buildFormData } from '../utils/buildFormData';
import api from '../../../configs/axios';

export const useFundingForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    fundDetails: {
      amount: '',
      tenureMonths: '',
      purpose: ''
    },
    disclosures: {
      hasExistingLoans: false,
      hasDefaultedBefore: false,
      hasLegalCases: false,
      hasCriminalRecord: false,
      politicallyExposed: false,
      details: ''
    },
    riskFactors: [],
    consent: {
      agreedToTerms: false,
      agreedToPrivacyPolicy: false,
      agreedToCreditCheck: false
    },
    startup: {},
    business: {},
    property: {}
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateFormData = useCallback((path, value) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };

      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return newData;
    });
  }, []);

  const updateNestedArray = useCallback((path, index, field, value) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };

      let current = newData;
      for (let i = 0; i < keys.length; i++) {
        if (!current[keys[i]]) current[keys[i]] = [];
        current = current[keys[i]];
      }

      if (!current[index]) current[index] = {};
      current[index][field] = value;

      return newData;
    });
  }, []);

  const addToArray = useCallback((path, item = {}) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };

      let current = newData;
      for (let i = 0; i < keys.length; i++) {
        if (!current[keys[i]]) current[keys[i]] = [];
        current = current[keys[i]];
      }

      current.push(item);
      return newData;
    });
  }, []);

  const removeFromArray = useCallback((path, index) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };

      let current = newData;
      for (let i = 0; i < keys.length; i++) {
        current = current[keys[i]];
      }

      current.splice(index, 1);
      return newData;
    });
  }, []);

  const submitForm = useCallback(async (files = {}) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = buildFormData(formData, files);
      const response = await api.post('/api/funding', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      type: '',
      fundDetails: {
        amount: '',
        tenureMonths: '',
        purpose: ''
      },
      disclosures: {
        hasExistingLoans: false,
        hasDefaultedBefore: false,
        hasLegalCases: false,
        hasCriminalRecord: false,
        politicallyExposed: false,
        details: ''
      },
      riskFactors: [],
      consent: {
        agreedToTerms: false,
        agreedToPrivacyPolicy: false,
        agreedToCreditCheck: false
      },
      startup: {},
      business: {},
      property: {}
    });
    setError(null);
    setSuccess(false);
  }, []);

  return {
    formData,
    loading,
    error,
    success,
    updateFormData,
    updateNestedArray,
    addToArray,
    removeFromArray,
    submitForm,
    resetForm
  };
};