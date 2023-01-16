"Prototype Use Case Example Code"
from document import Document

# Create variable to hold lists
orig_list = Document("Original", [[1, 2, 3], [8, 9, 10]])
print(orig_list)
print()

# Create a shallow copy of the lists
first_copy = orig_list.clone(1)
first_copy.name = "Copy 1"

# This copy will modify the orig list
first_copy.list[1][0] = 80
print(first_copy)
print(orig_list)
print()

# Create a shallow copy for level 2
second_copy = orig_list.clone(2)
second_copy.name = "Copy 2"

# This copy will not modify orig list
second_copy.list[1] = [80, 90, 100]
print(second_copy)
print(orig_list)
print()

# Create a shallow copy for level 2 again
third_copy = orig_list.clone(2)
third_copy.name = "Copy 3"

# This will modify the orig list as it changes the selected element that was not deep copied
third_copy.list[1][2] = "100"
print(third_copy)
print(orig_list)
print()

# Create a recursive deep copy for level 3
fourth_copy = orig_list.clone(3)
fourth_copy.name = "Copy 4"

# This creates a deep copy recursively, so it will not modify the orig list
fourth_copy.list[1][1] = "800"
print(fourth_copy)
print(orig_list)
print()
