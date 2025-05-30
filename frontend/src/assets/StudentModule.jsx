import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentSidebar from "./StudentSidebar"; // ✅ Import the sidebar

const StudentModule = ({ assignedGames, darkMode = false }) => {
  const navigate = useNavigate();
  const { gameType } = useParams();

  // ✅ Filter by game type (URL param)
  const filteredGames = gameType
    ? assignedGames.filter(
        (game) => game.gameTitle.toLowerCase().replace(/\s/g, "-") === gameType
      )
    : assignedGames;

  // ✅ Group by quarter
  const gamesByQuarter = filteredGames.reduce((acc, game) => {
    const quarter = game.quarter || "Unassigned";
    if (!acc[quarter]) acc[quarter] = [];
    acc[quarter].push(game);
    return acc;
  }, {});

  // ✅ Status badge
  const renderStatusBadge = (status) => (
    <span
      className={`px-3 py-1 text-sm font-bold rounded-full text-white`}
      style={{ backgroundColor: status === "Open" ? "#06D6A0" : "#EF476F" }}
    >
      {status}
    </span>
  );

  // ✅ Button: Start or Lock
  const renderGameButton = (status, gameSlug, gameId) => {
    if (status === "Open") {
      return (
        <button
          onClick={() => navigate(`/play/${gameSlug}/${gameId}`)}
          className="bg-[#06D6A0] text-white px-4 py-1 rounded-full text-sm font-semibold hover:opacity-90 transition"
        >
          Start
        </button>
      );
    } else {
      return (
        <button
          disabled
          className="bg-white text-black px-4 py-1 rounded-full text-sm font-semibold cursor-not-allowed"
        >
          Lock
        </button>
      );
    }
  };

  const bgClass = darkMode ? "bg-gray-900 text-white" : "bg-white text-[#213547]";

  return (
    <div className={`flex h-screen ${bgClass}`}>
      {/* ✅ Sidebar */}
      <StudentSidebar darkMode={darkMode} />

      {/* ✅ Main Content Area */}
      <div className="flex-1 overflow-y-auto p-10 space-y-10">
        {Object.entries(gamesByQuarter).map(([quarter, games], idx) => {
          const isOpen = games.some((game) => game.status === "Open");
          const quarterStatus = isOpen ? "Open" : "Closed";

          return (
            <div
              key={idx}
              className="rounded-xl border shadow p-6 bg-[#FCF8ED]"
            >
              <div className="flex justify-between items-center mb-4">
                {renderStatusBadge(quarterStatus)}
                <h3 className="text-xl font-bold text-[#213547]">
                  Quarter {quarter}
                </h3>
              </div>

              <div className="space-y-4">
                {games.map((game, i) => {
                  const gameSlug = game.gameTitle.toLowerCase().replace(/\s/g, "-");
                  const color = game.status === "Open" ? "#FFD166" : "#F78C6B";

                  return (
                    <div
                      key={i}
                      className="flex justify-between items-center px-4 py-3 rounded-lg shadow"
                      style={{ backgroundColor: color }}
                    >
                      <span className="text-md font-semibold text-[#073B4C]">
                        {game.gameTitle}
                      </span>
                      {renderGameButton(game.status, gameSlug, game.id)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredGames.length === 0 && (
          <p className="text-center text-gray-500 text-md mt-10">
            No game available for this module.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentModule;
