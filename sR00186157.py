#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Created on a sunny day

@author: Sean Pardy
@id: R00186157
@Cohort: SD3
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import tree, preprocessing
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier


df = pd.read_csv("C:/Users/Me/Desktop/Assignments/Y3/Data Analytics/Assignment 3/humanDetails.csv",
                 encoding="ISO-8859-1")


def Task1():
    # Create flt set with only some values
    flt = df[[' workclass', 'age', 'native-country', 'Income']].copy()

    # Remove question marks
    flt[' workclass'] = flt[' workclass'].replace(' ?', np.nan)
    flt = flt.dropna(subset=[' workclass'])
    # print(flt[' workclass'].unique())

    # changing centuries to not have the s
    flt['age'] = flt['age'].str.replace(r's', '')
    flt = flt.dropna(subset=['age'])
    flt['age'] = flt['age'].apply(pd.to_numeric, errors='coerce')
    # print(flt['age'].unique())

    # splitting up income levels
    flt.loc[flt['Income'].str.contains('<=50K', na=False), 'Income'] = 1
    flt.loc[flt['Income'].str.contains('>50K', na=False), 'Income'] = 2
    flt['Income'] = flt['Income'].apply(pd.to_numeric, errors='coerce')
    # print(np.unique(flt['Income']))

    # Change native-country to numeric
    flt['native-country'] = flt['native-country'].replace(' ?', np.nan)
    flt = flt.dropna(subset=['native-country'])
    # print(flt['native-country'].unique())

    # Cleaning countries and making numeric
    allCountries = np.unique(flt['native-country'].astype(str))
    dict1 = {}
    c = 1
    for ac in allCountries:
        dict1[ac] = c
        c = c + 1
    flt['native-country'] = flt['native-country'] .map(dict1)
    # print(dict1)

    # Make work class numeric
    allWc = np.unique(flt[' workclass'].astype(str))
    dict2 = {}
    c = 1
    for aw in allWc:
        dict2[aw] = c
        c = c + 1
    flt[' workclass'] = flt[' workclass'].map(dict2)
    # print(dict2)

    # Cross validation
    flt = flt[[' workclass', 'age', 'native-country', 'Income']].dropna(how='all', inplace=False)
    X = (flt[[' workclass', 'age', 'native-country']])
    y = flt[['Income']]

    clf = DecisionTreeClassifier()

    # Training and testing data
    kfold = StratifiedShuffleSplit(n_splits=5, test_size=0.2)
    trAc = []
    tsAc = []
    tree_clf = tree.DecisionTreeClassifier()
    tree_clf.fit(X, y)
    default = tree_clf.get_depth()
    tree_tr = []
    tree_ts = []
    for i in range(2, default):
        tree_clf = tree.DecisionTreeClassifier(max_depth=i)
        trAc = []
        tsAc = []
        for train, test in kfold.split(X, y):
            tree_clf.fit(X.iloc[train], y.iloc[train])
            trAc.append(tree_clf.score(X.iloc[train], y.iloc[train]))
            tsAc.append(tree_clf.score(X.iloc[test], y.iloc[test]))
            print(i + 1)
            tree_tr.append(np.mean(trAc))
            tree_ts.append(np.mean(tsAc))
            print('-------------')
    # Plot
    plt.plot(tree_ts)
    plt.plot(tree_tr)
    plt.show()

    # Interpretation of results
    """This code visualizes the overfitting of some countries in a line plot. It finds the overfitting countries using
    K-fold validation with 5 folds to evaluate the decision tree classifier on the training and test data. It calculates
    the average test and training accuracies and the gap between them."""


# Task1()


