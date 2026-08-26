import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { TicketPriority, TicketStatus } from "@/types/domain";

const statusTone: Record<
  TicketStatus,
  "blue" | "green" | "amber" | "red" | "neutral"
> = {
  NEW: "blue",
  WAITING_SUPPORT: "amber",
  IN_PROGRESS: "blue",
  WAITING_CUSTOMER: "amber",
  WAITING_TECHNICIAN: "amber",
  TECHNICIAN_ASSIGNED: "blue",
  VISIT_REQUIRED: "red",
  VISIT_SCHEDULED: "blue",
  RESOLVED: "green",
  CANCELLED: "neutral"
};
const priorityTone: Record<
  TicketPriority,
  "blue" | "green" | "amber" | "red" | "neutral"
> = { LOW: "neutral", MEDIUM: "blue", HIGH: "amber", CRITICAL: "red" };
export function StatusBadge({ status }: { status: TicketStatus }) {
  const t = useTranslations("ticket");
  return <Badge tone={statusTone[status]}>{t(`status_${status}`)}</Badge>;
}
export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const t = useTranslations("ticket");
  return (
    <Badge tone={priorityTone[priority]}>{t(`priority_${priority}`)}</Badge>
  );
}
