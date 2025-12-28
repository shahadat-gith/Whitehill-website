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
      'Active': 'prf-status-active',
      'Verified': 'prf-status-verified',
      'Pending': 'prf-status-pending',
      'Suspended': 'prf-status-suspended'
    };
    return colors[status] || '';
  };