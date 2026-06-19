import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { CookieConsent } from './components/CookieConsent';
import { RouteMetadata } from './components/RouteMetadata';
import { LandingPage } from './pages/LandingPage';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Unsubscribed } from './pages/Unsubscribed';

function App() {
  return (
    <BrowserRouter>
      <RouteMetadata />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/unsubscribed" element={<Unsubscribed />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsent />
    </BrowserRouter>
  );
}

export default App;
