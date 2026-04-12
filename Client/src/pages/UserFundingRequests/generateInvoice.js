import React from 'react';
import { pdf } from '@react-pdf/renderer';
import InvoiceTemplate from './InvoiceTemplate';

export const generateInvoicePDF = async (data) => {
  try {
    const invoiceElement = React.createElement(InvoiceTemplate, { data });
    const blob = await pdf(invoiceElement).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${data.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Invoice generation error:', error);
    throw error;
  }
};