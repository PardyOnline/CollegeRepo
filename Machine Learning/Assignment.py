from collections import Counter
import math
import pandas as pd
import re
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import confusion_matrix, accuracy_score


# Sean Pardy
# R00186157
# SDH4-A

# Task 1: Data Splitting
def Task1():
    # Read xlsx into dataframe
    data = pd.read_excel("movie_reviews.xlsx")

    # Split data into training and test sets
    training_data = data[data["Split"] == "train"]
    training_labels = training_data[["Sentiment"]]
    test_data = data[data["Split"] == "test"]
    test_labels = test_data[["Sentiment"]]

    # Task 1 results
    # print("Total number of positive reviews in training data: ",
    #       len(training_labels[training_labels["Sentiment"] == "positive"]))
    # print("Total number of negative reviews in training data: ",
    #       len(training_labels[training_labels["Sentiment"] == "negative"]))
    # print("Total number of positive reviews in test data: ", len(test_labels[test_labels["Sentiment"] == "positive"]))
    # print("Total number of negative reviews in test data: ", len(test_labels[test_labels["Sentiment"] == "negative"]))

    return training_data, training_labels, test_data, test_labels


# Task 2: Word Frequency Analysis
def Task2(data, min_word_len, min_word_occ):
    if isinstance(data, pd.DataFrame):
        data = data["Review"]

    # Clean text data using lambdaa
    clean_text = lambda text: re.sub(r'[^a-zA-Z0-9\s]', '', text.lower())

    # Apply the lambda cleaned data to the text data
    cleaned_reviews = data.apply(clean_text)
    words = cleaned_reviews.str.split()

    # Count the word occs and select common words based on the params provided
    all_words = [word for list_words in words for word in list_words]
    word_count = Counter(all_words)
    common_words = [word for word, count in word_count.items() if len(word) >= min_word_len and count >= min_word_occ]

    # Task 2 results
    # for word in common_words:
    #     print(f"Specified Word: {word}, Occurrences: {word_count[word]}")

    return common_words


# Task 3: Calculate Word Occurrences
def Task3(data, common_words):
    # Set dictionaries with word mapped to 0
    positive_word_review = {word: 0 for word in common_words}
    negative_word_review = {word: 0 for word in common_words}

    # Iterate through the reviews setting the reviews to lowercase and splitting them into a list of words. set
    # sentiment to the sentiment col
    for index, row in data.iterrows():
        review_text = row['Review'].lower()
        review_words = set(review_text.split())
        sentiment = row['Sentiment']

    # Count the word occs in pos and neg reviews
        for word in review_words:
            if word in common_words:
                if sentiment == 'positive':
                    positive_word_review[word] += 1
                elif sentiment == 'negative':
                    negative_word_review[word] += 1

    # Task 3 results
    # print("Positive Word Reviews: ", positive_word_review)
    # print("Negative Word Reviews: ", negative_word_review)

    return positive_word_review, negative_word_review


# Task 4: Likelihood Estimation
def Task4(positive_word_review, negative_word_review, total_positive_reviews, total_negative_reviews):
    # Set an empty dict for likelihoods
    likelihoods = {}

    # Use Laplace smoothing to calculate likelihoods
    alpha = 1
    for word in positive_word_review:
        positive_likelihood = (positive_word_review[word] + alpha) / (total_positive_reviews + 2 * alpha)
        negative_likelihood = (negative_word_review[word] + alpha) / (total_negative_reviews + 2 * alpha)
        likelihoods[word] = {'positive': positive_likelihood, 'negative': negative_likelihood}

    # Calculate the priors for pos and neg classes
    positive_prior = total_positive_reviews / (total_positive_reviews + total_negative_reviews)
    negative_prior = total_negative_reviews / (total_positive_reviews + total_negative_reviews)

    return likelihoods, {'positive': positive_prior, 'negative': negative_prior}


