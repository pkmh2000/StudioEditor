/**
 * Timeline Studio - Browser AI Video Editor & Real-Time Preview
 * High-performance, modular React 19 + TypeScript + Tailwind CSS application.
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProjectProvider } from './context/ProjectContext';
import { AppHeader } from './components/header/AppHeader';
import { AssetSidebar } from './components/sidebar/AssetSidebar';
import { VideoPreviewPlayer } from './components/preview/VideoPreviewPlayer';
import { ClipInspector } from './components/inspector/ClipInspector';
import { TimelineWorkspace } from './components/timeline/TimelineWorkspace';
import { ExportModal } from './components/export/ExportModal';
import { DocsModal } from './components/modals/DocsModal';

// Initialize React Query client with 10-minute cache defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
          {/* Top Bar Header */}
          <AppHeader
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onOpenDocsModal={() => setIsDocsModalOpen(true)}
          />

          {/* Central Workspace: Sidebar + Preview Viewport + Inspector */}
          <main className="flex-1 flex min-h-0 overflow-hidden relative">
            {/* Left Asset Drawer */}
            <AssetSidebar />

            {/* Center Canvas Preview Stage */}
            <VideoPreviewPlayer />

            {/* Right Property Inspector */}
            <ClipInspector />
          </main>

          {/* Bottom Multi-Track Timeline */}
          <TimelineWorkspace />

          {/* Modals */}
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
          />
          <DocsModal
            isOpen={isDocsModalOpen}
            onClose={() => setIsDocsModalOpen(false)}
          />
        </div>
      </ProjectProvider>
    </QueryClientProvider>
  );
}
