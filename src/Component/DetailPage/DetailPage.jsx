/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { AiOutlineLineChart } from 'react-icons/ai';  
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
      const { data } = await axios.get('/metadata.json');
      const detailData = data.hits.hits.find(
        (item) => item._source.symbol === symbol
      )?._source;

      if (detailData) {
        console.log('Detail data:', detailData);
        setDetail(detailData);
      } else {
        setError(t('detailsNotFound'));
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

  const renderField = (label, value) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <p className="text-gray-700 dark:text-gray-300">
          <strong className="font-semibold">{label}:</strong>{' '}
          {JSON.stringify(value, null, 2)}
        </p>
      );
    }

    return (
      <p className="text-gray-700 dark:text-gray-300">
        <strong className="font-semibold">{label}:</strong> {value || t('notAvailable')}
      </p>
    );
  };

  if (loading)
    return (
      <Suspense fallback={<Loading />}>
        <Loading />
      </Suspense>
    );

  if (!detail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-2xl font-semibold">
          {error || t('itemNotFound')}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Helmet>
        <title>{t(`${detail.name}`)}</title>
        <meta
          name="description"
          content="This page to show all data details for Financial management."
        />
        <meta name="keywords" content="data, list, information, SEO" />
        <meta name="author" content="FutTech" />
      </Helmet>

      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
      >
        <AiOutlineArrowLeft className="mr-2" />
        {t('back')}
      </button>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          {detail.name || t('notAvailable')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-lg">
          {renderField(t('symbol'), detail.symbol)}
          {renderField(t('code'), detail.code)}
          {renderField(t('exchange'), detail.exchange)}
          {renderField(t('currency'), detail.currency)}
          {renderField(t('country'), detail.countryName)}
          {renderField(t('type'), detail.type)}
          {renderField(t('isin'), detail.isin)}
          {renderField(t('validUntil'), detail.validUntil)}
          {renderField(t('countryIso'), detail.countryIso)}
        </div>

        {detail.exchangeTradedFundDetails && detail.exchangeTradedFundDetails.companyURL ? (
          <p className="mt-6 text-gray-700 dark:text-gray-300">
            <strong>{t('companyWebsite')}:</strong>{' '}
            <a
              href={detail.exchangeTradedFundDetails.companyURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {detail.exchangeTradedFundDetails.companyURL}
            </a>
          </p>
        ) : (
          <p className="mt-6 text-gray-700 dark:text-gray-300">
            <strong>{t('companyWebsite')}:</strong> {t('notAvailable')}
          </p>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(`/candle/${detail.symbol}`)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-md shadow hover:shadow-lg transition duration-300 transform hover:scale-105"
          >
            <AiOutlineLineChart className="mr-2 inline" />
            {t('viewCandleData')}
          </button>
        </div>
      </div>
    </div>
  );
}
