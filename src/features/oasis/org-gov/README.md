# ORG Governance ECharts Drop-in Files

## Included files
- `orgGovTypes.ts`
- `orgGovSunburst.ts`
- `orgGovMock.ts`
- `OrgGovRadial.tsx`
- `OrgGovDetailPanel.tsx`
- `OrgGovExecutiveView.tsx`

## Dependencies
Install:
```bash
npm install echarts echarts-for-react
```

## Suggested placement
Put these files in a feature folder such as:
```text
src/features/oasis/org-gov/
```

## Usage
Import the page-level component:
```tsx
import OrgGovExecutiveView from "./features/oasis/org-gov/OrgGovExecutiveView";

export default function App() {
  return <OrgGovExecutiveView />;
}
```

## What this gives you
- Executive radial using ECharts sunburst
- Mode toggle for current / benchmark / target / variance
- Click-through from element to detail panel
- Question-level driver and evidence display in the side panel
- Mock ORG domain data ready for replacement with API data

## Replace mock data with API data
Replace `orgGovMock` with your fetched domain object matching `DomainNode`.

## Recommended next integration step
1. Replace mock data with your engineered ORG domain JSON
2. Add benchmark and target sources
3. Add evidence panel actions
4. Add export fallback for report mode
