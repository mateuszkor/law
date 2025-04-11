import sys
import time

def capitalize_question(question):
    return question.upper()

if __name__ == "__main__":
    # Read question from stdin
    question = sys.stdin.read()
    
    # Simulate processing delay (e.g., 5 seconds)
    
    # Process the question and print the result
    result = capitalize_question(question.strip())
    result =very_long_text = """This is a very long text that spans multiple \n\n\nlines. You can include as much content here as you want.There is no need to worry about line breaks, indentation,or escaping special characters like quotes, unless you're using the same triple quote style.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    You can also add:
    - Bullet points
    - Line breaks

    Even code:
    def hello():
        print("Hello from within a string!")

    End of long string.
    This is a very long text that spans multiple lines.
    You can include as much content here as you want.
    There is no need to worry about line breaks, indentation,
    or escaping special characters like quotes, unless you're using the same triple quote style.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    You can also add:
    - Bullet points
    - Line breaks

    Even code:
    def hello():
        print("Hello from within a string!")

    End of long string.
    This is a very long text that spans multiple lines.
    You can include as much content here as you want.There is no need to worry about line breaks, indentation,or escaping special characters like quotes, unless you're using the same triple quote style.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    You can also add:
    - Bullet points
    - Line breaks

    Even code:
    def hello():
        print("Hello from within a string!")

    End of long string.
    This is a very long text that spans multiple lines.
    You can include as much content here as you want.
    There is no need to worry about line breaks, indentation,
    or escaping special characters like quotes, unless you're using the same triple quote style.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    You can also add:
    - Bullet points
    - Line breaks

    Even code:
    def hello():
        print("Hello from within a string!")

    End of long string.
    """

    print(result)
