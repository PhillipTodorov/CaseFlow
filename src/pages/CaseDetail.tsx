import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCases } from "../context/CaseContext";
import { getResponseTimeframe } from "../utils/triage";
import { formatDate, formatDateTime, timeAgo, nowISO } from "../utils/dates";
import { getCurrentUser } from "../utils/storage";
import type { CaseStatus, OutcomeType } from "../types";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";

type DetailTab = "details" | "notes" | "timeline";

const statusTransitions: Record<CaseStatus, CaseStatus[]> = {
  new: ["triaged", "assigned"],
  triaged: ["assigned"],
  assigned: ["in_progress"],
  in_progress: ["closed"],
  closed: [],
};

const outcomeOptions: { value: OutcomeType; label: string }[] = [
  { value: "engaged", label: "Client engaged with service" },
  { value: "declined", label: "Client declined support" },
  { value: "referred_on", label: "Referred to another service" },
  { value: "no_contact", label: "Unable to make contact" },
  { value: "not_eligible", label: "Not eligible for service" },
  { value: "other", label: "Other" },
];

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const { getCaseById, updateCaseStatus, addNote, closeCase } = useCases();

  const [activeTab, setActiveTab] = useState<DetailTab>("details");
  const [noteContent, setNoteContent] = useState("");
  const [noteName, setNoteName] = useState(getCurrentUser());

  // Close case modal
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [outcomeType, setOutcomeType] = useState<OutcomeType>("engaged");
  const [outcomeDetails, setOutcomeDetails] = useState("");

  // Assign modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignName, setAssignName] = useState("");

  const caseData = id ? getCaseById(id) : undefined;

  if (!caseData) {
    return (
      <main id="main" className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <h1 className="text-xl font-semibold text-slate-100 mb-4">
            Case Not Found
          </h1>
          <p className="text-slate-400 mb-4">
            The case you are looking for does not exist.
          </p>
          <Link
            to="/dashboard"
            className="text-blue-400 hover:underline font-medium"
          >
            Back to Dashboard
          </Link>
        </Card>
      </main>
    );
  }

  const responseTime = getResponseTimeframe(caseData.priority);
  const nextStatuses = statusTransitions[caseData.status];

  const handleAddNote = () => {
    if (noteContent.trim() && id) {
      addNote(id, noteContent.trim(), noteName.trim() || undefined);
      setNoteContent("");
    }
  };

  const handleCloseCase = () => {
    if (id) {
      closeCase(id, {
        type: outcomeType,
        details: outcomeDetails.trim() || undefined,
        closedDate: nowISO(),
      });
      setShowCloseModal(false);
    }
  };

  const handleAssign = () => {
    if (id && assignName.trim()) {
      updateCaseStatus(id, "assigned", assignName.trim());
      setShowAssignModal(false);
      setAssignName("");
    }
  };

  const handleStatusChange = (newStatus: CaseStatus) => {
    if (newStatus === "closed") {
      setShowCloseModal(true);
    } else if (newStatus === "assigned") {
      setAssignName(caseData.assignedTo || "");
      setShowAssignModal(true);
    } else if (id) {
      updateCaseStatus(id, newStatus);
    }
  };

  // Build timeline events
  const timelineEvents = [
    {
      type: "created",
      label: "Referral created",
      date: caseData.createdAt,
    },
    ...caseData.notes.map((n) => ({
      type: "note" as const,
      label: `Note added${n.createdBy ? ` by ${n.createdBy}` : ""}`,
      detail: n.content,
      date: n.createdAt,
    })),
    ...(caseData.outcome
      ? [
          {
            type: "closed" as const,
            label: `Case closed — ${
              outcomeOptions.find((o) => o.value === caseData.outcome?.type)
                ?.label || caseData.outcome.type
            }`,
            detail: caseData.outcome.details,
            date: caseData.outcome.closedDate,
          },
        ]
      : []),
  ].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const tabs: { key: DetailTab; label: string }[] = [
    { key: "details", label: "Details" },
    { key: "notes", label: `Notes (${caseData.notes.length})` },
    { key: "timeline", label: "Timeline" },
  ];

  return (
    <main id="main" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="text-sm text-blue-400 hover:underline mb-2 inline-block"
        >
          &larr; Back to Dashboard
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              {caseData.client.fullName}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge type="status" value={caseData.status} />
              <Badge type="priority" value={caseData.priority} />
              <span className="text-sm text-slate-400">
                Score: {caseData.triageScore}/100
              </span>
              <span className="text-sm text-slate-400">
                Response: {responseTime}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {nextStatuses.map((status) => (
              <Button
                key={status}
                variant={status === "closed" ? "danger" : "secondary"}
                size="sm"
                onClick={() => handleStatusChange(status)}
              >
                {status === "closed"
                  ? "Close Case"
                  : status === "assigned"
                  ? "Assign"
                  : `Mark ${status.replace("_", " ")}`}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Flags */}
      {caseData.flags.length > 0 && (
        <div className="space-y-2 mb-6">
          {caseData.flags.map((flag) => (
            <Alert key={flag} type="warning">
              {flag}
            </Alert>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-700 mb-6" role="tablist">
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
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div role="tabpanel">
        {activeTab === "details" && (
          <div className="space-y-6">
            <Card title="Client Details">
              <DefinitionList
                items={[
                  { label: "Full Name", value: caseData.client.fullName },
                  {
                    label: "Date of Birth",
                    value: formatDate(caseData.client.dateOfBirth),
                  },
                  { label: "Phone", value: caseData.client.phone },
                  { label: "Email", value: caseData.client.email },
                  { label: "Address", value: caseData.client.address },
                  { label: "Postcode", value: caseData.client.postcode },
                  {
                    label: "Preferred Contact",
                    value: caseData.client.preferredContact,
                  },
                  {
                    label: "Communication Needs",
                    value: caseData.client.communicationNeeds?.join(", "),
                  },
                  { label: "GP Practice", value: caseData.client.gpPractice },
                  { label: "NHS Number", value: caseData.client.nhsNumber },
                ]}
              />
            </Card>

            <Card title="Referral Information">
              <DefinitionList
                items={[
                  { label: "Source", value: caseData.referral.source },
                  {
                    label: "Referrer Name",
                    value: caseData.referral.referrerName,
                  },
                  {
                    label: "Referrer Organisation",
                    value: caseData.referral.referrerOrganisation,
                  },
                  {
                    label: "Referrer Contact",
                    value: caseData.referral.referrerContact,
                  },
                  {
                    label: "Date Received",
                    value: formatDate(caseData.referral.dateReceived),
                  },
                  {
                    label: "Reasons",
                    value: caseData.referral.reasons?.join(", "),
                  },
                  {
                    label: "Support Requested",
                    value: caseData.referral.supportRequested,
                  },
                ]}
              />
            </Card>

            <Card title="Risk Assessment">
              <DefinitionList
                items={[
                  {
                    label: "Risk to Self",
                    value: caseData.risk.riskToSelf,
                  },
                  {
                    label: "Risk to Others",
                    value: caseData.risk.riskToOthers,
                  },
                  {
                    label: "Risk from Others",
                    value: caseData.risk.riskFromOthers,
                  },
                  {
                    label: "Children in Household",
                    value: caseData.risk.childrenInHousehold ? "Yes" : "No",
                  },
                  {
                    label: "Number of Children",
                    value: caseData.risk.numberOfChildren?.toString(),
                  },
                  {
                    label: "Safeguarding Concerns",
                    value: caseData.risk.safeguardingConcerns ? "Yes" : "No",
                  },
                  {
                    label: "Safeguarding Details",
                    value: caseData.risk.safeguardingDetails,
                  },
                  { label: "Urgency", value: caseData.risk.urgency },
                ]}
              />
            </Card>

            <Card title="Consent">
              <DefinitionList
                items={[
                  {
                    label: "Share Information",
                    value: caseData.consent.shareInformation ? "Yes" : "No",
                  },
                  {
                    label: "Contact Client",
                    value: caseData.consent.contactClient ? "Yes" : "No",
                  },
                  {
                    label: "Preferred Times",
                    value: caseData.consent.preferredTimes?.join(", "),
                  },
                  {
                    label: "Barriers to Engagement",
                    value: caseData.consent.barriersToEngagement,
                  },
                ]}
              />
            </Card>

            {caseData.assignedTo && (
              <Card title="Assignment">
                <p className="text-sm text-slate-300">
                  Assigned to: <strong>{caseData.assignedTo}</strong>
                </p>
              </Card>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-sm font-medium text-slate-300 mb-3">
                Add Note
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={noteName}
                  onChange={(e) => setNoteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 text-sm min-h-[44px]"
                />
                <textarea
                  placeholder="Write a note..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 text-sm resize-vertical"
                />
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!noteContent.trim()}
                >
                  Add Note
                </Button>
              </div>
            </Card>

            {caseData.notes.length === 0 ? (
              <p className="text-center text-slate-400 py-8">
                No notes yet. Add one above.
              </p>
            ) : (
              <div className="space-y-3">
                {[...caseData.notes].reverse().map((note) => (
                  <Card key={note.id}>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {note.createdBy && (
                        <span className="font-medium text-slate-400">
                          {note.createdBy} &middot;{" "}
                        </span>
                      )}
                      {timeAgo(note.createdAt)} &middot;{" "}
                      {formatDateTime(note.createdAt)}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="space-y-0">
            {timelineEvents.map((event, i) => (
              <div key={i} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 ${
                      event.type === "created"
                        ? "bg-brand"
                        : event.type === "closed"
                        ? "bg-slate-400"
                        : "bg-green-500"
                    }`}
                  />
                  {i < timelineEvents.length - 1 && (
                    <div className="w-px flex-1 bg-slate-700 mt-1" />
                  )}
                </div>
                <div className="pb-2">
                  <p className="text-sm font-medium text-slate-300">
                    {event.label}
                  </p>
                  {event.detail && (
                    <p className="text-sm text-slate-400 mt-1">
                      {event.detail}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDateTime(event.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Close Case Modal */}
      <Modal
        isOpen={showCloseModal}
        onClose={() => setShowCloseModal(false)}
        title="Close Case"
        confirmLabel="Close Case"
        confirmVariant="danger"
        onConfirm={handleCloseCase}
      >
        <div className="space-y-3">
          <div>
            <label
              htmlFor="outcome-type"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Outcome
            </label>
            <select
              id="outcome-type"
              value={outcomeType}
              onChange={(e) =>
                setOutcomeType(e.target.value as OutcomeType)
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 text-sm min-h-[44px]"
            >
              {outcomeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="outcome-details"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Details (optional)
            </label>
            <textarea
              id="outcome-details"
              value={outcomeDetails}
              onChange={(e) => setOutcomeDetails(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 text-sm resize-vertical"
            />
          </div>
        </div>
      </Modal>

      {/* Assign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Case"
        confirmLabel="Assign"
        onConfirm={handleAssign}
      >
        <p className="mb-3">Assign this case to a worker:</p>
        <input
          type="text"
          value={assignName}
          onChange={(e) => setAssignName(e.target.value)}
          placeholder="Worker name"
          className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 text-sm min-h-[44px]"
          autoFocus
        />
      </Modal>
    </main>
  );
}

// Definition list helper component
function DefinitionList({
  items,
}: {
  items: { label: string; value?: string }[];
}) {
  const visibleItems = items.filter(
    (item) => item.value && item.value.trim() !== ""
  );

  if (visibleItems.length === 0) {
    return (
      <p className="text-sm text-slate-400">No information recorded.</p>
    );
  }

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
      {visibleItems.map((item) => (
        <div key={item.label}>
          <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {item.label}
          </dt>
          <dd className="text-sm text-slate-300 mt-0.5">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