# Task 5: Classification
def Task5(new_review, priors, likelihoods):
    words = new_review.split()

    log_prob_pos = math.log(priors['positive'])
    log_prob_neg = math.log(priors['negative'])

    for word in words:
        if word in likelihoods:
            log_prob_pos += math.log(likelihoods[word]['positive'])
            log_prob_neg += math.log(likelihoods[word]['negative'])

    # Compare the probs of pos and neg and predcit the sentiment of a new review
    if log_prob_pos > log_prob_neg:
        return "positive"
    else:
        return "negative"


# Task 6: Cross-Validation
def Task6(k, training_data, training_labels, word_len_params, min_word_occ):
    s_k_fold = StratifiedKFold(n_splits=k, shuffle=True, random_state=42)

    accuracy_scores = []

    for word_len in word_len_params:
        common_words = Task2(training_data, word_len, min_word_occ)
        p_common_words, n_common_words = Task3(training_data, common_words)

        # Use iloc to access the dataframes for training and test data
        for train_index, test_index in s_k_fold.split(training_data, training_labels):
            train_data, test_data = training_data.iloc[train_index], training_data.iloc[test_index]
            train_labels, test_labels = training_labels.iloc[train_index], training_labels.iloc[test_index]

            # total pos review and neg reviews are the len of the sentiment in the xlsx
            total_pos_reviews = len(train_labels[train_labels["Sentiment"] == "positive"])
            total_neg_reviews = len(train_labels[train_labels["Sentiment"] == "negative"])

            likelihoods, priors = Task4(p_common_words, n_common_words, total_pos_reviews, total_neg_reviews)

            test_pred = [Task5(review, priors, likelihoods) for review in test_data["Review"]]

            # Calculate accuracy manually based on te above preds
            correct_predictions = sum(test_pred == test_labels["Sentiment"])
            accuracy = correct_predictions / len(test_labels)
            accuracy_scores.append((word_len, accuracy))

    return accuracy_scores


# Main Function
def main():
    training_data, training_labels, test_data, test_labels = Task1()
    min_word_occ = 1000
    min_word_len = 5
    k = 5
    word_len_params = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    # use for task 2
    # common_words = Task2(training_data, min_word_len, min_word_occ)

    # Call task 6 and perform a k-fold cross validation for diff word len params
    accuracy_scores = Task6(k, training_data, training_labels, word_len_params, min_word_occ)

    # Find the best word len param and its accuracy
    best_word_len, best_acc = max(accuracy_scores, key=lambda x: x[1])
    print("Results of using best word len: ", best_word_len)
    print("Accuracy of best word len params: ", best_acc)

    # Use for task 6
    common_words = Task2(training_data, best_word_len, min_word_occ)
    p_common_words, n_common_words = Task3(training_data, common_words)

    # Calculate the total pos and neg reviews
    total_positive_reviews = len(training_labels[training_labels["Sentiment"] == "positive"])
    total_negative_reviews = len(training_labels[training_labels["Sentiment"] == "negative"])

    # Calculate a new likelihoods and priors based on common words and review sentiments
    likelihoods, priors = Task4(p_common_words, n_common_words, total_positive_reviews, total_negative_reviews)

    # Define a new review for task 5
    new_review = "This is a movie that really never should have been made"

    # predict if the new review will be pos or neg using the likelihoods and priors
    predicted_sentiment = Task5(new_review, priors, likelihoods)
    print("Predicted sentiment: ", predicted_sentiment)

    # Final tes using the test set
    test_pred = [Task5(review, priors, likelihoods) for review in test_data["Review"]]

    # Calculate the confusoin matrix and true and false pos and negs
    confuse_mat = confusion_matrix(test_labels, test_pred)
    true_pos = confuse_mat[1, 1]
    true_neg = confuse_mat[0, 0]
    false_pos = confuse_mat[0, 1]
    false_neg = confuse_mat[1, 0]
    class_acc = accuracy_score(test_labels, test_pred)

    # Task 6 results
    print("Confusion Matrix: ")
    print(confuse_mat)
    print("True Positives: ", true_pos)
    print("False Positives: ", false_pos)
    print("True Negatives: ", true_neg)
    print("False Negatives: ", false_neg)
    print("Classification Accuracy: ", class_acc)


main()

