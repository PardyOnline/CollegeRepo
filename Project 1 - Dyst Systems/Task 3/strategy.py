"""

Name: Sean Pardy

Student ID: R00186157

Task 3
"""

# Strategy Design Pattern

from abc import ABCMeta, abstractmethod, ABC
from istrategy import IStrategy


class Strategy(IStrategy, ABC):
    """Constructor function with the different methods of buying"""

    def __init__(self, balance, stock_price, strategy):

        """Get bank balance and stock price"""

        self.balance = balance
        self.stock_price = stock_price
    """New functions for buying strategies"""

    def strategy(self, mode, balance, stock_price):

        if mode == 1:
            """Aggressive Strategy"""

            balance = balance
            stock_price = stock_price

        if mode == 2:
            """Passive Strategy"""

            balance = balance / 2
            stock_price = stock_price / 100 * 90

