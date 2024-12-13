import React, { useEffect, useState, useMemo, Suspense, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
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

  // Memoize filtered candles to avoid recalculating on every render
  const filteredCandles = useMemo(() => {
    return candles.filter(
      (candle) => candle.symbol.toLowerCase() === symbol.toLowerCase()
    );
  }, [candles, symbol]);

  // Memoize function to avoid re-creating it on every render
  const storeDataWithQuotaCheck = useCallback((key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn('Quota exceeded, clearing old data...');
        localStorage.clear();
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        throw e;
      }
    }
  }, []);

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
          storeDataWithQuotaCheck(`candlesData-${symbol}`, data); // Cache the fetched data
        } else {
          setError(t('noCandleData')); // Handle case where no data is found
        }
      }
    } catch (error) {
      console.error('Error fetching candle data:', error);
      if (error.response) {
        setError(`${t('errorFetchingData')}: ${error.response.statusText}`);
      } else if (error.request) {
        setError(t('networkError'));
      } else {
        setError(t('unexpectedError'));
      }
    } finally {
      setLoading(false);
    }
  }, [symbol, t, storeDataWithQuotaCheck]);

  // Fetch data on initial mount and when symbol changes
  useEffect(() => {
    fetchData();
  }, [symbol, fetchData]);

  // If loading, show loading component
  if (loading) {
    return <Loading />;
  }

  // If there was an error, show error message
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  const metaDescription = filteredCandles.length > 0
    ? `${t('candleDataFor')} ${symbol}: ${t('viewCandleDataDesc')}`
    : t('loadingDetails');

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('candleDataFor')} {symbol}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <button
        onClick={() => {
          navigate(-1);
          window.scrollTo(0, 0); // Scroll to top on back
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

      {filteredCandles.length > 0 ? (
        <Suspense fallback={<Loading />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandles.map((candle, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  <strong>{t('date')}:</strong>{' '}
                  {new Date(candle.dateTime).toLocaleString()}
                </p>
                <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                  <p>
                    <strong>{t('open')}:</strong> {candle.startPrice.toLocaleString()}
                  </p>
                  <p>
                    <strong>{t('high')}:</strong> {candle.highestPrice.toLocaleString()}
                  </p>
                  <p>
                    <strong>{t('low')}:</strong> {candle.lowestPrice.toLocaleString()}
                  </p>
                  <p>
                    <strong>{t('close')}:</strong> {candle.endPrice.toLocaleString()}
                  </p>
                  <p>
                    <strong>{t('volume')}:</strong> {candle.volume.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Suspense>
      ) : (
        <p className="text-gray-500 text-center">{t('noCandleData')}</p>
      )}
    </div>
  );
}
