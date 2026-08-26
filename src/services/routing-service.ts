import type { Locale, RoutingContext, RoutingResult } from "@/types/domain";

const demoBranches: {
  id: string;
  name: string;
  locales: Locale[];
  countries: string[];
}[] = [
  {
    id: "branch-latam",
    name: "Latin America demo branch",
    locales: ["pt-BR", "es", "en"],
    countries: ["Brasil", "México", "Argentina", "Chile"]
  },
  {
    id: "branch-global",
    name: "Global demo branch",
    locales: ["en"],
    countries: []
  }
];

export class RoutingService {
  async route(context: RoutingContext): Promise<RoutingResult> {
    const branch = demoBranches.find(
      (candidate) =>
        candidate.locales.includes(context.locale) &&
        (candidate.countries.length === 0 ||
          candidate.countries.includes(context.country))
    );
    return branch
      ? {
          branchId: branch.id,
          branchName: branch.name,
          confidence: 0.82,
          reason: "Locale, country and demo branch capability match."
        }
      : {
          confidence: 0.45,
          reason: "No exact demo capability match; manual triage is required."
        };
  }
}
