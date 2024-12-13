/* eslint-disable react/prop-types */
import React, { useState, useCallback, useMemo } from 'react';
import { FaChartLine, FaBitcoin, FaCubes, FaLayerGroup, FaRegMoneyBillAlt, FaGlobe, FaGem, FaCube } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function SideBar({ types, onFilterChange, selectedFilter }) {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Memoize the icons object to avoid recreation on each render
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

  // Memoize toggle and close functions to avoid re-creating on each render
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <>
      {/* Sidebar Toggle Button for Small Screens */}
      <div className="sm:hidden">
        <button
          onClick={toggleSidebar}
          type="button"
          className="inline-flex items-center p-2 mt-32 ml-7 text-sm text-gray-800 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 hover:bg-gray-300"
          alt='toggle button'
        >
          <span className="sr-only">Open sidebar</span>
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
        ></div>
      )}

      {/* Sidebar */}
      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform bg-white ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:w-64 lg:w-80`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {t('filterByType')}
          </h2>
          <ul className="space-y-2">
            {/* All Filter Button */}
            <li>
              <button
                onClick={() => onFilterChange(null)}
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-all ${selectedFilter === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                  } hover:bg-blue-700 focus:ring-2 focus:ring-blue-500`}
                alt='all'
              >
                <FaGlobe />
                <span className="ml-2">{t('all')}</span>
              </button>
            </li>

            {/* Filter by Type */}
            {types.map((type) => (
              <li key={type}> {/* Use the type as the "key" instead of index */}
                <button
                  onClick={() => onFilterChange(type)}
                  className={`flex items-center w-full px-4 py-2 rounded-lg transition-all ${selectedFilter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                    } hover:bg-blue-700 focus:ring-2 focus:ring-blue-500`}
                  alt={t(type)}
                >
                  {icons[type] || <FaGlobe />} {/* Ensure the icon exists */}
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
