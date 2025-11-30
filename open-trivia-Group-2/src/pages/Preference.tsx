import { useEffect, useState } from "react";
import "./global.css";

const Preference = () => {
  const [difficulty, setDifficulty] = useState(localStorage.getItem("difficulty") || "easy");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [questionCount, setQuestionCount] = useState<number>(
    parseInt(localStorage.getItem("questionCount") || "10", 10)
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const updateDifficulty = (level: string) => {
    setDifficulty(level);
    localStorage.setItem("difficulty", level);
  };

  const toggleTheme = () => {
    if (!darkMode) {
      const confirmChange = window.confirm("Do you want to switch to Dark Mode?");
      if (!confirmChange) return;
      setDarkMode(true);
      localStorage.setItem("theme", "dark");
    } else {
      setDarkMode(false);
      localStorage.setItem("theme", "light");
    }
  };

  const updateQuestionCount = (count: number) => {
    const capped = Math.min(count, 50);
    const finalCount = Math.max(capped, 1);
    setQuestionCount(finalCount);
    localStorage.setItem("questionCount", finalCount.toString());
  };

  return (
    <div className="preferences-container">
      <h1>⚙️ Preferences</h1>
      <p className="preferences-subtitle">Customize your trivia experience</p>

      <div className="preferences-card">
        {/* Difficulty Section */}
        <div className="preference-section">
          <h2 className="preference-title">📊 Difficulty Level</h2>
          <p className="preference-description">Choose your challenge level</p>
          <div className="preference-difficulty-grid">
            {["easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                className={`preference-difficulty-btn ${difficulty === level ? "active" : ""}`}
                onClick={() => updateDifficulty(level)}
              >
                {level === "easy" && "🟢"}
                {level === "medium" && "🟡"}
                {level === "hard" && "🔴"}
                <span style={{ marginLeft: "0.5rem" }}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count Section */}
        <div className="preference-section">
          <h2 className="preference-title">❓ Number of Questions</h2>
          <p className="preference-description">Set questions per quiz (1-50)</p>
          <div className="preference-input-wrapper">
            <input
              type="number"
              min={1}
              max={50}
              value={questionCount}
              onChange={(e) => updateQuestionCount(parseInt(e.target.value || "1", 10))}
              className="preference-input"
            />
            <span className="preference-input-info">max 50</span>
          </div>
        </div>

        {/* Theme Section */}
        <div className="preference-section preference-section-last">
          <h2 className="preference-title">🎨 Theme</h2>
          <p className="preference-description">Choose your preferred theme</p>
          <button
            className={`preference-theme-btn ${darkMode ? "dark-mode" : "light-mode"}`}
            onClick={toggleTheme}
          >
            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>

        {/* Info Box */}
        <div className="preference-info-box">
          <p>💡 <strong>Tip:</strong> Your preferences are automatically saved and synced across sessions!</p>
        </div>
      </div>
    </div>
  );
};

export default Preference;