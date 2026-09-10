export type Role =
  | "SUPER_ADMIN"
  | "NATIONAL_ADMIN"
  | "DEPARTMENT_ADMIN"
  | "PROJECT_OFFICER"
  | "DISTRICT_OFFICER"
  | "FIELD_OFFICER"
  | "REVIEWER"
  | "VIEWER";
export interface AuthContext {
  userId: string;
  roles: Role[];
  departmentId?: string;
  districtId?: string;
}
