import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy, useCallback } from 'react';
import Loading from './Component/Loading/Loading';

// Lazy load components
const DataList = lazy(() => import('./Component/DataList/DataList'));
const DetailPage = lazy(() => import('./Component/DetailPage/DetailPage'));
const CandlePage = lazy(() => import('./Component/CandlePage/CandlePage'));

function App() {
  // Memoize Suspense fallback to prevent unnecessary re-renders
  const renderLoading = useCallback(() => <div><Loading /></div>, []);

  return (
    <Router>
      <Suspense fallback={renderLoading()}>
        <Routes>
          <Route path="/" element={<DataList />} />
          <Route path="/details/:symbol" element={<DetailPage />} />
          <Route path="/candle/:symbol" element={<CandlePage />} /> 
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
