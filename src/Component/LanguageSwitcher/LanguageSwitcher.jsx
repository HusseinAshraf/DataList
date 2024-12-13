/* eslint-disable-next-line no-unused-vars */
import React, { useEffect, useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import Flag from "react-world-flags";

// Styles for better readability, moved outside of the component
const styles = {
  button: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    border: "1px solid #ddd",
    padding: "10px 20px",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "16px",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: "0",
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "150px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  menuItemHover: {
    backgroundColor: "#f1f1f1",
  },
};

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Change language and store it in localStorage
  const changeLanguage = useCallback(
    (lang) => {
      i18n.changeLanguage(lang);
      localStorage.setItem("language", lang);
      setIsOpen(false); // Close dropdown after selection
    },
    [i18n]
  );

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "de";
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  // Mouse hover handlers for menu items
  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = styles.menuItemHover.backgroundColor;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          style={styles.button}
          aria-label="Language selection dropdown"
          alt="change language"
        >
          <FaGlobe size={20} style={{ marginRight: "10px" }} />
          {i18n.language === "en" ? "English" : "German"}
          <HiChevronDown size={20} style={{ marginLeft: "10px" }} />
        </button>

        {isOpen && (
          <div style={styles.dropdown} role="menu" aria-label="Language options">
            {/* English */}
            <div
              onClick={() => changeLanguage("en")}
              style={styles.menuItem}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              role="menuitem"
              aria-label="Select English"
            >
              <Flag code="GB" style={{ width: "20px", height: "15px", marginRight: "10px" }} alt="English" />
              English
            </div>

            {/* German */}
            <div
              onClick={() => changeLanguage("de")}
              style={styles.menuItem}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              role="menuitem"
              aria-label="Select German"
            >
              <Flag code="DE" style={{ width: "20px", height: "15px", marginRight: "10px" }} alt="German" />
              German
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(LanguageSwitcher);
