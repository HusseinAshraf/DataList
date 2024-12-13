import React from 'react';

function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="spinner-border animate-spin border-4 border-t-4 border-blue-600 rounded-full h-16 w-16" style={{ willChange: 'transform' }}></div>
    </div>
  );
}


export default React.memo(Loading);
