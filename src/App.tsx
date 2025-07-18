import React, { useState, useEffect } from 'react';
import './App.css';
import Globe from './components/Globe';
import DateControl from './components/DateControl';
import SolarInfo from './components/SolarInfo';
import { getSolarInfo } from './utils/solarCalculations';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [solarData, setSolarData] = useState(getSolarInfo(new Date()));

  useEffect(() => {
    const newSolarData = getSolarInfo(selectedDate);
    setSolarData(newSolarData);
  }, [selectedDate]);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  const handleTimeChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Zênite Solar</h1>
        <p>Visualize onde o Sol passa exatamente no zênite (90°) em qualquer dia do ano</p>
      </header>
      
      <main className="main-content">
        <div className="globe-container">
          <Globe
            zenithLine={solarData.zenithLine}
            subsolarPoint={solarData.subsolarPoint}
            date={selectedDate}
          />
        </div>
        
        <div className="controls-container">
          <DateControl
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
          />
          
          <SolarInfo
            declination={solarData.declination}
            equationOfTime={solarData.equationOfTime}
            subsolarPoint={solarData.subsolarPoint}
            date={selectedDate}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
