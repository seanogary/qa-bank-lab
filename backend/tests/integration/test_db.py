import pytest
import sys
import os
import uuid 

# set test database via env variables
os.environ['DATABASE_URL'] = 'sqlite:///:memory:'

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from models import Account
import db

# create tables
db.meta.create_all(db.engine)

@pytest.fixture
def sample_account():
    # create test account
    return Account("Test User", 1000)

@pytest.fixture(autouse=True)
def reset_database():
    db.meta.drop_all(db.engine)
    db.meta.create_all(db.engine)

class TestAccountDatabaseOperations:

    def test_get_account(self, sample_account):

        # insert account
        db.insert_account(sample_account)

        # retreive account 
        retrieved = db.get_account(str(sample_account.account_ID))

        # validate data 
        assert retrieved is not None, "Account should exist in database"
        assert retrieved['account_ID'] == str(sample_account.account_ID)
        assert retrieved['name'] == sample_account.name
        assert retrieved['balance'] == sample_account.balance
        assert retrieved['policy_ID'] == "default_policy"
    
    def test_get_all_accounts(self):
        # insert accounts
        account_1 = Account("Test User 1", 1000)
        account_2 = Account("Test User 2", 1000)
        account_3 = Account("Test User 3", 1000)
        model_accounts = [account_1, account_2, account_3]

        # insert accounts into dabatase
        db.insert_account(account_1)
        db.insert_account(account_2)
        db.insert_account(account_3)

        # retrieve accounts using get_all_accounts()
        accts = db.get_all_accounts()

        for index, acct in enumerate(accts):
            model_account = model_accounts[index]
            print(model_account.__dict__)
            assert acct is not None, "Accounts should exist in database"
            assert acct['account_ID'] == str(model_account.account_ID)
            assert acct['name'] == model_account.name
            assert acct['balance'] == model_account.balance
            assert acct['policy_ID'] == "default_policy"
        
    def test_delete_account(self):
        test_account = Account("Test User", 1000)
        db.insert_account(test_account)
        db.delete_account(str(test_account.account_ID))
        
        all_accounts = db.get_all_accounts()

        assert len(all_accounts) == 0
    
    def test_get_nonexistent_account(self):
        response = db.get_account(str(uuid.uuid4()))
        assert response is None    


