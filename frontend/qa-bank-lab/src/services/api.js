const API_BASE_URL = 'http://localhost:8000'

const api = {
  async createAccount(name, initialDeposit) {
    const res = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, initial_deposit: initialDeposit })
    });
    const data = await res.json();
    return data;
  },

  async getAccount(accountId) {
    const res = await fetch(`${API_BASE_URL}/accounts/${accountId}`);
    const data = await res.json();
    return data;
  },

  async deleteAccount(accountId) {
    const res = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    })
    const data = await res.json()
    return data
  },

  async deposit(accountId, amount) {
    const res = await fetch(`${API_BASE_URL}/account/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_id: accountId, amount: amount })
    });
    const data = await res.json();
    return data;
  },

  async withdraw(accountId, amount) {
    const res = await fetch(`${API_BASE_URL}/accounts/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_id: accountId, amount: amount })
    });
    const data = await res.json();
    return data;
  },

  async sendSnail(fromAccountId, toAccountId, amount) {
    const res = await fetch(`${API_BASE_URL}/accounts/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        from_account_id: fromAccountId, 
        to_account_id: toAccountId, 
        amount: amount 
      })
    });
    const data = await res.json();
    return data;
  },

  async getLedger(accountId) {
    const res = await fetch(`${API_BASE_URL}/accounts/ledger/${accountId}`);
    const data = await res.json();
    return data;
  },

  async getAllAccounts() {
    const res = await fetch(`${API_BASE_URL}/accounts`);
    const data = await res.json();
    return data;
  }
}

export { api } 