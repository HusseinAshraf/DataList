import React, { useEffect, useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import Flag from "react-world-flags";

// Inline styles for better readability
const styles = {
  button: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    border: "1px solid #ddd",
    padding: "10px 20px",
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: "0",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    width: "150px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    zIndex: 10,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Handle language change
  const changeLanguage = useCallback(
    (lang) => {
      i18n.changeLanguage(lang);
      localStorage.setItem("language", lang);
      setIsOpen(false);
    },
    [i18n]
  );

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={styles.button}
        aria-label="Language selection dropdown"
      >
        <FaGlobe size={20} style={{ marginRight: "10px" }} />
        {i18n.language === "en" ? "English" : "German"}
        <HiChevronDown size={20} style={{ marginLeft: "10px" }} />
      </button>

      {isOpen && (
        <div style={styles.dropdown} role="menu">
          <div
            onClick={() => changeLanguage("en")}
            style={styles.menuItem}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f1f1")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            role="menuitem"
          >
            <Flag code="GB" style={{ width: "20px", height: "15px", marginRight: "10px" }} alt="English Flag" />
            English
          </div>
          <div
            onClick={() => changeLanguage("de")}
            style={styles.menuItem}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f1f1")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            role="menuitem"
          >
            <Flag code="DE" style={{ width: "20px", height: "15px", marginRight: "10px" }} alt="German Flag" />
            German
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(LanguageSwitcher);
