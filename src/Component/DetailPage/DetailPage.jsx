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
      setError(t('errorFetchingData'));
    } finally {
      setLoading(false);
    }
  }, [symbol, t]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const getFieldValue = (field) => field || t('notAvailable');

  const detailContent = detail && (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{getFieldValue(detail.name)}</h2>
      <div className="space-y-3">
        {[
          { label: t('symbol'), value: detail.symbol },
          { label: t('type'), value: detail.type },
          { label: t('country'), value: detail.countryName },
          { label: t('currency'), value: detail.currency },
          { label: t('description'), value: detail.description },
          { label: t('industry'), value: detail.industry },
          { label: t('website'), value: detail.website },
          { label: t('marketCap'), value: detail.marketCap },
          { label: t('sector'), value: detail.sector },
        ].map(({ label, value }) => (
          <p key={label} className="text-gray-700 dark:text-gray-300">
            <strong className="font-semibold">{label}:</strong> {getFieldValue(value)}
          </p>
        ))}
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
    ? `${detail.name} (${detail.symbol}) - ${t('metaDescription', {
      type: detail.type,
      country: detail.countryName,
      currency: detail.currency,
    })}`
    : t('loadingDetails');

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

      {loading ? (
        <Suspense fallback={<div>{t('loading')}...</div>}>
          <Loading />
        </Suspense>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        detailContent
      )}
    </div>
  );
}
