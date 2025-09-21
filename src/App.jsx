import { BrowserRouter, Link, Router, Routes,Route } from 'react-router-dom';
import WeatherPage from './WeatherPage';
import React from 'react';
import LanguageProvider from './LanguageContext';



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
