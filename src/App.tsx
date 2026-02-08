import { Routes, Route, Link } from "react-router-dom";
import { CaseProvider } from "./context/CaseContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Intake from "./pages/Intake";
import Dashboard from "./pages/Dashboard";
import CaseDetail from "./pages/CaseDetail";
import Settings from "./pages/Settings";

function NotFound() {
  return (
    <main id="main" className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-100 mb-4">
        Page Not Found
      </h1>
      <p className="text-slate-400 mb-6">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="text-brand hover:underline font-medium">
        Go to Home
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <CaseProvider>
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
          <a href="#main" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/intake" element={<Intake />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cases/:id" element={<CaseDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </CaseProvider>
    </AccessibilityProvider>
  );
}