def Task2():
    flt = df[['hours-per-week', 'occupation ', 'relationship', 'age', 'Income']].copy()

    # apply mode to empty cells in occupation
    mode = df[df['occupation '] != ' ?']['occupation '].mode()[0]
    flt['occupation '] = flt['occupation '].replace(' ?', mode)
    flt = flt.dropna(subset=['occupation '])
    # print(flt['occupation '].unique())

    # changing centuries to not have the s
    flt['age'] = flt['age'].str.replace(r's', '')
    flt['age'] = flt['age'].apply(pd.to_numeric, errors='coerce')
    flt = flt.dropna(subset=['age'])
    # print(flt['age'].unique())

    # remove other-relative
    flt['relationship'] = flt['relationship'].replace(' Other-relative', np.nan)
    flt = flt.dropna(subset=['relationship'])
    # print(flt['relationship'].unique())

    # remove attributes mentioned once
    # print(flt['hours-per-week'].duplicated(keep=False))
    flt = flt.loc[flt.duplicated(subset='hours-per-week', keep=False)]
    flt['hours-per-week'] = flt['hours-per-week'].apply(pd.to_numeric, errors='coerce')
    # print(flt['hours-per-week'].count())
    # print(flt['hours-per-week'].unique())

    # Income 2 values
    flt.loc[flt['Income'].str.contains('<=50K', na=False), 'Income'] = 1
    flt.loc[flt['Income'].str.contains('>50K', na=False), 'Income'] = 2
    flt['Income'] = flt['Income'].apply(pd.to_numeric, errors='coerce')

    # Make occupation numeric
    allOcc = np.unique(flt['occupation '].astype(str))
    dict1 = {}
    c = 1
    for ao in allOcc:
        dict1[ao] = c
        c = c + 1
    flt['occupation '] = flt['occupation '].map(dict1)
    flt = flt.dropna()
    # print(dict1)

    # Make relationship numeric
    allRel = np.unique(flt['relationship'].astype(str))
    dict2 = {}
    c = 1
    for ar in allRel:
        dict1[ar] = c
        c = c + 1
    flt['relationship'] = flt['relationship'].map(dict1)
    flt = flt.dropna()
    # print(dict2)

    X = flt[['hours-per-week', 'occupation ', 'age', 'relationship']]
    y = flt['Income']

    clf = DecisionTreeClassifier()

    # Visualise the data
    kfold = StratifiedShuffleSplit(n_splits=5, test_size=0.2)
    trAc = []
    tsAc = []
    tree_clf = tree.DecisionTreeClassifier()
    tree_clf.fit(X, y)
    default = tree_clf.get_depth()
    tree_tr = []
    tree_ts = []
    for i in range(2, default):
        tree_clf = tree.DecisionTreeClassifier(max_depth=i)
        trAc = []
        tsAc = []
        for train, test in kfold.split(X, y):
            tree_clf.fit(X.iloc[train], y.iloc[train])
            trAc.append(tree_clf.score(X.iloc[train], y.iloc[train]))
            tsAc.append(tree_clf.score(X.iloc[test], y.iloc[test]))
            print(i + 1)
            tree_tr.append(np.mean(trAc))
            tree_ts.append(np.mean(tsAc))
            print('-------------')
    plt.plot(tree_ts)
    plt.plot(tree_tr)
    plt.show()

    # KNN Plot
    knn_tr = []
    knn_ts = []
    for i in range(10, 50):
        knn = KNeighborsClassifier(n_neighbors=i)
        for train, test in kfold.split(X, y):
            knn.fit(X.iloc[train], y.iloc[train])
            trAc.append(knn.score(X.iloc[train], y.iloc[train]))
            tsAc.append(knn.score(X.iloc[test], y.iloc[test]))
        print(i + 1)
        knn_tr.append(np.mean(trAc))
        knn_ts.append(np.mean(tsAc))
        print('-------------')
    plt.plot(knn_tr)
    plt.plot(knn_ts)
    plt.show()

    """By looking at the plot of the patterns or trends in the accuracy of the models when the parameters get changed. 
    For example, if the accuracy of the decision tree goes up as the depth goes up, it means the model is able to make
    better predictions when it is allowed to consider more splits in the tree"""


# Task2()


def Task3():
    flt = df[['age', 'fnlwgt', 'education-num', 'hours-per-week', 'Income']].copy()
    """Data Cleaning"""

    # changing centuries to not have the s
    flt['age'] = flt['age'].str.replace(r's', '')
    flt['age'] = flt['age'].apply(pd.to_numeric, errors='coerce')

    # splitting up income levels
    flt.loc[flt['Income'].str.contains('<=50K', na=False), 'Income'] = 1
    flt.loc[flt['Income'].str.contains('>50K', na=False), 'Income'] = 2
    flt['Income'] = flt['Income'].apply(pd.to_numeric, errors='coerce')
    # print(np.unique(flt['Income']))

    flt = flt.dropna()

    MinMax = flt['age'].quantile([0, 1])
    minn = MinMax[0]
    maxx = MinMax[1]
    print('------', minn, maxx)
    flt = flt[(flt['age'] > minn) & (flt['age'] < maxx)]
    flt = flt.dropna()

    MinMax = flt['fnlwgt'].quantile([0, 1])
    minn = MinMax[0]
    maxx = MinMax[1]
    print('------', minn, maxx)
    flt = flt[(flt['fnlwgt'] > minn) & (flt['fnlwgt'] < maxx)]
    flt = flt.dropna()

    MinMax = flt['education-num'].quantile([0, 1])
    minn = MinMax[0]
    maxx = MinMax[1]
    print('------', minn, maxx)
    flt = flt[(flt['education-num'] > minn) & (flt['education-num'] < maxx)]
    flt = flt.dropna()

    MinMax = flt['hours-per-week'].quantile([0, 1])
    minn = MinMax[0]
    maxx = MinMax[1]
    print('------', minn, maxx)
    flt = flt[(flt['hours-per-week'] > minn) & (flt['hours-per-week'] < maxx)]
    flt = flt.dropna()

    print(len(flt), minn, maxx)
    flt = flt.fillna(flt.mean())
    flt = flt.dropna()

    # Scaling and Clustering
    scalingObj = preprocessing.MinMaxScaler()
    new_flt = scalingObj.fit_transform(flt)
    kmeans = KMeans(n_clusters=2).fit(new_flt)

    # Reduce number of features to 2 using PCA
    pca = PCA(n_components=2)
    pca_1 = pca.fit_transform(new_flt)

    # Visualisation
    print(kmeans.inertia_)
    print(kmeans.predict([[0, 3, 55, 44, 11]]))
    print(kmeans.inertia_)
    plt.figure()
    # plt.scatter(flt['age'], flt['fnlwgt'], flt['education-num'], flt['hours-per-week'])

    # Graph 1
    plt.scatter(pca_1[:, 0], pca_1[:, 1], c=flt['Income'], cmap='viridis')
    plt.title("Income")
    plt.xlabel("X")
    plt.ylabel("Y")

    # Graph 2
    plt.scatter(pca_1[:, 0], pca_1[:, 1], c=kmeans.labels_, cmap='viridis')
    plt.title("Cluster Labels")
    plt.xlabel("X")
    plt.ylabel("Y")

    # Show graph
    plt.show()


Task3()

