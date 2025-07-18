import React from 'react';
import { format } from 'date-fns';

interface DateControlProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onTimeChange: (date: Date) => void;
}

export default function DateControl({ selectedDate, onDateChange, onTimeChange }: DateControlProps) {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    newDate.setHours(selectedDate.getHours());
    newDate.setMinutes(selectedDate.getMinutes());
    onDateChange(newDate);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = event.target.value.split(':').map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onTimeChange(newDate);
  };

  const handleNowClick = () => {
    const now = new Date();
    onDateChange(now);
  };

  const handleDateNavigation = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    onDateChange(newDate);
  };

  const formatDateValue = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  const formatTimeValue = (date: Date): string => {
    return format(date, 'HH:mm');
  };

  const formatDateDisplay = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    };
    return new Intl.DateTimeFormat('pt-BR', options).format(date) + ' UTC';
  };

  return (
    <div className="date-control">
      <div className="date-control-header">
        <h3>Controle de Data e Hora</h3>
        <button onClick={handleNowClick} className="now-button">
          Agora
        </button>
      </div>
      
      <div className="date-inputs">
        <div className="input-group">
          <label htmlFor="date-input">Data:</label>
          <input
            id="date-input"
            type="date"
            value={formatDateValue(selectedDate)}
            onChange={handleDateChange}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="time-input">Hora (UTC):</label>
          <input
            id="time-input"
            type="time"
            value={formatTimeValue(selectedDate)}
            onChange={handleTimeChange}
          />
        </div>
      </div>
      
      <div className="date-navigation">
        <button onClick={() => handleDateNavigation(-1)}>
          ← Dia Anterior
        </button>
        <button onClick={() => handleDateNavigation(1)}>
          Próximo Dia →
        </button>
      </div>
      
      <div className="date-display">
        <p>
          <strong>Data Selecionada:</strong><br />
          {formatDateDisplay(selectedDate)}
        </p>
      </div>
    </div>
  );
}
