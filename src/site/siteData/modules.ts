import coreIcon from "../../assets/modules/core.png";
import pulseIcon from "../../assets/modules/pulse.png";
import horizonIcon from "../../assets/modules/horizon.png";
import pathwaysIcon from "../../assets/modules/pathways.png";
import nexusIcon from "../../assets/modules/nexus.png";
import atlasIcon from "../../assets/modules/atlas.png";

export const MODULES = [
  {
    slug: "core",
    title: "CORE",
    icon: coreIcon,
    description: "The initial experience: an evidence-aware baseline that helps an organisation understand its present capability before deciding what should change.",
  },
  {
    slug: "pulse",
    title: "PULSE",
    icon: pulseIcon,
    description: "A lifecycle service for maintaining capability awareness as evidence, conditions, performance, and priorities change.",
  },
  {
    slug: "horizon",
    title: "HORIZON",
    icon: horizonIcon,
    description: "A lifecycle service that extends organisational understanding towards future conditions, choices, and consequences.",
  },
  {
    slug: "pathways",
    title: "PATHWAYS",
    icon: pathwaysIcon,
    description: "A lifecycle service that translates understanding into contextual, prioritised courses of improvement.",
  },
  {
    slug: "nexus",
    title: "NEXUS",
    icon: nexusIcon,
    description: "A cross-cutting relationship-intelligence dimension revealing how capabilities, evidence, decisions, and organisational elements affect one another.",
  },
  {
    slug: "atlas",
    title: "ATLAS",
    icon: atlasIcon,
    description: "A cross-cutting context-intelligence dimension connecting capability to operating, asset, portfolio, and spatial context.",
  },
] as const;
