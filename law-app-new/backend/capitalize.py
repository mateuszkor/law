import sys
import time

def capitalize_question(question):
    return question.upper()

if __name__ == "__main__":
    # Read question from stdin
    question = sys.stdin.read()
    
    # Simulate processing delay (e.g., 5 seconds)
    time.sleep(5)
    
    # Process the question and print the result
    result = capitalize_question(question.strip())
    print(result)
