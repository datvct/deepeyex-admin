enum Specialty {
  Ophthalmology = "ophthalmology",
  InternalMedicine = "internal_medicine",
  Neurology = "neurology",
  Endocrinology = "endocrinology",
  Pediatrics = "pediatrics",
  Dermatology = "dermatology",
}

export { Specialty };

export const SpecialtyLabel: Record<Specialty, string> = {
  [Specialty.Ophthalmology]: "Nhãn khoa",
  [Specialty.InternalMedicine]: "Nội khoa",
  [Specialty.Neurology]: "Thần kinh",
  [Specialty.Endocrinology]: "Nội tiết",
  [Specialty.Pediatrics]: "Nhi khoa",
  [Specialty.Dermatology]: "Da liễu",
};
