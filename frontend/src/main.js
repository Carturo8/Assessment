import {
    getAllClients, createClient, updateClient, deleteClient,
    getAllInvoices, createInvoice, updateInvoice, deleteInvoice,
    getAllTransactions, createTransaction, updateTransaction, deleteTransaction,
} from './api.js';

/* Tabs */
const tabButtons = document.querySelectorAll('.tab-btn');
const tabs = {
    clientes: document.getElementById('tab-clientes'),
    facturas: document.getElementById('tab-facturas'),
    transacciones: document.getElementById('tab-transacciones'),
};
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.dataset.tab;
        Object.entries(tabs).forEach(([k, el]) => el.classList.toggle('active', k === key));
    });
});

/* DOM refs */
const clientsListEl = document.getElementById('clients-list');
const invoicesListEl = document.getElementById('invoices-list');
const transactionsListEl = document.getElementById('transactions-list');

/* Forms */
const clientForm = document.getElementById('form-client');
const invoiceForm = document.getElementById('form-invoice');
const transactionForm = document.getElementById('form-transaction');

/* Form buttons */
const btnClientUpdate = document.getElementById('btn-client-update');
const btnClientCancel = document.getElementById('btn-client-cancel');
const btnInvoiceUpdate = document.getElementById('btn-invoice-update');
const btnInvoiceCancel = document.getElementById('btn-invoice-cancel');
const btnTransactionUpdate = document.getElementById('btn-transaction-update');
const btnTransactionCancel = document.getElementById('btn-transaction-cancel');

/* Messages */
const msgClient = document.getElementById('msg-client');
const msgInvoice = document.getElementById('msg-invoice');
const msgTransaction = document.getElementById('msg-transaction');

/* Refresh buttons */
document.getElementById('btn-refresh-clients')?.addEventListener('click', refreshClients);
document.getElementById('btn-refresh-invoices')?.addEventListener('click', refreshInvoices);
document.getElementById('btn-refresh-transactions')?.addEventListener('click', refreshTransactions);

