"use client";

import React, { createContext, useContext, useState } from 'react';
import {
  runModule1PBD,
  runModule2TallBuilding,
  runModule3Walls,
  runModule4SSI,
  runModule5GroundMotion
} from '@/lib/ruleEngine';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [projectData] = useState({
    projectName: "STRUCTIQ CIVIL CORE",
    author: "Engineer Dashboard",
  });

  const [userRole, setUserRole] = useState("Engineer"); // Default for dev, will be set on login
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const [inputState, setInputState] = useState({
    zone: 'zone-iv',
    soil: 'medium',
    storeys: 12,
    structuralSystem: 'smrf',
    regularity: true,
    groundwater: 'deep',
    sptN: 25,
  });

  const [overlayToggles, setOverlayToggles] = useState({
    shearWalls: false,
    foundation: false,
    riskZones: false,
  });

  const [analysisResults, setAnalysisResults] = useState(null);

  const [uiState, setUiState] = useState({
    isAnalyzing: false,
    lastAnalyzedAt: null,
  });

  const updateInput = (field, value) => {
    setInputState(prev => ({ ...prev, [field]: value }));
  };

  const runAnalysis = async () => {
    setUiState(prev => ({ ...prev, isAnalyzing: true }));

    // Simulate complex computation delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const results = {
        module1: runModule1PBD(inputState),
        module2: runModule2TallBuilding(inputState),
        module3: runModule3Walls(inputState),
        module4: runModule4SSI(inputState),
        module5: runModule5GroundMotion(inputState),
      };

      setAnalysisResults(results);
      setUiState({
        isAnalyzing: false,
        lastAnalyzedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Analysis Error:", error);
      setUiState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const toggleOverlay = (id) => {
    setOverlayToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const value = {
    projectData,
    userRole,
    setUserRole,
    isLoggedIn,
    login,
    logout,
    inputState,
    updateInput,
    overlayToggles,
    toggleOverlay,
    analysisResults,
    runAnalysis,
    uiState,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
