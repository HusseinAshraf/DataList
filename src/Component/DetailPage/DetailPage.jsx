/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { BsGraphUp } from 'react-icons/bs';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

const Loading = lazy(() => import('../Loading/Loading'));

export default function DetailPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cachedData = localStorage.getItem(`detail-${symbol}`);
      const cachedTime = localStorage.getItem(`detailTimestamp-${symbol}`);
      const currentTime = Date.now();

      if (cachedData && currentTime - cachedTime < 3600000) {
        setDetail(JSON.parse(cachedData));
      } else {
        const { data } = await axios.get('/metadata.json');
        const detailData = data.hits.hits.find((item) => item._source.symbol === symbol)?.['_source'];

        if (detailData) {
          localStorage.setItem(`detail-${symbol}`, JSON.stringify(detailData));
          localStorage.setItem(`detailTimestamp-${symbol}`, currentTime);
          setDetail(detailData);
        } else {
          setError(t('detailsNotFound'));
        }
      }
    } catch (err) {
      console.error('Error fetching metadata:', err);
      setError(
        err.response
          ? `${t('errorFetchingData')}: ${err.response.statusText}`
          : err.request
            ? t('networkError')
            : t('unexpectedError')
      );
    } finally {
      setLoading(false);
    }
  }, [symbol, t]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const detailContent = useMemo(() => {
    if (!detail) return null;

    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{detail.name}</h2>
        <div className="space-y-3">
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="font-semibold">{t('symbol')}:</strong> {detail.symbol}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="font-semibold">{t('type')}:</strong> {detail.type}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="font-semibold">{t('country')}:</strong> {detail.countryName}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="font-semibold">{t('currency')}:</strong> {detail.currency}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="font-semibold">{t('description')}:</strong>{' '}
            {detail.description || t('notAvailable')}
          </p>
        </div>

        <button
          onClick={() => navigate(`/candles/${symbol}`)}
          className="mt-6 flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg transition duration-200"
          alt='view candle'
        >
          <BsGraphUp className="mr-2" />
          {t('viewCandle')}
        </button>
      </div>
    );
  }, [detail, navigate, symbol, t]);

  const metaDescription = detail
    ? `${detail.name} (${detail.symbol}) - A detailed view of the ${detail.type} from ${detail.countryName}, available in ${detail.currency}.`
    : t('loadingDetails');

  if (loading) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Loading />
      </Suspense>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Helmet>
        <title>{detail ? `${detail.name} - ${t('details')}` : t('loadingDetails')}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
        alt='back'
      >
        <AiOutlineArrowLeft className="mr-2" />
        {t('back')}
      </button>

      {error ? (
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      ) : detail ? (
        detailContent
      ) : (
        <div className="text-center text-gray-500">
          <p>{t('detailsNotAvailable')}</p>
        </div>
      )}
    </div>
  );
}
