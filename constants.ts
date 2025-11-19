import { SlideData, SlideId } from './types';

export const SLIDES: SlideData[] = [
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
    textDelay: 1.0,
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
    textDelay: 1.0,
  },
  {
    id: SlideId.CATALYST,
    title: "The Catalyst",
    subtitle: "Latency without clear cause.",
    description: "Users reported high latency and stalled operations but couldn't find the root cause. To them, 'the store was slow,' but the reality was a hidden hotspot.",
    details: [
      "Spike in Bug Reports",
      "Unresolved Tickets",
      "High Read/Write Latency",
    ],
    textDelay: 0.8,
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
    textDelay: 1.5,
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
    textDelay: 2.5,
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