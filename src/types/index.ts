export interface Scripture {
  reference: string;
  text: string;
  translation?: string;
}

export interface DeCaussadeExcerpt {
  book: string;
  chapter: string;
  section: string;
  excerpt: string;
  full_chapter_slug: string;
  section_id: string;
}

export interface ProvidenceDay {
  day: number;
  theme: string;
  phase: 1 | 2 | 3 | 4;
  phaseTitle: string;
  scripture: Scripture;
  de_caussade: DeCaussadeExcerpt;
  reflection_prompts: string[];
  key_quote: string;
}

export interface ChapterSection {
  id: string;
  section_number?: number;
  title: string;
  paragraphs: string[];
}

export interface FullChapter {
  slug: string;
  book: string;
  book_title: string;
  chapter_number: number;
  chapter_title: string;
  sections: ChapterSection[];
}

export interface JournalEntry {
  day: number;
  responses: Record<number, string>; // prompt index -> text
  freeformNotes?: string;
  completed: boolean;
  completedAt?: string;
  updatedAt: string;
}

export interface SurrenderedBurden {
  id: string;
  day: number;
  text: string;
  surrenderedAt: string;
  dayTheme: string;
}

export interface UserJournalState {
  version: number;
  currentDay: number;
  completedDays: number[];
  entries: Record<number, JournalEntry>;
  burdens: SurrenderedBurden[];
  themeMode?: 'light' | 'sepia' | 'dark';
}
