import React, { useState } from "react";
import axios from "axios";

const AddWordOfTheDay = () => {
  const [salita, setSalita] = useState("");
  const [salitaTranslation, setSalitaTranslation] = useState("");
  const [kahulugan, setKahulugan] = useState("");
  const [kahuluganTranslation, setKahuluganTranslation] = useState("");
  const [pangungusap, setPangungusap] = useState("");
  const [pangungusapTranslation, setPangungusapTranslation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const wordData = {
      salita,
      salitaTranslation,
      kahulugan,
      kahuluganTranslation,
      pangungusap,
      pangungusapTranslation,
    };

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        "http://localhost:8080/api/words/add",
        wordData
      );

      console.log("Word added:", response.data);

      // Clear the form
      setSalita("");
      setSalitaTranslation("");
      setKahulugan("");
      setKahuluganTranslation("");
      setPangungusap("");
      setPangungusapTranslation("");

      alert("Word added successfully!");
    } catch (error) {
      console.error("Failed to add word:", error);
      alert("Failed to add word. Please check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Add Word of the Day
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="salita" className="text-sm font-medium text-gray-700">
            Salita (Word)
          </label>
          <input
            type="text"
            id="salita"
            value={salita}
            onChange={(e) => setSalita(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="salitaTranslation" className="text-sm font-medium text-gray-700">
            Translation of Salita
          </label>
          <input
            type="text"
            id="salitaTranslation"
            value={salitaTranslation}
            onChange={(e) => setSalitaTranslation(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="kahulugan" className="text-sm font-medium text-gray-700">
            Kahulugan (Meaning)
          </label>
          <textarea
            id="kahulugan"
            value={kahulugan}
            onChange={(e) => setKahulugan(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="kahuluganTranslation" className="text-sm font-medium text-gray-700">
            Translation of Kahulugan
          </label>
          <textarea
            id="kahuluganTranslation"
            value={kahuluganTranslation}
            onChange={(e) => setKahuluganTranslation(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="pangungusap" className="text-sm font-medium text-gray-700">
            Pangungusap (Sentence)
          </label>
          <textarea
            id="pangungusap"
            value={pangungusap}
            onChange={(e) => setPangungusap(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="pangungusapTranslation" className="text-sm font-medium text-gray-700">
            Translation of Pangungusap
          </label>
          <textarea
            id="pangungusapTranslation"
            value={pangungusapTranslation}
            onChange={(e) => setPangungusapTranslation(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 px-6 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWordOfTheDay;
