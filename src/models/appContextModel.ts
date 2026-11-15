import type { UserRole } from "../types/userRoleType";

export interface AppContextData {
  cycle: string;
  setCycle: (cycle: string) => void;
  cycles: string[];
  cyclesLoading: boolean;
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole | null) => void;
}