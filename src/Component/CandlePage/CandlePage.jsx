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
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 6;

  const filteredCandles = useMemo(
    () => candles.filter((candle) => candle.symbol.toLowerCase() === symbol.toLowerCase()),
    [candles, symbol]
  );

  // const paginatedCandles = useMemo(() => {
  //   const startIndex = (currentPage - 1) * itemsPerPage;
  //   return filteredCandles.slice(startIndex, startIndex + itemsPerPage);
  // }, [filteredCandles, currentPage, itemsPerPage]);

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

      <button
        onClick={() => {
          navigate(-1);
          window.scrollTo(0, 0);
        }}
        className="mb-6 flex items-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <AiOutlineArrowLeft className="mr-2" />
        {t('back')}
      </button>

      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {t('candleDataFor')} {symbol}
      </h2>

      {filteredCandles.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={filteredCandles} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="startPriceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="endPriceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="dateTime" 
              tickFormatter={(time) => new Date(time).toLocaleDateString()}
              tick={{ fill: '#4b5563', fontSize: 12 }}
              axisLine={{ stroke: '#d1d5db', strokeWidth: 2 }}
            />
            <YAxis 
              tick={{ fill: '#4b5563', fontSize: 12 }}
              axisLine={{ stroke: '#d1d5db', strokeWidth: 2 }}
            />
            <Tooltip 
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
                padding: '12px'
              }}
              labelFormatter={(time) => new Date(time).toLocaleString()}
              formatter={(value) => value.toLocaleString()}
            />
            <CartesianGrid 
              strokeDasharray="4 4" 
              stroke="#e5e7eb" 
              strokeOpacity={0.5}
            />
            <Bar 
              dataKey="volume" 
              barSize={20} 
              fill="url(#volumeGradient)"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
              onMouseEnter={(e) => {
                e.target.style.fill = '#4f46e5';
              }}
              onMouseLeave={(e) => {
                e.target.style.fill = 'url(#volumeGradient)';
              }}
            />
            <Line 
              type="monotone" 
              dataKey="startPrice" 
              stroke="url(#startPriceGradient)"
              strokeWidth={3}
              dot={{ 
                r: 5, 
                fill: '#f97316', 
                stroke: '#fff', 
                strokeWidth: 2,
                className: 'hover:scale-125 transition-all'
              }}
              activeDot={{ 
                r: 8,
                stroke: '#fff',
                strokeWidth: 2,
                fill: '#f97316',
                className: 'shadow-lg'
              }}
              animationDuration={1000}
            />
            <Line 
              type="monotone" 
              dataKey="endPrice" 
              stroke="url(#endPriceGradient)"
              strokeWidth={3}
              dot={{ 
                r: 5, 
                fill: '#16a34a', 
                stroke: '#fff', 
                strokeWidth: 2,
                className: 'hover:scale-125 transition-all'
              }}
              activeDot={{ 
                r: 8,
                stroke: '#fff',
                strokeWidth: 2,
                fill: '#16a34a',
                className: 'shadow-lg'
              }}
              animationDuration={1000}
            />
          </ComposedChart>
          </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">{t('noCandleData')}</p>
      )}
    </div>
  );
};

export default CandlePage;
