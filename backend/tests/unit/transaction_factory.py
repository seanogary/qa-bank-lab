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
    


tx_factory(100,10,100)

def create_test_account(name=None, balance=0, policy=None):
    """
    Create an Account instance with specified configuration.
    
    Args:
        name: Account name (default: generated)
        balance: Initial balance (default: 0)
        policy: Policy instance (default: uses Account default)
        
    Returns:
        Account instance
    """
    # TODO: Generate name if not provided
    # TODO: Create Policy if custom policy provided
    # TODO: Create Account with name, balance
    # TODO: If custom policy, assign to account.policy
    # TODO: Return account
    pass


def generate_deposits(account, count, min_amount=1, max_amount=None):
    """
    Generate deposits on an account and return the transactions.
    
    Args:
        account: Account instance to deposit into
        max_amount: Maximum deposit amount (default: account.policy.maxDeposit)
        min_amount: Minimum deposit amount (default: 1)
        count: Number of deposits to perform
        
    Returns:
        List of Transaction objects from deposits
    """
    # TODO: Determine max_amount (use policy.maxDeposit if not provided)
    # TODO: Generate random amounts within [min_amount, max_amount]
    # TODO: For each amount:
    #   - Call account.deposit(amount) using model method
    #   - Extract transaction from account.ledger.transactions
    # TODO: Return list of deposit transactions
    pass


def generate_withdrawals(account, count, min_amount=1, max_amount=None):
    """
    Generate withdrawals from an account and return the transactions.
    
    Args:
        account: Account instance to withdraw from
        max_amount: Maximum withdrawal amount (default: account.policy.maxWithdrawal)
        min_amount: Minimum withdrawal amount (default: 1)
        count: Number of withdrawals to perform
        
    Returns:
        List of Transaction objects from withdrawals
    """
    # TODO: Determine max_amount (use policy.maxWithdrawal if not provided)
    # TODO: Generate random amounts within [min_amount, max_amount]
    # TODO: For each amount:
    #   - Call account.withdraw(amount) using model method
    #   - Extract transaction from account.ledger.transactions
    # TODO: Return list of withdrawal transactions
    pass


def generate_payments(sender_account, receiver_account, count, min_amount=1, max_amount=None):
    """
    Generate payments between two accounts and return the transactions.
    
    Args:
        sender_account: Account to send from
        receiver_account: Account to receive
        max_amount: Maximum payment amount (default: min of both policies)
        min_amount: Minimum payment amount (default: 1)
        count: Number of payments to perform
        
    Returns:
        List of Transaction objects (contains both payer and payee transactions for each payment)
    """
    # TODO: Determine max_amount (consider both policies)
    # TODO: Generate random amounts within [min_amount, max_amount]
    # TODO: For each amount:
    #   - Call sender_account.payment(receiver_account, amount) using model method
    #   - Extract both transactions (payer and payee) from respective ledgers
    # TODO: Return list of all payment transactions (payer + payee pairs)
    pass


def extract_transactions_from_ledger(account):
    """
    Extract all transactions from an account's ledger.
    
    Args:
        account: Account instance
        
    Returns:
        List of Transaction objects from account.ledger.transactions
    """
    # TODO: Return account.ledger.transactions
    pass


def extract_transactions_from_accounts(accounts):
    """
    Extract all transactions from multiple accounts' ledgers.
    
    Args:
        accounts: List of Account instances
        
    Returns:
        List of all Transaction objects from all account ledgers
    """
    # TODO: Loop through accounts
    # TODO: Extract transactions from each account's ledger
    # TODO: Combine into single list
    # TODO: Return combined list
    pass


def generate_transaction_sequence(accounts, operation_types, seed):
    """
    Generate a sequence of transactions across multiple accounts.
    
    This is a higher-level orchestrator that can mix different operation types.
    
    Args:
        accounts: List of Account instances to operate on
        operation_types: List of TransactionType enums to choose from
        seed: Random seed
        
    Returns:
        List of Transaction objects generated
    """
    # TODO: Set random seed
    # TODO: Initialize empty transactions list
    # TODO: Loop to generate transactions:
    #   - Randomly select operation type from operation_types
    #   - Randomly select account(s) based on operation type
    #   - Generate random amount within policy limits
    #   - Execute operation using model methods
    #   - Extract transaction(s) from ledger
    # TODO: Return all transactions
    pass
