# pylint: disable=too-few-public-methods
# Addition Decorator
from iface_value import IValue


class Add(IValue):
    # Decorator used to add 2 numbers together

    def __init__(self, num1, num2):
        # num 1 and 2 can be preset numbers or custom ints
        num1 = getattr(num1, 'value', num1)
        num2 = getattr(num2, 'value', num2)
        self.value = num1 + num2

    def __str__(self):
        return str(self.value)
