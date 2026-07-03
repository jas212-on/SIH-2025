import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ToastProvider } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import './i18n';

const HomePage        = lazy(() => import('./pages/HomePage'));
const ChatPage        = lazy(() => import('./pages/ChatPage'));
const DataVisualization = lazy(() => import('./pages/DataVisualization'));
const MapPage         = lazy(() => import('./pages/MapPage'));
const ComparePage     = lazy(() => import('./pages/ComparePage'));
const ForecastPage    = lazy(() => import('./pages/ForecastPage'));
const AdvisoryPage    = lazy(() => import('./pages/AdvisoryPage'));
const SimulatorPage   = lazy(() => import('./pages/SimulatorPage'));
const FieldObservationPage = lazy(() => import('./pages/FieldObservationPage'));
const ReportsPage     = lazy(() => import('./pages/ReportsPage'));
const AboutPage       = lazy(() => import('./pages/AboutPage'));
const FeaturesPage    = lazy(() => import('./pages/FeaturesPage'));
const ContactPage     = lazy(() => import('./pages/ContactPage'));
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'));
const ApiGuidePage    = lazy(() => import('./pages/ApiGuidePage'));

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 dark:bg-ink-950">
      <div className="animate-spin w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
            <Suspense fallback={<Spinner />}>
              <Routes>
                <Route path="/"             element={<HomePage />} />
                <Route path="/chat"         element={<ChatPage />} />
                <Route path="/visualization" element={<DataVisualization />} />
                <Route path="/map"          element={<MapPage />} />
                <Route path="/compare"      element={<ComparePage />} />
                <Route path="/forecast"     element={<ForecastPage />} />
                <Route path="/advisory"     element={<AdvisoryPage />} />
                <Route path="/simulator"    element={<SimulatorPage />} />
                <Route path="/field-data"   element={<FieldObservationPage />} />
                <Route path="/reports"      element={<ReportsPage />} />
                <Route path="/about"        element={<AboutPage />} />
                <Route path="/features"     element={<FeaturesPage />} />
                <Route path="/contact"      element={<ContactPage />} />
                <Route path="/documentation" element={<DocumentationPage />} />
                <Route path="/api-guide"    element={<ApiGuidePage />} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}
