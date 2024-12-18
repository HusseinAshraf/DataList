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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredCandles = useMemo(
    () => candles.filter((candle) => candle.symbol.toLowerCase() === symbol.toLowerCase()),
    [candles, symbol]
  );

  const paginatedCandles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCandles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCandles, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => Math.ceil(filteredCandles.length / itemsPerPage), [
    filteredCandles.length,
    itemsPerPage,
  ]);

  const clearLocalStorage = () => {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('candlesData-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cachedData = localStorage.getItem(`candlesData-${symbol}`);
      if (cachedData) {
        setCandles(JSON.parse(cachedData));
      } else {
        const response = await axios.get('/candle.json');
        if (response.data?.hits?.hits) {
          const data = response.data.hits.hits.map((item) => item._source);

          // Clear old data before storing new data
          clearLocalStorage();

          // Check the size of the data before saving to localStorage
          if (JSON.stringify(data).length < 5000000) { // 5MB limit
            setCandles(data);
            localStorage.setItem(`candlesData-${symbol}`, JSON.stringify(data));
          } else {
            setError(t('dataTooLargeError')); // Custom error for large data
          }
        } else {
          setError(t('noCandleData'));
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
  }, [fetchData]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-lg font-medium">{error}</p>
        {error === t('dataTooLargeError') && (
          <p className="text-sm text-gray-600">{t('reduceDataSize')}</p>
        )}
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
      >
        <AiOutlineArrowLeft className="mr-2" />
        {t('back')}
      </button>

      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {t('candleDataFor')} {symbol}
      </h2>

      {paginatedCandles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCandles.map((candle, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform"
              >
                <p className="text-gray-700">
                  <strong>{t('date')}:</strong> {new Date(candle.dateTime).toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>{t('open')}:</strong> {candle.startPrice.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>{t('high')}:</strong> {candle.highestPrice.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>{t('low')}:</strong> {candle.lowestPrice.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>{t('close')}:</strong> {candle.endPrice.toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>{t('volume')}:</strong> {candle.volume.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 bg-red-500 text-white  hover:bg-red-700 rounded-lg   disabled:cursor-not-allowed transition"
            >
              <AiOutlineArrowLeft />
              <span>{t('previous')}</span>
            </button>

            <span className="text-gray-700">
              {t('page')} {currentPage} {t('of')} {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 bg-red-500 text-white  hover:bg-red-700 rounded-lg  disabled:cursor-not-allowed transition"
            >
              <span>{t('next')}</span>
              <AiOutlineArrowRight />
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">{t('noCandleData')}</p>
      )}
    </div>
  );
}
