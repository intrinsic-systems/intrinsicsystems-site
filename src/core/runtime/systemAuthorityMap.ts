export const AUTHORITY_SOURCES = [
  "AMS - SAP",
  "AMS - IBM Maximo",
  "AMS - Hexagon EAM",
  "AMS - Infor EAM",
  "AMS - Ellipse",
  "AMS - Cityworks",
  "AMS - Maintenix",
  "AMS - Oracle eAM",

  "CMMS - Fiix",
  "CMMS - UpKeep",
  "CMMS - Limble",
  "CMMS - Hippo",

  "GIS - Esri ArcGIS",
  "GIS - ArcGIS Utility Network",
  "GIS - Smallworld",
  "GIS - QGIS",
  "GIS - MapInfo",
  "GIS - Bentley OpenCities",

  "BIM - Autodesk Revit",
  "BIM - Navisworks",
  "BIM - Bentley OpenBuildings",
  "BIM - IFC Model",
  "BIM - Digital Twin",

  "PMS - Primavera P6",
  "PMS - Microsoft Project",
  "CMS - Aconex",
  "CMS - Autodesk Construction Cloud",
  "CMS - BIM360",
  "CMS - Procore",

  "DMS - SharePoint",
  "DMS - Objective",
  "DMS - OpenText",
  "DMS - TRIM",
  "DMS - Documentum",

  "FIELD - Esri Field Maps",
  "FIELD - Survey123",
  "FIELD - Fulcrum",
  "FIELD - Collector",
  "FIELD - Custom Mobile App",
  "FIELD - Manual Inspection",

  "ERP - SAP Finance",
  "ERP - Oracle ERP",
  "ERP - TechnologyOne",
  "ERP - JD Edwards",

  "SCADA - AVEVA",
  "SCADA - Wonderware",
  "SCADA - Ignition",
  "SCADA - Siemens WinCC",
  "SCADA - OSI PI",

  "BI - Power BI",
  "BI - Tableau",
  "BI - Qlik",
  "AI - OASIS Runtime",

  "AUTHORITY - Utility Register",
  "AUTHORITY - Regulator",
  "AUTHORITY - Cadastre",
  "AUTHORITY - Land Registry",

  "HANDOVER - Project Delivery",
  "HANDOVER - As-Built Validation",
  "HANDOVER - Commissioning",

  "LEGACY - Spreadsheet",
  "LEGACY - Access Database",
  "LEGACY - Unknown Source",
  "LEGACY - Archived System",
] as const;

export type AuthoritySource = (typeof AUTHORITY_SOURCES)[number];

export type AttributeAuthority = {
  attribute: string;
  authoritativeSource: AuthoritySource;
  confidenceWeight: number;
};

export const systemAuthorityMap: AttributeAuthority[] = [
  {
    attribute: "geometry",
    authoritativeSource: "GIS - Esri ArcGIS",
    confidenceWeight: 0.95,
  },
  {
    attribute: "network-topology",
    authoritativeSource: "GIS - ArcGIS Utility Network",
    confidenceWeight: 0.94,
  },
  {
    attribute: "asset-register",
    authoritativeSource: "AMS - IBM Maximo",
    confidenceWeight: 0.9,
  },
  {
    attribute: "maintenance-history",
    authoritativeSource: "AMS - IBM Maximo",
    confidenceWeight: 0.9,
  },
  {
    attribute: "condition",
    authoritativeSource: "FIELD - Manual Inspection",
    confidenceWeight: 0.92,
  },
  {
    attribute: "field-observations",
    authoritativeSource: "FIELD - Esri Field Maps",
    confidenceWeight: 0.88,
  },
  {
    attribute: "design-model",
    authoritativeSource: "BIM - Autodesk Revit",
    confidenceWeight: 0.86,
  },
  {
    attribute: "as-built-model",
    authoritativeSource: "BIM - IFC Model",
    confidenceWeight: 0.84,
  },
  {
    attribute: "handover-status",
    authoritativeSource: "HANDOVER - Project Delivery",
    confidenceWeight: 0.82,
  },
  {
    attribute: "commissioning-status",
    authoritativeSource: "HANDOVER - Commissioning",
    confidenceWeight: 0.86,
  },
  {
    attribute: "financial-value",
    authoritativeSource: "ERP - SAP Finance",
    confidenceWeight: 0.85,
  },
  {
    attribute: "work-order-cost",
    authoritativeSource: "ERP - SAP Finance",
    confidenceWeight: 0.82,
  },
  {
    attribute: "document-record",
    authoritativeSource: "DMS - SharePoint",
    confidenceWeight: 0.78,
  },
  {
    attribute: "regulatory-record",
    authoritativeSource: "AUTHORITY - Regulator",
    confidenceWeight: 0.93,
  },
  {
    attribute: "land-parcel",
    authoritativeSource: "AUTHORITY - Cadastre",
    confidenceWeight: 0.96,
  },
  {
    attribute: "operational-telemetry",
    authoritativeSource: "SCADA - OSI PI",
    confidenceWeight: 0.91,
  },
  {
    attribute: "analytics-output",
    authoritativeSource: "BI - Power BI",
    confidenceWeight: 0.76,
  },
  {
    attribute: "runtime-inference",
    authoritativeSource: "AI - OASIS Runtime",
    confidenceWeight: 0.7,
  },
  {
    attribute: "legacy-record",
    authoritativeSource: "LEGACY - Spreadsheet",
    confidenceWeight: 0.55,
  },
];