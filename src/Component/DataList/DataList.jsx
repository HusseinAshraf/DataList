/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, memo, Suspense, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import debounce from 'lodash.debounce'; // Add lodash for debouncing

const MemoizedSideBar = memo(React.lazy(() => import('../SideBar/SideBar.jsx')));
const MemoizedLanguageSwitcher = memo(React.lazy(() => import('../LanguageSwitcher/LanguageSwitcher.jsx')));

export default function DataList() {
  const { t } = useTranslation();
  const [exchangeData, setExchangeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const navigate = useNavigate();

  const types = useMemo(
    () => [
      'Common Stock', 'Cryptocurrency', 'Exchange traded commodity', 'Exchange traded fund',
      'Fund', 'Index', 'Commodity', 'Mutual fund',
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem('exchangeData');
        const cachedTime = localStorage.getItem('exchangeDataTimestamp');
        const currentTime = new Date().getTime();

        if (cachedData && cachedTime && currentTime - cachedTime <= 3600000) {
          setExchangeData(JSON.parse(cachedData));
        } else {
          const response = await axios.get('/exchange.json');
          const data = response.data.hits.hits.map((item) => item._source);
          if (data.length > 0) {
            localStorage.setItem('exchangeData', JSON.stringify(data));
            localStorage.setItem('exchangeDataTimestamp', currentTime);
            setExchangeData(data);
          }
        }
      } catch (error) {
        console.error('Error fetching exchange data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const filteredData = useMemo(
    () =>
      exchangeData.filter((item) => {
        const matchesFilter = selectedFilter
          ? item.type?.toLowerCase() === selectedFilter.toLowerCase()
          : true;
        const matchesSearch = searchTerm
          ? item.name?.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        return matchesFilter && matchesSearch;
      }),
    [exchangeData, searchTerm, selectedFilter]
  );

  const handleSearch = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleFilterChange = (filter) => setSelectedFilter(filter);

  const handleItemClick = (symbol) => navigate(`/details/${symbol}`);

  const metaDescription = `Find the best exchange data based on your search for "${searchTerm}"${selectedFilter ? ` and filter by ${selectedFilter}` : ''}.`;

  return (
    <>
      <Helmet>
        <title>{t('dataList')}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <div className="md:block w-64">
        <Suspense fallback={<div>Loading sidebar...</div>}>
          <MemoizedSideBar
            types={types}
            onFilterChange={handleFilterChange}
            selectedFilter={selectedFilter}
          />
        </Suspense>
      </div>

      <div className="sm:ml-64 overflow-auto p-6 dark:bg-gray-900">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-200">
            {t('dataList')}
          </h1>

          <div className="flex items-center space-x-4 w-full md:w-auto">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <Suspense fallback={<div>Loading language switcher...</div>}>
              <MemoizedLanguageSwitcher />
            </Suspense>
          </div>
        </header>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div
                  key={item.symbol}
                  className="flex flex-col items-start bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-transform duration-300"
                  onClick={() => handleItemClick(item.symbol)}
                >
                  <strong className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {item.name || t('notAvailable')}
                  </strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400">({item.symbol})</p>
                  <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                    <p>{t('type')}: {item.type || t('notAvailable')}</p>
                    <p>{t('country')}: {item.country || t('notAvailable')}</p>
                    <p>{t('currency')}: {item.currency || t('notAvailable')}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">{t('noData')}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
