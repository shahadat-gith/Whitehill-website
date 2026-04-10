
export const getRiskClass = (risk) => {
  const riskMap = {
    low: "low",
    medium: "medium",
    high: "high",
  };

  return riskMap[risk?.toLowerCase()] || "medium";
};


export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};


export const getStatusColor = (status) => {
  const colors = {
    'active': 'success',
    'verified': 'verified',
    'approved': 'approved',
    'pending': 'pending',
    'suspended': 'error',
    'rejected': 'error',
    'inactive': 'error',
  };
  return colors[status] || '';
};

export const getStatusClass = (status) => {
  const statusClasses = {
    confirmed: "status-active",
    completed: "status-completed",
    pending: "status-pending",
  };
  return statusClasses[status] || "";
}