import daysData from './providence_30_days.json';
import chaptersData from './full_chapters.json';
import type { ProvidenceDay, FullChapter } from '../types';

export const PROVIDENCE_DAYS: ProvidenceDay[] = daysData as ProvidenceDay[];
export const FULL_CHAPTERS: FullChapter[] = chaptersData as FullChapter[];

export function getDayData(dayNumber: number): ProvidenceDay {
  const found = PROVIDENCE_DAYS.find(d => d.day === dayNumber);
  return found || PROVIDENCE_DAYS[0];
}

export function getChapterBySlug(slug: string): FullChapter | undefined {
  return FULL_CHAPTERS.find(c => c.slug === slug);
}

export interface PhaseGroup {
  phaseNumber: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  dayRange: string;
  days: ProvidenceDay[];
}

export const PHASES: PhaseGroup[] = [
  {
    phaseNumber: 1,
    title: "Understanding Divine Action",
    subtitle: "The Sacrament of the Present Moment and the Hidden Hand of God",
    dayRange: "Days 1–7",
    days: PROVIDENCE_DAYS.filter(d => d.phase === 1),
  },
  {
    phaseNumber: 2,
    title: "The Heart of Abandonment",
    subtitle: "Consenting with the Fiat and Walking in Pure Trust",
    dayRange: "Days 8–15",
    days: PROVIDENCE_DAYS.filter(d => d.phase === 2),
  },
  {
    phaseNumber: 3,
    title: "Freedom from Self-Direction",
    subtitle: "Relinquishing Human Calculations and False Security",
    dayRange: "Days 16–22",
    days: PROVIDENCE_DAYS.filter(d => d.phase === 3),
  },
  {
    phaseNumber: 4,
    title: "Consolation & Interior Freedom",
    subtitle: "The Fire of Divine Purification and Perpetual Peace",
    dayRange: "Days 23–30",
    days: PROVIDENCE_DAYS.filter(d => d.phase === 4),
  },
];
