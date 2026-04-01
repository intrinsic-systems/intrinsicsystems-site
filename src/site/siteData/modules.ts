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
    description: "Assessment and governance intelligence that establishes a defensible enterprise capability baseline across strategy, governance, lifecycle decision-making, and performance integration.",
  },
  {
    slug: "pulse",
    title: "PULSE",
    icon: pulseIcon,
    description: "Operational performance visibility and feedback loops to detect drift, surface systemic risk, and support continuous improvement.",
  },
  {
    slug: "horizon",
    title: "HORIZON",
    icon: horizonIcon,
    description: "Strategic planning and future-state modelling to test scenarios, evaluate investment horizons, and guide long-range capability uplift.",
  },
  {
    slug: "pathways",
    title: "PATHWAYS",
    icon: pathwaysIcon,
    description: "Structured uplift pathways that translate diagnostic insight into prioritised actions, work programs, and capability enablement.",
  },
  {
    slug: "nexus",
    title: "NEXUS",
    icon: nexusIcon,
    description: "Integration and interoperability spine to connect systems, normalise evidence flows, and enable consistent decision support.",
  },
  {
    slug: "atlas",
    title: "ATLAS",
    icon: atlasIcon,
    description: "Spatial enablement and location intelligence to strengthen context, visibility, and portfolio decision-making across places and assets.",
  },
] as const;