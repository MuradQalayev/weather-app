import React, { useEffect, useRef, useState } from 'react'



const Navbar = ({switchLanguage, language, setIsModalOpen, translations, state, dispatch}) => {
  const [menuOpen, setMenuOpen] = useState(false);

    function useCloseOnOutsideClick(ref) {
      useEffect(() => {
        function handleClickOutside(e) {
          if (ref.current && !ref.current.contains(e.target)) {
            ref.current.removeAttribute("open");
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }, [ref]);
    }
    const dropdownRef = useRef(null);
    useCloseOnOutsideClick(dropdownRef);
    
  return (
    <>
      <div className="logo">☁️ Weather+</div>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <div className={`nav-controls ${menuOpen ? "open" : ""}`}>
        <button className="nav-button" onClick={() => setIsModalOpen(true)}>
          {translations[language].askAI}
        </button>
        <select
          className="nav-button"
          value={language}
          onChange={(e) => switchLanguage(e.target.value)}
        >
          <option value="en">🇬🇧 English</option>
          <option value="ru">🇷🇺 Русский</option>
          <option value="it">🇮🇹 Italiano</option>
          <option value="zh">🇨🇳 中文</option>
          <option value="es">🇪🇸 Español</option>
        </select>

        <details ref={dropdownRef} className="nav-dropdown">
          <summary className="nav-button">⚙️ Options</summary>
          <div className="dropdown-menu">
            <button
              data-cy="toggle-weather"
              onClick={() => dispatch({ type: "TOGGLE_WEATHER" })}
            >
              <span class="material-symbols-outlined">cloud</span>
              {state.showWeather
                ? translations[language].hideWeather
                : translations[language].showWeather}
            </button>

            <button
              data-cy="toggle-pomodoro"
              onClick={() => dispatch({ type: "TOGGLE_POMODORO" })}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span className="material-symbols-outlined">timer</span>
              {state.showPomodoro
                ? translations[language].hidePomodoro
                : translations[language].showPomodoro}
            </button>

            <button
              data-cy="toggle-music"
              onClick={() => {
                const audio = document.getElementById("bg-music");
                if (audio.paused) {
                  audio.muted = false;
                  audio.play();
                } else {
                  audio.pause();
                }
                dispatch({ type: "TOGGLE_PLAY" });
              }}
            >
              {state.isPlaying
                ? `🔊 ${translations[language].musicOn}`
                : `🔇 ${translations[language].musicOff}`}
            </button>
            <button
              onClick={() =>
                window.open("https://galayevmurad.site/", "_blank")
              }
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <span className="material-symbols-outlined">
                supervised_user_circle
              </span>
              About me!
            </button>
          </div>
        </details>
      </div>
    </>
  );
}

export default Navbar