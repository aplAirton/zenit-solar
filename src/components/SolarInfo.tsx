import React from 'react';

interface SolarInfoProps {
  declination: number;
  equationOfTime: number;
  subsolarPoint: { lat: number; lng: number };
  date: Date;
}

export default function SolarInfo({ declination, equationOfTime, subsolarPoint, date }: SolarInfoProps) {
  const formatCoordinate = (value: number, isLatitude: boolean): string => {
    const abs = Math.abs(value);
    const direction = isLatitude 
      ? (value >= 0 ? 'N' : 'S')
      : (value >= 0 ? 'E' : 'W');
    return `${abs.toFixed(2)}° ${direction}`;
  };

  const formatDeclination = (declination: number): string => {
    return declination >= 0 
      ? `${declination.toFixed(2)}° Norte`
      : `${Math.abs(declination).toFixed(2)}° Sul`;
  };

  const getSeason = (declination: number): string => {
    if (declination > 20) return 'Solstício de Verão (Hemisfério Norte)';
    if (declination < -20) return 'Solstício de Inverno (Hemisfério Norte)';
    if (Math.abs(declination) < 2) return 'Equinócio';
    if (declination > 0) return 'Primavera/Verão (Hemisfério Norte)';
    return 'Outono/Inverno (Hemisfério Norte)';
  };

  return (
    <div className="solar-info">
      <h3>Informações Solares</h3>
      
      <div className="info-grid">
        <div className="info-item">
          <h4>Declinação Solar</h4>
          <p className="value">{formatDeclination(declination)}</p>
          <p className="description">
            Ângulo entre o plano equatorial da Terra e a linha Terra-Sol
          </p>
        </div>
        
        <div className="info-item">
          <h4>Equação do Tempo</h4>
          <p className="value">{equationOfTime.toFixed(2)} minutos</p>
          <p className="description">
            Diferença entre o tempo solar aparente e o tempo solar médio
          </p>
        </div>
        
        <div className="info-item">
          <h4>Ponto Subsolar</h4>
          <p className="value">
            {formatCoordinate(subsolarPoint.lat, true)}, {formatCoordinate(subsolarPoint.lng, false)}
          </p>
          <p className="description">
            Local onde o Sol está exatamente no zênite (90°)
          </p>
        </div>
        
        <div className="info-item">
          <h4>Estação do Ano</h4>
          <p className="value">{getSeason(declination)}</p>
          <p className="description">
            Baseado na declinação solar atual
          </p>
        </div>
      </div>
      
      <div className="zenith-explanation">
        <h4>Sobre a Linha de Zênite</h4>
        <p>
          A linha vermelha no globo mostra todos os pontos onde o Sol passa pelo zênite 
          (diretamente acima, a 90°) durante o dia selecionado. Esta linha está sempre 
          na latitude da declinação solar e se move de leste para oeste conforme a Terra gira.
        </p>
        <p>
          O ponto amarelo mostra onde o Sol está no zênite no momento exato selecionado.
        </p>
      </div>
    </div>
  );
}
