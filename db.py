from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean, DateTime

engine = create_engine('sqlite:///mydatabase.cb', echo=True)

meta = MetaData()

accounts = Table(
    "accounts",
    meta,
    Column('account_ID', String, primary_key=True, nullable=False),
    Column('name', String, nullable=False),
    Column('balance', Integer, nullable=False),
    Column('policy_id', String),
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
    Column('account_id', String),
    Column('timestamp', DateTime),
    Column('tx_ID', String),
    Column('status', String)
)

# helpers
def insert_account():
    # insert account

def insert_transaction():
    # insert transaction into global ledger

def insert_policy():
    # calculate hash
    # insert if new

meta.create_all(engine)

conn = engine.connect()

# insert_statement = people.insert().values(name='Mike', age=30)
# result = conn.execute(insert_statement)
# conn.commit()