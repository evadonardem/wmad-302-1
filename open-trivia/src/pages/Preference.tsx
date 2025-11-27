import React, { useState } from 'react';
import { Settings, Bell, Eye, Zap } from 'lucide-react';


const Preferences = () => {
  type Prefs = {
    notifications: boolean;
    darkMode: boolean;
    soundEffects: boolean;
    showHints: boolean;
  };

  const [prefs, setPrefs] = useState<Prefs>({
    notifications: true,
    darkMode: false,
    soundEffects: true,
    showHints: true,
  });

  const handleChange = (key: keyof Prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Settings className="w-8 h-8 text-slate-900" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Preferences</h1>
            <p className="text-slate-600 text-sm mt-1">Customize your trivia experience</p>
          </div>
        </div>

        {/* Preferences Cards */}
        <div className="space-y-4">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  <p className="text-sm text-slate-600 mt-1">Get notified about daily challenges</p>
                </div>
              </div>
              <button
                onClick={() => handleChange('notifications')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  prefs.notifications ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    prefs.notifications ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Sound Effects */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Sound Effects</h3>
                  <p className="text-sm text-slate-600 mt-1">Play sounds for correct/incorrect answers</p>
                </div>
              </div>
              <button
                onClick={() => handleChange('soundEffects')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  prefs.soundEffects ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    prefs.soundEffects ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Show Hints */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <Eye className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Show Hints</h3>
                  <p className="text-sm text-slate-600 mt-1">Display helpful hints for difficult questions</p>
                </div>
              </div>
              <button
                onClick={() => handleChange('showHints')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  prefs.showHints ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    prefs.showHints ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mt-8">
            <h3 className="font-semibold text-blue-900 mb-2">About Your Data</h3>
            <p className="text-sm text-blue-800">
              Your preferences are saved locally in your browser. We don't store any personal data on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;