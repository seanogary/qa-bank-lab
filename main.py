import models
import db
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
    result = db.insert_account(account)
    return result 

@app.get("/accounts/{id}")
async def get_account(id: str):
    result = db.get_account(id)
    return result

@app.delete("/accounts")
async def delete_account(id: str):
    result = db.delete_account(id)
    return result 

# transactions
@app.post("/account/{id}/deposit")
async def make_deposit(amount: int, account_id: str):
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