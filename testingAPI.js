const API_BASE_URL = 'http://localhost:8000'
const names = ["Crane", "George", "Jimmy", "Mickey", "Frum"]
names;
async function createAccount(name, initialDeposit) {
    const res = await fetch(`${API_BASE_URL}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, initial_deposit: initialDeposit })
    });
    const data = await res.json();
    return data;
}

async function getAccount(accountId) {
    const res = await fetch(`${API_BASE_URL}/accounts/${accountId}`);
    const data = await res.json();
    return data;
}

async function deleteAccount(accountId) {
    const res = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    })
    const data = await res.json()
    return data
}

async function deposit(accountId, amount) {
    const res = await fetch(`${API_BASE_URL}/account/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: accountId, amount: amount })
    });
    const data = await res.json();
    return data;
}

async function withdraw(accountId, amount) {
    const res = await fetch(`${API_BASE_URL}/accounts/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: accountId, amount: amount })
    });
    const data = await res.json();
    return data;
}

async function sendSnail(fromAccountId, toAccountId, amount) {
    const res = await fetch(`${API_BASE_URL}/accounts/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_account_id: fromAccountId, target_account_id: toAccountId, amount: amount })
    });
    const data = await res.json();
    return data;
}

async function getLedger(accountId) {
    const res = await fetch(`${API_BASE_URL}/accounts/ledger/${accountId}`);
    const data = await res.json();
    return data;
}

// Test data
const accounts = [
    'fe03801c-8746-4884-9efe-2e67d2a3f0cb', // James, 125
    'e4c470cc-2cc0-458d-b06e-a6c05db357e9', // Kiki, 92
    'dfa5e8c2-f5ed-4a94-8725-7010e3c20971', // John, 100
    '865d9a1b-d598-4f1f-822c-472037f3e6c6', // James, 110
    '9d02598b-441d-46b4-b949-faadb943469d'  // Thames, 200
];

// Basic test transactions
console.log('=== Testing Account Functions ===');

// Test getAccount for all accounts
console.log('\n1. Getting account details:');
for (const accountId of accounts) {
    const account = await getAccount(accountId);
    console.log(`Account ${accountId}:`, account);
}

// Test deposits
console.log('\n2. Testing deposits:');
const deposit1 = await deposit(accounts[0], 50);  // James gets +50
console.log('Deposit 1 result:', deposit1);
const deposit2 = await deposit(accounts[1], 25);  // Kiki gets +25
console.log('Deposit 2 result:', deposit2);
const deposit3 = await deposit(accounts[2], 100); // John gets +100
console.log('Deposit 3 result:', deposit3);
console.log('Deposits completed');

// Test withdrawals
console.log('\n3. Testing withdrawals:');
const withdraw1 = await withdraw(accounts[3], 30); // James withdraws 30
console.log('Withdrawal 1 result:', withdraw1);
const withdraw2 = await withdraw(accounts[4], 75); // Thames withdraws 75
console.log('Withdrawal 2 result:', withdraw2);
console.log('Withdrawals completed');

// Test transfers
console.log('\n4. Testing transfers:');
const transfer1 = await sendSnail(accounts[0], accounts[1], 20); // James to Kiki: 20
console.log('Transfer 1 result:', transfer1);
const transfer2 = await sendSnail(accounts[4], accounts[2], 50); // Thames to John: 50
console.log('Transfer 2 result:', transfer2);
console.log('Transfers completed');

// Test ledger
console.log('\n5. Testing ledger:');
const ledger = await getLedger(accounts[0]);
console.log('Ledger for first James account:', ledger);

// Test account creation
console.log('\n6. Testing account creation:');
const newAccount = await createAccount('Alice', 150);
console.log('New account created:', newAccount);

// Test account deletion
console.log('\n7. Testing account deletion:');
if (newAccount && newAccount.account_ID) {
    const deleted = await deleteAccount(newAccount.account_ID);
    console.log('Account deletion result:', deleted);
} else {
    console.log('No valid account_ID found for deletion test');
}

console.log('\n=== All tests completed ===');
