import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading/Loading';
import { Helmet } from 'react-helmet';

export default function CandlePage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page

  const filteredCandles = useMemo(() => {
    return candles.filter(
      (candle) => candle.symbol.toLowerCase() === symbol.toLowerCase()
    );
  }, [candles, symbol]);

  const paginatedCandles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCandles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCandles, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredCandles.length / itemsPerPage);
  }, [filteredCandles.length, itemsPerPage]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state

      const cachedData = localStorage.getItem(`candlesData-${symbol}`);
      if (cachedData) {
        setCandles(JSON.parse(cachedData)); // Use cached data if available
      } else {
        const response = await axios.get('/candle.json'); // Replace with actual endpoint

        if (response.data?.hits?.hits) {
          const data = response.data.hits.hits.map((item) => item._source) || [];
          setCandles(data);
        } else {
          setError(t('noCandleData')); // Handle case where no data is found
        }
      }
    } catch (error) {
      console.error('Error fetching candle data:', error);
      setError(t('unexpectedError'));
    } finally {
      setLoading(false);
    }
  }, [symbol, t]);

  useEffect(() => {
    fetchData();
  }, [symbol, fetchData]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when changing page
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('candleDataFor')} {symbol}</title>
      </Helmet>

      <button
        onClick={() => {
          navigate(-1);
          window.scrollTo(0, 0);
        }}
        className="mb-6 flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
        alt="back"
      >
        <AiOutlineArrowLeft className="mr-2" />
        {t('back')}
      </button>

      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        {t('candleDataFor')} {symbol}
      </h2>

      {paginatedCandles.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCandles.map((candle, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  <strong>{t('date')}:</strong>{' '}
                  {new Date(candle.dateTime).toLocaleString()}
                </p>
                <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                  <p><strong>{t('open')}:</strong> {candle.startPrice.toLocaleString()}</p>
                  <p><strong>{t('high')}:</strong> {candle.highestPrice.toLocaleString()}</p>
                  <p><strong>{t('low')}:</strong> {candle.lowestPrice.toLocaleString()}</p>
                  <p><strong>{t('close')}:</strong> {candle.endPrice.toLocaleString()}</p>
                  <p><strong>{t('volume')}:</strong> {candle.volume.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          

          <div className="mt-6 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition duration-200 shadow-lg space-x-2"
            >
              <AiOutlineArrowLeft className="text-lg" />
              <span>{t('previous')}</span>
            </button>
            <span className="text-gray-800 dark:text-gray-100 font-semibold">
              {t('page')} {currentPage} {t('of')} {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition duration-200 shadow-lg space-x-2"
            >
              <span>{t('next')}</span>
              <AiOutlineArrowRight className="text-lg" />
            </button>
          </div>



        </div>
      ) : (
        <p className="text-gray-500 text-center">{t('noCandleData')}</p>
      )}
    </div>
  );
}
