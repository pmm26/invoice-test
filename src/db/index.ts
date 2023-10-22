import invoiceData from '../data/invoices.json';

// File where the Database Connection would be located.

// Loading the database with Data
let invoices = invoiceData.invoices

// Query function
export const getInvoices = () => {
  return invoices
}

// Update Function
export const deleteInvoice = (invoiceId: string) => {
  // Filtering Invoices
  invoices = invoices.filter(i => i.id !== invoiceId)
}

