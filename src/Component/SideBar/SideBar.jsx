/* eslint-disable react/prop-types */
import React, { useState, useCallback, useMemo } from 'react';
import { FaChartLine, FaBitcoin, FaCubes, FaLayerGroup, FaRegMoneyBillAlt, FaGlobe, FaGem, FaCube } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function SideBar({ types, onFilterChange, selectedFilter }) {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Memoize icons object
  const icons = useMemo(() => ({
    'Common Stock': <FaChartLine />,
    Cryptocurrency: <FaBitcoin />,
    'Exchange traded commodity': <FaCubes />,
    'Exchange traded fund': <FaLayerGroup />,
    Fund: <FaRegMoneyBillAlt />,
    Index: <FaGlobe />,
    Commodity: <FaGem />,
    'Mutual fund': <FaCube />,
  }), []);

  // Toggle and close sidebar functions
  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <div className="sm:hidden">
        <button
          onClick={toggleSidebar}
          type="button"
          className="inline-flex items-center p-2 text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-300"
        >
          <span className="sr-only">{t('toggleSidebar')}</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>
      </div>

      {/* Background Overlay */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black opacity-50 z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar fixed top-0 left-0 z-40 w-64 h-full bg-white dark:bg-gray-800 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-6 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('filterByType')}</h2>
          <ul className="space-y-2">
            {/* All Filter Button */}
            <li>
              <button
                onClick={() => onFilterChange(null)}
                className={`flex items-center w-full px-4 py-2 rounded-lg ${selectedFilter === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  } hover:bg-blue-700`}
              >
                <FaGlobe />
                <span className="ml-2">{t('all')}</span>
              </button>
            </li>

            {/* Filter by Type */}
            {types.map((type) => (
              <li key={type}>
                <button
                  onClick={() => onFilterChange(type)}
                  className={`flex items-center w-full px-4 py-2 rounded-lg ${selectedFilter === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    } hover:bg-blue-700`}
                >
                  {icons[type] || <FaGlobe />}
                  <span className="ml-2">{t(type)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}

export default React.memo(SideBar);
