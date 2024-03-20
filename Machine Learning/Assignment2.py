# R00186157
# Sean Pardy

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sklearn.model_selection import KFold
from sklearn.metrics import confusion_matrix, accuracy_score
import time

from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import Perceptron
from sklearn.neighbors import KNeighborsClassifier

# Read CSV
df = pd.read_csv("fashion-mnist_train.csv")


# Images ---------------------------------------------------------------------------------------------------------------
def Task1():
    # Get classes for sneakers, ankle boots and sandals
    classes = [5, 7, 9]

    # Put each necessary class into a dataframe
    classes_df = df[df['label'].isin(classes)]

    # Get label and pixel values
    labels = classes_df['label']
    features = classes_df.drop('label', axis=1)

    # Display an image for each class
    num_classes = len(classes)
    figures, axes = plt.subplots(1, num_classes, figsize=(15, 5))

    for i in range(num_classes):
        # Get the index of the first occurance of the class
        index = np.where(labels == classes[i])[0][0]

        # Get the pixel values and reshape to 28x28
        image_data = np.array(features.iloc[index]).reshape(28, 28)

        # Display
        axes[i].imshow(image_data, cmap='gray')
        axes[i].axis('off')
    plt.show()
    return labels, features


# Task1()


# Cross validation -----------------------------------------------------------------------------------------------------
def Task2(labels, features, classifier, k=5, samples=None):
    kfold = KFold(n_splits=k, shuffle=True, random_state=42)

    training_times = []
    pred_times = []
    accuracies = []
    con_matrices = []

    for train_index, test_index in kfold.split(labels):
        X_train, X_test = features.iloc[train_index], features.iloc[test_index]
        y_train, y_test = labels.iloc[train_index], labels.iloc[test_index]

        # Train the data
        start = time.time()
        classifier.fit(X_train, y_train)
        train_time = time.time() - start
        training_times.append(train_time)

        # Predictions
        start = time.time()
        pred = classifier.predict(X_test)
        pred_time = time.time() - start
        pred_times.append(pred_time)

        # Evaluation of results
        accuracy = accuracy_score(y_test, pred)
        accuracies.append(accuracy)

        # Confusion Matrix
        cm = confusion_matrix(y_test, pred)
        con_matrices.append(cm)

        print(f"Confusion Matrix: {cm}\n")
        print(f"Accuracy: {accuracy:.4f}\n")
        print(f"Training Time: {train_time:.4f}\n")
        print(f"Confusion Matrix: {pred_time:.4f}\n")
        print(f"-" * 30)

    # Statistics Calculation - Training times
    min_train_time = min(training_times)
    max_train_time = max(training_times)
    avg_train_time = sum(training_times) / k

    # Accuracy
    min_acc = min(accuracies)
    max_acc = max(accuracies)
    avg_acc = sum(accuracies) / k

    # Prediction Times
    min_pred_time = min(pred_times)
    max_pred_time = max(pred_times)
    avg_pred_time = sum(pred_times) / k

    # Outputs
    print("Summary:")
    print(f"Min Training Time: {min_train_time:.4f} seconds",
          f"Max Training Time: {max_train_time:.4f} seconds",
          f"Avg Training Time: {avg_train_time:.4f} seconds",

          f"Min Prediction Time: {min_pred_time:.4f} seconds",
          f"Max Prediction Time: {max_pred_time:.4f} seconds",
          f"Avg Prediction Time: {avg_pred_time:.4f} seconds",

          f"Min Accuracy: {min_acc:.4f}",
          f"Max Accuracy: {max_acc:.4f}",
          f"Avg Accuracy: {avg_acc:.4f}")

    return avg_acc, avg_pred_time, avg_train_time, con_matrices


# Task 3 - Perceptron ------------------------------------------------------------------------------------------------
def Task3(labels, features, classifier, k, samples):
    training_times = []
    pred_times = []

    for sample in samples:
        print(f"Testing with {sample} samples")
        avg_acc, avg_pred_time, avg_train_time, con_matrices = Task2(labels, features, classifier, k=k, samples=sample)
        training_times.append(avg_train_time)
        pred_times.append(avg_pred_time)

        print(f"Average Accuracy: {avg_acc:.4}\n")

    # Graph for Perceptron
    plt.figure(figsize=(10, 6))

    # Training Graph
    plt.subplot(1, 2, 1)
    plt.plot(samples, training_times, color='purple')
    plt.xlabel('Number of Samples')
    plt.ylabel('Training Time (Seconds)')
    plt.title("Training Time vs Number of Samples")

    # Prediction Graph
    plt.subplot(1, 2, 2)
    plt.plot(samples, pred_times, color='Green')
    plt.xlabel('Number of Samples')
    plt.ylabel('Prediction Time (Seconds)')
    plt.title("Prediction Time vs Number of Samples")

    plt.tight_layout()
    plt.show()


# Decision Tree Classifier ---------------------------------------------------------------------------------------------
def Task4(labels, features, classifier, k, samples):
    training_times = []
    pred_times = []

    for sample in samples:
        print(f"Testing with {sample} samples")
        avg_acc, avg_pred_time, avg_train_time, con_matrices = Task2(labels, features, classifier, k=k, samples=sample)
        training_times.append(avg_train_time)
        pred_times.append(avg_pred_time)

        print(f"Average Accuracy: {avg_acc:.4}\n")

    # Graph for Decision Tree Classifier
    plt.figure(figsize=(10, 6))

    # Training Graph
    plt.subplot(1, 2, 1)
    plt.plot(samples, training_times, color='purple')
    plt.xlabel('Number of Samples')
    plt.ylabel('Training Time (Seconds)')
    plt.title("Training Time vs Number of Samples")

    # Prediction Graph
    plt.subplot(1, 2, 2)
    plt.plot(samples, pred_times, color='Green')
    plt.xlabel('Number of Samples')
    plt.ylabel('Prediction Time (Seconds)')
    plt.title("Prediction Time vs Number of Samples")

    plt.tight_layout()
    plt.show()


