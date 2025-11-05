"""
Unit Tests for Banking System Models

This file contains unit tests for the business logic models in models.py.
"""

import pytest
from datetime import datetime
import sys
import os

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

# PROBLEM: Create a pytest fixture that returns an Account with a specific balance
# SUGGESTION: Create an Account with name="Test User", balance=1000
# TEST: Verify the account has the expected name and balance
@pytest.fixture
def test_account():
    # TODO: Implement this fixture
    pass


# PROBLEM: Create a pytest fixture that returns an Account with zero balance
# SUGGESTION: Create an Account with balance=0
# TEST: Verify the account balance is 0
@pytest.fixture
def zero_balance_account():
    # TODO: Implement this fixture
    pass


# PROBLEM: Create a pytest fixture that returns a sample Transaction
# SUGGESTION: Create a Transaction with reasonable values for all required parameters
# TEST: Verify the transaction has the expected attributes
# HINT: Check Transaction.__init__ signature - it needs: user_id, amount, tx_type, current_balance, timestamp
@pytest.fixture
def sample_transaction():
    # TODO: Implement this fixture
    pass


# ============================================================================
# POLICY CLASS TESTS
# ============================================================================

class TestPolicy:
    """
    Test suite for the Policy class.
    Tests policy validation logic for deposits and withdrawals.
    """
    
    # PROBLEM: Test that Policy initializes with default values correctly
    # SUGGESTION: Create a Policy() with no arguments, assert all default values match expected
    # TEST: Verify maxDeposit=1000, maxWithdrawal=1000, dailyWithdrawalLimit=10000, allowNegativeBalance=True, overdraftLimit=50
    # HINT: Use the default_policy fixture you created above
    def test_policy_default_initialization(self, default_policy):
        # TODO: Write assertions to verify all default values
        pass
    
    
    # PROBLEM: Test that Policy can be initialized with custom values
    # SUGGESTION: Create a Policy with custom parameters, verify each attribute is set correctly
    # TEST: Create Policy with maxDeposit=5000, maxWithdrawal=3000, verify these values are set
    def test_policy_custom_initialization(self):
        # TODO: Create Policy with custom values and assert they match
        pass
    
    
    # PROBLEM: Test validate_deposit with valid amount (within maxDeposit limit)
    # SUGGESTION: Use default_policy, call validate_deposit with amount=500, expect True
    # TEST: Verify that a deposit within the limit is validated successfully
    def test_validate_deposit_within_limit(self, default_policy):
        # TODO: Test valid deposit amount
        pass
    
    
    # PROBLEM: Test validate_deposit with amount exceeding maxDeposit
    # SUGGESTION: Use default_policy (maxDeposit=1000), call validate_deposit with amount=1500, expect False
    # TEST: Verify that deposits exceeding the limit are rejected
    def test_validate_deposit_exceeds_limit(self, default_policy):
        # TODO: Test deposit amount exceeding limit
        pass
    
    
    # PROBLEM: Test validate_deposit with negative amount
    # SUGGESTION: Call validate_deposit with amount=-100, expect False
    # TEST: Verify that negative deposits are rejected
    def test_validate_deposit_negative_amount(self, default_policy):
        # TODO: Test negative deposit amount
        pass
    
    
    # PROBLEM: Test validate_deposit with amount exactly at maxDeposit limit (boundary test)
    # SUGGESTION: Use default_policy (maxDeposit=1000), call validate_deposit with amount=1000, expect True
    # TEST: Verify boundary condition - amount exactly at the limit should be accepted
    def test_validate_deposit_at_limit(self, default_policy):
        # TODO: Test boundary condition - amount exactly at maxDeposit
        pass
    
    
    # PROBLEM: Test validate_deposit with amount one over maxDeposit limit (boundary test)
    # SUGGESTION: Use default_policy (maxDeposit=1000), call validate_deposit with amount=1001, expect False
    # TEST: Verify boundary condition - amount one over the limit should be rejected
    def test_validate_deposit_one_over_limit(self, default_policy):
        # TODO: Test boundary condition - amount one over maxDeposit
        pass
    
    
    # PROBLEM: Test validate_withdrawal with valid amount (within maxWithdrawal and balance)
    # SUGGESTION: Use default_policy, call validate_withdrawal with amount=500, balance=1000, expect True
    # TEST: Verify that a withdrawal within limits and available balance is validated
    def test_validate_withdrawal_valid(self, default_policy):
        # TODO: Test valid withdrawal
        pass
    
    
    # PROBLEM: Test validate_withdrawal when amount exceeds maxWithdrawal limit
    # SUGGESTION: Use default_policy (maxWithdrawal=1000), call validate_withdrawal with amount=1500, balance=2000, expect False
    # TEST: Verify that withdrawals exceeding maxWithdrawal are rejected even if balance is sufficient
    def test_validate_withdrawal_exceeds_max_withdrawal(self, default_policy):
        # TODO: Test withdrawal exceeding maxWithdrawal limit
        pass
    
    
    # PROBLEM: Test validate_withdrawal when amount exceeds balance and negative balances not allowed
    # SUGGESTION: Use strict_policy (allowNegativeBalance=False), call validate_withdrawal with amount=500, balance=300, expect False
    # TEST: Verify that withdrawals exceeding balance are rejected when negative balances aren't allowed
    def test_validate_withdrawal_exceeds_balance_no_overdraft(self, strict_policy):
        # TODO: Test withdrawal exceeding balance when overdraft not allowed
        pass
    
    
    # PROBLEM: Test validate_withdrawal when amount exceeds balance but negative balances are allowed
    # SUGGESTION: Use overdraft_policy (allowNegativeBalance=True), call validate_withdrawal with amount=500, balance=300, expect True
    # TEST: Verify that withdrawals exceeding balance are allowed when overdraft is enabled
    def test_validate_withdrawal_exceeds_balance_with_overdraft(self, overdraft_policy):
        # TODO: Test withdrawal exceeding balance when overdraft is allowed
        pass
    
    
    # PROBLEM: Test validate_withdrawal when withdrawal would exceed overdraft limit
    # SUGGESTION: Use overdraft_policy with overdraftLimit=50, call validate_withdrawal with amount=400, balance=300, expect False
    # TEST: Verify that withdrawals exceeding the overdraft limit are rejected (balance - amount should not be < -overdraftLimit)
    # HINT: The validation should check: if balance - amount < -overdraftLimit, reject it
    def test_validate_withdrawal_exceeds_overdraft_limit(self, overdraft_policy):
        # TODO: Test withdrawal that would exceed overdraft limit
        pass
    
    
    # PROBLEM: Test validate_withdrawal at exactly the overdraft limit (boundary test)
    # SUGGESTION: Use overdraft_policy with overdraftLimit=50, balance=0, call validate_withdrawal with amount=50, expect True
    # TEST: Verify boundary condition - withdrawal exactly at overdraft limit should be accepted
    def test_validate_withdrawal_at_overdraft_limit(self, overdraft_policy):
        # TODO: Test boundary condition - withdrawal at exactly overdraft limit
        pass
    
    
    # PROBLEM: Test update_policy method with valid updates
    # SUGGESTION: Create a Policy, call update_policy with {'maxDeposit': 2000, 'maxWithdrawal': 1500}, verify values updated
    # TEST: Verify that update_policy correctly updates the specified attributes
    def test_update_policy_valid_updates(self):
        # TODO: Test updating policy attributes
        pass
    
    
    # PROBLEM: Test update_policy with invalid attribute name
    # SUGGESTION: Create a Policy, call update_policy with {'invalidAttr': 999}, verify it doesn't crash
    # TEST: Verify that update_policy ignores attributes that don't exist on the Policy object
    # HINT: Check how update_policy uses hasattr to validate attributes
    def test_update_policy_invalid_attribute(self):
        # TODO: Test updating with invalid attribute name
        pass


