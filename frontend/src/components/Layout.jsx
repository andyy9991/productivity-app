import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {children}
    </div>
  );
};

export default Layout;