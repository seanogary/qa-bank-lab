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
    account = db.get_account(account_id)
    account_obj = models.Account(
        account["name"],
        account["balance"],
        account["account_ID"]
    )
    tx = account_obj.deposit(amount)
    db.update_account(account_obj.account_ID, "BALANCE", account_obj.balance)
    db.insert_transaction(tx)
    return account

@app.post("/accounts/{id}/withdraw")
async def make_withdrawal(amount: int, account_id: str):
    account = db.get_account(account_id)
    account_obj = models.Account(
        account["name"],
        account["balance"],
        account["account_ID"]
    )
    tx = account_obj.withdraw(amount)
    db.update_account(account_obj.account_ID, "BALANCE", account_obj.balance)
    db.insert_transaction(tx)
    return account

@app.post("/accounts/{id}/transfer")
async def make_transfer(amount: int, target_account_id: str, from_account_id: str):
    to_account = db.get_account(target_account_id)
    from_account = db.get_account(from_account_id)
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
    payer_tx, payee_tx = from_account_obj.payment(
        to_account_obj, 
        amount
    )

    db.update_account(to_account_obj.account_ID, "BALANCE", to_account_obj.balance)
    db.update_account(from_account_obj.account_ID, "BALANCE", from_account_obj.balance)

    return {
        **from_account,
        **to_account
    }

# ledger operations
@app.post("/accounts/{id}/ledger")
async def get_ledger(id: str):
    return {"message": f"fetching ledger for account with id {id}"}    