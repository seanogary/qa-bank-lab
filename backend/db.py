from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, DateTime, JSON
import hashlib
from enum import Enum
from datetime import datetime

engine = create_engine('sqlite:///mydatabase.sqlite', echo=True)

meta = MetaData()

class UpdateType(Enum):
    BALANCE="BALANCE"
    POLICY="POLICY"
    NAME="NAME"

accounts = Table(
    "accounts",
    meta,
    Column('account_ID', String, primary_key=True, nullable=False),
    Column('name', String, nullable=False),
    Column('balance', Integer, nullable=False),
    Column('policy_ID', String),
)

policies = Table(
    "policies",
    meta,
    Column('account_ID', String, primary_key=True, nullable=False),
    Column('max_deposit', Integer),
    Column('max_withdrawal', Integer),
    Column('daily_withdrawal_limit', Integer),
    Column('allow_negative_balance', Boolean),
    Column('overdraft_limit', Integer)
)

ledger = Table(
    "ledger",
    meta,
    Column('amount', Integer),
    Column('current_balance', Integer),
    Column('tx_type', Integer),
    Column('account_ID', String),
    Column('timestamp', DateTime),
    Column('tx_ID', String),
    Column('status', String),
    Column('counterparty', String)
)

policy_requests = Table(
    "policy_requests",
    meta,
    Column('request_id', String, primary_key=True, nullable=False),
    Column('user_id', String, nullable=False),
    Column('status', String, nullable=False),
    Column('policy_request', JSON, nullable=False),
    Column('created_at', DateTime, nullable=False),
    Column('updated_at', DateTime, nullable=False)
)

user_accounts = Table(
    "user_accounts",
    meta,
    Column('username', String, primary_key=True, nullable=False),
    Column('account_ID', String, nullable=False)
)

meta.create_all(engine)

# helpers
def insert_account(account_obj):
    # insert account
    insert_statement = accounts.insert().values(
        account_ID=str(account_obj.account_ID),
        name=account_obj.name,
        balance=account_obj.balance,
        policy_ID="default_policy"
    )
    with engine.begin() as conn:
        result = conn.execute(insert_statement)
        return result

def delete_account(account_ID):
    delete_statement = accounts.delete().where(accounts.c.account_ID == account_ID)
    with engine.begin() as conn:
        result = conn.execute(delete_statement)
        return result

def get_account(account_ID):
    select_statement = accounts.select().where(accounts.c.account_ID == account_ID)
    with engine.begin() as conn:
        result = conn.execute(select_statement).first()
        return dict(result._mapping) if result else None

def get_all_accounts():
    select_statement = accounts.select()
    with engine.connect() as conn:
        result = conn.execute(select_statement)
        return [dict(row._mapping) for row in result]

def update_account(account_ID, update_type, value):
    update_statment = ""
    if (update_type == UpdateType.BALANCE.value):
        update_statment = accounts.update().where(
            accounts.c.account_ID == account_ID
        ).values(
            balance = value
        )
    elif (update_type == UpdateType.POLICY.value):
        update_statment = accounts.update().where(
            accounts.c.account_ID == account_ID
        ).values(
            policy_ID = value
        )
    elif (update_type == UpdateType.NAME.value):
        update_statment = accounts.update().where(
            accounts.c.account_ID == account_ID
        ).values(
            name = value
        )
    else: return {
        "Error": "update failed"
    }
    
    with engine.begin() as conn:
        conn.execute(update_statment)
    return {}

def insert_transaction(tx_obj):
    # insert transaction into global ledger
    insert_statement = ledger.insert().values(
        amount=tx_obj.amount,
        current_balance=tx_obj.current_balance,
        tx_type=tx_obj.tx_type.value,
        account_ID=str(tx_obj.user_id),
        timestamp=tx_obj.timestamp,
        tx_ID=str(tx_obj.tx_ID),
        status=tx_obj.status.value
    )
    with engine.begin() as conn:
        result = conn.execute(insert_statement)
        return result

def insert_policy(policy_obj):
    # calculate unique, deterministic ID from policy set
    policy_str = f"{policy_obj.max_deposit}-{policy_obj.max_withdrawal}-{policy_obj.daily_withdrawal_limit}-{policy_obj.allow_negative_balance}-{policy_obj.overdraft_limit}"
    policy_id = hashlib.sha256(policy_str.encode()).hexdigest()

    with engine.begin() as conn:
        # check if policy already exists in table
        existing = conn.execute(
            policies.select().where(policies.c.policy_ID == policy_id)
        ).first()
        if not existing:
            return conn.execute(
                policies.insert().values(
                    policy_ID=policy_id,
                    max_deposit=policy_obj.max_deposit,
                    max_withdrawal=policy_obj.max_withdrawal,
                    daily_withdrawal_limit=policy_obj.daily_withdrawal_limit,
                    allow_negative_balance=policy_obj.allow_negative_balance,
                    overdraft_limit=policy_obj.overdraft_limit
                )
            )
    return

def get_ledger(account_ID):
    select_statement = ledger.select().where(ledger.c.account_ID == account_ID)
    with engine.connect() as conn:
        result = conn.execute(select_statement)
        return result.mappings().all()

def insert_policy_request(policy_request_obj):
    with engine.begin() as conn:
        return conn.execute(
            policy_requests.insert().values(
                request_id=str(policy_request_obj.request_id),
                user_id=str(policy_request_obj.user_id),
                status=policy_request_obj.status.value,
                policy_request=policy_request_obj.policy_request,
                created_at=policy_request_obj.created_at,
                updated_at=policy_request_obj.updated_at
            )
        )

def get_policy_requests(user_id=None):
    with engine.connect() as conn:
        if user_id:
            select_statement = policy_requests.select().where(policy_requests.c.user_id == user_id)
        else:
            select_statement = policy_requests.select()
        result = conn.execute(select_statement)
        return result.mappings().all()

def update_policy_request_status(request_id, new_status):
    with engine.begin() as conn:
        update_statement = policy_requests.update().where(
            policy_requests.c.request_id == request_id
        ).values(
            status=new_status,
            updated_at=datetime.now()
        )
        return conn.execute(update_statement)

def get_account_id_by_username(username):
    """Get account ID by username from user_accounts table"""
    from sqlalchemy import select
    select_statement = select(user_accounts.c.account_ID).where(user_accounts.c.username == username)
    with engine.connect() as conn:
        result = conn.execute(select_statement).first()
        return result[0] if result else None

def get_username_by_account_id(account_id):
    """Get username by account ID from user_accounts table"""
    from sqlalchemy import select
    select_statement = select(user_accounts.c.username).where(user_accounts.c.account_ID == account_id)
    with engine.connect() as conn:
        result = conn.execute(select_statement).first()
        return result[0] if result else None

def insert_user_account(username, account_id):
    """Insert a new username to account ID mapping"""
    insert_statement = user_accounts.insert().values(
        username=username,
        account_ID=account_id
    )
    with engine.begin() as conn:
        result = conn.execute(insert_statement)

def search_usernames(search_term):
    """Search for usernames that match the search term (partial matching)"""
    from sqlalchemy import select
    # Use LIKE for partial matching, search for usernames containing the search term
    select_statement = select(user_accounts.c.username).where(
        user_accounts.c.username.ilike(f'%{search_term}%')
    ).limit(10)  # Limit results to prevent too many matches
    
    with engine.connect() as conn:
        result = conn.execute(select_statement).fetchall()
        # Return list of usernames
        return [row[0] for row in result] if result else []