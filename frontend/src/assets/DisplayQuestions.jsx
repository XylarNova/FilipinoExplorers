import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DisplayQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {questions.map((q) => (
            <div
              key={q.id}
              style={{
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '10px',
                backgroundColor: '#f0faff'
              }}
            >
              <h3>📖 Story:</h3>
              <p>{q.story}</p>

              <h4>❓ Question:</h4>
              <p>{q.question}</p>

              <h4>🔢 Choices:</h4>
              <ul>
                {q.choices.map((choice, index) => (
                  <li key={index}>
                    {String.fromCharCode(65 + index)}. {choice}
                  </li>
                ))}
              </ul>

              <p>✅ Correct Answer: {String.fromCharCode(65 + q.correctAnswer)}</p>
              <p>💡 Hint: {q.hint}</p>

              <button
                onClick={() => navigate(`/paaralanquest-teacher/update/${q.id}`)}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#FFA726',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ✏️ Edit Question
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayQuestions;
