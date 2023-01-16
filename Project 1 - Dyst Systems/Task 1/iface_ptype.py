from abc import ABCMeta, abstractmethod


class IPType(metaclass=ABCMeta):
    # IPType interface is used for cloning
    @staticmethod
    @abstractmethod
    def clone(mode):
        """This is the cloning method"""


