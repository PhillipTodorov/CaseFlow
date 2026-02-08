import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCases } from "../context/CaseContext";
import { getCurrentUser, setCurrentUser } from "../utils/storage";
import { formatDate } from "../utils/dates";
import type { Case, Priority } from "../types";
import Table, { type TableColumn } from "../components/ui/Table";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";

type Tab = "inbox" | "active" | "myCases";

export default function Dashboard() {
  const navigate = useNavigate();
  const { cases, updateCaseStatus } = useCases();

  const [activeTab, setActiveTab] = useState<Tab>("inbox");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [userName, setUserName] = useState(getCurrentUser());

  // Assign modal state
  const [assignModalCase, setAssignModalCase] = useState<Case | null>(null);
  const [assignName, setAssignName] = useState("");

  // Set user name prompt
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState("");

  const tabFilters: Record<Tab, (c: Case) => boolean> = {
    inbox: (c) => c.status === "new" || c.status === "triaged",
    active: (c) => c.status === "assigned" || c.status === "in_progress",
    myCases: (c) =>
      userName !== "" &&
      c.assignedTo?.toLowerCase() === userName.toLowerCase() &&
      c.status !== "closed",
  };

  const filteredCases = useMemo(() => {
    return cases
      .filter(tabFilters[activeTab])
      .filter(
        (c) =>
          !searchTerm ||
          c.client.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (c) => priorityFilter.length === 0 || priorityFilter.includes(c.priority)
      )
      .filter((c) => !dateFrom || c.createdAt >= dateFrom)
      .filter(
        (c) => !dateTo || c.createdAt <= dateTo + "T23:59:59.999Z"
      );
  }, [cases, activeTab, searchTerm, priorityFilter, dateFrom, dateTo, userName]);

  const handleAssign = () => {
    if (assignModalCase && assignName.trim()) {
      updateCaseStatus(assignModalCase.id, "assigned", assignName.trim());
      setAssignModalCase(null);
      setAssignName("");
    }
  };

  const handleSetUserName = () => {
    setCurrentUser(tempName.trim());
    setUserName(tempName.trim());
    setShowNamePrompt(false);
  };

  const togglePriorityFilter = (p: Priority) => {
    setPriorityFilter((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const columns: TableColumn<Case>[] = [
    {
      key: "client",
      label: "Client Name",
      sortable: true,
      render: (_val, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/cases/${row.id}`);
          }}
          className="text-blue-400 hover:underline font-medium text-left"
        >
          {row.client.fullName}
        </button>
      ),
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (_val, row) => <Badge type="priority" value={row.priority} />,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_val, row) => <Badge type="status" value={row.status} />,
    },
    {
      key: "flags",
      label: "Flags",
      render: (_val, row) =>
        row.flags.length > 0 ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-900/40 text-amber-300">
            {row.flags.length}
          </span>
        ) : null,
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (_val, row) => (
        <span className="text-slate-400">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      key: "assignedTo",
      label: "Assigned To",
      sortable: true,
      render: (_val, row) => (
        <span className={row.assignedTo ? "text-slate-300" : "text-slate-500"}>
          {row.assignedTo || "Unassigned"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_val, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/cases/${row.id}`)}
          >
            View
          </Button>
          {row.status !== "closed" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAssignModalCase(row);
                setAssignName(row.assignedTo || "");
              }}
            >
              Assign
            </Button>
          )}
        </div>
      ),
    },
  ];

  const tabs: { key: Tab; label: string; count: number }[] = [
    {
      key: "inbox",
      label: "Inbox",
      count: cases.filter(tabFilters.inbox).length,
    },
    {
      key: "active",
      label: "Active",
      count: cases.filter(tabFilters.active).length,
    },
    {
      key: "myCases",
      label: "My Cases",
      count: cases.filter(tabFilters.myCases).length,
    },
  ];

  const emptyMessages: Record<Tab, string> = {
    inbox: 'No new referrals. Create one using "New Referral".',
    active: "No active cases.",
    myCases: userName
      ? "No cases assigned to you."
      : "Set your name to see your cases.",
  };

  return (
    <main id="main" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <Button onClick={() => navigate("/intake")}>New Referral</Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700 mb-6" role="tablist">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors min-h-[44px] ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-700 text-slate-300">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* My Cases name prompt */}
      {activeTab === "myCases" && !userName && (
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-400 flex-1">
              Set your name to see cases assigned to you.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setTempName("");
                setShowNamePrompt(true);
              }}
            >
              Set Name
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="search" className="sr-only">
              Search by client name
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 text-sm min-h-[44px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-1">
            {(["low", "medium", "high", "urgent"] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => togglePriorityFilter(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[36px] border ${
                  priorityFilter.includes(p)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700"
                }`}
                aria-pressed={priorityFilter.includes(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="dateFrom" className="text-xs text-slate-400">
              From
            </label>
            <input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 text-sm min-h-[36px]"
            />
            <label htmlFor="dateTo" className="text-xs text-slate-400">
              To
            </label>
            <input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 text-sm min-h-[36px]"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div role="tabpanel">
          <Table
            columns={columns}
            data={filteredCases}
            emptyMessage={emptyMessages[activeTab]}
          />
        </div>
      </Card>

      {/* Assign Modal */}
      <Modal
        isOpen={!!assignModalCase}
        onClose={() => setAssignModalCase(null)}
        title="Assign Case"
        confirmLabel="Assign"
        onConfirm={handleAssign}
      >
        <p className="mb-3">
          Assign{" "}
          <strong>{assignModalCase?.client.fullName}</strong> to a worker:
        </p>
        <input
          type="text"
          value={assignName}
          onChange={(e) => setAssignName(e.target.value)}
          placeholder="Worker name"
          className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 text-sm min-h-[44px]"
          autoFocus
        />
      </Modal>

      {/* Set Name Modal */}
      <Modal
        isOpen={showNamePrompt}
        onClose={() => setShowNamePrompt(false)}
        title="Set Your Name"
        confirmLabel="Save"
        onConfirm={handleSetUserName}
      >
        <p className="mb-3">
          Enter your name to filter the "My Cases" tab.
        </p>
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          placeholder="Your name"
          className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 text-sm min-h-[44px]"
          autoFocus
        />
      </Modal>
    </main>
  );
}
