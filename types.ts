
export enum SlideId {
  TITLE = 'title',
  OBSERVABILITY = 'observability',
  PREMISE = 'premise',
  HOTSPOT = 'hotspot',
  METHODOLOGY = 'methodology',
  CATALYST = 'catalyst',
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
