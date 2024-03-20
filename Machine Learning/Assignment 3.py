# R00186157
# Sean Pardy

import numpy as np
import pandas as pd


# TASK 1 ###############################################################################################################
def Task1():

    # Load data from csv
    data = pd.read_csv("energy_performance.csv")

    # Split into features and targets with relevant data
    features = data[['Relative compactness', 'Surface area', 'Wall area', 'Roof area', 'Overall height', 'Orientation',
                     'Glazing area', 'Glazing area distribution']]
    targets = data[['Heating load', 'Cooling load']]

    # Output min and max loads of cooling and heating
    min_heating_load = targets['Heating load'].min()
    max_heating_load = targets['Heating load'].max()
    min_cooling_load = targets['Cooling load'].min()
    max_cooling_load = targets['Cooling load'].max()

    # Output
    print(f"Min Heating Load: {min_heating_load}, Max Heating Load: {max_heating_load}")
    print(f"Min Cooling Load: {min_cooling_load}, Max Cooling Load: {max_cooling_load}")

    return features, targets


# TASK 2 ###############################################################################################################

def Task2_A(deg, features, coefficients):
    # Calculate estimated target vector based on a varying polynomial of the degree
    est_targets = np.math.factorial(deg + features) / (np.math.factorial(deg + coefficients))

    return est_targets


def Task2_B(deg):
    # Calculate the correct size of the parameter vector based on the degree
    return (deg + 1) ** 2


# TASK 3 ###############################################################################################################
def Task3(deg, features, linearization_coefficients):
    est_targets = Task2_A(deg, features, linearization_coefficients)
    # We call Task2_A to obtain estimated targets, which represent the model's predictions
    # at the linearization point. This is necessary for linearization as it provides the baseline predictions
    # that will be used to calculate the Jacobian matrix.

    epsilon = 1e-6  # Small deviation for numerical differences

    # Initialize an empty list for partial derivatives
    jacobian = []

    # Numerical differentiation for each feature
    for i, var in enumerate(features.columns):
        features_plus = features.copy()
        features_minus = features.copy()

        # addepsilon to the features
        features_plus[var] += epsilon
        features_minus[var] -= epsilon

        # Calculate the numerical partial derivative
        partial_derivative = (Task2_A(deg, features_plus, linearization_coefficients)
                              - Task2_A(deg, features_minus, linearization_coefficients)) / (
                                         2 * epsilon)

        jacobian.append(partial_derivative)

    # Convert the list of partial derivatives into a numpy array
    jacobian = np.array(jacobian)

    return est_targets, jacobian


def main():
    deg = [0, 1, 2]  # Array of degrees to find the best value

    # Task 1 Usage
    features, targets = Task1()

    # Task 2 Usage
    for degree in deg:
        coefficients = np.zeros(Task2_B(degree))  # Initialize coefficients
        print(f"Coefficients for degree {degree} : {coefficients}")
        est_targets = Task2_A(deg, features, coefficients)
        print(f"Estimated Targets: for degree {degree}")
        print(est_targets)

        # Task 3 Usage
        linearization_coefficients = np.ones(Task2_B(degree))  # Example linearization coefficients

        # Calculate estimated targets and Jacobian at the linearization point using numerical differentiation
        estimated_targets, jacobian = Task3(degree, features, linearization_coefficients)

        # Output results
        print("Estimated Targets at Linearization Point:")
        print(estimated_targets)
        print("\nJacobian at Linearization Point:")
        print(jacobian)


main()
