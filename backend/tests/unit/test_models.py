"""
Unit Tests for Banking System Models

This file contains unit tests for the business logic models in models.py.
"""

import pytest
from datetime import datetime
import sys
import os
import uuid

# Add parent directory to path to import models
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))
# Add current directory to path to import transaction_factory
sys.path.insert(0, os.path.dirname(__file__))

from models import (
    Policy, 
    Ledger, 
    Transaction, 
    Account, 
    PolicyRequest,
    TransactionType, 
    StatusType, 
    PolicyRequestStatus
)

# ----- FIXTURES -----

# test account fixture
@pytest.fixture
def test_account():
    return Account("test_account", 1000)

# default policy object fixture
@pytest.fixture
def default_policy():    
    # return default policy object (
    # maxDeposit=1000,
    # maxWithdrawal=1000,
    # dailyWithdrawalLimit=10000,
    # allowNegativeBalance=True,
    # overdraftLimit=50
    # )
    return Policy()

# custom policy object, neg balance not allowed
@pytest.fixture
def strict_policy():
    # return a custom Policy
    return Policy(maxDeposit=5000, maxWithdrawal=2000, allowNegativeBalance=False, overdraftLimit=100)

# custom policy object, neg balance allowed
@pytest.fixture
def overdraft_policy():
    return Policy(maxDeposit=5000, maxWithdrawal=2000, allowNegativeBalance=False, overdraftLimit=100)

# empty ledger
@pytest.fixture
def empty_ledger():
    return Ledger()

import random as r

@pytest.fixture
def fixed_seed():
    return 314

from transaction_factory import tx_factory

# ledger with random transactions (sampled normally from the set of allowed values per data member)
@pytest.fixture
def populated_ledger(fixed_seed):
    txs = tx_factory(fixed_seed)
    ledger = Ledger()
    for tx in txs:
        ledger.add_transaction(self, tx)
    return ledger

# test suite for user account class operation
class TestAccount:
    test_cases = []
    for i in range(100):
        test_cases.append((f"test_user_{i}", (i + 1)*10))

    @pytest.mark.parametrize("user_name, initial_balance", test_cases)
    def test_account_creation(self, user_name, initial_balance):
        # create account object
        new_account = Account(user_name, initial_balance)
        # validate name and balance
        assert new_account.balance == initial_balance and new_account.name == user_name and isinstance(new_account.policy, Policy) and isinstance(new_account.account_ID, uuid.UUID) and len(new_account.ledger.transactions) == 0
    
    def test_account_creation_with_negative_initial_balance(self):
        # create account object with negative initial balance
        with pytest.raises(ValueError):
            Account("test_user_with_neg_balance", -1000)
    
    def test_deposit(self, test_account):
        starting_balance = test_account.balance
        test_account.deposit(100)
        assert test_account.balance == starting_balance + 100
     
    def test_max_deposit(self, test_account):
        starting_balance = test_account.balance
        max_deposit_amount = test_account.policy.maxDeposit
        test_account.deposit(max_deposit_amount)
        assert test_account.balance == starting_balance  + max_deposit_amount
       
    def test_deposit_more_than_limit(self,test_account):
        starting_balance = test_account.balance
        max_deposit_amount = test_account.policy.maxDeposit
        test_account.deposit(max_deposit_amount + 1)
        assert test_account.balance == starting_balance
    
    def test_deposit_negative(self, test_account):
        with pytest.raises(ValueError):
            test_account.deposit(-1000)
    
    def test_max_deposit(self, test_account):
        starting_balance = test_account.balance
        max_deposit = test_account.policy.maxDeposit
        test_account.deposit(max_deposit)
        assert test_account.balance == starting_balance + max_deposit
    
    def test_withdraw(self, test_account):
        starting_balance = test_account.balance
        test_account.withdraw(1000)
        assert test_account.balance == starting_balance - 1000

    def test_withdraw_at_limit(self, test_account):
        starting_balance = test_account.balance
        max_withdrawal = test_account.policy.maxWithdrawal
        test_account.withdraw(max_withdrawal)
        assert test_account.balance == starting_balance - max_withdrawal

    def test_withdraw_more_than_limit(self, test_account):
        starting_balance = test_account.balance
        max_withdrawal = test_account.policy.maxWithdrawal
        test_account.withdraw(max_withdrawal + 1)
        assert starting_balance == test_account.balance
    
    
    def test_overdraft_more_than_limit(self, test_account):
        starting_balance = test_account.balance
        test_account.withdraw(1051)
        assert test_account.balance == starting_balance
    
    def test_overdraft_within_limit(self, test_account):
        starting_balance = test_account.balance
        test_account.withdraw(test_account.balance)
        test_account.withdraw(test_account.policy.overdraftLimit - 1)
        assert test_account.balance == starting_balance - 1049
    
    def test_overdraft_at_limit(self, test_account):
        starting_balance = test_account.balance
        test_account.withdraw(starting_balance)
        test_account.withdraw(test_account.policy.overdraftLimit)
        assert test_account.balance == - test_account.policy.overdraftLimit
    
    def test_deposit_adds_to_ledger(self, test_account):
        starting_balance = test_account.balance
        test_account.deposit(50)
        txs = test_account.ledger.transactions
        tx = txs[-1]
        # verify tx_ID and user_ID is UUID
        is_UUID = isinstance(tx.tx_ID, uuid.UUID) and isinstance(tx.user_id, uuid.UUID)
        # verify that amount is accurate
        correct_amount = tx.amount == 50
        # verify that tx_type is accurate
        correct_tx_type = tx.tx_type == TransactionType.DEPOSIT
        # verify that timestamp is proper type
        is_datetime = isinstance(tx.timestamp, datetime)
        # verify that current balance is accurate
        correct_balance = tx.current_balance == starting_balance + 50
        # verify that status is successful 
        correct_status = tx.status == StatusType.SUCCESS
        
        assert is_UUID and correct_amount and correct_tx_type and is_datetime and correct_balance and correct_status

class TestPolicy:
    """ 
    Test suite for the Policy class.
    """
    @pytest.mark.xfail
    def test_policy():
        pass

class TestLedger:
    """
    Test suite for the Ledger class
    """
    @pytest.mark.xfail
    def test_ledger():
        pass

class TestTransaction:
    """
    Test suite for the Transaction class
    """
    @pytest.mark.xfail
    def test_transaction():
        pass

