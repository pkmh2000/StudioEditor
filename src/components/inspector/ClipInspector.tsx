import React, { useState } from 'react';
import {
  Sliders,
  Scissors,
  Copy,
  Trash2,
  RotateCcw,
  Eye,
  Volume2,
  Type,
  Maximize,
  Sparkles,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { formatTimecode } from '../../utils/timecode';
import { RESOLUTION_PRESETS } from '../../services/sampleProject';

export const ClipInspector: React.FC = () => {
  const {
    project,
    selectedClip,
    updateClip,
    splitClipAtPlayhead,
    duplicateClip,
    deleteClip,
    setResolution,
  } = useProject();

  const [activeSubTab, setActiveSubTab] = useState<'transform' | 'filters' | 'audio'>('transform');

  if (!selectedClip) {
    // Project Overview & Global Inspector
    return (
      <aside className="w-72 md:w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full select-none shrink-0 z-20 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Project Settings</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400">Project Title</label>
            <input
              type="text"
              value={project.name}
              readOnly
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400">Canvas Aspect Ratio</label>
            <div className="grid grid-cols-1 gap-1.5 mt-1">
              {RESOLUTION_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setResolution(preset)}
                  className={`px-3 py-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    project.resolution.aspectRatio === preset.aspectRatio
                      ? 'border-cyan-500 bg-cyan-950/30 text-cyan-200'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-medium">{preset.label}</span>
                  <span className="font-mono text-[10px] text-slate-500">{preset.width}x{preset.height}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Total Duration:</span>
              <span className="font-mono tabular-nums text-slate-200">
                {formatTimecode(project.duration, project.fps)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Frame Rate:</span>
              <span className="font-mono text-slate-200">{project.fps} FPS</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Timeline Tracks:</span>
              <span className="font-mono text-slate-200">{project.tracks.length}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Markers:</span>
              <span className="font-mono text-slate-200">{project.markers.length}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">💡 Quick Tip</div>
            <p className="text-[11px] leading-relaxed">
              Click any clip on the timeline below to inspect and customize its transform, filters, subtitles, or audio levels.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const isVisual = selectedClip.type === 'video' || selectedClip.type === 'image';
  const isCaption = selectedClip.type === 'caption';
  const isAudio = selectedClip.type === 'music' || selectedClip.type === 'voiceover';

  return (
    <aside className="w-72 md:w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full select-none shrink-0 z-20 overflow-y-auto p-4 space-y-4">
      {/* Header: Clip Name & Action Tools */}
      <div className="space-y-2 border-b border-slate-800 pb-3">
        <div className="flex items-center justify-between gap-2">
          <input
            type="text"
            value={selectedClip.name}
            onChange={(e) => updateClip(selectedClip.id, { name: e.target.value })}
            className="text-xs font-bold text-slate-100 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 focus:outline-none truncate w-full"
          />
          <span
            className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase shrink-0"
            style={{ backgroundColor: `${selectedClip.color}25`, color: selectedClip.color }}
          >
            {selectedClip.type}
          </span>
        </div>

        {/* Quick Actions toolbar */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => splitClipAtPlayhead(selectedClip.id)}
            title="Split Clip at Playhead (Ctrl+B)"
            className="flex-1 py-1 px-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-800 flex items-center justify-center gap-1 text-[11px] transition-colors"
          >
            <Scissors className="w-3.5 h-3.5 text-cyan-400" />
            <span>Split</span>
          </button>
          <button
            onClick={() => duplicateClip(selectedClip.id)}
            title="Duplicate Clip (Ctrl+D)"
            className="flex-1 py-1 px-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-800 flex items-center justify-center gap-1 text-[11px] transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-purple-400" />
            <span>Duplicate</span>
          </button>
          <button
            onClick={() => deleteClip(selectedClip.id)}
            title="Delete Clip (Backspace)"
            className="p-1 px-2 bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded border border-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Clip Timing stats */}
      <div className="grid grid-cols-2 gap-2 p-2 bg-slate-950/70 border border-slate-800 rounded-lg text-xs font-mono tabular-nums">
        <div>
          <span className="text-[10px] text-slate-500 block">START</span>
          <span className="text-slate-200">{formatTimecode(selectedClip.startTime, project.fps)}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block">DURATION</span>
          <span className="text-cyan-400">{formatTimecode(selectedClip.duration, project.fps)}</span>
        </div>
      </div>

      {/* VISUAL CLIP CONTROLS */}
      {isVisual && (
        <div className="space-y-4">
          {/* Sub tabs: Transform vs Filters */}
          <div className="grid grid-cols-2 p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveSubTab('transform')}
              className={`py-1.5 rounded-md font-medium transition-colors ${
                activeSubTab === 'transform' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Transform
            </button>
            <button
              onClick={() => setActiveSubTab('filters')}
              className={`py-1.5 rounded-md font-medium transition-colors ${
                activeSubTab === 'filters' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Filters & Color
            </button>
          </div>

          {activeSubTab === 'transform' && (
            <div className="space-y-3 text-xs">
              {/* Scale */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Scale</span>
                  <span className="font-mono tabular-nums">{Math.round((selectedClip.visualProps?.scale || 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.05"
                  value={selectedClip.visualProps?.scale || 1}
                  onChange={(e) =>
                    updateClip(selectedClip.id, {
                      visualProps: {
                        ...(selectedClip.visualProps || { x: 0, y: 0, rotation: 0, opacity: 1, fit: 'contain' }),
                        scale: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Rotation */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Rotation</span>
                  <span className="font-mono tabular-nums">{selectedClip.visualProps?.rotation || 0}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={selectedClip.visualProps?.rotation || 0}
                  onChange={(e) =>
                    updateClip(selectedClip.id, {
                      visualProps: {
                        ...(selectedClip.visualProps || { x: 0, y: 0, scale: 1, opacity: 1, fit: 'contain' }),
                        rotation: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Opacity */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Opacity</span>
                  <span className="font-mono tabular-nums">{Math.round((selectedClip.visualProps?.opacity ?? 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={selectedClip.visualProps?.opacity ?? 1}
                  onChange={(e) =>
                    updateClip(selectedClip.id, {
                      visualProps: {
                        ...(selectedClip.visualProps || { x: 0, y: 0, scale: 1, rotation: 0, fit: 'contain' }),
                        opacity: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Fit Mode */}
              <div>
                <label className="text-slate-300 mb-1 block">Fit Mode</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['contain', 'cover', 'fill'] as const).map((fitMode) => (
                    <button
                      key={fitMode}
                      onClick={() =>
                        updateClip(selectedClip.id, {
                          visualProps: {
                            ...(selectedClip.visualProps || { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 }),
                            fit: fitMode,
                          },
                        })
                      }
                      className={`py-1.5 rounded text-xs capitalize transition-colors ${
                        (selectedClip.visualProps?.fit || 'contain') === fitMode
                          ? 'bg-cyan-600 text-white font-semibold'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {fitMode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Transform */}
              <button
                onClick={() =>
                  updateClip(selectedClip.id, {
                    visualProps: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, fit: 'contain' },
                  })
                }
                className="w-full py-1.5 text-slate-400 hover:text-slate-200 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 flex items-center justify-center gap-1.5 text-xs transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Transform</span>
              </button>
            </div>
          )}

          {activeSubTab === 'filters' && (
            <div className="space-y-3 text-xs">
              {/* Brightness */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Brightness</span>
                  <span className="font-mono tabular-nums">{selectedClip.filters?.brightness || 100}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={selectedClip.filters?.brightness || 100}
                  onChange={(e) =>
                    updateClip(selectedClip.id, {
                      filters: {
                        ...(selectedClip.filters || { contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0 }),
                        brightness: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Contrast</span>
                  <span className="font-mono tabular-nums">{selectedClip.filters?.contrast || 100}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={selectedClip.filters?.contrast || 100}
                  onChange={(e) =>
                    updateClip(selectedClip.id, {
                      filters: {
                        ...(selectedClip.filters || { brightness: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0 }),
                        contrast: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Saturation */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Saturation</span>
                  <span className="font-mono tabular-nums">{selectedClip.filters?.saturation || 100}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
                  value={selectedClip.filters?.saturation || 100}
                  onChange={(e) =>
                    updateClip(selectedClip.id, {
                      filters: {
                        ...(selectedClip.filters || { brightness: 100, contrast: 100, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0 }),
                        saturation: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Blur */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Gaussian Blur</span>
                  <span className="font-mono tabular-nums">{selectedClip.filters?.blur || 0}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={selectedClip.filters?.blur || 0}
                  onChange={(e) =>
                    updateClip(selectedClip.id, {
                      filters: {
                        ...(selectedClip.filters || { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0 }),
                        blur: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Reset Filters */}
              <button
                onClick={() =>
                  updateClip(selectedClip.id, {
                    filters: { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0 },
                  })
                }
                className="w-full py-1.5 text-slate-400 hover:text-slate-200 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 flex items-center justify-center gap-1.5 text-xs transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* CAPTION / SUBTITLE CONTROLS */}
      {isCaption && selectedClip.captionProps && (
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 mb-1 block">Caption Text</label>
            <textarea
              value={selectedClip.captionProps.text}
              onChange={(e) =>
                updateClip(selectedClip.id, {
                  captionProps: { ...selectedClip.captionProps!, text: e.target.value },
                })
              }
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Font Size</span>
              <span className="font-mono tabular-nums">{selectedClip.captionProps.fontSize}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="64"
              value={selectedClip.captionProps.fontSize}
              onChange={(e) =>
                updateClip(selectedClip.id, {
                  captionProps: { ...selectedClip.captionProps!, fontSize: parseInt(e.target.value, 10) },
                })
              }
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 mb-1 block">Text Color</label>
              <input
                type="color"
                value={selectedClip.captionProps.color || '#ffffff'}
                onChange={(e) =>
                  updateClip(selectedClip.id, {
                    captionProps: { ...selectedClip.captionProps!, color: e.target.value },
                  })
                }
                className="w-full h-8 bg-slate-950 border border-slate-800 rounded cursor-pointer p-0.5"
              />
            </div>
            <div>
              <label className="text-slate-400 mb-1 block">Background</label>
              <input
                type="text"
                value={selectedClip.captionProps.backgroundColor}
                onChange={(e) =>
                  updateClip(selectedClip.id, {
                    captionProps: { ...selectedClip.captionProps!, backgroundColor: e.target.value },
                  })
                }
                placeholder="rgba(0,0,0,0.8)"
                className="w-full h-8 bg-slate-950 border border-slate-800 rounded px-2 text-[11px] text-slate-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 mb-1 block">Screen Position</label>
            <div className="grid grid-cols-3 gap-1">
              {(['top', 'center', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() =>
                    updateClip(selectedClip.id, {
                      captionProps: { ...selectedClip.captionProps!, position: pos },
                    })
                  }
                  className={`py-1.5 rounded text-xs capitalize transition-colors ${
                    selectedClip.captionProps!.position === pos
                      ? 'bg-cyan-600 text-white font-semibold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AUDIO / VOICEOVER CONTROLS */}
      {isAudio && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Track Volume</span>
              <span className="font-mono tabular-nums">{selectedClip.audioProps?.volume ?? 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={selectedClip.audioProps?.volume ?? 100}
              onChange={(e) =>
                updateClip(selectedClip.id, {
                  audioProps: {
                    ...(selectedClip.audioProps || { muted: false, pan: 0, fadeIn: 0, fadeOut: 0 }),
                    volume: parseInt(e.target.value, 10),
                  },
                })
              }
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Fade In</span>
                <span className="font-mono">{selectedClip.audioProps?.fadeIn || 0}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={selectedClip.audioProps?.fadeIn || 0}
                onChange={(e) =>
                  updateClip(selectedClip.id, {
                    audioProps: {
                      ...(selectedClip.audioProps || { volume: 100, muted: false, pan: 0, fadeOut: 0 }),
                      fadeIn: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Fade Out</span>
                <span className="font-mono">{selectedClip.audioProps?.fadeOut || 0}s</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={selectedClip.audioProps?.fadeOut || 0}
                onChange={(e) =>
                  updateClip(selectedClip.id, {
                    audioProps: {
                      ...(selectedClip.audioProps || { volume: 100, muted: false, pan: 0, fadeIn: 0 }),
                      fadeOut: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
