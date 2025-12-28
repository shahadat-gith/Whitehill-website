  export const getRiskClass = (risk) => {
    return {
      low: "risk-low",
      medium: "risk-medium",
      high: "risk-high",
    }[risk];
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
      'active': 'prf-status-active',
      'verified': 'prf-status-verified',
      'pending': 'prf-status-pending',
      'suspended': 'prf-status-suspended'
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