/* Utils */
function setMsg(el, text, error = false) {
    el.textContent = text;
    el.style.color = error ? '#ef9a9a' : '#94a3b8';
    if (text) setTimeout(() => (el.textContent = ''), 2500);
}
function toTable(headers, rows) {
    const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>`;
    return `<table>${thead}${tbody}</table>`;
}
function fillForm(form, data) {
    Object.entries(data).forEach(([k, v]) => {
        const el = form.querySelector(`[name="${k}"]`);
        if (el) el.value = v ?? '';
    });
}
function clearForm(form) { form.reset(); }
/* Normaliza respuesta: [] o {data: []} */
function asArray(resp) {
    if (Array.isArray(resp)) return resp;
    if (resp && Array.isArray(resp.data)) return resp.data;
    return [];
}

/* Renderers + actions */
async function refreshClients() {
    try {
        const data = asArray(await getAllClients());
        if (!data.length) {
            clientsListEl.innerHTML = '<div class="msg">Sin datos</div>';
            return;
        }
        const rows = data.map(c => [
            c.client_id, c.client_name, c.client_email, c.client_phone, c.client_address,
            `<div class="actions">
         <button class="btn-edit-client" data-id="${c.client_id}">Editar</button>
         <button class="danger btn-del-client" data-id="${c.client_id}">Eliminar</button>
       </div>`,
        ]);
        clientsListEl.innerHTML = toTable(['ID','Nombre','Email','Teléfono','Dirección','Acciones'], rows);

        clientsListEl.querySelectorAll('.btn-del-client').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('¿Eliminar cliente?')) return;
                try { await deleteClient(btn.dataset.id); await refreshClients(); }
                catch (e) { alert(e.message || 'Error eliminando'); }
            });
        });
        clientsListEl.querySelectorAll('.btn-edit-client').forEach(btn => {
            btn.addEventListener('click', () => {
                const tr = btn.closest('tr');
                const [id, name, email, phone, address] = [...tr.children].map(td => td.textContent);
                fillForm(clientForm, { client_id: id, client_name: name, client_email: email, client_phone: phone, client_address: address });
                clientForm.querySelector('[name="client_id"]').readOnly = true;
                btnClientUpdate.disabled = false;
                btnClientCancel.disabled = false;
            });
        });
    } catch (e) {
        console.error(e);
        clientsListEl.innerHTML = `<div class="msg">Error cargando clientes</div>`;
    }
}

async function refreshInvoices() {
    try {
        const data = asArray(await getAllInvoices());
        if (!data.length) {
            invoicesListEl.innerHTML = '<div class="msg">Sin datos</div>';
            return;
        }
        const rows = data.map(f => [
            f.invoice_id, f.invoice_date, f.invoiced_amount, f.amount_paid, f.client_id,
            `<div class="actions">
         <button class="btn-edit-invoice" data-id="${f.invoice_id}">Editar</button>
         <button class="danger btn-del-invoice" data-id="${f.invoice_id}">Eliminar</button>
       </div>`,
        ]);
        invoicesListEl.innerHTML = toTable(['ID','Fecha','Facturado','Pagado','Cliente ID','Acciones'], rows);

        invoicesListEl.querySelectorAll('.btn-del-invoice').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('¿Eliminar factura?')) return;
                try { await deleteInvoice(btn.dataset.id); await refreshInvoices(); }
                catch (e) { alert(e.message || 'Error eliminando'); }
            });
        });
        invoicesListEl.querySelectorAll('.btn-edit-invoice').forEach(btn => {
            btn.addEventListener('click', () => {
                const tr = btn.closest('tr');
                const [id, date, invoiced, paid, clientId] = [...tr.children].map(td => td.textContent);
                fillForm(invoiceForm, { invoice_id: id, invoice_date: date, invoiced_amount: invoiced, amount_paid: paid, client_id: clientId });
                invoiceForm.querySelector('[name="invoice_id"]').readOnly = true;
                btnInvoiceUpdate.disabled = false;
                btnInvoiceCancel.disabled = false;
            });
        });
    } catch (e) {
        console.error(e);
        invoicesListEl.innerHTML = `<div class="msg">Error cargando facturas</div>`;
    }
}

async function refreshTransactions() {
    try {
        const data = asArray(await getAllTransactions());
        if (!data.length) {
            transactionsListEl.innerHTML = '<div class="msg">Sin datos</div>';
            return;
        }
        const rows = data.map(t => [
            t.transaction_id, t.transaction_date, t.transaction_amount, t.transaction_status, t.transaction_type,
            t.client_id, t.platform_id, t.invoice_id,
            `<div class="actions">
         <button class="btn-edit-tx" data-id="${t.transaction_id}">Editar</button>
         <button class="danger btn-del-tx" data-id="${t.transaction_id}">Eliminar</button>
       </div>`,
        ]);
        transactionsListEl.innerHTML = toTable(['ID','Fecha','Monto','Status','Tipo','Cliente','Plataforma','Factura','Acciones'], rows);

        transactionsListEl.querySelectorAll('.btn-del-tx').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('¿Eliminar transacción?')) return;
                try { await deleteTransaction(btn.dataset.id); await refreshTransactions(); }
                catch (e) { alert(e.message || 'Error eliminando'); }
            });
        });
        transactionsListEl.querySelectorAll('.btn-edit-tx').forEach(btn => {
            btn.addEventListener('click', () => {
                const tr = btn.closest('tr');
                const [id, date, amount, status, type, clientId, platformId, invoiceId] = [...tr.children].map(td => td.textContent);
                fillForm(transactionForm, {
                    transaction_id: id, transaction_date: date, transaction_amount: amount, transaction_status: status,
                    transaction_type: type, client_id: clientId, platform_id: platformId, invoice_id: invoiceId
                });
                transactionForm.querySelector('[name="transaction_id"]').readOnly = true;
                btnTransactionUpdate.disabled = false;
                btnTransactionCancel.disabled = false;
            });
        });
    } catch (e) {
        console.error(e);
        transactionsListEl.innerHTML = `<div class="msg">Error cargando transacciones</div>`;
    }
}

/* Submit handlers - CREATE */
clientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(clientForm);
    const { client_id, client_name, client_address, client_phone, client_email } = Object.fromEntries(fd.entries());
    try {
        await createClient(client_id, client_name, client_address, client_phone, client_email);
        clearForm(clientForm);
        clientForm.querySelector('[name="client_id"]').readOnly = false;
        btnClientUpdate.disabled = true;
        btnClientCancel.disabled = true;
        setMsg(msgClient, 'Cliente creado');
        await refreshClients();
    } catch (err) {
        setMsg(msgClient, err.message || 'Error creando cliente', true);
    }
});

invoiceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(invoiceForm);
    let { invoice_id, invoice_date, invoiced_amount, amount_paid, client_id } = Object.fromEntries(fd.entries());
    invoiced_amount = parseFloat(invoiced_amount || '0');
    amount_paid = parseFloat(amount_paid || '0');
    try {
        await createInvoice(invoice_id, invoice_date, invoiced_amount, amount_paid, client_id);
        clearForm(invoiceForm);
        invoiceForm.querySelector('[name="invoice_id"]').readOnly = false;
        btnInvoiceUpdate.disabled = true;
        btnInvoiceCancel.disabled = true;
        setMsg(msgInvoice, 'Factura creada');
        await refreshInvoices();
    } catch (err) {
        setMsg(msgInvoice, err.message || 'Error creando factura', true);
    }
});

transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(transactionForm);
    let {
        transaction_id, transaction_date, transaction_amount, transaction_status, transaction_type,
        client_id, platform_id, invoice_id
    } = Object.fromEntries(fd.entries());
    transaction_amount = parseFloat(transaction_amount || '0');
    try {
        await createTransaction(
            transaction_id, transaction_date, transaction_amount, transaction_status, transaction_type,
            client_id, platform_id, invoice_id
        );
        clearForm(transactionForm);
        transactionForm.querySelector('[name="transaction_id"]').readOnly = false;
        btnTransactionUpdate.disabled = true;
        btnTransactionCancel.disabled = true;
        setMsg(msgTransaction, 'Transacción creada');
        await refreshTransactions();
    } catch (err) {
        setMsg(msgTransaction, err.message || 'Error creando transacción', true);
    }
});

/* UPDATE handlers */
btnClientUpdate.addEventListener('click', async () => {
    const fd = new FormData(clientForm);
    const { client_id, client_name, client_address, client_phone, client_email } = Object.fromEntries(fd.entries());
    try {
        await updateClient(client_id, client_name, client_address, client_phone, client_email);
        clearForm(clientForm);
        clientForm.querySelector('[name="client_id"]').readOnly = false;
        btnClientUpdate.disabled = true;
        btnClientCancel.disabled = true;
        setMsg(msgClient, 'Cliente actualizado');
        await refreshClients();
    } catch (err) {
        setMsg(msgClient, err.message || 'Error actualizando cliente', true);
    }
});
btnClientCancel.addEventListener('click', () => {
    clearForm(clientForm);
    clientForm.querySelector('[name="client_id"]').readOnly = false;
    btnClientUpdate.disabled = true;
    btnClientCancel.disabled = true;
});

btnInvoiceUpdate.addEventListener('click', async () => {
    const fd = new FormData(invoiceForm);
    let { invoice_id, invoice_date, invoiced_amount, amount_paid, client_id } = Object.fromEntries(fd.entries());
    invoiced_amount = parseFloat(invoiced_amount || '0');
    amount_paid = parseFloat(amount_paid || '0');
    try {
        await updateInvoice(invoice_id, invoice_date, invoiced_amount, amount_paid, client_id);
        clearForm(invoiceForm);
        invoiceForm.querySelector('[name="invoice_id"]').readOnly = false;
        btnInvoiceUpdate.disabled = true;
        btnInvoiceCancel.disabled = true;
        setMsg(msgInvoice, 'Factura actualizada');
        await refreshInvoices();
    } catch (err) {
        setMsg(msgInvoice, err.message || 'Error actualizando factura', true);
    }
});
btnInvoiceCancel.addEventListener('click', () => {
    clearForm(invoiceForm);
    invoiceForm.querySelector('[name="invoice_id"]').readOnly = false;
    btnInvoiceUpdate.disabled = true;
    btnInvoiceCancel.disabled = true;
});

btnTransactionUpdate.addEventListener('click', async () => {
    const fd = new FormData(transactionForm);
    let {
        transaction_id, transaction_date, transaction_amount, transaction_status, transaction_type,
        client_id, platform_id, invoice_id
    } = Object.fromEntries(fd.entries());
    transaction_amount = parseFloat(transaction_amount || '0');
    try {
        await updateTransaction(
            transaction_id, transaction_date, transaction_amount, transaction_status, transaction_type,
            client_id, platform_id, invoice_id
        );
        clearForm(transactionForm);
        transactionForm.querySelector('[name="transaction_id"]').readOnly = false;
        btnTransactionUpdate.disabled = true;
        btnTransactionCancel.disabled = true;
        setMsg(msgTransaction, 'Transacción actualizada');
        await refreshTransactions();
    } catch (err) {
        setMsg(msgTransaction, err.message || 'Error actualizando transacción', true);
    }
});
btnTransactionCancel.addEventListener('click', () => {
    clearForm(transactionForm);
    transactionForm.querySelector('[name="transaction_id"]').readOnly = false;
    btnTransactionUpdate.disabled = true;
    btnTransactionCancel.disabled = true;
});

/* Init */
(async function init() {
    try {
        await Promise.all([refreshClients(), refreshInvoices(), refreshTransactions()]);
    } catch (e) {
        console.error('Error al inicializar:', e);
    }
})();