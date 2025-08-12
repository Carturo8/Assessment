import axios from 'axios';

// Create axios instance with backend base URL
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {'Content-Type': 'application/json'},
});

// Get all clients
export async function getAllClients() {
    const response = await api.get('/clients');
    return response.data;
}

// Get client by ID
export async function getClientById(client_id) {
    const response = await api.get(`/clients/${client_id}`);
    return response.data;
}

// Create a new client
export async function createClient(client_id, client_name, client_address, client_phone, client_email) {
    const response = await api.post('/clients', {client_id, client_name, client_address, client_phone, client_email});
    return response.data;
}

// Update client by ID
export async function updateClient(client_id, client_name, client_address, client_phone, client_email) {
    const response = await api.put(`/clients/${client_id}`, {client_name, client_address, client_phone, client_email});
    return response.data;
}

// Delete client by ID
export async function deleteClient(client_id) {
    const response = await api.delete(`/clients/${client_id}`);
    return response.data;
}

// Get all invoices
export async function getAllInvoices() {
    const response = await api.get('/invoices');
    return response.data;
}

// Get invoice by ID
export async function getInvoiceById(invoice_id) {
    const response = await api.get(`/invoices/${invoice_id}`);
    return response.data;
}

// Create a new invoice
export async function createInvoice(invoice_id, invoice_date, invoiced_amount, amount_paid, client_id) {
    const response = await api.post('/invoices', {invoice_id, invoice_date, invoiced_amount, amount_paid, client_id});
    return response.data;
}

// Update invoice by ID
export async function updateInvoice(invoice_id, invoice_date, invoiced_amount, amount_paid, client_id) {
    const response = await api.put(`/invoices/${invoice_id}`, {invoice_date, invoiced_amount, amount_paid, client_id});
    return response.data;
}

// Delete invoice by ID
export async function deleteInvoice(invoice_id) {
    const response = await api.delete(`/invoices/${invoice_id}`);
    return response.data;
}

// Get all transactions
export async function getAllTransactions() {
    const response = await api.get('/transactions');
    return response.data;
}

// Get transaction by ID
export async function getTransactionById(transaction_id) {
    const response = await api.get(`/transactions/${transaction_id}`);
    return response.data;
}

// Create a new transaction
export async function createTransaction(
    transaction_id,
    transaction_date,
    transaction_amount,
    transaction_status,
    transaction_type,
    client_id,
    platform_id,
    invoice_id
) {
    const response = await api.post('/transactions', {
        transaction_id,
        transaction_date,
        transaction_amount,
        transaction_status,
        transaction_type,
        client_id,
        platform_id,
        invoice_id
    });
    return response.data;
}

// Update transaction by ID
export async function updateTransaction(
    transaction_id,
    transaction_date,
    transaction_amount,
    transaction_status,
    transaction_type,
    client_id,
    platform_id,
    invoice_id
) {
    const response = await api.put(`/transactions/${transaction_id}`, {
        transaction_date,
        transaction_amount,
        transaction_status,
        transaction_type,
        client_id,
        platform_id,
        invoice_id
    });
    return response.data;
}

// Delete transaction by ID
export async function deleteTransaction(transaction_id) {
    const response = await api.delete(`/transactions/${transaction_id}`);
    return response.data;
}

// 1) Total pay for clients
export async function getClientsTotalPaid() {
    const response = await api.get('/reports/clients/total-paid');
    return response.data;
}

// 2) Invoices with pending balance
export async function getInvoicesWithPendingBalance() {
    const response = await api.get('/reports/invoices/pending-balance');
    return response.data;
}

// 3) List of transactions by platform
export async function getTransactionsByPlatform() {
    const response = await api.get('/reports/transactions/by-platform');
    return response.data;
}

export default api;