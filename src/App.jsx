import { BrowserRouter, Link, Router, Routes,Route } from 'react-router-dom';
import WeatherPage from './WeatherPage';
import React from 'react';
import LanguageProvider from './LanguageContext';
import StudyMode from './StudyMode';



function App(){

  return (
      <LanguageProvider>
          <BrowserRouter> 
            <Routes>
              <Route index element={<WeatherPage />} />
              <Route path='/studymode' element={<StudyMode/>}/>
            </Routes>
        </BrowserRouter>
      </LanguageProvider>
  )
}

export default App
