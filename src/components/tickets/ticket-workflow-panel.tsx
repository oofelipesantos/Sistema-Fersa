"use client";

import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  MessageSquareText,
  UserRoundCheck,
  Wrench
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/auth-context";
import { getTicketRepository } from "@/repositories/repository-factory";
import type {
  TechnicianSummary,
  Ticket,
  TicketStatus,
  TicketWorkflowAction
} from "@/types/domain";

const supportStatuses: TicketStatus[] = [
  "NEW",
  "WAITING_SUPPORT",
  "IN_PROGRESS",
  "WAITING_CUSTOMER"
];
const technicianStatuses: TicketStatus[] = [
  "WAITING_TECHNICIAN",
  "TECHNICIAN_ASSIGNED",
  "VISIT_REQUIRED",
  "VISIT_SCHEDULED"
];

export function TicketWorkflowPanel({
  ticket,
  onChange
}: {
  ticket: Ticket;
  onChange: (ticket: Ticket) => void;
}) {
  const t = useTranslations("workflow");
  const ticketT = useTranslations("ticket");
  const { session } = useAuth();
  const [note, setNote] = useState("");
  const [technicians, setTechnicians] = useState<TechnicianSummary[]>([]);
  const [technicianId, setTechnicianId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [pending, setPending] = useState<string>();
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    text: string;
  }>();
  const role = session?.user.role;
  const canCoordinate = role === "SUPPORT" || role === "ADMIN";
  const closed = ticket.status === "RESOLVED" || ticket.status === "CANCELLED";

  useEffect(() => {
    if (!canCoordinate || technicians.length) return;
    void getTicketRepository()
      .listTechnicians()
      .then((items) => {
        setTechnicians(items);
        setTechnicianId(
          items.find((item) => item.availability === "AVAILABLE")?.id ??
            items[0]?.id ??
            ""
        );
      })
      .catch(() =>
        setFeedback({ tone: "error", text: t("loadTechniciansError") })
      );
  }, [canCoordinate, t, technicians.length]);

  const activeStep = technicianStatuses.includes(ticket.status)
    ? 2
    : ticket.status === "RESOLVED"
      ? 3
      : supportStatuses.includes(ticket.status)
        ? 1
        : 0;
  const steps = [
    { label: t("stepCustomer"), icon: MessageSquareText },
    { label: t("stepSupport"), icon: ClipboardCheck },
    { label: t("stepTechnician"), icon: Wrench },
    { label: t("stepResolution"), icon: CheckCircle2 }
  ];

  async function run(key: string, action: TicketWorkflowAction) {
    setFeedback(undefined);
    setPending(key);
    try {
      const updated = await getTicketRepository().applyWorkflow(
        ticket.id,
        action
      );
      onChange(updated);
      setNote("");
      setFeedback({ tone: "success", text: t("actionSaved") });
    } catch {
      setFeedback({ tone: "error", text: t("actionError") });
    } finally {
      setPending(undefined);
    }
  }

  return (
    <Card className="border-navy-600/30">
      <CardHeader className="border-b bg-navy-50">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-navy-700">
              {t("eyebrow")}
            </p>
            <h2 className="mt-1 text-lg font-bold">{t("title")}</h2>
            <p className="mt-1 text-sm text-slate-600">{t("subtitle")}</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-navy-700 shadow-sm">
            {ticketT(`status_${ticket.status}`)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-5">
        <ol
          className="grid gap-2 sm:grid-cols-4"
          aria-label={t("journeyLabel")}
        >
          {steps.map(({ label, icon: Icon }, index) => {
            const complete = index < activeStep || ticket.status === "RESOLVED";
            const active = index === activeStep && ticket.status !== "RESOLVED";
            return (
              <li
                className={`rounded-lg border p-3 ${
                  complete
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : active
                      ? "border-navy-600 bg-navy-50 text-navy-900"
                      : "bg-white text-slate-500"
                }`}
                key={label}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden />
                  <span className="text-sm font-bold">{label}</span>
                </div>
              </li>
            );
          })}
        </ol>

        {feedback && (
          <p
            className={`rounded-lg border p-3 text-sm font-semibold ${
              feedback.tone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
            role="status"
          >
            {feedback.text}
          </p>
        )}

        {closed ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-bold text-emerald-900">{t("closedTitle")}</p>
            <p className="mt-1 text-sm text-emerald-800">
              {ticket.resolutionSummary ?? t("closedDescription")}
            </p>
            {canCoordinate && ticket.status === "RESOLVED" && (
              <div className="mt-4">
                <Textarea
                  onChange={(event) => setNote(event.target.value)}
                  placeholder={t("reopenPlaceholder")}
                  value={note}
                />
                <Button
                  className="mt-3"
                  disabled={!note.trim() || Boolean(pending)}
                  onClick={() =>
                    run("reopen", { type: "REOPEN", reason: note })
                  }
                  variant="outline"
                >
                  {t("reopen")}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-bold" htmlFor="workflow-note">
                {t("noteLabel")}
              </label>
              <Textarea
                className="mt-1.5"
                id="workflow-note"
                onChange={(event) => setNote(event.target.value)}
                placeholder={t("notePlaceholder")}
                value={note}
              />
              <p className="mt-1 text-xs text-slate-500">{t("noteHint")}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {canCoordinate &&
                (!ticket.assigneeName ||
                  ["NEW", "WAITING_SUPPORT"].includes(ticket.status)) && (
                  <Button
                    disabled={Boolean(pending)}
                    onClick={() => run("take", { type: "TAKE" })}
                    variant="outline"
                  >
                    <UserRoundCheck className="h-4 w-4" aria-hidden />
                    {t("take")}
                  </Button>
                )}
              <Button
                disabled={!note.trim() || Boolean(pending)}
                onClick={() =>
                  run("reply", {
                    type: "REPLY",
                    message: note,
                    visibility: "CUSTOMER"
                  })
                }
                variant="outline"
              >
                <MessageSquareText className="h-4 w-4" aria-hidden />
                {t("reply")}
              </Button>
              {canCoordinate && (
                <Button
                  disabled={!note.trim() || Boolean(pending)}
                  onClick={() =>
                    run("request", {
                      type: "REQUEST_INFORMATION",
                      message: note
                    })
                  }
                  variant="outline"
                >
                  {t("requestInformation")}
                </Button>
              )}
              <Button
                disabled={!note.trim() || Boolean(pending)}
                onClick={() =>
                  run("resolve", { type: "RESOLVE", resolution: note })
                }
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                {role === "TECHNICIAN"
                  ? t("resolveTechnician")
                  : t("resolveSupport")}
              </Button>
            </div>

            {canCoordinate && (
              <div className="rounded-xl border bg-steel-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="rounded-lg bg-white p-2 text-navy-700 shadow-sm">
                    <Wrench className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold">{t("escalateTitle")}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {t("escalateDescription")}
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                      <Select
                        aria-label={t("selectTechnician")}
                        onChange={(event) =>
                          setTechnicianId(event.target.value)
                        }
                        value={technicianId}
                      >
                        {technicians.map((technician) => (
                          <option key={technician.id} value={technician.id}>
                            {technician.fullName} · {technician.region} ·{" "}
                            {technician.activeTicketCount} {t("activeCases")}
                          </option>
                        ))}
                      </Select>
                      <Button
                        disabled={!technicianId || Boolean(pending)}
                        onClick={() =>
                          run("assign", {
                            type: "ASSIGN_TECHNICIAN",
                            technicianId,
                            note: note.trim() || undefined
                          })
                        }
                      >
                        {t("assignTechnician")}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(role === "TECHNICIAN" || canCoordinate) && (
              <div className="rounded-xl border bg-white p-4">
                <h3 className="font-bold">{t("visitTitle")}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {t("visitDescription")}
                </p>
                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <label className="min-w-60 flex-1 text-sm font-bold">
                    {t("visitDate")}
                    <input
                      className="mt-1 h-12 w-full rounded-lg border bg-white px-3 text-base"
                      min="2026-09-01T08:00"
                      onChange={(event) => setScheduledAt(event.target.value)}
                      type="datetime-local"
                      value={scheduledAt}
                    />
                  </label>
                  <Button
                    disabled={!note.trim() || Boolean(pending)}
                    onClick={() =>
                      run("visit-required", {
                        type: "MARK_VISIT_REQUIRED",
                        note
                      })
                    }
                    variant="outline"
                  >
                    {t("markVisitRequired")}
                  </Button>
                  <Button
                    disabled={!scheduledAt || Boolean(pending)}
                    onClick={() =>
                      run("schedule", {
                        type: "SCHEDULE_VISIT",
                        scheduledAt,
                        technicianId:
                          canCoordinate && technicianId
                            ? technicianId
                            : undefined,
                        note: note.trim() || undefined
                      })
                    }
                    variant="outline"
                  >
                    {t("scheduleVisit")}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
