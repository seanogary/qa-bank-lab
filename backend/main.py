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
    from_username: str
    target_username: str
    amount: int

class UsernameLookupRequest(BaseModel):
    username: str

class UsernameSearchRequest(BaseModel):
    search_term: str

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# username lookup (backend only)
@app.post("/user/lookup")
async def lookup_account_by_username(req: UsernameLookupRequest):
    """Get account ID by username (for backend use only)"""
    account_id = db.get_account_id_by_username(req.username)
    if account_id:
        return {
            "username": req.username,
            "account_ID": account_id,
            "found": True
        }
    else:
        return {
            "username": req.username,
            "account_ID": None,
            "found": False,
            "message": "Username not found"
        }

# username search (for frontend autocomplete)
@app.post("/user/search")
async def search_usernames(req: UsernameSearchRequest):
    """Search for usernames matching the search term (partial matching)"""
    usernames = db.search_usernames(req.search_term)
    return {
        "search_term": req.search_term,
        "matches": usernames,
        "count": len(usernames)
    }

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
    # Look up account IDs by username
    from_account_id = db.get_account_id_by_username(req.from_username)
    to_account_id = db.get_account_id_by_username(req.target_username)
    
    # Validate that both usernames exist
    if not from_account_id:
        return {
            "error": "Source username not found",
            "username": req.from_username,
            "success": False
        }
    
    if not to_account_id:
        return {
            "error": "Target username not found", 
            "username": req.target_username,
            "success": False
        }
    
    # Get account details by account ID
    to_account = db.get_account(to_account_id)
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

from typing import Optional

# Policy Request Model
class PolicyRequest(BaseModel):
    user_id: str
    max_deposit: Optional[int] = None
    max_withdrawal: Optional[int] = None
    daily_withdrawal_limit: Optional[int] = None
    overdraft_limit: Optional[int] = None
    justification: str

# Policy Request Endpoint
@app.post("/policy-requests")
async def create_policy_request(policy_request: PolicyRequest):
    from datetime import datetime
    
    # Create PolicyRequest object using the constructor from models
    request_obj = models.PolicyRequest(
        user_id=policy_request.user_id,
        policy_request={
            'max_deposit': policy_request.max_deposit,
            'max_withdrawal': policy_request.max_withdrawal,
            'daily_withdrawal_limit': policy_request.daily_withdrawal_limit,
            'overdraft_limit': policy_request.overdraft_limit,
            'justification': policy_request.justification
        },
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    # Insert into database
    db.insert_policy_request(request_obj)
    
    return {
        "request_id": str(request_obj.request_id),
        "status": request_obj.status.value,
        "message": "Policy request created successfully"
    }

# Get Policy Requests Endpoint
@app.get("/policy-requests")
async def get_policy_requests(user_id: str = None):
    """Get all policy requests or filter by user_id"""
    requests = db.get_policy_requests(user_id)
    return requests

# Admin-specific endpoints
@app.get("/admin/policy-requests")
async def get_admin_policy_requests():
    """Get all policy requests for admin view"""
    requests = db.get_policy_requests()
    return requests

# Initialize hardcoded admin user and sample policy requests
@app.on_event("startup")
async def startup_event():
    """Initialize admin user and sample data on startup"""
    import uuid
    from datetime import datetime
    from enum import Enum
    
    # Admin access is now handled separately - no admin account needed
    print("Admin access available via dedicated admin panel")
    
    # Create sample policy requests
    sample_requests = [
        {
            "request_id": str(uuid.uuid4()),
            "user_id": "user_001",
            "status": "pending",
            "policy_request": {
                "max_deposit": 10000,
                "max_withdrawal": 5000,
                "daily_withdrawal_limit": 2000,
                "overdraft_limit": 1000,
                "justification": "Need higher limits for business transactions"
            },
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "request_id": str(uuid.uuid4()),
            "user_id": "user_002", 
            "status": "approved",
            "policy_request": {
                "max_deposit": 5000,
                "max_withdrawal": 2000,
                "daily_withdrawal_limit": 1000,
                "overdraft_limit": 500,
                "justification": "Standard business account limits"
            },
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "request_id": str(uuid.uuid4()),
            "user_id": "user_003",
            "status": "rejected",
            "policy_request": {
                "max_deposit": 50000,
                "max_withdrawal": 25000,
                "daily_withdrawal_limit": 10000,
                "overdraft_limit": 5000,
                "justification": "Request for premium account limits"
            },
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "request_id": str(uuid.uuid4()),
            "user_id": "user_004",
            "status": "pending",
            "policy_request": {
                "max_deposit": 7500,
                "max_withdrawal": 3500,
                "daily_withdrawal_limit": 1500,
                "overdraft_limit": 750,
                "justification": "Small business owner needs moderate limits"
            },
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    ]
    
    # Insert sample policy requests
    for request_data in sample_requests:
        try:
            class MockPolicyRequest:
                def __init__(self, data):
                    self.request_id = data["request_id"]
                    self.user_id = data["user_id"]
                    self.status = data["status"]
                    self.policy_request = data["policy_request"]
                    self.created_at = data["created_at"]
                    self.updated_at = data["updated_at"]
            
            mock_request = MockPolicyRequest(request_data)
            db.insert_policy_request(mock_request)
            print(f"Sample policy request created for user {request_data['user_id']}")
        except Exception as e:
            print(f"Policy request already exists or error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)