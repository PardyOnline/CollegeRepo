"A sample document to be used in the Prototype example"
import copy  # import the copy library
from iface_ptype import IPType


class Document(IPType):

    def __init__(self, name, l):
        self.name = name
        self.list = l

    def clone(self, mode):
        # The mode switcher uses different methods on different levels
        if mode == 1:
            # Creates a 1 level shallow copy of the orig list
            my_list = self.list
        if mode == 2:
            # Creates a 2 level shallow copy of the orig list
            my_list = self.list.copy()
        if mode == 3:
            # Creates a deep copy recursively, takes longer than shallow copy
            my_list = copy.deepcopy(self.list)

        return type(self)(
            self.name,  # a shallow copy is returned of the name property
            my_list
        )

    def __str__(self):
        # Overrides the default __str__ method
        return f"{id(self)}\tname={self.name}\tlist={self.list}"