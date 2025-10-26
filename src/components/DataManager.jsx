import React, { useState } from "react";
import { useMovie } from "../context/MovieContext";

const DataManager = () => {
  const { watchlist, watched, clearAllData, exportData, importData } =
    useMovie();
  const [showManager, setShowManager] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("export");

  const handleExport = () => {
    const data = exportData();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cinetrack-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);

    setMessage("✅ Data exported successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importJson);
      if (data.watchlist && data.watched) {
        if (window.confirm("This will replace your current data. Continue?")) {
          importData(data);
          setImportJson("");
          setMessage("✅ Data imported successfully!");
          setTimeout(() => setMessage(""), 3000);
          setShowManager(false);
        }
      } else {
        setMessage(
          "❌ Invalid data format - missing watchlist or watched arrays"
        );
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ Invalid JSON format");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "🚨 Are you sure you want to clear ALL data? This cannot be undone!"
      )
    ) {
      clearAllData();
      setMessage("🗑️ All data cleared!");
      setTimeout(() => setMessage(""), 3000);
      setShowManager(false);
    }
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImportJson(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  if (!showManager) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowManager(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 flex items-center space-x-2"
          title="Data Manager"
        >
          <span className="text-xl">💾</span>
          <span className="hidden sm:block font-semibold">Data</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">💾</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Data Manager
                </h2>
                <p className="text-sm text-gray-600">Manage your movie data</p>
              </div>
            </div>
            <button
              onClick={() => setShowManager(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-xl mb-6 ${
                message.includes("✅")
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : message.includes("❌")
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-yellow-100 text-yellow-800 border border-yellow-200"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {message.includes("✅")
                    ? "✅"
                    : message.includes("❌")
                    ? "❌"
                    : "⚠️"}
                </span>
                <span>{message}</span>
              </div>
            </div>
          )}

          {/* Storage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {watchlist.length}
              </div>
              <div className="text-blue-800 font-medium">Watchlist</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {watched.length}
              </div>
              <div className="text-green-800 font-medium">Watched</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {watchlist.length + watched.length}
              </div>
              <div className="text-purple-800 font-medium">Total</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab("export")}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "export"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📤 Export
            </button>
            <button
              onClick={() => setActiveTab("import")}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "import"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📥 Import
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "settings"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              ⚙️ Settings
            </button>
          </div>

          {/* Export Tab */}
          {activeTab === "export" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Export Your Data
                </h3>
                <p className="text-blue-700 text-sm">
                  Download your complete movie data as a JSON file. Perfect for
                  backups or transferring to another device.
                </p>
              </div>
              <button
                onClick={handleExport}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>📥</span>
                <span>Download Backup File</span>
              </button>
            </div>
          )}

          {/* Import Tab */}
          {activeTab === "import" && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Import Data
                </h3>
                <p className="text-green-700 text-sm">
                  Restore your movie data from a previously exported JSON backup
                  file.
                </p>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                  id="file-import"
                />
                <label
                  htmlFor="file-import"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <span className="text-4xl">📁</span>
                  <span className="font-semibold text-gray-700">
                    Choose Backup File
                  </span>
                  <span className="text-sm text-gray-500">
                    Or paste JSON data below
                  </span>
                </label>
              </div>

              {/* JSON Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or paste JSON data:
                </label>
                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder="Paste your JSON backup data here..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={handleImport}
                disabled={!importJson.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 px-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                📤 Restore Data
              </button>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Dangerous Zone
                </h3>
                <p className="text-yellow-700 text-sm">
                  These actions cannot be undone. Make sure you have a backup
                  before proceeding.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h4 className="font-semibold text-red-800 mb-2">
                    Clear All Data
                  </h4>
                  <p className="text-red-700 text-sm mb-3">
                    Permanently delete all your watchlist and watched data.
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    🗑️ Clear All Data
                  </button>
                </div>

                {/* Storage Information */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Storage Information
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Your data is automatically saved to your browser's local
                    storage. It will persist even after closing the browser or
                    refreshing the page.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Storage location:{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      localStorage
                    </code>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataManager;
