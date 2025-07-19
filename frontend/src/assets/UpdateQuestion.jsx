import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateQuestion = () => {
  const { id } = useParams(); // Get question ID from URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    story: '',
    question: '',
    choices: ['', '', '', ''],
    correctAnswer: 0,
    hint: ''
  });

  // Fetch existing question data
  useEffect(() => {
    axios.get(`http://localhost:8080/api/story-questions/${id}`)
      .then((res) => {
        const q = res.data;
        setForm({
          story: q.story,
          question: q.question,
          choices: q.choices,
          correctAnswer: q.correctAnswer,
          hint: q.hint
        });
      })
      .catch((err) => {
        console.error("❌ Failed to fetch question:", err);
        alert("Failed to load question.");
      });
  }, [id]);

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...form.choices];
    updatedChoices[index] = value;
    setForm({ ...form, choices: updatedChoices });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8080/api/story-questions/${id}`, form);
      alert('✅ Question updated successfully!');
      navigate('/paaralanquest-teacher/display');
    } catch (error) {
      console.error('❌ Failed to update question:', error);
      alert('Failed to update question.');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: "'Fredoka', sans-serif", backgroundColor: '#FDFBEE', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#073A4D' }}>✏️ Update Paaralan Quest Question</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <label>Story:</label>
        <textarea
          value={form.story}
          onChange={(e) => setForm({ ...form, story: e.target.value })}
          required
          rows={3}
          style={inputStyle}
        />

        <label>Question:</label>
        <input
          type="text"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          required
          style={inputStyle}
        />

        <label>Choices:</label>
        {form.choices.map((choice, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Choice ${String.fromCharCode(65 + i)}`}
            value={choice}
            onChange={(e) => handleChoiceChange(i, e.target.value)}
            required
            style={inputStyle}
          />
        ))}

        <label>Correct Answer (0 = A, 1 = B, 2 = C, 3 = D):</label>
        <select
          value={form.correctAnswer}
          onChange={(e) => setForm({ ...form, correctAnswer: parseInt(e.target.value) })}
          required
          style={inputStyle}
        >
          <option value={0}>A</option>
          <option value={1}>B</option>
          <option value={2}>C</option>
          <option value={3}>D</option>
        </select>

        <label>Hint:</label>
        <input
          type="text"
          value={form.hint}
          onChange={(e) => setForm({ ...form, hint: e.target.value })}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#FFA600',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          Update Question
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  borderRadius: '8px',
  border: '1px solid #ccc'
};

export default UpdateQuestion;
