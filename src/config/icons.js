import {
  Wheat,
  Landmark,
  Microscope,
  User,
} from "lucide-react";

// Central lookup so config data (constants.js) can reference icons by string key
// instead of importing lucide components directly into plain data files.
export const ROLE_ICONS = {
  farmer: Wheat,
  policymaker: Landmark,
  researcher: Microscope,
  general: User,
};
