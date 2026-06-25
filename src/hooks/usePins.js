import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PIN_EXPIRY_HOURS } from '../lib/constants';
import { auth } from "../lib/auth";
import { arrayUnion } from "firebase/firestore";



export function usePins() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'pins'),
      (snapshot) => {
        const now = Date.now();
        const activePins = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((pin) => {
            if (pin.expiresAt) {
              const expires = pin.expiresAt.toMillis?.() ?? pin.expiresAt;
              return expires > now;
            }
            return true;
          });
        setPins(activePins);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const stats = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayMs = todayStart.getTime();

    const activeCrises = pins.filter(
      (p) => p.status === 'active' && p.type === 'needs_help'
    ).length;

    const resolvedToday = pins.filter((p) => {
      if (p.status !== 'resolved') return false;
      const created = p.createdAt?.toMillis?.() ?? 0;
      return created >= todayMs;
    }).length;

    const helpersAvailable = pins.filter(
      (p) => p.status === 'active' && p.type === 'offering_help'
    ).length;

    const categoryCounts = {};
    pins
      .filter((p) => p.status === 'active')
      .forEach((p) => {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      });

    return { activeCrises, resolvedToday, helpersAvailable, categoryCounts };
  }, [pins]);

  async function addPin(pinData) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + PIN_EXPIRY_HOURS * 60 * 60 * 1000);

    const docRef = await addDoc(collection(db, 'pins'), {
      lat: pinData.lat,
      lng: pinData.lng,
      category: pinData.category,
      severity: pinData.severity,
      helpType: pinData.helpType || null,
      availability: pinData.availability || null,
      type: pinData.type,
      note: pinData.note,
      name: pinData.name || 'Anonymous',
      status: 'active',
      upvotes: 0,
      confirmations: 0,
      confirmedBy: [],
      verificationScore: 0,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt),
      ownerId: auth.currentUser?.uid,
    });

    return docRef.id;
  }

  async function resolvePin(pinId) {
    await updateDoc(doc(db, 'pins', pinId), { status: 'resolved' });
  }

  async function upvotePin(pinId) {
  const pin = pins.find((p) => p.id === pinId);

  if (!pin) return;

  const upvotes = (pin.upvotes || 0) + 1;

  const verificationScore = Math.min(
    100,
    (pin.confirmations || 0) * 10 + upvotes * 5
  );

  await updateDoc(doc(db, "pins", pinId), {
    upvotes: increment(1),
    verificationScore,
  });
}

  async function confirmPin(pinId, uid) {
  const pin = pins.find((p) => p.id === pinId);

  if (!pin) return;

  if (pin.confirmedBy?.includes(uid)) {
    return;
  }

  const confirmations = (pin.confirmations || 0) + 1;
  const verificationScore = Math.min(
    100,
    confirmations * 10 + (pin.upvotes || 0) * 5
  );

  await updateDoc(doc(db, "pins", pinId), {
    confirmations,
    confirmedBy: arrayUnion(uid),
    verificationScore,
  });
}

  return { pins, loading, error, stats, addPin, resolvePin, upvotePin, confirmPin, };
}
