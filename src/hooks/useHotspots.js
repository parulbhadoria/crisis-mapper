import { useMemo } from "react";
import L from "leaflet";

const HOTSPOT_RADIUS = 500;

export function useHotspots(pins) {
  return useMemo(() => {
    const activePins = pins.filter(
      (p) => p.status === "active" && p.type === "needs_help"
    );

    const hotspots = [];

    activePins.forEach((pin) => {
      const existing = hotspots.find((h) => {
        return (
          L.latLng(pin.lat, pin.lng).distanceTo(
            L.latLng(h.lat, h.lng)
          ) < HOTSPOT_RADIUS
        );
      });

      if (existing) {
        existing.pins.push(pin);
      } else {
        hotspots.push({
          lat: pin.lat,
          lng: pin.lng,
          pins: [pin],
        });
      }
    });

    return hotspots
      .map((h) => {
        let riskScore = 0;

        h.pins.forEach((p) => {
          let severity = 1;

          if (p.severity === "Urgent") severity = 2;
          if (p.severity === "Critical") severity = 3;

          riskScore +=
            severity +
            (p.verificationScore || 0) / 25 +
            (p.upvotes || 0) / 5;
        });

        let level = "low";

        if (riskScore >= 25) level = "critical";
        else if (riskScore >= 15) level = "high";
        else if (riskScore >= 8) level = "medium";

        return {
          lat: h.lat,
          lng: h.lng,
          count: h.pins.length,
          riskScore: Math.round(riskScore),
          level,
        };
      })
      .filter((h) => h.count >= 2);
  }, [pins]);
}