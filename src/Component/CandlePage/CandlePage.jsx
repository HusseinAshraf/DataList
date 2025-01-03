/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading/Loading';
import { Helmet } from 'react-helmet';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Line,
} from 'recharts';
import i18n from '../../i18n';

const openDb = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('candlesDB', 1);
    request.onerror = () => reject('IndexedDB failed');
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('candles')) {
        db.createObjectStore('candles', { keyPath: 'symbol' });
      }
    };
  });
};

const fetchDataFromDb = async (symbol) => {
  const db = await openDb();
  const transaction = db.transaction('candles', 'readonly');
  const store = transaction.objectStore('candles');
  return new Promise((resolve, reject) => {
    const request = store.get(symbol);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Failed to fetch data from DB');
  });
};

const saveDataToDb = async (symbol, data) => {
  const db = await openDb();
  const transaction = db.transaction('candles', 'readwrite');
  const store = transaction.objectStore('candles');
  store.put({ symbol, data });
};

const CandlePage = () => {
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cachedData = await fetchDataFromDb(symbol);
      if (cachedData) {
        setCandles(cachedData.data);
      } else {
        const response = await axios.get('/candle.json');
        const data = response.data.hits.hits.map((item) => item._source);
        setCandles(data);
        saveDataToDb(symbol, data);
      }
    } catch (error) {
      setError(t('unexpectedError'));
    } finally {
      setLoading(false);
    }
  }, [symbol, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('candleDataFor')} {symbol}</title>
      </Helmet>

      <div className="flex justify-end mb-4">
        <button onClick={() => changeLanguage('en')} className="mx-2 px-4 py-2 border rounded">
          English
        </button>
        <button onClick={() => changeLanguage('de')} className="mx-2 px-4 py-2 border rounded">
          Deutsch
        </button>
      </div>

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

      {filteredCandles.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={filteredCandles}>
            <XAxis dataKey="dateTime" tickFormatter={(time) => new Date(time).toLocaleDateString()} />
            <YAxis />
            <Tooltip labelFormatter={(time) => new Date(time).toLocaleString()} />
            <CartesianGrid stroke="#f5f5f5" />
            <Bar dataKey="volume" barSize={20} fill="#8884d8" />
            <Line type="monotone" dataKey="startPrice" stroke="#ff7300" />
            <Line type="monotone" dataKey="endPrice" stroke="#387908" />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">{t('noCandleData')}</p>
      )}
    </div>
  );
};

export default CandlePage;
