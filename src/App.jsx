import { useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import MapView from './components/Map';
import PinForm from './components/PinForm';
import ChatWidget from './components/ChatWidget';
import { usePins } from './hooks/usePins';
import { useGeolocation } from './hooks/useGeolocation';
import { CATEGORY_LIST, USER_ZOOM, DEFAULT_ZOOM } from './lib/constants';
import { auth } from "./lib/auth";

function AppContent() {
  const { pinId } = useParams();
  const navigate = useNavigate();
  const mapSectionRef = useRef(null);

  const { pins, loading, stats, addPin, resolvePin, upvotePin, confirmPin, } = usePins();
  const { position, loading: geoLoading } = useGeolocation();

  const [activeCategories, setActiveCategories] = useState([...CATEGORY_LIST]);
  const [showNeedsHelp, setShowNeedsHelp] = useState(true);
  const [showOfferingHelp, setShowOfferingHelp] = useState(true);
  const [viewMode, setViewMode] = useState('pins');

  const [pinFormOpen, setPinFormOpen] = useState(false);
  const [pinFormData, setPinFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('crisismapper_upvotes');
      return new Set(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  });

  const filteredPins = useMemo(() => {
    return pins.filter((pin) => {
      if (!activeCategories.includes(pin.category)) return false;
      if (pin.type === 'needs_help' && !showNeedsHelp) return false;
      if (pin.type === 'offering_help' && !showOfferingHelp) return false;
      return true;
    });
  }, [pins, activeCategories, showNeedsHelp, showOfferingHelp]);

  const mapCenter = position;
  const mapZoom = geoLoading ? DEFAULT_ZOOM : USER_ZOOM;

  const handleMapClick = useCallback((lat, lng) => {
    setPinFormData({ lat, lng });
    setPinFormOpen(true);
  }, []);

  const handleOpenPinForm = useCallback((data) => {
    setPinFormData(data);
    setPinFormOpen(true);
  }, []);

  const handleSubmitPin = useCallback(
    async (form) => {
      setSubmitting(true);
      try {
        const id = await addPin(form);
        setPinFormOpen(false);
        setPinFormData({});
        navigate(`/pin/${id}`, { replace: true });
      } catch (err) {
        console.error('Failed to add pin:', err);
        alert('Failed to drop pin. Please check your connection and try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [addPin, navigate]
  );

  const handleUpvote = useCallback(
    async (id) => {
      if (upvotedIds.has(id)) return;
      try {
        await upvotePin(id);
        const updated = new Set(upvotedIds);
        updated.add(id);
        setUpvotedIds(updated);
        localStorage.setItem('crisismapper_upvotes', JSON.stringify([...updated]));
      } catch (err) {
        console.error('Failed to upvote:', err);
      }
    },
    [upvotePin, upvotedIds]
  );

  const handleToggleCategory = useCallback((cat) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const handleToggleType = useCallback((type) => {
    if (type === 'needs_help') setShowNeedsHelp((v) => !v);
    else setShowOfferingHelp((v) => !v);
  }, []);

  const scrollToMap = useCallback(() => {
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleConfirm = useCallback(async (pinId) => {
  const pin = pins.find((p) => p.id === pinId);

  if (!pin) return;

  if (!navigator.geolocation) {
    alert("Geolocation is not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const distance = L.latLng(
        position.coords.latitude,
        position.coords.longitude
      ).distanceTo(
        L.latLng(pin.lat, pin.lng)
      );

      if (distance > VERIFY_RADIUS_METERS) {
        alert(
          `You are ${Math.round(distance)}m away.\n\nOnly users within ${VERIFY_RADIUS_METERS}m can verify this report.`
        );
        return;
      }

      await confirmPin(pinId, auth.currentUser?.uid);

      alert("✅ Report verified successfully!");
    },
    () => {
      alert("Unable to fetch your location.");
    },
    {
      enableHighAccuracy: true,
    }
  );
}, [pins, confirmPin]);

  return (
    <div className="min-h-screen bg-navy">
      <HeroSection stats={stats} onScrollToMap={scrollToMap} />

      <div ref={mapSectionRef} className="max-w-7xl mx-auto px-4 pb-24 space-y-4">
        <StatsBar stats={stats} />
        <FilterBar
          activeCategories={activeCategories}
          onToggleCategory={handleToggleCategory}
          showNeedsHelp={showNeedsHelp}
          showOfferingHelp={showOfferingHelp}
          onToggleType={handleToggleType}
          categoryCounts={stats.categoryCounts}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />
        <MapView
          pins={pins}
          filteredPins={filteredPins}
          center={mapCenter}
          zoom={mapZoom}
          viewMode={viewMode}
          onMapClick={handleMapClick}
          onResolve={resolvePin}
          onUpvote={handleUpvote}
          onConfirm={handleConfirm}
          upvotedIds={upvotedIds}
          highlightPinId={pinId}
          loading={loading || geoLoading}
        />
      </div>

      <PinForm
        isOpen={pinFormOpen}
        onClose={() => {
          setPinFormOpen(false);
          setPinFormData({});
        }}
        onSubmit={handleSubmitPin}
        initialData={pinFormData}
        submitting={submitting}
      />

      <ChatWidget userPosition={position} onOpenPinForm={handleOpenPinForm} />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
