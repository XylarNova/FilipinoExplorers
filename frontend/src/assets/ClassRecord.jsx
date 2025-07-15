import React from 'react';
import ExportClassRecordButton from './ExportClassRecordButton'; 

function ClassRecord() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Class Records</h1>
      
      {/* Export Button */}
      <ExportClassRecordButton />
    </div>
  );
}

export default ClassRecord;