# ============================================================================
# LEDGER CLASS TESTS
# ============================================================================

class TestLedger:
    """
    Test suite for the Ledger class.
    Tests ledger transaction storage and management.
    """
    
    # PROBLEM: Test that Ledger initializes with empty transactions list by default
    # SUGGESTION: Create a Ledger(), verify transactions is an empty list
    # TEST: Verify that a new Ledger has an empty transactions list
    def test_ledger_default_initialization(self):
        # TODO: Test empty ledger initialization
        pass
    
    
    # PROBLEM: Test that Ledger can be initialized with existing transactions
    # SUGGESTION: Create a list of Transaction objects, pass to Ledger(transactions=list), verify they're stored
    # TEST: Verify that Ledger can be initialized with a pre-existing list of transactions
    def test_ledger_initialization_with_transactions(self, sample_transaction):
        # TODO: Test ledger initialization with existing transactions
        pass
    
    
    # PROBLEM: Test add_transaction adds a transaction to the ledger
    # SUGGESTION: Use empty_ledger fixture, add a transaction, verify it's in the transactions list
    # TEST: Verify that add_transaction appends a transaction to the ledger's transactions list
    def test_add_transaction(self, empty_ledger, sample_transaction):
        # TODO: Test adding a transaction to ledger
        pass
    
    
    # PROBLEM: Test that multiple transactions can be added to a ledger
    # SUGGESTION: Use empty_ledger, add 3 transactions, verify all 3 are in the list
    # TEST: Verify that multiple transactions can be added and stored correctly
    def test_add_multiple_transactions(self, empty_ledger):
        # TODO: Test adding multiple transactions
        pass
    
    
    # PROBLEM: Test that transactions maintain order (FIFO - first in, first out)
    # SUGGESTION: Add transactions in a specific order, verify they remain in that order
    # TEST: Verify that transactions are stored in the order they were added
    def test_transactions_maintain_order(self, empty_ledger):
        # TODO: Test transaction ordering
        pass


