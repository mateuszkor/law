import React, { useState } from 'react';
import styled from 'styled-components';

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 20px;
  background-color: #f8f9fa; /* Light gray background */
`;

const InputBox = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid var(--primary-color); /* Use application main color */
  border-radius: 8px;
  resize: none;

  &:focus {
    outline: none;
    border-color: var(--primary-color); /* Highlight border on focus */
    box-shadow: 0px 0px 5px var(--primary-color);
  }
`;

const AnswerBox = styled.div`
  width: 100%;
  min-height: 300px; /* Increased height for larger output box */
  margin-top: 20px;
  padding: 15px;
  font-size: 16px;
  border: 2px solid var(--primary-color); /* Use application main color */
  border-radius: 8px;
  background-color: #ffffff; /* White background */
`;

const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
  color: white;
  background-color: var(--primary-color); /* Use application main color */
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: #3088e0; /* Slightly darker shade on hover */
    cursor: pointer;
    transition: background-color ease-in-out .3s ;
`;
const Chat = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('Your answer will appear here.');

    const handleSubmit = () => {
        if (question.trim() === '') return;

        // Simulate generating an answer (replace with actual logic later)
        setAnswer(`You asked: "${question}". This is a placeholder answer.`);
        setQuestion(''); // Clear the input box
    };

    return (
        <ChatWrapper>
            {/* Input Box */}
            <InputBox
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            {/* Submit Button */}
            <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>

            {/* Answer Box */}
            <AnswerBox>
                {answer}
            </AnswerBox>
        </ChatWrapper>
    );
};

export default Chat;

