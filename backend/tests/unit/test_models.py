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

test_cases = []
for i in range(100):
    test_cases.append((f"test_user_{i}", i*10))

@pytest.mark.parametrize("user_name, initial_balance", test_cases)
# TEST: validating account creation logic 
def test_account(user_name, initial_balance):
    # create account object
    new_account = Account(user_name, initial_balance)
    # validate name and balance
    assert new_account.balance == initial_balance and new_account.name == user_name and isinstance(new_account.policy, Policy) and isinstance(new_account.account_ID, uuid.UUID)

