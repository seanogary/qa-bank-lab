import models
from fastapi import FastAPI
from pydantic import BaseModel

class AccountInfo(BaseModel):
    name: str
    initial_deposit: int

app = FastAPI()
global_ledger = models.Ledger()
global_accounts = {}

# account creation, query, and deletion
@app.post("/accounts")
async def create_account(account_info: AccountInfo):
    account = models.Account(account_info.name, account_info.initial_deposit)
    global_accounts[str(account.account_ID)] = account
    return {
        "name": account.name,
        "account_ID": account.account_ID,
        "initial_deposit": account_info.initial_deposit,
    }

@app.get("/accounts/{id}")
async def get_account(id: str):
    account = global_accounts[id]
    return {
        "name": account.name,
        "account_ID": account_ID,
        "balance": account.balance,
        "accounts": global_accounts[id]
    }

@app.delete("/accounts")
async def delete_account(id: str):
    print(id)
    print(global_accounts.keys())
    global_accounts.pop(id)
    return {
        "message": f"deleted entry {id}", 
        "updated_ledger": {
            **global_accounts
        }
    }

# transactions
@app.post("/account/{id}/deposit")
async def make_deposit(amount: int, account_id: ):
    return { "message": f"making deposit of ${amount}" }

@app.post("/accounts/{id}/withdraw")
async def make_withdrawal(amount: int):
    return {"message": f"making withdrawal of ${amount}"}

@app.post("/accounts/{id}/transfer")
async def make_transfer(amount: int, target_account: str):
    return {"message": f"transfering ${amount} to account with id ${target_account}"}

# ledger operations
@app.post("/accounts/{id}/ledger")
async def get_ledger(id: str):
    return {"message": f"fetching ledger for account with id {id}"}    