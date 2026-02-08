import { useNavigate } from "react-router-dom";
import { useCases } from "../context/CaseContext";
import { usePWAInstall } from "../hooks/usePWAInstall";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Home() {
  const navigate = useNavigate();
  const { cases } = useCases();
  const { canInstall, install } = usePWAInstall();

  const openCases = cases.filter((c) => c.status !== "closed");
  const urgentCases = cases.filter(
    (c) => c.priority === "urgent" && c.status !== "closed"
  );
  const newCases = cases.filter(
    (c) => c.status === "new" || c.status === "triaged"
  );

  return (
    <main id="main" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-100 sm:text-4xl">
          CaseFlow
        </h1>
        <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
          Client intake and triage tool for social services teams. Capture
          referrals, automatically assess priority, and track cases through
          to resolution.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/intake")}>
            New Referral
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/dashboard")}
          >
            View Cases
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      {cases.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Card className="text-center">
            <p className="text-3xl font-bold text-slate-100">
              {newCases.length}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Awaiting Triage
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-slate-100">
              {openCases.length}
            </p>
            <p className="text-sm text-slate-400 mt-1">Open Cases</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-red-400">
              {urgentCases.length}
            </p>
            <p className="text-sm text-slate-400 mt-1">Urgent</p>
          </Card>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-900/40 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">&#9878;</span>
          </div>
          <h3 className="font-semibold text-slate-100">Automatic Triage</h3>
          <p className="text-sm text-slate-400 mt-1">
            Risk-based scoring automatically prioritises referrals.
          </p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-900/40 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">&#128246;</span>
          </div>
          <h3 className="font-semibold text-slate-100">Offline Capable</h3>
          <p className="text-sm text-slate-400 mt-1">
            Works without internet. Perfect for field work.
          </p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-900/40 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">&#128190;</span>
          </div>
          <h3 className="font-semibold text-slate-100">Export to CSV</h3>
          <p className="text-sm text-slate-400 mt-1">
            Download all case data for reporting and analysis.
          </p>
        </div>
      </div>

      {/* PWA Install */}
      {canInstall && (
        <Card className="text-center">
          <h3 className="font-semibold text-slate-100 mb-2">
            Install CaseFlow
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Add CaseFlow to your device for quick access and full offline
            support.
          </p>
          <Button variant="secondary" onClick={install}>
            Install App
          </Button>
        </Card>
      )}
    </main>
  );
}