# ============================================================================
# TRANSACTION CLASS TESTS
# ============================================================================

class TestTransaction:
    """
    Test suite for the Transaction class.
    Tests transaction creation and attributes.
    """
    
    # PROBLEM: Test that Transaction initializes with required parameters
    # SUGGESTION: Create a Transaction with all required params, verify all attributes are set correctly
    # TEST: Verify that Transaction stores user_id, amount, tx_type, current_balance, and timestamp correctly
    def test_transaction_initialization(self):
        # TODO: Test transaction initialization with required parameters
        pass
    
    
    # PROBLEM: Test that Transaction generates a UUID if tx_ID is not provided
    # SUGGESTION: Create a Transaction without tx_ID, verify that tx_ID is a valid UUID
    # TEST: Verify that tx_ID is automatically generated when not provided
    # HINT: Use uuid.UUID() to validate the generated ID
    def test_transaction_auto_generates_id(self):
        # TODO: Test automatic UUID generation
        pass
    
    
    # PROBLEM: Test that Transaction uses provided tx_ID when given
    # SUGGESTION: Create a Transaction with a specific tx_ID, verify it uses that ID
    # TEST: Verify that Transaction respects the tx_ID parameter when provided
    def test_transaction_uses_provided_id(self):
        # TODO: Test that provided tx_ID is used
        pass
    
    
    # PROBLEM: Test that Transaction initializes with PROCESSING status by default
    # SUGGESTION: Create a Transaction, verify status is StatusType.PROCESSING
    # TEST: Verify that new transactions start with PROCESSING status
    def test_transaction_default_status(self):
        # TODO: Test default status is PROCESSING
        pass
    
    
    # PROBLEM: Test that Transaction can store counterparty information
    # SUGGESTION: Create a Transaction with counterparty="account_123", verify counterparty attribute is set
    # TEST: Verify that counterparty information is stored correctly (for transfers/payments)
    def test_transaction_with_counterparty(self):
        # TODO: Test transaction with counterparty
        pass


# ============================================================================
# ACCOUNT CLASS TESTS
# ============================================================================

