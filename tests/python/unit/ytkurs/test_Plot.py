from __future__ import absolute_import, division, print_function, unicode_literals

import unittest
import numpy as np
import matplotlib.pyplot as plt

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from IPython.display import clear_output
from six.moves import urllib

import tensorflow.compat.v2.feature_column as fc

import tensorflow as tf


def e_function(a, b):
    return [np.exp(i) for i in range(a, b + 1)]


#
# Basic Test
#
# Weitere Infos:
#       https://medium.com/ryans-dev-notes/unit-testing-with-python-unittest-module-c37531e28d75
#
class MyTestCase(unittest.TestCase):
    csvTrain = None
    csvEval = None

    @classmethod
    def setUpClass(self):
        # Load dataset.
        self.csvTrain = pd.read_csv(
            'https://storage.googleapis.com/tf-datasets/titanic/train.csv')  # training data
        self.csvEval = pd.read_csv(
            'https://storage.googleapis.com/tf-datasets/titanic/eval.csv')  # testing data

        y_train = self.csvTrain.pop('survived')
        y_eval = self.csvEval.pop('survived')

        print("this will run before all test methods.")

    def test_DataSet(self):
        # self.assertEqual(True, True)
        self.assertIsNotNone(self.csvTrain)
        self.assertIsNotNone(self.csvEval)

        # print(self.csvTrain.head())

    # noinspection PyMethodMayBeStatic
    def test_Plot(self):
        a = 1
        b = 5
        e_list = e_function(a, b)

        plt.plot(range(a, b + 1), e_list, color='blue')
        plt.xlabel('i')
        plt.ylabel('e^i')
        plt.show()

    def test_Histogram(self):
        self.csvTrain.age.hist(bins=20)
        plt.show()


if __name__ == '__main__':
    unittest.main()
