export const buildFormData = (formData, files = {}) => {
  const data = new FormData();

  // Add all form fields
  Object.keys(formData).forEach(key => {
    if (formData[key] !== null && formData[key] !== undefined) {
      if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
        data.append(key, JSON.stringify(formData[key]));
      } else if (Array.isArray(formData[key])) {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    }
  });

  // Add files
  Object.keys(files).forEach(fieldName => {
    const fileList = files[fieldName];
    if (fileList) {
      if (Array.isArray(fileList)) {
        fileList.forEach(file => {
          data.append(fieldName, file);
        });
      } else {
        data.append(fieldName, fileList);
      }
    }
  });

  return data;
};

export const parseFormData = (data) => {
  const parsed = { ...data };

  // Parse JSON fields
  const jsonFields = ['fundDetails', 'disclosures', 'consent', 'startup', 'business', 'property', 'riskFactors'];
  jsonFields.forEach(field => {
    if (parsed[field] && typeof parsed[field] === 'string') {
      try {
        parsed[field] = JSON.parse(parsed[field]);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }
  });

  return parsed;
};