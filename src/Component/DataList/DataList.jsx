/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, memo, Suspense, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import debounce from 'lodash.debounce';

const SideBar = memo(React.lazy(() => import('../SideBar/SideBar.jsx')));
const LanguageSwitcher = memo(React.lazy(() => import('../LanguageSwitcher/LanguageSwitcher.jsx')));

export default function DataList() {
  const { t } = useTranslation();
  const [exchangeData, setExchangeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const navigate = useNavigate();

  const types = useMemo(() => [
    'Common Stock', 'Cryptocurrency', 'Exchange traded commodity',
    'Exchange traded fund', 'Fund', 'Index', 'Commodity', 'Mutual fund'
  ], []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cachedData = localStorage.getItem('exchangeData');
        const cachedTime = localStorage.getItem('exchangeDataTimestamp');
        const currentTime = Date.now();

        if (cachedData && cachedTime && currentTime - cachedTime <= 3600000) {
          setExchangeData(JSON.parse(cachedData));
        } else {
          const { data } = await axios.get('/exchange.json');
          const formattedData = data.hits.hits.map((item) => item._source);
          localStorage.setItem('exchangeData', JSON.stringify(formattedData));
          localStorage.setItem('exchangeDataTimestamp', currentTime);
          setExchangeData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching exchange data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return exchangeData.filter((item) => {
      const matchesFilter = selectedFilter
        ? item.type?.toLowerCase() === selectedFilter.toLowerCase()
        : true;
      const matchesSearch = searchTerm
        ? item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesFilter && matchesSearch;
    });
  }, [exchangeData, searchTerm, selectedFilter]);

  const handleSearch = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleFilterChange = (filter) => setSelectedFilter(filter);

  const handleItemClick = (symbol) => navigate(`/details/${symbol}`);

  const highlightText = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{
            backgroundColor: 'yellow',
            borderRadius: '4px',
            padding: '0 2px',
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const metaDescription = useMemo(() =>
    `Find the best exchange data${searchTerm ? ` for "${searchTerm}"` : ''}${selectedFilter ? ` filtered by ${selectedFilter}` : ''}.`,
    [searchTerm, selectedFilter]
  );

  return (
    <>
      <Helmet>
        <title>{t('dataList')}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <div className="flex flex-col sm:flex-row">
        {/* Sidebar */}
        <div className="md:block w-64">
          <Suspense fallback={<div>{t('loadingSidebar')}...</div>}>
            <SideBar
              types={types}
              onFilterChange={handleFilterChange}
              selectedFilter={selectedFilter}
            />
          </Suspense>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold">{t('dataList')}</h1>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg placeholder-gray-400"
                  style={{
                    backgroundColor: '#f9f9f9', // Lighter background for input field
                    borderColor: '#d1d1d1', // Slightly darker border for better contrast
                  }}
                />
                <button
                  onClick={() => handleSearch(searchTerm)}
                  className="flex items-center justify-center p-2 ml-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <Suspense fallback={<div>{t('loadingLanguageSwitcher')}...</div>}>
                <LanguageSwitcher />
              </Suspense>
            </div>
          </header>

          {/* Content */}
          {loading ? (
            <div className="text-center">{t('loading')}...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <div
                    key={item.symbol}
                    className="p-4 bg-white rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    onClick={() => handleItemClick(item.symbol)}
                  >
                    <strong className="text-lg">
                      {highlightText(item.name || t('notAvailable'), searchTerm)}
                    </strong>
                    <p>({item.symbol})</p>
                    <p>{t('type')}: {item.type || t('notAvailable')}</p>
                    <p>{t('country')}: {item.country || t('notAvailable')}</p>
                    <p>{t('currency')}: {item.currency || t('notAvailable')}</p>
                  </div>
                ))
              ) : (
                <p className="text-center">{t('noData')}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
