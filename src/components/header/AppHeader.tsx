import React from 'react';
import {
  Film,
  Download,
  RotateCcw,
  RotateCw,
  FolderOpen,
  Sparkles,
  HelpCircle,
  FileCode,
  Layers,
  Ratio,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { RESOLUTION_PRESETS } from '../../services/sampleProject';
import { formatTimecode } from '../../utils/timecode';

interface AppHeaderProps {
  onOpenExportModal: () => void;
  onOpenDocsModal: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenExportModal,
  onOpenDocsModal,
}) => {
  const {
    project,
    canUndo,
    canRedo,
    undo,
    redo,
    setResolution,
    loadDemoProject,
    resetProject,
  } = useProject();

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-4 select-none z-30 shrink-0">
      {/* Zone 1: Wordmark & Project Name */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Film className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-white whitespace-nowrap">
            Timeline Studio
          </span>
        </div>

        <div className="hidden sm:block h-4 w-px bg-slate-700 mx-1" />

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-200 font-medium truncate max-w-[140px] md:max-w-[200px]">
            {project.name}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono tabular-nums text-cyan-400">
            {formatTimecode(project.duration, project.fps)}
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation & Utility Controls */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 bg-slate-950/60 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
            className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
            className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Resolution selector */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-950/60 px-2 py-1 rounded-lg border border-slate-800 text-xs">
          <Ratio className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={project.resolution.aspectRatio}
            onChange={(e) => {
              const matched = RESOLUTION_PRESETS.find((p) => p.aspectRatio === e.target.value);
              if (matched) setResolution(matched);
            }}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            {RESOLUTION_PRESETS.map((preset) => (
              <option key={preset.label} value={preset.aspectRatio} className="bg-slate-900 text-slate-200">
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        {/* Load Demo & Reset */}
        <button
          onClick={loadDemoProject}
          title="Reload Demo Project"
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800/80"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Demo Reel</span>
        </button>

        {/* Documentation & GitHub Pages Guide */}
        <button
          onClick={onOpenDocsModal}
          title="View Documentation & GitHub Pages CI/CD Setup"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800/80"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Docs & Deployment</span>
        </button>
      </div>

      {/* Zone 3: Primary Action (Export Video) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg shadow-sm shadow-cyan-500/20 active:scale-[0.98] transition-all whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Video</span>
        </button>
      </div>
    </header>
  );
};
