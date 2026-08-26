import type { KnowledgeBaseRepository } from "@/repositories/contracts";
import { createSupabaseClient } from "@/lib/supabase";
import type { IssueCategory, KnownIssue, Locale } from "@/types/domain";

type CategoryRow = {
  id: string;
  issue_category_translations: { locale: Locale; name: string }[];
};
type IssueRow = {
  id: string;
  product_id: string;
  category_id: string;
  known_issue_translations: {
    locale: Locale;
    title: string;
    description: string;
  }[];
  troubleshooting_steps: {
    id: string;
    step_order: number;
    requires_confirmation: boolean;
    troubleshooting_step_translations: {
      locale: Locale;
      title: string;
      description: string;
    }[];
  }[];
};

export class SupabaseKnowledgeBaseRepository implements KnowledgeBaseRepository {
  private readonly client = createSupabaseClient();
  async listCategories(): Promise<IssueCategory[]> {
    const { data, error } = await this.client
      .from("issue_categories")
      .select("id, issue_category_translations(locale, name)")
      .eq("active", true);
    if (error) throw error;
    return ((data ?? []) as unknown as CategoryRow[]).map(
      (row) =>
        ({
          id: row.id,
          translations: Object.fromEntries(
            row.issue_category_translations.map((item) => [
              item.locale,
              item.name
            ])
          )
        }) as IssueCategory
    );
  }
  async listKnownIssues(productId: string): Promise<KnownIssue[]> {
    const { data, error } = await this.client
      .from("known_issues")
      .select(
        "id, product_id, category_id, known_issue_translations(locale, title, description), troubleshooting_steps(id, step_order, requires_confirmation, troubleshooting_step_translations(locale, title, description))"
      )
      .eq("product_id", productId)
      .eq("active", true);
    if (error) throw error;
    return ((data ?? []) as unknown as IssueRow[]).map(
      (row) =>
        ({
          id: row.id,
          productId: row.product_id,
          categoryId: row.category_id,
          translations: Object.fromEntries(
            row.known_issue_translations.map((item) => [
              item.locale,
              { title: item.title, description: item.description }
            ])
          ),
          steps: row.troubleshooting_steps.map((step) => ({
            id: step.id,
            order: step.step_order,
            requiresConfirmation: step.requires_confirmation,
            title: Object.fromEntries(
              step.troubleshooting_step_translations.map((item) => [
                item.locale,
                item.title
              ])
            ),
            description: Object.fromEntries(
              step.troubleshooting_step_translations.map((item) => [
                item.locale,
                item.description
              ])
            )
          }))
        }) as KnownIssue
    );
  }
}
