import { BrowserRouter, Link, Router, Routes,Route } from 'react-router-dom';
import React from 'react';
import WeatherPage from './Weather/WeatherPage';
import LanguageProvider from './Context/LanguageContext';

function App(){

  return (
      <LanguageProvider>
          <BrowserRouter> 
            <Routes>
              <Route index element={<WeatherPage />} />
            </Routes>
        </BrowserRouter>
      </LanguageProvider>
  )
}

export default App
