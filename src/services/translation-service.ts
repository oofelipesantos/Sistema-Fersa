import type { Locale } from "@/i18n/routing";

export interface TranslationService {
  translate(text: string, from: Locale, to: Locale): Promise<string>;
}

export class StubTranslationService implements TranslationService {
  async translate(text: string, from: Locale, to: Locale) {
    void from;
    void to;
    return text;
  }
}
