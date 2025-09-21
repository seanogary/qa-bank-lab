# create banking system
# connect to ledger database, user database
# create log system for transactions, 
from enum import Enum
from tabulate import tabulate
import uuid
from datetime import datetime

class TransactionType(Enum):
    DEPOSIT = "DEPOSIT"
    WITHDRAWAL = "WITHDRAWAL"
    TRANSFER = "TRANSFER"
    PAY = "PAY"

class StatusType(Enum):
    PROCESSING = "PROCESSING"
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"
    DECLINED = "DECLINED"   

class Policy:
    def __init__(
        self,
        maxDeposit = 1000,
        maxWithdrawal = 1000,
        dailyWithdrawalLimit = 10000,
        allowNegativeBalance = True,
        overdraftLimit = 50
    ):
        self.maxDeposit = maxDeposit
        self.maxWithdrawal = maxWithdrawal
        self.dailyWithdrawalLimit = dailyWithdrawalLimit
        self.allowNegativeBalance = allowNegativeBalance
        self.overdraftLimit = overdraftLimit
    
    def validate_withdrawal(self, amount, balance):
        if (amount > self.maxWithdrawal):
            return False
        if (not self.allowNegativeBalance and amount > balance):
            return False
        if (self.allowNegativeBalance and balance-amount<-self.overdraftLimit):
            return False
        return True
    
    def validate_deposit(self, amount):
        if (amount > self.maxDeposit or amount < 0):
            return False
        return True
    
    def update_policy(self, updates):
        for key, value in updates.items():
            if hasattr(self, key):
                setattr(self, key, value)

class Ledger:
    def __init__(self, transactions: list = None):
        # if transactions is default, make empty list. Otherwise, keep it.
        self.transactions = transactions or []

    # add transaction to ledger
    def add_transaction(self, tx):
        self.transactions.append(tx)
    
    # print ledger with tabulate
    def print_ledger(self):
        column_names = [
            "AMOUNT", 
            "BALANCE",
            "TRANSACTION TYPE", 
            "USER",
            "TIME",
            "TRANSACTION ID",
            "STATUS",
            ]
        table = []
        for transaction in self.transactions:
            table.append([
                transaction.amount, 
                transaction.current_balance,
                transaction.tx_type.value, 
                transaction.user_id,
                transaction.timestamp,
                transaction.tx_ID,
                transaction.status.value, 
            ])
        print(tabulate(table, headers = column_names))

class Transaction:
    def __init__(self, user_id, amount, tx_type, current_balance, timestamp, tx_ID=None, counterparty=None):
        self.tx_ID = tx_ID or uuid.uuid4()
        self.user_id = user_id
        self.amount = amount
        self.tx_type = tx_type
        self.timestamp = timestamp
        self.current_balance = current_balance
        self.status = StatusType.PROCESSING
        counterparty=counterparty

class Account:
    def __init__(self, name, balance, account_ID=None):
        self.name = name
        self.balance = balance
        self.account_ID = account_ID or uuid.uuid4()

        # account specific policy and ledger objects
        self.policy = Policy()
        self.ledger = Ledger()

    # withdrawal money from account
    def withdraw(self, amount):   
        if (self.policy.validate_withdrawal(amount, self.balance)):
            new_balance = self.balance - amount
            status = StatusType.SUCCESS  # approve transaction
        else:
            new_balance = self.balance
            status = StatusType.DECLINED # decline transaction
        
        tx = Transaction(
            self.account_ID,
            amount,
            TransactionType.WITHDRAWAL,
            new_balance,
            datetime.utcnow()
        )
        self.balance = new_balance
        tx.status = status
        # add transaction to account ledger
        self.ledger.add_transaction(tx)
        return tx
    
    # deposit money into account
    def deposit(self, amount):
        if (self.policy.validate_deposit(amount)):
            new_balance = self.balance + amount
            status = StatusType.SUCCESS
        else:
            new_balance = self.balance
            status = StatusType.DECLINED
        
        tx = Transaction(
            self.account_ID,
            amount,
            TransactionType.DEPOSIT,
            new_balance,
            datetime.utcnow()
        ) 
        self.balance = new_balance
        tx.status = status
        # add transaction to account ledger
        self.ledger.add_transaction(tx)
        return tx
 
    def payment(self, account_obj, amount):
        # initial balances
        self_balance = self.balance
        target_balance = account_obj.balance

        # check policy to validate transaction
        if (self.policy.validate_withdrawal(amount, self.balance)):
            if (account_obj.policy.validate_deposit(amount)):
                self_balance = self.balance - amount
                target_balance = account_obj.balance + amount
                status = StatusType.SUCCESS
        else:
            status = StatusType.DECLINED
        
        transaction_time = datetime.utcnow()

        payer_tx = Transaction(
            user_id=self.account_ID,
            amount=amount,
            tx_type=TransactionType.PAY,
            current_balance=self_balance,
            timestamp=transaction_time,
            counterparty=account_obj.account_ID
        )

        payee_tx = Transaction(
            user_id=account_obj.account_ID,
            amount=amount,
            tx_type=TransactionType.PAY,
            current_balance=target_balance,
            timestamp=transaction_time,
            counterparty=self.account_ID
        )

        self.balance = self_balance
        account_obj.balance = target_balance

        return [payer_tx, payee_tx]
