import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Styled components for clean layout
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
  border: 1px solid var(--primary-color); /* Application's main color */
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
  min-height: 300px; /* Larger output box */
  margin-top: 20px;
  padding: 15px;
  font-size: 16px;
  border: 2px solid var(--primary-color); /* Application's main color */
  border-radius: 8px;
  background-color: #ffffff; /* White background */
`;

const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
  color: white;
  background-color: var(--primary-color); /* Application's main color */
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
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (question.trim() === '') return;
    
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5001/process-question', {
                question: question
            });
    
            setAnswer(response.data.answer);
            setQuestion('');
        } catch (error) {
            console.error('Error sending question:', error);
            setAnswer('Error processing question. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ChatWrapper>
            <InputBox
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
            />

            <SubmitButton onClick={handleSubmit} disabled={loading}>
                {loading ? 'Sending...' : 'Submit'}
            </SubmitButton>

            <AnswerBox>
                {answer}
            </AnswerBox>
        </ChatWrapper>
    );
};

export default Chat;