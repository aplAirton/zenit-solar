import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MercatorMapProps {
  zenithLine: Array<{ lat: number; lng: number }>;
  subsolarPoint: { lat: number; lng: number };
  date: Date;
}

export default function MercatorMap({ zenithLine, subsolarPoint, date }: MercatorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const zenithLineRef = useRef<L.Polyline | null>(null);
  const subsolarMarkerRef = useRef<L.Marker | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  const userHasInteractedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Inicializar o mapa se não existir
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [0, 0],
        zoom: 2,
        worldCopyJump: true,
        maxBounds: [[-90, -180], [90, 180]]
      });

      // Detectar interações do usuário com o mapa
      mapInstanceRef.current.on('zoomstart dragstart', () => {
        userHasInteractedRef.current = true;
      });

      // Adicionar camada de satélite do OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        noWrap: false
      }).addTo(mapInstanceRef.current);

      // Adicionar camada alternativa de satélite (Esri)
      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri, Maxar, Earthstar Geographics',
        maxZoom: 18,
        noWrap: false
      });

      // Adicionar camada de terreno físico
      const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap (CC-BY-SA)',
        maxZoom: 17,
        noWrap: false
      });

      // Controle de camadas
      const baseLayers = {
        "Mapa Padrão": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }),
        "Satélite": satelliteLayer,
        "Terreno": terrainLayer
      };

      L.control.layers(baseLayers).addTo(mapInstanceRef.current);

      // Adicionar linhas de grade personalizadas
      const addGridLines = () => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Linhas de latitude
        for (let lat = -75; lat <= 75; lat += 15) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const latLine = L.polyline([
            [lat, -180],
            [lat, 180]
          ], {
            color: 'rgba(255, 255, 255, 0.3)',
            weight: 1,
            dashArray: '5, 5'
          }).addTo(map);

          // Label da latitude
          if (lat !== 0) {
            L.marker([lat, 0], {
              icon: L.divIcon({
                html: `<div style="background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">${Math.abs(lat)}°${lat > 0 ? 'N' : 'S'}</div>`,
                iconSize: [40, 20],
                className: 'custom-grid-label'
              })
            }).addTo(map);
          }
        }

        // Linhas de longitude
        for (let lng = -180; lng <= 180; lng += 30) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const lngLine = L.polyline([
            [-85, lng],
            [85, lng]
          ], {
            color: 'rgba(255, 255, 255, 0.3)',
            weight: 1,
            dashArray: '5, 5'
          }).addTo(map);

          // Label da longitude
          if (lng !== 0 && lng !== 180 && lng !== -180) {
            L.marker([0, lng], {
              icon: L.divIcon({
                html: `<div style="background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">${Math.abs(lng)}°${lng > 0 ? 'E' : 'W'}</div>`,
                iconSize: [40, 20],
                className: 'custom-grid-label'
              })
            }).addTo(map);
          }
        }

        // Linha do Equador especial
        L.polyline([
          [0, -180],
          [0, 180]
        ], {
          color: 'rgba(255, 255, 0, 0.6)',
          weight: 2,
          dashArray: '10, 5'
        }).addTo(map);

        // Trópicos
        L.polyline([
          [23.5, -180],
          [23.5, 180]
        ], {
          color: 'rgba(255, 165, 0, 0.5)',
          weight: 2,
          dashArray: '8, 4'
        }).addTo(map);

        L.polyline([
          [-23.5, -180],
          [-23.5, 180]
        ], {
          color: 'rgba(255, 165, 0, 0.5)',
          weight: 2,
          dashArray: '8, 4'
        }).addTo(map);

        // Labels dos trópicos
        L.marker([23.5, 0], {
          icon: L.divIcon({
            html: '<div style="background: rgba(255,165,0,0.8); color: white; padding: 3px 8px; border-radius: 5px; font-weight: bold;">Trópico de Câncer</div>',
            iconSize: [120, 25],
            className: 'tropic-label'
          })
        }).addTo(map);

        L.marker([-23.5, 0], {
          icon: L.divIcon({
            html: '<div style="background: rgba(255,165,0,0.8); color: white; padding: 3px 8px; border-radius: 5px; font-weight: bold;">Trópico de Capricórnio</div>',
            iconSize: [140, 25],
            className: 'tropic-label'
          })
        }).addTo(map);

        L.marker([0, 0], {
          icon: L.divIcon({
            html: '<div style="background: rgba(255,255,0,0.8); color: black; padding: 3px 8px; border-radius: 5px; font-weight: bold;">Equador</div>',
            iconSize: [80, 25],
            className: 'equator-label'
          })
        }).addTo(map);
      };

      addGridLines();
    }

    // Atualizar linha de zênite
    if (mapInstanceRef.current) {
      // Remover linha anterior
      if (zenithLineRef.current) {
        mapInstanceRef.current.removeLayer(zenithLineRef.current);
      }

      // Criar nova linha de zênite
      const zenithLatLngs: [number, number][] = zenithLine.map(point => [point.lat, point.lng]);
      zenithLineRef.current = L.polyline(zenithLatLngs, {
        color: '#ff0000',
        weight: 4,
        opacity: 0.8
      }).addTo(mapInstanceRef.current);

      // Remover marcador anterior
      if (subsolarMarkerRef.current) {
        mapInstanceRef.current.removeLayer(subsolarMarkerRef.current);
      }

      // Criar ícone customizado para o ponto subsolar
      const sunIcon = L.divIcon({
        html: `
          <div style="
            width: 24px; 
            height: 24px; 
            background: radial-gradient(circle, #ffff00 30%, #ff8800 70%);
            border: 3px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(255, 255, 0, 0.6);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: -8px;
              left: -8px;
              width: 40px;
              height: 40px;
              border: 2px solid rgba(255, 255, 0, 0.4);
              border-radius: 50%;
              animation: pulse 2s infinite;
            "></div>
          </div>
          <style>
            @keyframes pulse {
              0% { transform: scale(1); opacity: 0.4; }
              50% { transform: scale(1.1); opacity: 0.2; }
              100% { transform: scale(1); opacity: 0.4; }
            }
          </style>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        className: 'subsolar-point'
      });

      // Adicionar novo marcador do ponto subsolar
      subsolarMarkerRef.current = L.marker([subsolarPoint.lat, subsolarPoint.lng], {
        icon: sunIcon
      }).addTo(mapInstanceRef.current);

      // Adicionar popup informativo
      subsolarMarkerRef.current.bindPopup(`
        <div style="text-align: center; font-family: Arial;">
          <h4 style="margin: 5px 0; color: #ff8800;">☀️ Ponto Subsolar</h4>
          <p style="margin: 3px 0;"><strong>Latitude:</strong> ${subsolarPoint.lat.toFixed(2)}°</p>
          <p style="margin: 3px 0;"><strong>Longitude:</strong> ${subsolarPoint.lng.toFixed(2)}°</p>
          <p style="margin: 3px 0; font-size: 12px; color: #666;">
            ${new Date(date).toLocaleString('pt-BR')}
          </p>
        </div>
      `);

      // Apenas centralizar o mapa na primeira inicialização e se o usuário não interagiu
      if (!isInitializedRef.current && !userHasInteractedRef.current) {
        mapInstanceRef.current.setView([subsolarPoint.lat, subsolarPoint.lng], 3);
        isInitializedRef.current = true;
      }
    }

    // Cleanup function
    return () => {
      if (zenithLineRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(zenithLineRef.current);
      }
      if (subsolarMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(subsolarMarkerRef.current);
      }
    };
  }, [zenithLine, subsolarPoint, date]);

  // Cleanup do mapa quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="mercator-container">
      <h3>Mapa Mundial Real - Projeção Mercator</h3>
      <div className="map-wrapper">
        <div 
          ref={mapRef} 
          style={{ 
            width: '100%', 
            height: '500px', 
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }} 
        />
        
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ff0000' }}></div>
            <span>Linha de Zênite Solar</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ffff00', borderRadius: '50%' }}></div>
            <span>Ponto Subsolar Atual</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgba(255, 255, 0, 0.6)' }}></div>
            <span>Equador</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: 'rgba(255, 165, 0, 0.5)' }}></div>
            <span>Trópicos</span>
          </div>
        </div>

        <div className="map-info">
          <p><strong>💡 Dica:</strong> Use os controles no canto superior direito para alternar entre diferentes visualizações do mapa (padrão, satélite, terreno).</p>
          <p><strong>🔍 Navegação:</strong> Clique no ponto amarelo para ver informações detalhadas do ponto subsolar.</p>
          {userHasInteractedRef.current && (
            <div style={{ marginTop: '10px' }}>
              <button 
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([subsolarPoint.lat, subsolarPoint.lng], 4);
                  }
                }}
                style={{
                  background: 'rgba(255, 165, 0, 0.8)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                🎯 Centralizar no Sol
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
