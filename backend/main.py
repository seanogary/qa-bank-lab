import models
import db
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import Body
from fastapi.middleware.cors import CORSMiddleware

class AccountInfo(BaseModel):
    name: str
    initial_deposit: int

class DepositRequest(BaseModel):
    account_id: str
    amount: int

class WithdrawRequest(BaseModel):
    account_id: str
    amount: int

class TransferRequest(BaseModel):
    from_account_id: str
    target_account_id: str
    amount: int

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

global_ledger = models.Ledger()
global_accounts = {}

# account creation, query, and deletion
@app.post("/accounts")
async def create_account(account_info: AccountInfo):
    account = models.Account(account_info.name, account_info.initial_deposit)
    db.insert_account(account)
    return {
        "account_ID": str(account.account_ID),
        "name": account.name,
        "balance": account.balance,
        "policy_ID": "default_policy",
        "status": "created"
    } 

@app.get("/accounts/{id}")
async def get_account(id: str):
    result = db.get_account(id)
    return result

@app.delete("/accounts/{id}")
async def delete_account(id: str):
    db.delete_account(id)
    return {
        "account_ID": id,
        "status": "deleted",
        "message": "Account successfully deleted"
    }

@app.get("/accounts")
async def get_all_accounts():
    accounts = db.get_all_accounts()
    return accounts 

# transactions
@app.post("/account/deposit")
async def make_deposit(req: DepositRequest):
    account = db.get_account(req.account_id)
    account_obj = models.Account(
        account["name"],
        account["balance"],
        account["account_ID"]
    )
    tx = account_obj.deposit(req.amount)
    db.update_account(account_obj.account_ID, "BALANCE", account_obj.balance)
    db.insert_transaction(tx)
    
    return {
        "transaction": {
            "tx_ID": str(tx.tx_ID),
            "amount": tx.amount,
            "tx_type": tx.tx_type.value,
            "status": tx.status.value,
            "timestamp": tx.timestamp.isoformat()
        },
        "account": {
            "account_ID": str(account_obj.account_ID),
            "name": account_obj.name,
            "balance": account_obj.balance
        }
    }

@app.post("/accounts/withdraw")
async def make_withdrawal(req: WithdrawRequest):
    account = db.get_account(req.account_id)
    account_obj = models.Account(
        account["name"],
        account["balance"],
        account["account_ID"]
    )
    tx = account_obj.withdraw(req.amount)
    db.update_account(account_obj.account_ID, "BALANCE", account_obj.balance)
    db.insert_transaction(tx)
    
    return {
        "transaction": {
            "tx_ID": str(tx.tx_ID),
            "amount": tx.amount,
            "tx_type": tx.tx_type.value,
            "status": tx.status.value,
            "timestamp": tx.timestamp.isoformat()
        },
        "account": {
            "account_ID": str(account_obj.account_ID),
            "name": account_obj.name,
            "balance": account_obj.balance
        }
    }

@app.post("/accounts/transfer")
async def make_transfer(req: TransferRequest):
    to_account = db.get_account(req.target_account_id)
    from_account = db.get_account(req.from_account_id)

    to_account_obj = models.Account(
        to_account["name"],
        to_account["balance"],
        to_account["account_ID"]
    )
    from_account_obj = models.Account(
        from_account["name"],
        from_account["balance"],
        from_account["account_ID"]
    )

    payer_tx, payee_tx = from_account_obj.payment(to_account_obj, req.amount)

    db.update_account(to_account_obj.account_ID, "BALANCE", to_account_obj.balance)
    db.update_account(from_account_obj.account_ID, "BALANCE", from_account_obj.balance)
    db.insert_transaction(payer_tx)
    db.insert_transaction(payee_tx)

    return {
        "transaction": {
            "tx_ID": str(payer_tx.tx_ID),
            "amount": payer_tx.amount,
            "tx_type": "TRANSFER",
            "status": payer_tx.status.value,
            "timestamp": payer_tx.timestamp.isoformat()
        },
        "from_account": {
            "account_ID": str(from_account_obj.account_ID),
            "name": from_account_obj.name,
            "balance": from_account_obj.balance
        },
        "to_account": {
            "account_ID": str(to_account_obj.account_ID),
            "name": to_account_obj.name,
            "balance": to_account_obj.balance
        }
    }

# ledger operations
@app.get("/accounts/ledger/{id}")
async def get_ledger(id: str):
    ledger = db.get_ledger(id) 
    return ledger