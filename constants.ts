
import { CaseStudy, SlideId } from './types';

const SPANNER_SLIDES = [
  {
    id: SlideId.TITLE,
    title: "Project Overview",
    subtitle: "Spanner Hotspots Case Study",
    description: "Revealing the invisible mechanics of database latency.",
    details: [
      "UX Research",
      "Data Visualization",
      "System Design",
    ],
    textDelay: 2.5,
  },
  {
    id: SlideId.OBSERVABILITY,
    title: "The Context",
    subtitle: "A crucial capability.",
    description: "Before diving into the problem, it is essential to understand the goal: providing clarity into complex, distributed systems where issues are often invisible.",
    details: [
      "System Health",
      "Performance Metrics",
      "Root Cause Analysis",
    ],
    textDelay: 3.5,
  },
  {
    id: SlideId.PREMISE,
    title: "The Distributed Premise",
    subtitle: "Ideally, 1,000 lanes moving fast.",
    description: "Imagine a database like a grocery store with 1,000 checkout lanes. Spanner is distributed: it splits customers (data) evenly across all lanes so everyone moves instantly.",
    details: [
      "Linear Scalability",
      "Automatic Sharding",
      "Balanced Load",
    ],
    textDelay: 2.5,
  },
  {
    id: SlideId.HOTSPOT,
    title: "The Anomaly: Hotspotting",
    subtitle: "When logic breaks.",
    description: "What if all 1,000 customers try to squeeze into Lane #1? The other 999 lanes stand empty while the first collapses. The store grinds to a halt.",
    details: [
      "Uneven Access Patterns",
      "System Overload",
      "Invisible Imbalance",
    ],
    textDelay: 2.5,
  },
  {
    id: SlideId.METHODOLOGY,
    title: "The Process",
    subtitle: "Research Timeline",
    description: "A rigorous, multi-phase approach to understanding the invisible.",
    details: [],
    textDelay: 3.0,
  },
  {
    id: SlideId.ACTION,
    title: "The Action",
    subtitle: "Qualitative Foundational Research.",
    description: "Existing tools weren't being used. I conducted a qualitative study, interviewing users across Spanner, Bigtable, and Firestore to understand their troubleshooting journey.",
    details: [
      "User Interviews",
      "Convenience Sampling",
      "Journey Mapping",
    ],
    textDelay: 2.5,
  },
  {
    id: SlideId.IMPACT,
    title: "The Outcome & Impact",
    subtitle: "Defining the solution.",
    description: "The research uncovered critical gaps across the user journey. While users knew 'something' was wrong, they lacked the specific metrics to detect, investigate, or fix hotspots.",
    details: [
      "Detection: Too Vague",
      "Investigation: No Data",
      "Fixing: Blocked",
    ],
    textDelay: 3.5,
  },
  {
    id: SlideId.IMPLEMENTATION,
    title: "The Execution",
    subtitle: "Implementation Timeline",
    description: "Translating insights into engineering reality through cross-functional collaboration.",
    details: [],
    textDelay: 3.0,
  },
  {
    id: SlideId.SOLUTION,
    title: "The Solution",
    subtitle: "Hotspot Insights",
    description: "The research resulted in a new page called 'Hotspot Insights'. This feature allows users to determine whether hotspots need their intervention and to identify problematic hot splits, directly addressing the visibility gaps identified in our user journey audit.",
    details: [
      "Visualized Hot Splits",
      "Actionable Metrics",
      "Gap Resolved",
    ],
    textDelay: 2.0,
    link: "https://docs.cloud.google.com/spanner/docs/find-hotspots-in-database"
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'spanner',
    title: 'Spanner Hotspots',
    year: '2022',
    slides: SPANNER_SLIDES
  }
];
