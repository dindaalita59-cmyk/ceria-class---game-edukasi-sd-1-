/**
 * CERIA CLASS - Main Application Component
 * Cerdas, Interaktif, dan Asyik Belajar
 * SDN 32 Rantau Bayur - Dinda Noer Alita, S.Pd.
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  Game, 
  Student, 
  GameSessionResult, 
  AppSettings 
} from './types';
import { initialGames, initialStudents } from './data/initialData';
import { 
  loadSavedGames, 
  saveGames, 
  loadSavedStudents, 
  saveStudents, 
  loadSessionResults, 
  saveSessionResult, 
  clearSessionResults,
  loadAppSettings, 
  saveAppSettings,
  ImportResult
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { PlayGames } from './components/PlayGames';
import { GameMaker } from './components/GameMaker';
import { ClassStudents } from './components/ClassStudents';
import { BankMateri } from './components/BankMateri';
import { Reports } from './components/Reports';
import { AboutApp } from './components/AboutApp';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  
  // Storage state with lazy initializers
  const [games, setGames] = useState<Game[]>(() => loadSavedGames(initialGames));
  const [students, setStudents] = useState<Student[]>(() => loadSavedStudents(initialStudents));
  const [results, setResults] = useState<GameSessionResult[]>(() => loadSessionResults());
  const [settings, setSettings] = useState<AppSettings>(() => loadAppSettings());

  // Editing state for Game Maker
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveGames(games);
  }, [games]);

  useEffect(() => {
    saveStudents(students);
  }, [students]);

  useEffect(() => {
    saveAppSettings(settings);
  }, [settings]);

  // Handlers
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSaveGame = (newOrUpdatedGame: Game) => {
    setGames((prev) => {
      const exists = prev.some((g) => g.id === newOrUpdatedGame.id);
      if (exists) {
        return prev.map((g) => (g.id === newOrUpdatedGame.id ? newOrUpdatedGame : g));
      }
      return [newOrUpdatedGame, ...prev];
    });
  };

  const handlePlayGameDirectly = (gameToPlay: Game) => {
    handleSaveGame(gameToPlay);
    setEditingGame(null);
    setActiveTab('play');
  };

  const handleRecordSessionResult = (result: GameSessionResult) => {
    saveSessionResult(result);
    setResults((prev) => [result, ...prev]);
  };

  const handleClearResults = () => {
    clearSessionResults();
    setResults([]);
  };

  const handleRestoreBackup = (imported: ImportResult) => {
    if (imported.importedGames) {
      setGames(imported.importedGames);
      saveGames(imported.importedGames);
    }
    if (imported.importedStudents) {
      setStudents(imported.importedStudents);
      saveStudents(imported.importedStudents);
    }
    if (imported.importedResults) {
      setResults(imported.importedResults);
      imported.importedResults.forEach((r) => saveSessionResult(r));
    }
  };

  const handlePlayMaterialAsGame = (materialGame: Game) => {
    handleSaveGame(materialGame);
    setActiveTab('play');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-200 ${
      settings.projectorMode ? 'bg-amber-50/80 text-slate-900 text-lg' : 'ceria-bg-rainbow text-slate-800'
    }`}>
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            games={games}
            students={students}
            results={results}
            onNavigateToPlay={() => setActiveTab('play')}
            onNavigateToMaker={() => {
              setEditingGame(null);
              setActiveTab('game-maker');
            }}
            onNavigateToReports={() => setActiveTab('reports')}
          />
        )}

        {activeTab === 'play' && (
          <PlayGames
            games={games}
            students={students}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onRecordResult={handleRecordSessionResult}
            onOpenGameMaker={() => {
              setEditingGame(null);
              setActiveTab('game-maker');
            }}
          />
        )}

        {activeTab === 'game-maker' && (
          <GameMaker
            onSaveGame={handleSaveGame}
            onPlayGameDirectly={handlePlayGameDirectly}
            onCancel={() => {
              setEditingGame(null);
              setActiveTab('dashboard');
            }}
            existingGame={editingGame}
          />
        )}

        {activeTab === 'students' && (
          <ClassStudents
            students={students}
            onSaveStudents={setStudents}
          />
        )}

        {activeTab === 'bank-materi' && (
          <BankMateri
            onPlayMaterialAsGame={handlePlayMaterialAsGame}
          />
        )}

        {activeTab === 'reports' && (
          <Reports
            results={results}
            games={games}
            students={students}
            onClearResults={handleClearResults}
            onRestoreBackup={handleRestoreBackup}
          />
        )}

        {activeTab === 'about' && (
          <AboutApp />
        )}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
