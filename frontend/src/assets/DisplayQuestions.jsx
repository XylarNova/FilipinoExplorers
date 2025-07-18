import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DisplayQuestions = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/story-questions')
      .then(response => setQuestions(response.data))
      .catch(error => console.error('❌ Failed to fetch questions:', error));
  }, []);

  return (
    <div style={{ padding: '40px', backgroundColor: '#fff8dc', fontFamily: "'Fredoka', sans-serif" }}>
      <h2 style={{ fontSize: '28px', color: '#073A4D', marginBottom: '20px' }}>📄 Paaralan Quest Questions</h2>
      {questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {questions.map((q, index) => (
            <li key={index} style={{
              marginBottom: '20px',
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '10px',
              backgroundColor: '#f0faff'
            }}>
              <p><strong>Story:</strong> {q.story}</p>
              <p><strong>Question:</strong> {q.question}</p>
              <p><strong>Choices:</strong></p>
              <ul>
                {q.choices.map((choice, i) => (
                  <li key={i}><strong>{String.fromCharCode(65 + i)}.</strong> {choice}</li>
                ))}
              </ul>
              <p><strong>Correct Answer:</strong> {String.fromCharCode(65 + q.correctAnswer)}</p>
              <p><strong>Hint:</strong> {q.hint}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DisplayQuestions;
