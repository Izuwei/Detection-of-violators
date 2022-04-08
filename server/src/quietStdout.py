# Author: Jakub Sadilek
#
# Faculty of Information Technology
# Brno University of Technology
# 2022

import sys
import os

# Source: https://stackoverflow.com/questions/8391411/how-to-block-calls-to-print
class QuietStdout:
    """
    Class is used to temporarily redirect stdout to devnull to eliminate junk dumps.
    """

    def __enter__(self):
        self.originalStdout = sys.stdout
        sys.stdout = open(os.devnull, "w")

    def __exit__(self, excType, excVal, excTb):
        sys.stdout.close()
        sys.stdout = self.originalStdout
