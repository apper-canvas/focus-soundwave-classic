import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import TrackList from "@/components/organisms/TrackList";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import downloadService from "@/services/api/downloadService";
import { cn } from "@/utils/cn";

const DownloadManager = ({ 
  currentSong, 
  isPlaying, 
  onPlay, 
  onPause,
  onRemoveDownload
}) => {
  const [downloads, setDownloads] = useState([]);
  const [filteredDownloads, setFilteredDownloads] = useState([]);
  const [storageInfo, setStorageInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDownloads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [downloadsData, storage] = await Promise.all([
        downloadService.getAll(),
        downloadService.getStorageInfo()
      ]);
      
      setDownloads(downloadsData);
      setFilteredDownloads(downloadsData);
      setStorageInfo(storage);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load downloads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDownloads();
  }, []);

  useEffect(() => {
    filterDownloads();
  }, [downloads, activeTab, searchQuery]);

  const filterDownloads = () => {
    let filtered = [...downloads];

    // Filter by type
    if (activeTab === "songs") {
      filtered = filtered.filter(d => d.type === "song");
    } else if (activeTab === "recent") {
      filtered = filtered.filter(d => d.lastPlayed);
      filtered.sort((a, b) => new Date(b.lastPlayed) - new Date(a.lastPlayed));
    } else if (activeTab === "popular") {
      filtered = filtered.filter(d => d.playCount > 0);
      filtered.sort((a, b) => b.playCount - a.playCount);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(download =>
        download.title.toLowerCase().includes(searchTerm) ||
        download.artist.toLowerCase().includes(searchTerm) ||
        download.album.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredDownloads(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRemoveDownloadLocal = async (download) => {
    try {
      await onRemoveDownload(download.Id);
      setDownloads(prev => prev.filter(d => d.Id !== download.Id));
      
      // Update storage info
      const newStorageInfo = await downloadService.getStorageInfo();
      setStorageInfo(newStorageInfo);
      
      toast.success("Download removed successfully");
    } catch (error) {
      toast.error("Failed to remove download");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all downloads? This action cannot be undone.")) {
      return;
    }

    try {
      await downloadService.clearAll();
      setDownloads([]);
      setFilteredDownloads([]);
      
      const newStorageInfo = await downloadService.getStorageInfo();
      setStorageInfo(newStorageInfo);
      
      toast.success("All downloads cleared successfully");
    } catch (error) {
      toast.error("Failed to clear downloads");
    }
  };

  const handlePlayDownload = async (download) => {
    try {
      await downloadService.updatePlayCount(download.Id);
      onPlay(download);
    } catch (error) {
      console.error("Failed to update play count:", error);
      onPlay(download);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const tabs = [
    { id: "all", label: "All Downloads", count: downloads.length },
    { id: "songs", label: "Songs", count: downloads.filter(d => d.type === "song").length },
    { id: "recent", label: "Recently Played", count: downloads.filter(d => d.lastPlayed).length },
    { id: "popular", label: "Most Played", count: downloads.filter(d => d.playCount > 0).length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Downloads"
          subtitle="Manage your offline content"
        />
        <div className="flex items-center justify-center py-32">
          <Loading type="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          title="Downloads"
          subtitle="Manage your offline content"
        />
        <div className="px-4 py-8">
          <Error message={error} onRetry={loadDownloads} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Downloads"
        subtitle="Manage your offline content"
        actions={downloads.length > 0 ? [
          { 
            icon: "Trash2", 
            onClick: handleClearAll,
            variant: "ghost",
            className: "text-error hover:text-error"
          }
        ] : []}
      />
      
      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Storage Info */}
        {storageInfo && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="HardDrive" size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Storage Usage</h3>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(storageInfo.used)} of {formatFileSize(storageInfo.limit)} used
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {storageInfo.usagePercentage}%
                </div>
                <div className="text-sm text-gray-400">
                  {storageInfo.totalDownloads} downloads
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  storageInfo.usagePercentage > 80 
                    ? "bg-gradient-to-r from-warning to-error" 
                    : "bg-gradient-to-r from-primary to-secondary"
                )}
                style={{ width: `${storageInfo.usagePercentage}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Available: {formatFileSize(storageInfo.available)}</span>
              <span>Total: {formatFileSize(storageInfo.limit)}</span>
            </div>
          </Card>
        )}

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search downloads..."
          value={searchQuery}
        />

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "gradient" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="whitespace-nowrap"
            >
              {tab.label} ({tab.count})
            </Button>
          ))}
        </div>

        {/* Downloads List */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {filteredDownloads.length === 0 ? (
            <Empty
              icon="Download"
              message={
                searchQuery 
                  ? "No downloads match your search"
                  : activeTab === "all" 
                    ? "No downloads yet"
                    : activeTab === "recent"
                      ? "No recently played downloads"
                      : activeTab === "popular"
                        ? "No frequently played downloads"
                        : "No downloads in this category"
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredDownloads.map((download) => (
                <motion.div
                  key={download.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex items-center gap-4 p-4 rounded-lg bg-surface/50 backdrop-blur-sm border border-gray-700/50 hover:bg-surface hover:border-gray-600 transition-all duration-200"
                >
                  <div className="relative">
                    <img
                      src={download.coverUrl}
                      alt={download.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePlayDownload(download)}
                        className="w-8 h-8 text-white hover:bg-white/20"
                      >
                        <ApperIcon 
                          name={currentSong?.Id === download.Id && isPlaying ? "Pause" : "Play"} 
                          size={16} 
                        />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-medium text-white truncate",
                      currentSong?.Id === download.Id && isPlaying && "text-primary"
                    )}>
                      {download.title}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {download.artist} • {download.album}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {formatFileSize(download.fileSize)}
                      </span>
                      {download.playCount > 0 && (
                        <span className="text-xs text-gray-500">
                          Played {download.playCount} times
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDownloadLocal(download)}
                      className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DownloadManager;