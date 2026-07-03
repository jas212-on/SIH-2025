export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "te", name: "తెలుగు" },
  { code: "ta", name: "தமிழ்" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "ml", name: "മലയാളം" },
];

export const USER_ROLES = [
  {
    id: "farmer",
    title: "Farmer",
    icon: "farmer",
    description: "Practical recommendations for agricultural water management",
    focus: "Get actionable insights for crop planning, irrigation guidance, and well management",
  },
  {
    id: "policymaker",
    title: "Policymaker",
    icon: "policymaker",
    description: "Policy insights and governance recommendations",
    focus: "Access policy-relevant data, regulatory insights, and governance recommendations",
  },
  {
    id: "researcher",
    title: "Researcher",
    icon: "researcher",
    description: "Detailed data and technical analysis",
    focus: "Comprehensive datasets, methodologies, and detailed technical analysis",
  },
  {
    id: "general",
    title: "General User",
    icon: "general",
    description: "General information and basic insights",
    focus: "Easy-to-understand information about groundwater resources",
  },
];

export const METRICS = [
  { id: "rainfall",     label: "Rainfall",              unit: "mm" },
  { id: "recharge",     label: "Groundwater Recharge",  unit: "ham" },
  { id: "draft",        label: "Groundwater Draft",     unit: "ham" },
  { id: "availability", label: "Water Availability",    unit: "ham" },
  { id: "groundwater",  label: "Groundwater Resources", unit: "ham" },
];

export const ALL_STATES = [
  "ANDHRA PRADESH","ARUNACHAL PRADESH","ASSAM","BIHAR","CHHATTISGARH",
  "GOA","GUJARAT","HARYANA","HIMACHAL PRADESH","JHARKHAND","KARNATAKA",
  "KERALA","MADHYA PRADESH","MAHARASHTRA","MANIPUR","MEGHALAYA","MIZORAM",
  "NAGALAND","ODISHA","PUNJAB","RAJASTHAN","SIKKIM","TAMILNADU","TELANGANA",
  "TRIPURA","UTTAR PRADESH","UTTARAKHAND","WEST BENGAL","DELHI",
  "JAMMU AND KASHMIR","LADAKH",
];

export const KERALA_DISTRICTS = [
  "ALAPPUZHA","ERNAKULAM","IDUKKI","KANNUR","KASARGOD",
  "KOLLAM","KOTTAYAM","KOZHIKKODE","MALAPPURAM","PALAKKAD",
  "PATHANAMTHITTA","THIRUVANANTHAPURAM","THRISSUR","WAYANAD",
];

export const AVAILABLE_YEARS = [2023, 2024];

export const CHART_TYPES = [
  { id: "bar",      label: "Bar Chart",      compatible: ["state","district","yearly"] },
  { id: "line",     label: "Line Chart",     compatible: ["yearly"] },
  { id: "pie",      label: "Pie Chart",      compatible: ["state","district"] },
  { id: "doughnut", label: "Doughnut Chart", compatible: ["state","district"] },
  { id: "radar",    label: "Radar Chart",    compatible: ["metric"] },
];

export const COMPARISON_TYPES = [
  { id: "state",    label: "State Comparison" },
  { id: "district", label: "District Comparison" },
  { id: "yearly",   label: "Yearly Trends" },
  { id: "metric",   label: "Multi-Metric" },
];
