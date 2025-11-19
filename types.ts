export enum SlideId {
  PREMISE = 'premise',
  HOTSPOT = 'hotspot',
  CATALYST = 'catalyst',
  ACTION = 'action',
  IMPACT = 'impact',
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