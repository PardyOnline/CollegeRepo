"""

Name: Sean Pardy

Student ID: R00186157

Task 2
"""

from sub import Sub
from add import Add
from value import Value

x = Value(1)
y = Value(2)
z = Value(3)

print(Add(x, y))
print(Add(x, 50))
print(Sub(z, x))
print(Sub(Add(z, y), x))
print(Sub(20, 30))
print(Add(Sub(Add(z, y), x), 60))
print(Sub(123, Add(z, z)))
print(Add(Sub(Add(z, 20), x), 50))
print(x)
print(y)
print(z)
