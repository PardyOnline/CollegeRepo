# strategy will implement this interface

from abc import ABCMeta, abstractmethod


class IStrategy(metaclass=ABCMeta):
    # Methods that will be implemented
    @staticmethod
    @abstractmethod
    def __str__():
        " Used to override default __str__ method"
