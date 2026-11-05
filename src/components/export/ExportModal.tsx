import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  Film,
  CheckCircle2,
  FileJson,
  Loader2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { formatTimecode } from '../../utils/timecode';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { project } = useProject();

  const [format, setFormat] = useState<'mp4' | 'webm' | 'gif'>('mp4');
  const [resolutionLabel, setResolutionLabel] = useState(project.resolution.label);
  const [fps, setFps] = useState(30);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [downloadBlobUrl, setDownloadBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsExporting(false);
      setProgress(0);
      setIsComplete(false);
      if (downloadBlobUrl) {
        URL.revokeObjectURL(downloadBlobUrl);
        setDownloadBlobUrl(null);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Run simulated rendering process
  const handleStartExport = () => {
    setIsExporting(true);
    setProgress(0);
    setIsComplete(false);

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);

        // Generate synthetic mock video blob download
        const dummyData = `Timeline Studio Export\nProject: ${project.name}\nDuration: ${project.duration}s\nResolution: ${resolutionLabel}\nFPS: ${fps}\nExported: ${new Date().toISOString()}`;
        const blob = new Blob([dummyData], { type: format === 'mp4' ? 'video/mp4' : 'video/webm' });
        const url = URL.createObjectURL(blob);

        setDownloadBlobUrl(url);
        setIsExporting(false);
        setIsComplete(true);
      }
      setProgress(current);
    }, 120);
  };

  // Export portable .timeline project JSON
  const handleExportTimelineJson = () => {
    const projectJson = JSON.stringify(project, null, 2);
    const blob = new Blob([projectJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}.timeline`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Approximate file size calculation based on duration, resolution & quality
  const estimatedMB = Number(
    ((project.duration * (quality === 'high' ? 2.5 : quality === 'medium' ? 1.5 : 0.8) * (fps / 30)).toFixed(1))
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-cyan-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Export Timeline Composition</h3>
              <p className="text-[11px] text-slate-400">Deterministic browser rendering engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {!isComplete ? (
            <>
              {/* Format selection */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Container Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['mp4', 'webm', 'gif'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      disabled={isExporting}
                      onClick={() => setFormat(fmt)}
                      className={`py-2 px-3 rounded-lg border text-center font-mono uppercase font-bold transition-all ${
                        format === fmt
                          ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-sm'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution & Quality Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">Frame Rate</label>
                  <select
                    disabled={isExporting}
                    value={fps}
                    onChange={(e) => setFps(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="24">24 FPS (Cinematic)</option>
                    <option value="30">30 FPS (Standard)</option>
                    <option value="60">60 FPS (Smooth)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1.5">Bitrate Quality</label>
                  <select
                    disabled={isExporting}
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="high">High (Visually Lossless)</option>
                    <option value="medium">Balanced (Standard Web)</option>
                    <option value="low">Optimized (Smaller File)</option>
                  </select>
                </div>
              </div>

              {/* Composition Overview Box */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1.5 text-[11px] text-slate-400 font-mono">
                <div className="flex justify-between">
                  <span>CANVAS SIZE:</span>
                  <span className="text-slate-200 font-bold">{project.resolution.width} × {project.resolution.height}</span>
                </div>
                <div className="flex justify-between">
                  <span>TIMELINE LENGTH:</span>
                  <span className="text-cyan-400">{formatTimecode(project.duration, project.fps)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ESTIMATED SIZE:</span>
                  <span className="text-slate-200">~{estimatedMB} MB</span>
                </div>
                <div className="flex justify-between">
                  <span>ACTIVE TRACKS:</span>
                  <span className="text-slate-200">{project.tracks.filter((t) => !t.isHidden).length} Tracks</span>
                </div>
              </div>

              {/* Progress bar when rendering */}
              {isExporting && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Rendering frames & mixing audio...
                    </span>
                    <span className="font-mono font-bold">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Complete State */
            <div className="py-6 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-100">Export Complete!</h4>
              <p className="text-slate-400 text-xs max-w-sm">
                Your composition was rendered into a high-definition {format.toUpperCase()} package.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 w-full">
                <a
                  href={downloadBlobUrl || '#'}
                  download={`${project.name.toLowerCase().replace(/\s+/g, '-')}.${format}`}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Video ({format.toUpperCase()})</span>
                </a>

                <button
                  onClick={handleExportTimelineJson}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                  <FileJson className="w-4 h-4 text-amber-400" />
                  <span>Save .timeline Project</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!isComplete && (
          <div className="px-5 py-3.5 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleExportTimelineJson}
              title="Save project as JSON for later editing"
              className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
            >
              <FileJson className="w-3.5 h-3.5 text-amber-400" />
              <span>Backup .timeline Project</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isExporting}
                onClick={handleStartExport}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{isExporting ? 'Exporting...' : 'Start Render'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
