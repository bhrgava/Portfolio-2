
export enum SlideId {
  TITLE = 'title',
  OBSERVABILITY = 'observability',
  PREMISE = 'premise',
  HOTSPOT = 'hotspot',
  METHODOLOGY = 'methodology',
  ACTION = 'action',
  IMPACT = 'impact',
  IMPLEMENTATION = 'implementation',
  SOLUTION = 'solution',
}

export interface SlideData {
  id: SlideId;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  textDelay?: number;
  link?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  year: string;
  slides: SlideData[];
}
