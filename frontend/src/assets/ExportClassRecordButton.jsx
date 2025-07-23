import React from 'react';
import axios from 'axios';

function ExportClassRecordButton() {
  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/class-records/export', {
        responseType: 'blob', // Important to handle Excel file as binary
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'class_record.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. See console for details.');
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Export Class Records to Excel
      </button>
    </div>
  );
}

export default ExportClassRecordButton;
