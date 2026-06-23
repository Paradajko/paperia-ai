import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { CookieConsent } from './components/CookieConsent';
import { RouteMetadata } from './components/RouteMetadata';
import { AgencyPage } from './pages/AgencyPage';
import { LandingPage } from './pages/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Unsubscribed } from './pages/Unsubscribed';
import { BlogArticlePage } from './pages/blog/[slug]';
import { BlogIndex } from './pages/blog/index';

function App() {
  return (
    <BrowserRouter>
      <RouteMetadata />
      <Routes>
        <Route path="/" element={<LandingPage locale="en" />} />
        <Route path="/sk/" element={<LandingPage locale="sk" />} />
        <Route path="/rs/" element={<LandingPage locale="rs" />} />
        <Route path="/ua/" element={<LandingPage locale="ua" />} />
        <Route path="/pricing" element={<PricingPage locale="en" />} />
        <Route path="/sk/pricing" element={<PricingPage locale="sk" />} />
        <Route path="/rs/pricing" element={<PricingPage locale="rs" />} />
        <Route path="/ua/pricing" element={<PricingPage locale="ua" />} />
        <Route path="/for-agencies" element={<AgencyPage locale="en" />} />
        <Route path="/sk/for-agencies" element={<AgencyPage locale="sk" />} />
        <Route path="/rs/for-agencies" element={<AgencyPage locale="rs" />} />
        <Route path="/ua/for-agencies" element={<AgencyPage locale="ua" />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/unsubscribed" element={<Unsubscribed />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogArticlePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsent />
    </BrowserRouter>
  );
}

export default App;
