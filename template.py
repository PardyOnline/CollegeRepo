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
from sklearn import tree
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

    allCountries = np.unique(flt['native-country'].astype(str))
    dict1 = {}
    c = 1
    for ac in allCountries:
        dict1[ac] = c
        c = c + 1
    flt['native-country'] = flt['native-country'] .map(dict1)
    flt = flt.dropna()


    # Cross validation
    flt = flt[[' workclass', 'age', 'native-country', 'Income']].dropna(how='all', inplace=False)
    X = (flt[[' workclass', 'age', 'native-country']])
    y = flt[['Income']]
    clf = DecisionTreeClassfier()
    scores = cross_val_score(clf, X, y, cv=5, test_size=0.2)
    kfold = StratifiedShuffleSplit(n_splits=5, test_size=0.2)

    for depth in range(1,20):
        clf = DecisionTreeClassifier()
        scores = cross_val_score(clf, X, y, cv=5, test_size=0.2)
        print(f"Tree Depth: {depth}, Mean Accuracy: {scores.mean()}, Standard Deviation: {scores.std()}")


Task1()


def Task2():
    flt = df[['hours-per-week', 'occupation ', 'relationship', 'age']].copy()

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
    # print(flt['hours-per-week'].count())
    # print(flt['hours-per-week'].unique())

    # Income 2 values
    flt = flt.dropna(subset=['Income'])
    # print(flt['native-country'].unique())

    allIncome = np.unique(flt['Income'].astype(str))
    dict1 = {}
    c = 1
    for ac in allIncome:
        dict1[ai] = c
        c = c + 1
    flt['Income'] = flt['Income'].map(dict1)
    flt = flt.dropna()
    print(dict1)


# Task2()


def Task3():
    flt = df[['age', 'fnlwgt ', 'education-num', 'hours-per-week']].copy()

    # changing centuries to not have the s
    flt['age'] = flt['age'].str.replace(r's', '')
    flt['age'] = flt['age'].apply(pd.to_numeric, errors='coerce') 

