import sys
import os
import random as r
import uuid
from datetime import datetime, timedelta
import math

# Add backend directory to path to import models
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from models import Account, Transaction, TransactionType, StatusType, Policy, Ledger


def tx_factory(tx_count, user_count, seed):
    accts = []
    for i in range(user_count):
        accts.append(Account(f"test_user_{i + 1}", r.random()*1000, i))

    for i in range(tx_count):
        # select random account
        random_account_indexes = r.sample(range(user_count), 2)
        random_account = accts[random_account_indexes[0]]
        random_amount = r.random()*100
        # generate random transaction
        available_methods = [
            (random_account.withdraw, [random_amount]), 
            (random_account.deposit, [random_amount]), 
            (random_account.payment, [accts[random_account_indexes[1]], random_amount])
            ]
        method = r.choice(available_methods)
        method[0](*method[1])
    
    # collect and merge ledgers from accounts
    all_transactions = []
    for acct in accts:
        all_transactions.append(acct.ledger.transactions)
    
    return all_transactions
    

