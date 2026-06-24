import { useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { CATEGORIES, SEVERITY_CONFIG, RESOLVED_COLOR, USER_ZOOM } from '../lib/constants';
import PinPopup from './PinPopup';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
});

function createPinIcon(pin) {
  const isResolved = pin.status === 'resolved';
  const color = isResolved ? RESOLVED_COLOR : (CATEGORIES[pin.category]?.color || '#ef4444');
  const size = SEVERITY_CONFIG[pin.severity]?.size || 18;
  const isCritical = pin.severity === 'Critical' && !isResolved;

  return L.divIcon({
    className: '',
    html: `<div class="pin-marker ${isCritical ? 'pin-marker-critical' : ''} pin-marker-drop" style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapController({ center, zoom, flyToPin }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);

  useEffect(() => {
    if (flyToPin) {
      map.flyTo([flyToPin.lat, flyToPin.lng], USER_ZOOM, { duration: 1.5 });
    }
  }, [map, flyToPin]);

  return null;
}

function HeatmapLayer({ pins, visible }) {
  const map = useMap();
  const heatRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      if (heatRef.current) {
        map.removeLayer(heatRef.current);
        heatRef.current = null;
      }
      return;
    }

    const points = pins
      .filter((p) => p.status === 'active' && p.type === 'needs_help')
      .map((p) => {
        const intensity =
          p.severity === 'Critical' ? 1.0 : p.severity === 'Urgent' ? 0.7 : 0.4;
        return [p.lat, p.lng, intensity];
      });

    if (heatRef.current) {
      map.removeLayer(heatRef.current);
    }

    if (points.length > 0) {
      heatRef.current = L.heatLayer(points, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.2: '#3b82f6',
          0.5: '#f97316',
          0.8: '#ef4444',
          1.0: '#dc2626',
        },
      }).addTo(map);
    }

    return () => {
      if (heatRef.current) {
        map.removeLayer(heatRef.current);
        heatRef.current = null;
      }
    };
  }, [map, pins, visible]);

  return null;
}

function AnimatedMarker({ pin, pins, onResolve, onUpvote, onConfirm, upvotedIds, openPopup }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!openPopup) return;
    const marker = markerRef.current;
    if (marker) {
      marker.openPopup();
    }
  }, [openPopup]);

  return (
    <Marker
      ref={markerRef}
      position={[pin.lat, pin.lng]}
      icon={createPinIcon(pin)}
    >
      <Popup>
        <PinPopup
          pin={pin}
          pins={pins}
          onResolve={onResolve}
          onUpvote={onUpvote}
          onConfirm={onConfirm}
          upvoted={upvotedIds.has(pin.id)}
        />
      </Popup>
    </Marker>
  );
}

export default function MapView({
  pins,
  filteredPins,
  center,
  zoom,
  viewMode,
  onMapClick,
  onResolve,
  onUpvote,
  onConfirm,
  upvotedIds,
  highlightPinId,
  loading,
}) {
  const highlightPin = useMemo(
    () => (highlightPinId ? pins.find((p) => p.id === highlightPinId) : null),
    [pins, highlightPinId]
  );

  const handleMapClick = useCallback(
    (lat, lng) => {
      if (viewMode === 'heatmap') return;
      onMapClick(lat, lng);
    },
    [onMapClick, viewMode]
  );

  if (loading) {
    return (
      <div className="w-full h-[60vh] md:h-[70vh] rounded-xl bg-slate-800 animate-pulse flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading map data...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[60vh] md:h-[70vh] rounded-xl overflow-hidden border border-white/10 relative z-0">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={handleMapClick} />
        <MapController center={center} zoom={zoom} flyToPin={highlightPin} />
        <HeatmapLayer pins={filteredPins} visible={viewMode === 'heatmap'} />

        {viewMode === 'pins' &&
          filteredPins.map((pin) => (
            <AnimatedMarker
              key={pin.id}
              pin={pin}
              pins={pins}
              onResolve={onResolve}
              onUpvote={onUpvote}
              onConfirm={onConfirm}
              upvotedIds={upvotedIds}
              openPopup={pin.id === highlightPinId}
            />
          ))}
      </MapContainer>
    </div>
  );
}
