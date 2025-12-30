import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CompanyVerification, CompanyRating, SavedSearch } from '@/types';

export const [MarketProvider, useMarket] = createContextHook(() => {
  const [verifications, setVerifications] = useState<Record<string, CompanyVerification>>({});
  const [ratings, setRatings] = useState<CompanyRating[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedVerifications, storedRatings, storedSearches] = await Promise.all([
        AsyncStorage.getItem('company_verifications'),
        AsyncStorage.getItem('company_ratings'),
        AsyncStorage.getItem('saved_searches')
      ]);

      if (storedVerifications) {
        const parsed = JSON.parse(storedVerifications);
        const mapped: Record<string, CompanyVerification> = {};
        Object.keys(parsed).forEach(key => {
          mapped[key] = {
            ...parsed[key],
            verificationDate: new Date(parsed[key].verificationDate),
            lastContactDate: parsed[key].lastContactDate ? new Date(parsed[key].lastContactDate) : undefined
          };
        });
        setVerifications(mapped);
      }

      if (storedRatings) {
        const parsed = JSON.parse(storedRatings);
        setRatings(parsed.map((r: any) => ({
          ...r,
          date: new Date(r.date)
        })));
      }

      if (storedSearches) {
        const parsed = JSON.parse(storedSearches);
        setSavedSearches(parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt)
        })));
      }
    } catch (error) {
      console.error('Error loading market data:', error);
    }
  };

  const updateVerification = async (companyId: string, verification: CompanyVerification) => {
    const updated = { ...verifications, [companyId]: verification };
    setVerifications(updated);
    await AsyncStorage.setItem('company_verifications', JSON.stringify(updated));
  };

  const recordContact = async (companyId: string, responded: boolean) => {
    const existing = verifications[companyId] || {
      verificationDate: new Date(),
      contactCount: 0,
      respondedCount: 0,
      responseRate: 0
    };

    const newContactCount = (existing.contactCount || 0) + 1;
    const newRespondedCount = (existing.respondedCount || 0) + (responded ? 1 : 0);
    const newResponseRate = (newRespondedCount / newContactCount) * 100;

    const updated = {
      ...existing,
      lastContactDate: new Date(),
      contactCount: newContactCount,
      respondedCount: newRespondedCount,
      responseRate: newResponseRate
    };

    await updateVerification(companyId, updated);
  };

  const addRating = async (rating: CompanyRating) => {
    const updated = [...ratings, rating];
    setRatings(updated);
    await AsyncStorage.setItem('company_ratings', JSON.stringify(updated));
  };

  const getRatingsForCompany = (companyId: string) => {
    return ratings.filter(r => r.companyId === companyId);
  };

  const getAverageRating = (companyId: string) => {
    const companyRatings = getRatingsForCompany(companyId);
    if (companyRatings.length === 0) return 0;
    const sum = companyRatings.reduce((acc, r) => acc + r.rating, 0);
    return sum / companyRatings.length;
  };

  return {
    verifications,
    ratings,
    savedSearches,
    updateVerification,
    recordContact,
    addRating,
    getRatingsForCompany,
    getAverageRating
  };
});
