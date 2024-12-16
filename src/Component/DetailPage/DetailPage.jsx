import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
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

  // Fetching details with caching logic
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const cachedData = localStorage.getItem(`detail-${symbol}`);
      const cachedTime = localStorage.getItem(`detailTimestamp-${symbol}`);
      const currentTime = Date.now();

      if (cachedData && currentTime - cachedTime < 3600000) {
        setDetail(JSON.parse(cachedData));
      } else {
        const { data } = await axios.get('/metadata.json');
        const detailData = data.hits.hits.find(item => item._source.symbol === symbol)?._source;

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
      setError(err?.response ? `${t('errorFetchingData')}: ${err.response.statusText}` : t('networkError'));
    } finally {
      setLoading(false);
    }
  }, [symbol, t]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // Fallback for missing fields
  const getFieldValue = (field) => field || t('notAvailable');

  const detailContent = detail && (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{getFieldValue(detail.name)}</h2>
      <div className="space-y-3">
        <p className="text-gray-700 dark:text-gray-300">
          <strong className="font-semibold">{t('symbol')}:</strong> {getFieldValue(detail.symbol)}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong className="font-semibold">{t('type')}:</strong> {getFieldValue(detail.type)}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong className="font-semibold">{t('country')}:</strong> {getFieldValue(detail.countryName)}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong className="font-semibold">{t('currency')}:</strong> {getFieldValue(detail.currency)}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong className="font-semibold">{t('description')}:</strong> {getFieldValue(detail.description)}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong className="font-semibold">{t('industry')}:</strong> {getFieldValue(detail.industry)}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong className="font-semibold">{t('website')}:</strong> {getFieldValue(detail.website)}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong className="font-semibold">{t('marketCap')}:</strong> {getFieldValue(detail.marketCap)}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong className="font-semibold">{t('sector')}:</strong> {getFieldValue(detail.sector)}
        </p>
      </div>

      <button
        onClick={() => navigate(`/candles/${symbol}`)}
        className="mt-6 flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg transition duration-200"
      >
        <BsGraphUp className="mr-2" />
        {t('viewCandle')}
      </button>
    </div>
  );

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
      >
        <AiOutlineArrowLeft className="mr-2" />
        {t('back')}
      </button>

      {error ? (
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      ) : detailContent}
    </div>
  );
}
