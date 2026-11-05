import React, { useState } from 'react';
import {
  Film,
  Music,
  Type,
  Sliders,
  Bookmark,
  Plus,
  Upload,
  Search,
  Loader2,
  Play,
  Volume2,
  Sparkles,
  Palette,
  Check,
} from 'lucide-react';
import { useStockMedia } from '../../hooks/useStockMedia';
import { useProject } from '../../context/ProjectContext';
import { MediaType, StockMediaItem, ClipItem } from '../../types/timeline';
import { formatDuration, generateWaveform } from '../../utils/timecode';

type SidebarTab = 'media' | 'audio' | 'captions' | 'effects' | 'markers';

export const AssetSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('media');
  const [searchQuery, setSearchQuery] = useState('');
  const [customCaptionText, setCustomCaptionText] = useState('New Subtitle Line');
  const [captionPresetStyle, setCaptionPresetStyle] = useState<'default' | 'glow' | 'cinema' | 'box'>('default');

  const { addClipToTrack, project, addMarker, deleteMarker, setCurrentTime } = useProject();

  // React Query cached stock media search
  const mediaTypeFilter = activeTab === 'media' ? 'all' : activeTab === 'audio' ? 'music' : 'all';
  const { data: stockItems = [], isLoading } = useStockMedia(mediaTypeFilter, searchQuery);

  // File upload handler for local user videos/images/audio
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const objectUrl = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video');
      const isAudio = file.type.startsWith('audio');
      const isImage = file.type.startsWith('image');

      if (isVideo || isImage) {
        addClipToTrack('visuals', {
          name: file.name,
          type: isVideo ? 'video' : 'image',
          sourceUrl: objectUrl,
          duration: isVideo ? 6.0 : 4.0,
          color: isVideo ? '#3b82f6' : '#ec4899',
        });
      } else if (isAudio) {
        addClipToTrack('music', {
          name: file.name,
          type: 'music',
          sourceUrl: objectUrl,
          duration: 10.0,
          color: '#8b5cf6',
          waveformData: generateWaveform(60, Math.floor(Math.random() * 1000)),
        });
      }
    }
  };

  // Quick add stock item
  const handleAddStockItem = (item: StockMediaItem) => {
    if (item.type === 'video' || item.type === 'image') {
      addClipToTrack('visuals', {
        name: item.title,
        type: item.type,
        duration: item.duration,
        sourceUrl: item.url,
        thumbnailUrl: item.thumbnail,
        color: item.type === 'video' ? '#3b82f6' : '#ec4899',
      });
    } else if (item.type === 'music') {
      addClipToTrack('music', {
        name: item.title,
        type: 'music',
        duration: item.duration,
        sourceUrl: item.url,
        color: '#8b5cf6',
        waveformData: item.waveformData || generateWaveform(60, 42),
      });
    } else if (item.type === 'voiceover') {
      addClipToTrack('voiceover', {
        name: item.title,
        type: 'voiceover',
        duration: item.duration,
        sourceUrl: item.url,
        color: '#10b981',
        waveformData: item.waveformData || generateWaveform(40, 101),
      });
    }
  };

  // Add custom caption
  const handleAddCaption = () => {
    if (!customCaptionText.trim()) return;

    let color = '#ffffff';
    let bgColor = 'rgba(15, 23, 42, 0.85)';
    let fontSize = 28;

    if (captionPresetStyle === 'glow') {
      color = '#38bdf8';
      bgColor = 'rgba(2, 6, 23, 0.9)';
      fontSize = 32;
    } else if (captionPresetStyle === 'cinema') {
      color = '#fef08a';
      bgColor = 'transparent';
      fontSize = 26;
    } else if (captionPresetStyle === 'box') {
      color = '#ffffff';
      bgColor = '#f43f5e';
      fontSize = 24;
    }

    addClipToTrack('captions', {
      name: `Caption: ${customCaptionText.slice(0, 15)}...`,
      type: 'caption',
      duration: 3.5,
      color: '#eab308',
      captionProps: {
        text: customCaptionText,
        fontSize,
        fontFamily: 'Plus Jakarta Sans',
        color,
        backgroundColor: bgColor,
        fontWeight: '700',
        alignment: 'center',
        position: 'bottom',
      },
    });
  };

  // Quick apply color filter preset
  const handleApplyFilterPreset = (presetName: string) => {
    const activeVisual = project.tracks
      .find((t) => t.type === 'visuals')
      ?.clips.find((c) => project.currentTime >= c.startTime && project.currentTime <= c.startTime + c.duration);

    if (!activeVisual) return;

    let filters = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
      invert: 0,
    };

    if (presetName === 'cyberpunk') {
      filters = { ...filters, contrast: 130, saturation: 150, hueRotate: 45 };
    } else if (presetName === 'vintage') {
      filters = { ...filters, sepia: 60, contrast: 90, brightness: 105 };
    } else if (presetName === 'noir') {
      filters = { ...filters, grayscale: 100, contrast: 140, brightness: 90 };
    } else if (presetName === 'warm_sunset') {
      filters = { ...filters, brightness: 110, saturation: 135, sepia: 25 };
    }

    addClipToTrack('visuals', {
      ...activeVisual,
      name: `${activeVisual.name} (${presetName})`,
      filters,
    });
  };

  return (
    <aside className="w-80 md:w-88 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none shrink-0 z-20">
      {/* Tab Navigation */}
      <div className="grid grid-cols-5 p-1 bg-slate-950/70 border-b border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('media')}
          className={`flex flex-col items-center gap-1 py-2 px-1 rounded-md transition-colors ${
            activeTab === 'media' ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="w-4 h-4" />
          <span className="text-[10px]">Media</span>
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`flex flex-col items-center gap-1 py-2 px-1 rounded-md transition-colors ${
            activeTab === 'audio' ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Music className="w-4 h-4" />
          <span className="text-[10px]">Audio</span>
        </button>
        <button
          onClick={() => setActiveTab('captions')}
          className={`flex flex-col items-center gap-1 py-2 px-1 rounded-md transition-colors ${
            activeTab === 'captions' ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Type className="w-4 h-4" />
          <span className="text-[10px]">Text</span>
        </button>
        <button
          onClick={() => setActiveTab('effects')}
          className={`flex flex-col items-center gap-1 py-2 px-1 rounded-md transition-colors ${
            activeTab === 'effects' ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span className="text-[10px]">Effects</span>
        </button>
        <button
          onClick={() => setActiveTab('markers')}
          className={`flex flex-col items-center gap-1 py-2 px-1 rounded-md transition-colors ${
            activeTab === 'markers' ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-[10px]">Markers</span>
        </button>
      </div>

      {/* Main Tab View Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: Media Library */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            {/* Local Media Import Zone */}
            <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/80 bg-slate-950/40 hover:bg-slate-950/80 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group">
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors mb-2" />
              <span className="text-xs font-semibold text-slate-200">Import Local Media</span>
              <span className="text-[11px] text-slate-400 mt-0.5">MP4, WebM, PNG, JPG, MP3</span>
              <input type="file" multiple accept="video/*,image/*,audio/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search stock footage..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Stock Footage Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Stock Library (Cached)</span>
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {stockItems
                  .filter((item) => item.type === 'video' || item.type === 'image')
                  .map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/50 rounded-lg p-2 flex gap-3 items-center transition-all"
                    >
                      <div className="w-20 h-12 rounded overflow-hidden bg-slate-800 shrink-0 relative">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0.5 right-0.5 px-1 bg-black/80 text-[9px] font-mono rounded text-slate-200">
                          {formatDuration(item.duration)}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          <span>{item.type.toUpperCase()}</span>
                          {item.resolution && (
                            <>
                              <span>·</span>
                              <span>{item.resolution}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddStockItem(item)}
                        title="Add to Timeline"
                        className="w-7 h-7 rounded-md bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white flex items-center justify-center transition-colors shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Audio & Voiceover */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Royalty-free background tracks & AI voiceover stems with instant waveform preview.
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Soundtracks & BGM</h4>
              <div className="space-y-2">
                {stockItems
                  .filter((item) => item.type === 'music')
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/50 rounded-lg p-2.5 flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                          <Music className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-purple-300">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {formatDuration(item.duration)} · {item.tags.join(', ')}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddStockItem(item)}
                        className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white rounded-md flex items-center gap-1 transition-colors shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Voiceover Narrations</h4>
              <div className="space-y-2">
                {stockItems
                  .filter((item) => item.type === 'voiceover')
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/50 rounded-lg p-2.5 flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-emerald-300">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {formatDuration(item.duration)} · AI Voice
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddStockItem(item)}
                        className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-md flex items-center gap-1 transition-colors shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Captions & Text */}
        {activeTab === 'captions' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Subtitle Text</label>
              <textarea
                value={customCaptionText}
                onChange={(e) => setCustomCaptionText(e.target.value)}
                rows={3}
                placeholder="Type caption line here..."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* Preset Styles */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Caption Style Preset</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCaptionPresetStyle('default')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    captionPresetStyle === 'default'
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-200'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-white">Classic Box</div>
                  <div className="text-[10px] opacity-70">Dark rounded pill</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCaptionPresetStyle('glow')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    captionPresetStyle === 'glow'
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-200'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-cyan-400">Cyan Pop</div>
                  <div className="text-[10px] opacity-70">Modern tech highlight</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCaptionPresetStyle('cinema')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    captionPresetStyle === 'cinema'
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-200'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-yellow-300">Cinema Gold</div>
                  <div className="text-[10px] opacity-70">Floating yellow subtitle</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCaptionPresetStyle('box')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    captionPresetStyle === 'box'
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-200'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-rose-300">Badge Red</div>
                  <div className="text-[10px] opacity-70">Bold announcement</div>
                </button>
              </div>
            </div>

            <button
              onClick={handleAddCaption}
              className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Insert Subtitle at Playhead</span>
            </button>
          </div>
        )}

        {/* TAB 4: Effects & Color Filters */}
        {activeTab === 'effects' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Apply real-time GPU-accelerated canvas shaders & LUT color grading.
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleApplyFilterPreset('cyberpunk')}
                className="group p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-cyan-500/80 text-left transition-all"
              >
                <div className="w-full h-12 rounded bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">Cyberpunk 2077</div>
                <div className="text-[10px] text-slate-400">High saturation & neon</div>
              </button>

              <button
                onClick={() => handleApplyFilterPreset('vintage')}
                className="group p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-amber-500/80 text-left transition-all"
              >
                <div className="w-full h-12 rounded bg-gradient-to-r from-amber-800 via-amber-600 to-yellow-600 mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300">Vintage Film</div>
                <div className="text-[10px] text-slate-400">Sepia retro warmth</div>
              </button>

              <button
                onClick={() => handleApplyFilterPreset('noir')}
                className="group p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-500 text-left transition-all"
              >
                <div className="w-full h-12 rounded bg-gradient-to-r from-black via-slate-700 to-white mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="text-xs font-semibold text-slate-200 group-hover:text-slate-100">Classic Noir</div>
                <div className="text-[10px] text-slate-400">High-contrast B&W</div>
              </button>

              <button
                onClick={() => handleApplyFilterPreset('warm_sunset')}
                className="group p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-orange-500 text-left transition-all"
              >
                <div className="w-full h-12 rounded bg-gradient-to-r from-orange-600 to-rose-600 mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="text-xs font-semibold text-slate-200 group-hover:text-orange-300">Golden Hour</div>
                <div className="text-[10px] text-slate-400">Rich sunset radiance</div>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: Markers & Chapters */}
        {activeTab === 'markers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Project Markers</span>
              <button
                onClick={() => addMarker()}
                className="px-2 py-1 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 rounded text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add (M)</span>
              </button>
            </div>

            <div className="space-y-2">
              {project.markers.map((marker) => (
                <div
                  key={marker.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                >
                  <button
                    onClick={() => setCurrentTime(marker.time)}
                    className="flex items-center gap-2.5 min-w-0 text-left flex-1"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: marker.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-200 truncate">{marker.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatDuration(marker.time)} {marker.note ? `· ${marker.note}` : ''}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => deleteMarker(marker.id)}
                    className="text-slate-400 hover:text-rose-400 p-1 text-xs transition-colors"
                    title="Delete marker"
                  >
                    ×
                  </button>
                </div>
              ))}

              {project.markers.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No markers added yet. Press 'M' during playback or click Add above to flag beats and chapters.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
