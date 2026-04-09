
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