class TestAccount:
    """
    Test suite for the Account class.
    Tests account operations: deposits, withdrawals, and payments.
    """
    
    # PROBLEM: Test that Account initializes with name, balance, and generates account_ID
    # SUGGESTION: Create an Account with name="Alice", balance=500, verify all attributes are set
    # TEST: Verify that Account stores name, balance, and generates/uses account_ID correctly
    def test_account_initialization(self):
        # TODO: Test account initialization
        pass
    
    
    # PROBLEM: Test that Account initializes with default Policy
    # SUGGESTION: Create an Account, verify it has a Policy instance with default values
    # TEST: Verify that Account automatically creates a Policy with default settings
    def test_account_has_default_policy(self):
        # TODO: Test that account has default policy
        pass
    
    
    # PROBLEM: Test that Account initializes with empty Ledger
    # SUGGESTION: Create an Account, verify it has a Ledger instance with empty transactions
    # TEST: Verify that Account automatically creates an empty Ledger
    def test_account_has_empty_ledger(self):
        # TODO: Test that account has empty ledger
        pass
    
    
    # PROBLEM: Test successful deposit within policy limits
    # SUGGESTION: Use test_account (balance=1000), deposit 500, verify balance increases and transaction is SUCCESS
    # TEST: Verify that a valid deposit increases balance and creates a SUCCESS transaction
    def test_deposit_success(self, test_account):
        # TODO: Test successful deposit
        pass
    
    
    # PROBLEM: Test deposit that exceeds maxDeposit limit
    # SUGGESTION: Use test_account with default policy (maxDeposit=1000), deposit 1500, verify balance unchanged and transaction is DECLINED
    # TEST: Verify that deposits exceeding policy limits are declined and balance doesn't change
    def test_deposit_exceeds_limit(self, test_account):
        # TODO: Test deposit exceeding policy limit
        pass
    
    
    # PROBLEM: Test deposit with negative amount
    # SUGGESTION: Use test_account, deposit -100, verify balance unchanged and transaction is DECLINED
    # TEST: Verify that negative deposits are declined
    def test_deposit_negative_amount(self, test_account):
        # TODO: Test negative deposit
        pass
    
    
    # PROBLEM: Test deposit at exactly maxDeposit limit (boundary test)
    # SUGGESTION: Use test_account with default policy (maxDeposit=1000), deposit 1000, verify it succeeds
    # TEST: Verify boundary condition - deposit exactly at maxDeposit should be accepted
    def test_deposit_at_limit(self, test_account):
        # TODO: Test deposit at policy limit (boundary)
        pass
    
    
    # PROBLEM: Test successful withdrawal within policy limits and available balance
    # SUGGESTION: Use test_account (balance=1000), withdraw 500, verify balance decreases and transaction is SUCCESS
    # TEST: Verify that a valid withdrawal decreases balance and creates a SUCCESS transaction
    def test_withdraw_success(self, test_account):
        # TODO: Test successful withdrawal
        pass
    
    
    # PROBLEM: Test withdrawal that exceeds maxWithdrawal limit
    # SUGGESTION: Use test_account with default policy (maxWithdrawal=1000), withdraw 1500, verify balance unchanged and transaction is DECLINED
    # TEST: Verify that withdrawals exceeding maxWithdrawal are declined
    def test_withdraw_exceeds_max_withdrawal(self, test_account):
        # TODO: Test withdrawal exceeding maxWithdrawal
        pass
    
    
    # PROBLEM: Test withdrawal that exceeds balance when overdraft not allowed
    # SUGGESTION: Use zero_balance_account with strict_policy (allowNegativeBalance=False), withdraw 100, verify declined
    # TEST: Verify that withdrawals exceeding balance are declined when overdraft is disabled
    def test_withdraw_exceeds_balance_no_overdraft(self, zero_balance_account, strict_policy):
        # TODO: Test withdrawal exceeding balance without overdraft
        # HINT: You may need to manually set the account's policy to strict_policy
        pass
    
    
    # PROBLEM: Test withdrawal that exceeds balance but is within overdraft limit
    # SUGGESTION: Use zero_balance_account with overdraft_policy, withdraw 30 (within overdraft limit), verify success
    # TEST: Verify that withdrawals exceeding balance succeed when within overdraft limit
    def test_withdraw_within_overdraft_limit(self, zero_balance_account, overdraft_policy):
        # TODO: Test withdrawal within overdraft limit
        # HINT: You may need to manually set the account's policy to overdraft_policy
        pass
    
    
    # PROBLEM: Test withdrawal that exceeds overdraft limit
    # SUGGESTION: Use zero_balance_account with overdraft_policy (overdraftLimit=50), withdraw 100, verify declined
    # TEST: Verify that withdrawals exceeding overdraft limit are declined
    def test_withdraw_exceeds_overdraft_limit(self, zero_balance_account, overdraft_policy):
        # TODO: Test withdrawal exceeding overdraft limit
        pass
    
    
    # PROBLEM: Test that successful deposit adds transaction to account's ledger
    # SUGGESTION: Use test_account, deposit 500, verify ledger contains the transaction
    # TEST: Verify that deposits are recorded in the account's ledger
    def test_deposit_adds_to_ledger(self, test_account):
        # TODO: Test that deposit is added to ledger
        pass
    
    
    # PROBLEM: Test that successful withdrawal adds transaction to account's ledger
    # SUGGESTION: Use test_account, withdraw 500, verify ledger contains the transaction
    # TEST: Verify that withdrawals are recorded in the account's ledger
    def test_withdraw_adds_to_ledger(self, test_account):
        # TODO: Test that withdrawal is added to ledger
        pass
    
    
    # PROBLEM: Test that declined transactions are still added to ledger with DECLINED status
    # SUGGESTION: Use test_account, attempt deposit exceeding limit, verify ledger contains transaction with DECLINED status
    # TEST: Verify that declined transactions are logged in the ledger
    def test_declined_transaction_in_ledger(self, test_account):
        # TODO: Test that declined transactions are in ledger
        pass
    
    
    # PROBLEM: Test successful payment between two accounts
    # SUGGESTION: Create two accounts (sender balance=1000, receiver balance=500), payment of 200, verify both balances updated and SUCCESS transactions created
    # TEST: Verify that payment correctly transfers money and creates transactions for both accounts
    def test_payment_success(self):
        # TODO: Test successful payment between accounts
        pass
    
    
    # PROBLEM: Test payment when sender's withdrawal would be declined
    # SUGGESTION: Create sender with insufficient balance/overdraft, receiver with valid deposit, payment of amount that would be declined, verify declined
    # TEST: Verify that payment is declined when sender's withdrawal would fail policy validation
    def test_payment_declined_sender_validation(self):
        # TODO: Test payment declined due to sender validation
        pass
    
    
    # PROBLEM: Test payment when receiver's deposit would be declined
    # SUGGESTION: Create sender with valid withdrawal, receiver with deposit policy that would decline, verify payment declined
    # TEST: Verify that payment is declined when receiver's deposit would fail policy validation
    def test_payment_declined_receiver_validation(self):
        # TODO: Test payment declined due to receiver validation
        pass
    
    
    # PROBLEM: Test that payment creates two transactions (payer and payee)
    # SUGGESTION: Create two accounts, make payment, verify payment() returns list with 2 transactions
    # TEST: Verify that payment returns a list containing two Transaction objects
    def test_payment_creates_two_transactions(self):
        # TODO: Test that payment creates payer and payee transactions
        pass
    
    
    # PROBLEM: Test that payment transactions have correct counterparty information
    # SUGGESTION: Create two accounts, make payment, verify payer transaction has receiver's account_ID as counterparty and vice versa
    # TEST: Verify that payment transactions correctly reference each other as counterparties
    def test_payment_transactions_have_counterparty(self):
        # TODO: Test counterparty information in payment transactions
        pass


