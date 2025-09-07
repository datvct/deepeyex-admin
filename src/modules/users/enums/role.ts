enum Role {
  Patient = "patient",
  Doctor = "doctor",
  Admin = "admin",
}

export { Role };

const RoleLabel: Record<Role, string> = {
  [Role.Patient]: "Bệnh nhân",
  [Role.Doctor]: "Bác sĩ",
  [Role.Admin]: "Quản trị viên",
};

export { RoleLabel };
