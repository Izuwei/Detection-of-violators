import sys
import os

# Source: https://stackoverflow.com/questions/8391411/how-to-block-calls-to-print
class QuietStdout:
    def __enter__(self):
        self.originalStdout = sys.stdout
        sys.stdout = open(os.devnull, 'w')

    def __exit__(self, excType, excVal, excTb):
        sys.stdout.close()
        sys.stdout = self.originalStdout