# ============================================================================
# POLICYREQUEST CLASS TESTS
# ============================================================================

class TestPolicyRequest:
    """
    Test suite for the PolicyRequest class.
    Tests policy request creation and status management.
    """
    
    # PROBLEM: Test that PolicyRequest initializes with required parameters
    # SUGGESTION: Create PolicyRequest with user_id="user_123", policy_request={...}, verify attributes set correctly
    # TEST: Verify that PolicyRequest stores user_id, policy_request, and generates request_id
    def test_policy_request_initialization(self):
        # TODO: Test policy request initialization
        pass
    
    
    # PROBLEM: Test that PolicyRequest generates UUID if request_id not provided
    # SUGGESTION: Create PolicyRequest without request_id, verify request_id is a valid UUID
    # TEST: Verify that request_id is automatically generated when not provided
    def test_policy_request_auto_generates_id(self):
        # TODO: Test automatic UUID generation for request_id
        pass
    
    
    # PROBLEM: Test that PolicyRequest initializes with PENDING status by default
    # SUGGESTION: Create PolicyRequest, verify status is PolicyRequestStatus.PENDING
    # TEST: Verify that new policy requests start with PENDING status
    def test_policy_request_default_status(self):
        # TODO: Test default status is PENDING
        pass
    
    
    # PROBLEM: Test that PolicyRequest can be initialized with specific status
    # SUGGESTION: Create PolicyRequest with status=PolicyRequestStatus.APPROVED, verify status is set correctly
    # TEST: Verify that PolicyRequest can be created with a specific status
    def test_policy_request_with_status(self):
        # TODO: Test policy request with specific status
        pass
    
    
    # PROBLEM: Test update_status method changes the status
    # SUGGESTION: Create PolicyRequest (status=PENDING), call update_status(APPROVED), verify status changed
    # TEST: Verify that update_status correctly updates the request status
    def test_policy_request_update_status(self):
        # TODO: Test updating policy request status
        pass
    
    
    # PROBLEM: Test to_dict method returns correct dictionary structure
    # SUGGESTION: Create PolicyRequest, call to_dict(), verify it returns dict with all expected keys
    # TEST: Verify that to_dict returns a dictionary with request_id, user_id, status, policy_request, created_at, updated_at
    def test_policy_request_to_dict(self):
        # TODO: Test to_dict method
        pass
    
    
    # PROBLEM: Test to_dict converts UUIDs to strings
    # SUGGESTION: Create PolicyRequest, call to_dict(), verify request_id and user_id are strings (not UUID objects)
    # TEST: Verify that UUID values in to_dict are converted to strings
    def test_policy_request_to_dict_uuid_strings(self):
        # TODO: Test that UUIDs are converted to strings in to_dict
        pass
    
    
    # PROBLEM: Test to_dict converts status enum to value
    # SUGGESTION: Create PolicyRequest, call to_dict(), verify status is the enum value (string) not the enum object
    # TEST: Verify that status in to_dict is the enum value string
    def test_policy_request_to_dict_status_value(self):
        # TODO: Test that status enum is converted to value in to_dict
        pass

