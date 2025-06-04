// ProgressTracking.jsx (Frontend UI only)
import React, { useEffect, useState } from 'react';
import Rank1 from '../assets/images/Progress Tracking Teacher/1.png';
import Rank2 from '../assets/images/Progress Tracking Teacher/2.png';
import Rank3 from '../assets/images/Progress Tracking Teacher/3.png';
import Rank4 from '../assets/images/Progress Tracking Teacher/4.png';
import Rank5 from '../assets/images/Progress Tracking Teacher/5.png';
import Rank6 from '../assets/images/Progress Tracking Teacher/6.png';
import Rank7 from '../assets/images/Progress Tracking Teacher/7.png';
import Rank8 from '../assets/images/Progress Tracking Teacher/8.png';
import Rank9 from '../assets/images/Progress Tracking Teacher/9.png';
import Rank10 from '../assets/images/Progress Tracking Teacher/10.png';

const rankImages = [null, Rank1, Rank2, Rank3, Rank4, Rank5, Rank6, Rank7, Rank8, Rank9, Rank10];

const ProgressTracking = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Dummy data only, backend needed for real data
    const dummy = [
      { name: 'Mark Reyes', start: '2024-02-20', end: '2024-02-20', score: 50, time: '40 mins', cheating: false, status: 'Completed', module: 'Paaralan Quest' },
      { name: 'Angela Dizon', start: '2024-02-19', end: '2024-02-19', score: 46, time: '25 mins', cheating: true, status: 'Completed', module: 'Guess the Word' },
      { name: 'Luis Fernandez', start: '2024-02-20', end: '2024-02-20', score: 45, time: '28 mins', cheating: false, status: 'Completed', module: 'Vocabulary Quest' },
      { name: 'Melissa Garcia', start: '2024-02-18', end: '2024-02-18', score: 42, time: '32 mins', cheating: false, status: 'Completed', module: 'Memory Game' },
      { name: 'Rafael Cruz', start: '2024-02-20', end: '2024-02-20', score: 40, time: '22 mins', cheating: true, status: 'Completed', module: 'Parke Quest' },
      { name: 'Bryan Santos', start: '2024-02-19', end: '2024-02-19', score: 39, time: '25 mins', cheating: true, status: 'Completed', module: 'Paaralan Quest' },
    ];
    const sorted = dummy.sort((a, b) => b.score - a.score);
    setStudents(sorted);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-[32px] font-bold text-[#073A4D] mb-6">Section Fortitude</h1>

      <div className="mb-4">
        <select className="border rounded px-4 py-2 shadow">
          <option value="">Sort by</option>
          <option value="score">Score</option>
          <option value="time">Total Time</option>
        </select>
      </div>

      <div className="rounded-xl border border-[#108AB1] overflow-hidden">
        <div className="grid grid-cols-8 bg-[#E0F2F7] text-[#073B4D] font-semibold text-center py-3">
          <div>Rank</div>
          <div>Name</div>
          <div>Date Started</div>
          <div>Date Completed</div>
          <div>Score</div>
          <div>Total Time</div>
          <div>Cheating</div>
          <div>Status</div>
        </div>

        {students.map((s, i) => (
          <div key={i} className="grid grid-cols-8 items-center text-center py-3 border-t border-[#CDEDF6] hover:bg-[#F8FDFF]">
            <div>{rankImages[i + 1] ? <img src={rankImages[i + 1]} alt={`Rank ${i + 1}`} className="w-6 h-6 mx-auto" /> : <div className="rounded-full bg-gray-200 text-sm w-6 h-6 flex items-center justify-center mx-auto">{i + 1}</div>}</div>
            <div>{s.name}</div>
            <div>{s.start}</div>
            <div>{s.end}</div>
            <div className="font-bold">{s.score}</div>
            <div>{s.time}</div>
            <div>
              <span className={`px-3 py-1 rounded-full text-white font-medium ${s.cheating ? 'bg-[#EF476F]' : 'bg-[#06D6A0]'}`}>{s.cheating ? 'Yes' : 'No'}</span>
            </div>
            <div className="font-semibold text-[#073A4D]">{s.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracking;
