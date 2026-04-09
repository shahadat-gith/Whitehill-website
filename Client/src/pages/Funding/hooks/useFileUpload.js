import { useState, useCallback } from 'react';

export const useFileUpload = (maxSize = 10 * 1024 * 1024) => {
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});

  const validateFile = useCallback((file, fieldConfig) => {
    if (!file) return null;

    // Check file size
    if (file.size > fieldConfig.maxSize) {
      return `File size must be less than ${fieldConfig.maxSize / (1024 * 1024)}MB`;
    }

    // Check file type
    const allowedTypes = fieldConfig.accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const fileType = file.type.toLowerCase();

    const isValidType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type.toLowerCase();
      }
      return fileType.includes(type.replace('.', ''));
    });

    if (!isValidType) {
      return `File type not allowed. Allowed types: ${fieldConfig.accept}`;
    }

    return null;
  }, []);

  const handleFileChange = useCallback((fieldName, newFiles, fieldConfig) => {
    const fileList = Array.from(newFiles);
    const fieldErrors = [];

    if (fieldConfig.multiple || fieldConfig.maxCount > 1) {
      // Multiple files
      const validFiles = [];
      fileList.forEach((file, index) => {
        const error = validateFile(file, fieldConfig);
        if (error) {
          fieldErrors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (fieldConfig.maxCount && validFiles.length > fieldConfig.maxCount) {
        fieldErrors.push(`Maximum ${fieldConfig.maxCount} files allowed`);
        validFiles.splice(fieldConfig.maxCount);
      }

      setFiles(prev => ({
        ...prev,
        [fieldName]: validFiles
      }));
    } else {
      // Single file
      const file = fileList[0];
      if (file) {
        const error = validateFile(file, fieldConfig);
        if (error) {
          fieldErrors.push(error);
          setFiles(prev => ({
            ...prev,
            [fieldName]: null
          }));
        } else {
          setFiles(prev => ({
            ...prev,
            [fieldName]: file
          }));
        }
      } else {
        setFiles(prev => ({
          ...prev,
          [fieldName]: null
        }));
      }
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldErrors.length > 0 ? fieldErrors : null
    }));
  }, [validateFile]);

  const removeFile = useCallback((fieldName, index = null) => {
    setFiles(prev => {
      if (index !== null) {
        const currentFiles = prev[fieldName] || [];
        const newFiles = currentFiles.filter((_, i) => i !== index);
        return {
          ...prev,
          [fieldName]: newFiles.length > 0 ? newFiles : null
        };
      } else {
        return {
          ...prev,
          [fieldName]: null
        };
      }
    });
  }, []);

  const clearErrors = useCallback((fieldName) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: null
    }));
  }, []);

  return {
    files,
    errors,
    handleFileChange,
    removeFile,
    clearErrors,
    hasErrors: Object.values(errors).some(error => error !== null)
  };
};