import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const MainLayout = ({ children, onSearch }) => {
  return (
    <div className="app-layout">
      <Navbar onSearch={onSearch} />
      <main className="main-content">{children}</main>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};
