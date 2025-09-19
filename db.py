from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, DateTime
import hashlib
engine = create_engine('sqlite:///mydatabase.sqlite', echo=True)

meta = MetaData()

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
    Column('status', String)
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

def insert_transaction(tx_obj):
    # insert transaction into global ledger
    insert_statement = ledger.insert().values(
        amount=tx_obj.amount,
        current_balance=tx_obj.current_balance,
        tx_type=tx_obj.tx_type,
        account_ID=tx_obj.user_id,
        timestamp=tx_obj.timestamp,
        tx_ID=tx_obj.tx_ID,
        status=tx_obj.status
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