# K-Nearest Neighbour Classifier ---------------------------------------------------------------------------------------
def Task5(labels, features, classifier, k, samples):
    knn = KNeighborsClassifier()

    best_k_acc = 0
    best_k_value = 0

    # Test for best k value
    for value in k:
        print(f"Testing with k={value}")
        avg_acc, avg_pred_time, avg_train_time, _ = Task2(labels, features, knn, k=value, samples=2000)
        print(f"Mean Prediction Accuracy for k={value}: {avg_acc:.4f}")

        if avg_acc > best_k_acc:
            best_k_acc = avg_acc
            best_k_value = value

    print(f"\nBest k: {best_k_value} with Mean Prediction Accuracy: {best_k_acc:.4}")

    # Using optimal K, test sample sizes
    print("Testing with optimal K for different sample sizes:")
    train_times = []
    pred_times = []

    # Test optimal k with varying sample value
    for sample in samples:
        print(f"Testing with {sample} samples")
        _, pred_time, train_time, _ = Task2(labels, features, knn, k=best_k_value, samples=sample)
        train_times.append(train_time)
        pred_times.append(pred_time)

    # Training Graph
    plt.subplot(1, 2, 1)
    plt.plot(samples, train_times, color='purple')
    plt.xlabel('Number of Samples')
    plt.ylabel('Training Time (Seconds)')
    plt.title("Training Time vs Number of Samples")

    # Prediction Graph
    plt.subplot(1, 2, 2)
    plt.plot(samples, pred_times, color='Green')
    plt.xlabel('Number of Samples')
    plt.ylabel('Prediction Time (Seconds)')
    plt.title("Prediction Time vs Number of Samples")

    plt.tight_layout()
    plt.show()


# Support Vector Machine Classifier ------------------------------------------------------------------------------------
def Task6(labels, features, classifier, k, samples, gamma_values):
    best_gamma_acc = 0
    best_gamma_value = 0

    # Test for best gamma value
    for gamma in gamma_values:
        print(f"Testing with gamma value: {gamma}")
        avg_acc, _, _, _ = Task2(labels, features, classifier.set_params(gamma=gamma), k=k, samples=2000)
        print(f"Mean Prediction Accuracy for gamma = {gamma}: {avg_acc:.4}")

        if avg_acc > best_gamma_acc:
            best_gamma_acc = avg_acc
            best_gamma_value = gamma

    print(f"Best gamma: {best_gamma_value} with Mean Prediction Accuracy: {best_gamma_acc:.4}")

    # WIth optional gamma, test the sample sizes
    print("Testing using best gamma value for different sample sizes:")
    train_times = []
    pred_times = []

    for sample in samples:
        print(f"Testing with {sample} samples")
        _, pred_time, train_time, _ = Task2(labels, features, classifier.set_params(gamma=best_gamma_value),
                                            k=k, samples=sample)
        train_times.append(train_time)
        pred_times.append(pred_time)

    # Training Graph
    plt.subplot(1, 2, 1)
    plt.plot(samples, train_times, color='purple')
    plt.xlabel('Number of Samples')
    plt.ylabel('Training Time (Seconds)')
    plt.title("Training Time vs Number of Samples")

    # Prediction Graph
    plt.subplot(1, 2, 2)
    plt.plot(samples, pred_times, color='Green')
    plt.xlabel('Number of Samples')
    plt.ylabel('Prediction Time (Seconds)')
    plt.title("Prediction Time vs Number of Samples")

    plt.tight_layout()
    plt.show()

    return best_gamma_value, best_gamma_acc


def Task7(labels, features, classifiers, k, samples):
    for classifier in classifiers:
        train_times = []
        pred_times = []

        for sample in samples:
            print(f"Testing with sample {sample} using {type(classifier).__name__}")
            _, pred_time, train_time, _ = Task2(labels, features, classifier, k=k, samples=sample)
            train_times.append(train_time)
            pred_times.append(pred_time)


def main():
    samples = [100, 500, 1000, 2000, 5000]
    labels, features = Task1()

    # Call the function with the Perceptron classifier
    perceptron_classifier = Perceptron()
    # Task3(labels, features, perceptron_classifier, k=5, samples=samples)

    # Call the function with the Decision Tree Classifier
    dtc = DecisionTreeClassifier()
    # Task4(labels, features, dtc, k=5, samples=samples)

    # Call the function using K Nearest Neighbour Classifier
    knn = KNeighborsClassifier()
    # Task5(labels, features, knn, k=[2, 3, 5, 8, 9], samples=samples)

    # Call the function using SVM classifier
    svm = SVC()  # - default value in SVM is rbf
    gamma_values = [0.001, 0.1, 1, 10]
    best_gamma, best_acc = Task6(labels, features, svm, k=5, samples=samples, gamma_values=gamma_values)

    print(f"Best gamma value: {best_gamma}")
    print(f"Best achievable mean prediction accuracy: {best_acc:.4}")

    # Compare all the classifiers
    classifiers = [perceptron_classifier, dtc, knn, svm]
    Task7(labels, features, classifiers, k=5, samples=[100, 500, 1000, 2000, 5000])


main()
