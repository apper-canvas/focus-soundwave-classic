import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import userLibraryService from "@/services/api/userLibraryService";

const Profile = () => {
  const [settings, setSettings] = useState({
    audioQuality: "high",
    enableNotifications: true,
    enableOfflineMode: true,
    theme: "dark",
    language: "en"
  });
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalAlbums: 0,
    totalPlaylists: 0,
    listeningTime: 0
  });
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const library = await userLibraryService.getLibrary();
      
      setStats({
        totalSongs: library.savedSongs?.length || 0,
        totalAlbums: library.savedAlbums?.length || 0,
        totalPlaylists: library.playlists?.length || 0,
        listeningTime: Math.floor(Math.random() * 1000) + 500 // Mock listening time
      });
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success("Settings updated");
  };

  const settingsOptions = [
    {
      key: "audioQuality",
      label: "Audio Quality",
      type: "select",
      options: [
        { value: "low", label: "Low (96kbps)" },
        { value: "medium", label: "Medium (160kbps)" },
        { value: "high", label: "High (320kbps)" }
      ]
    },
    {
      key: "enableNotifications",
      label: "Push Notifications",
      type: "toggle"
    },
    {
      key: "enableOfflineMode",
      label: "Offline Mode",
      type: "toggle"
    },
    {
      key: "theme",
      label: "Theme",
      type: "select",
      options: [
        { value: "dark", label: "Dark" },
        { value: "light", label: "Light" },
        { value: "auto", label: "Auto" }
      ]
    }
  ];

  const formatListeningTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Profile"
        subtitle="Manage your music preferences"
      />
      
      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                Music Lover
              </h2>
              <p className="text-gray-400">
                Enjoying music since today
              </p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold text-white mb-4">
            Your Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">
                {stats.totalSongs}
              </div>
              <div className="text-sm text-gray-400">Songs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">
                {stats.totalAlbums}
              </div>
              <div className="text-sm text-gray-400">Albums</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">
                {stats.totalPlaylists}
              </div>
              <div className="text-sm text-gray-400">Playlists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">
                {formatListeningTime(stats.listeningTime)}
              </div>
              <div className="text-sm text-gray-400">Listening Time</div>
            </div>
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold text-white mb-4">
            Settings
          </h3>
          <div className="space-y-4">
            {settingsOptions.map((option) => (
              <div key={option.key} className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">
                    {option.label}
                  </label>
                </div>
                <div>
                  {option.type === "toggle" ? (
                    <Button
                      variant={settings[option.key] ? "gradient" : "ghost"}
                      size="sm"
                      onClick={() => handleSettingChange(option.key, !settings[option.key])}
                    >
                      {settings[option.key] ? "On" : "Off"}
                    </Button>
                  ) : (
                    <select
                      value={settings[option.key]}
                      onChange={(e) => handleSettingChange(option.key, e.target.value)}
                      className="bg-surface border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                    >
                      {option.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Audio Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold text-white mb-4">
            Audio Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Equalizer Preset
              </label>
              <select className="w-full bg-surface border border-gray-600 rounded-lg px-3 py-2 text-white">
                <option>Default</option>
                <option>Rock</option>
                <option>Pop</option>
                <option>Jazz</option>
                <option>Classical</option>
                <option>Hip-Hop</option>
                <option>Electronic</option>
              </select>
            </div>
            <div>
              <label className="block text-white font-medium mb-2">
                Crossfade Duration
              </label>
              <input
                type="range"
                min="0"
                max="12"
                defaultValue="3"
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>0s</span>
                <span>12s</span>
              </div>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold text-white mb-4">
            About SoundWave
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Version</span>
              <Badge variant="outline">1.0.0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Build</span>
              <Badge variant="outline">2024.01.01</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Platform</span>
              <Badge variant="gradient">Web</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;