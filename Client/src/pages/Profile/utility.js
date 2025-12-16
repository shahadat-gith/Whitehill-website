 export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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