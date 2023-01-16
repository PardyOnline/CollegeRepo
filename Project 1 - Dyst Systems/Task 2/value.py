# Custom value goes in this class

from iface_value import IValue


class Value(IValue):
    # Component to be decorated

    def __init__(self, value):

        self.value = value

    def __str__(self):
        return str(self.value)
