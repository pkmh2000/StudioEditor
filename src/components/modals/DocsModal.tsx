import React, { useState } from 'react';
import {
  X,
  FileCode,
  Github,
  CheckCircle2,
  Workflow,
  Sparkles,
  Layers,
  Terminal,
  ShieldCheck,
  BookOpen,
  Keyboard,
} from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'deploy' | 'architecture' | 'shortcuts' | 'testing'>('deploy');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Project Guide & Architecture</h3>
              <p className="text-[11px] text-slate-400">GitHub Pages CI/CD, React Query, Jest & Modular Design</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'deploy'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Pages CI/CD</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'architecture'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Modular Architecture</span>
          </button>
          <button
            onClick={() => setActiveTab('testing')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'testing'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Jest & Code Quality</span>
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'shortcuts'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Keyboard Shortcuts</span>
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300">
          {activeTab === 'deploy' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Workflow className="w-4 h-4 text-cyan-400" />
                <span>Automated GitHub Pages Deployment Flow</span>
              </h4>
              <p className="text-slate-400 text-xs">
                This project includes a pre-configured GitHub Actions workflow located at{' '}
                <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">.github/workflows/deploy.yml</code>.
              </p>

              <div className="space-y-2.5 bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 font-mono text-[11px]">
                <div className="flex gap-2">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <div>
                    <span className="text-slate-200 font-bold">Base Path Configuration</span>
                    <p className="text-slate-400 font-sans mt-0.5">
                      Configured <code className="text-cyan-300">base: './'</code> in <code className="text-slate-300">vite.config.ts</code> so assets resolve correctly on GitHub Pages repository subpaths (<code className="text-slate-300">https://username.github.io/repo/</code>).
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <div>
                    <span className="text-slate-200 font-bold">GitHub Repository Settings</span>
                    <p className="text-slate-400 font-sans mt-0.5">
                      Navigate to your GitHub Repo &gt; <strong>Settings</strong> &gt; <strong>Pages</strong>. Under <strong>Build and deployment</strong>, choose <strong>GitHub Actions</strong> as the source.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <div>
                    <span className="text-slate-200 font-bold">Automatic CI/CD Pipeline</span>
                    <p className="text-slate-400 font-sans mt-0.5">
                      Every push to <code className="text-cyan-300">main</code> automatically runs TypeScript checking (<code className="text-slate-300">npm run lint</code>), Jest unit tests (<code className="text-slate-300">npm test</code>), builds the static bundle, and publishes to GitHub Pages in seconds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Modular Architecture & State Caching</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>React Query (@tanstack)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Handles asynchronous media fetching, cache invalidation, stale-time management, and search queries without performance degradation.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Modular Components</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Clean separation into <code className="text-slate-300">timeline/</code>, <code className="text-slate-300">preview/</code>, <code className="text-slate-300">inspector/</code>, <code className="text-slate-300">sidebar/</code>, and <code className="text-slate-300">header/</code>.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>HTML5 Canvas Compositor</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Hardware-accelerated rendering loop with multi-layer blend modes, CSS filter strings, and exact subtitle vector alignment.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tailwind CSS v4</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Studio dark visual language following the Frontend Design Constitution: zero-pill discipline, tabular numerals, and responsive viewport math.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testing' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Jest Unit Testing & ESLint Quality Gate</span>
              </h4>

              <p className="text-slate-400 text-xs">
                Unit test specifications are implemented under <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">src/__tests__/timeline.test.ts</code> to ensure timeline calculations, splitting, and timecodes never drift.
              </p>

              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 font-mono text-[11px] space-y-2">
                <div className="text-slate-400"># Run unit tests via Jest</div>
                <div className="text-cyan-300 font-bold">$ npm test</div>
                <div className="text-slate-400 pt-1"># Run TypeScript & ESLint validation</div>
                <div className="text-cyan-300 font-bold">$ npm run lint</div>
                <div className="text-slate-400 pt-1"># Production build</div>
                <div className="text-cyan-300 font-bold">$ npm run build</div>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-cyan-400" />
                <span>Keyboard Shortcuts & Quick Navigation</span>
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-slate-400 font-sans">Play / Pause</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-cyan-300 font-bold">Space</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-slate-400 font-sans">Split Clip at Playhead</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-cyan-300 font-bold">Ctrl + B</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-slate-400 font-sans">Duplicate Clip</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-cyan-300 font-bold">Ctrl + D</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-slate-400 font-sans">Delete Selected Clip</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-cyan-300 font-bold">Backspace</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-slate-400 font-sans">Step 1 Frame Back</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-cyan-300 font-bold">Left Arrow</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-slate-400 font-sans">Step 1 Frame Forward</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-cyan-300 font-bold">Right Arrow</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-slate-400 font-sans">Add Marker</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-cyan-300 font-bold">M</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-slate-400 font-sans">Toggle Snapping</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-cyan-300 font-bold">S</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-slate-400 font-sans">Undo</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-cyan-300 font-bold">Ctrl + Z</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-slate-400 font-sans">Redo</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-cyan-300 font-bold">Ctrl + Y</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
