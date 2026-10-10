import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const WelcomeScreen = lazy(() => import("./pages/WelcomeScreen/WelcomeScreen"));
const ProjectSetup = lazy(() => import("./pages/ProjectSetup/ProjectSetup"));
const DownloadStep = lazy(() => import("./components/features/DownloadStep/DownloadStep"));
const GitHubCallback = lazy(() => import("./components/github/GitHubCallback"));

export function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-brand-500" /></div>}>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/setup" element={<ProjectSetup />} />
          <Route 
            path="/download" 
            element={
              <DownloadStep 
                selectedFramework={null}
                selectedVersion={null}
                selectedFeatures={[]}
                selectedTemplate={null}
                projectName=""
                projectDescription=""
              />
            } 
          />
          <Route path="/github-callback" element={<GitHubCallback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;