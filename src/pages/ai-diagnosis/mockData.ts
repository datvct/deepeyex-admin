export interface AIDiagnosis {
  diagnosis_id: string;
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  symptoms: string[];
  ai_diagnosis: string;
  confidence_score: number;
  recommended_treatment: string[];
  alternative_diagnoses: string[];
  risk_factors: string[];
  created_at: string;
  status: "pending" | "confirmed" | "rejected";
  doctor_notes?: string;
  eye_images?: string[];
}

export const mockAIDiagnoses: AIDiagnosis[] = [
  {
    diagnosis_id: "ai_diag_001",
    patient_id: "patient_001",
    patient_name: "Nguyễn Thị Bình",
    patient_age: 39,
    patient_gender: "Nữ",
    symptoms: ["Mờ mắt", "Nhức đầu", "Nhìn đôi", "Đau mắt", "Chảy nước mắt"],
    ai_diagnosis:
      "Có khả năng cao bị tăng nhãn áp (glaucoma) góc mở. Triệu chứng mờ mắt và nhức đầu kết hợp với đau mắt cho thấy cần kiểm tra nhãn áp ngay lập tức. Cần đo nhãn áp và khám đáy mắt để xác định chính xác.",
    confidence_score: 89,
    recommended_treatment: [
      "Đo nhãn áp (IOP)",
      "Khám đáy mắt với kính soi đáy mắt",
      "Đo thị lực chi tiết",
      "Chụp OCT (Optical Coherence Tomography)",
      "Đo thị trường (Visual Field)",
      "Sử dụng thuốc nhỏ mắt hạ nhãn áp",
    ],
    alternative_diagnoses: ["Đục thủy tinh thể", "Viêm màng bồ đào", "Đau nửa đầu"],
    risk_factors: ["Tuổi trung niên", "Giới tính nữ", "Tiền sử gia đình bị glaucoma"],
    created_at: "2024-01-15T10:30:00Z",
    status: "pending",
    eye_images: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop",
    ],
  },
  {
    diagnosis_id: "ai_diag_002",
    patient_id: "patient_002",
    patient_name: "Lê Văn Đức",
    patient_age: 46,
    patient_gender: "Nam",
    symptoms: [
      "Mờ mắt dần",
      "Nhìn mờ khi đọc sách",
      "Khó nhìn ban đêm",
      "Chói mắt",
      "Thay đổi độ kính liên tục",
    ],
    ai_diagnosis:
      "Có khả năng cao bị đục thủy tinh thể (cataract). Triệu chứng mờ mắt dần và khó nhìn ban đêm là dấu hiệu điển hình. Cần đánh giá mức độ đục và lên kế hoạch phẫu thuật.",
    confidence_score: 94,
    recommended_treatment: [
      "Đo thị lực chi tiết",
      "Khám sinh hiển vi",
      "Đo độ dày giác mạc",
      "Đánh giá mức độ đục thủy tinh thể",
      "Phẫu thuật thay thủy tinh thể (IOL)",
      "Theo dõi định kỳ",
    ],
    alternative_diagnoses: ["Tăng nhãn áp", "Thoái hóa hoàng điểm", "Viễn thị"],
    risk_factors: ["Tuổi trung niên", "Nam giới", "Tiền sử tiếp xúc tia UV"],
    created_at: "2024-01-15T11:15:00Z",
    status: "pending",
    eye_images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop",
    ],
  },
  {
    diagnosis_id: "ai_diag_003",
    patient_id: "patient_003",
    patient_name: "Hoàng Thị Phương",
    patient_age: 32,
    patient_gender: "Nữ",
    symptoms: ["Mắt đỏ", "Ngứa mắt", "Chảy nước mắt", "Cảm giác cộm mắt", "Nhạy cảm với ánh sáng"],
    ai_diagnosis:
      "Có khả năng cao bị viêm kết mạc dị ứng (allergic conjunctivitis). Triệu chứng ngứa mắt và chảy nước mắt kết hợp với mắt đỏ là dấu hiệu điển hình của phản ứng dị ứng.",
    confidence_score: 85,
    recommended_treatment: [
      "Thuốc nhỏ mắt kháng histamine",
      "Thuốc nhỏ mắt chống viêm",
      "Tránh các chất gây dị ứng",
      "Sử dụng nước mắt nhân tạo",
      "Chườm lạnh giảm sưng",
      "Theo dõi triệu chứng",
    ],
    alternative_diagnoses: ["Viêm kết mạc do vi khuẩn", "Khô mắt", "Viêm màng bồ đào"],
    risk_factors: ["Tuổi trẻ", "Giới tính nữ", "Tiền sử dị ứng", "Mùa dị ứng"],
    created_at: "2024-01-15T12:00:00Z",
    status: "pending",
    eye_images: [
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop",
    ],
  },
  {
    diagnosis_id: "ai_diag_004",
    patient_id: "patient_004",
    patient_name: "Trần Minh Tuấn",
    patient_age: 28,
    patient_gender: "Nam",
    symptoms: [
      "Nhìn mờ đột ngột",
      "Mất thị lực một phần",
      "Nhìn thấy đốm đen",
      "Đau mắt dữ dội",
      "Buồn nôn",
    ],
    ai_diagnosis:
      "Có khả năng cao bị tăng nhãn áp góc đóng cấp tính. Triệu chứng nhìn mờ đột ngột và đau mắt dữ dội kết hợp với buồn nôn là cấp cứu nhãn khoa cần can thiệp ngay lập tức.",
    confidence_score: 96,
    recommended_treatment: [
      "Cấp cứu: Đo nhãn áp ngay",
      "Thuốc nhỏ mắt hạ nhãn áp khẩn cấp",
      "Laser iridotomy",
      "Phẫu thuật cắt bè củng mạc",
      "Theo dõi dấu hiệu sinh tồn",
      "Khám đáy mắt sau điều trị",
    ],
    alternative_diagnoses: ["Viêm màng bồ đào cấp", "Tắc tĩnh mạch võng mạc", "Bong võng mạc"],
    risk_factors: ["Tuổi trẻ", "Nam giới", "Viễn thị", "Tiền sử gia đình"],
    created_at: "2024-01-15T13:30:00Z",
    status: "pending",
    eye_images: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"],
  },
  {
    diagnosis_id: "ai_diag_005",
    patient_id: "patient_005",
    patient_name: "Phạm Thị Lan",
    patient_age: 55,
    patient_gender: "Nữ",
    symptoms: [
      "Nhìn mờ trung tâm",
      "Nhìn đường thẳng bị cong",
      "Mất thị lực màu",
      "Khó đọc sách",
      "Nhìn thấy điểm mù",
    ],
    ai_diagnosis:
      "Có khả năng cao bị thoái hóa hoàng điểm tuổi già (AMD - Age-related Macular Degeneration). Triệu chứng nhìn mờ trung tâm và nhìn đường thẳng bị cong là dấu hiệu đặc trưng của bệnh này.",
    confidence_score: 91,
    recommended_treatment: [
      "Chụp OCT võng mạc",
      "Chụp mạch máu võng mạc (FFA)",
      "Test Amsler grid",
      "Tiêm thuốc chống VEGF",
      "Bổ sung vitamin và khoáng chất",
      "Theo dõi định kỳ",
    ],
    alternative_diagnoses: ["Phù hoàng điểm", "Tắc tĩnh mạch võng mạc", "Viêm màng bồ đào"],
    risk_factors: ["Tuổi cao", "Giới tính nữ", "Hút thuốc", "Tiền sử gia đình"],
    created_at: "2024-01-15T14:45:00Z",
    status: "pending",
    eye_images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop",
    ],
  },
  {
    diagnosis_id: "ai_diag_006",
    patient_id: "patient_006",
    patient_name: "Võ Thành Nam",
    patient_age: 42,
    patient_gender: "Nam",
    symptoms: [
      "Mắt khô",
      "Cảm giác cát trong mắt",
      "Chảy nước mắt",
      "Mỏi mắt",
      "Nhìn mờ khi làm việc",
    ],
    ai_diagnosis:
      "Có khả năng cao bị hội chứng khô mắt (Dry Eye Syndrome). Triệu chứng mắt khô và cảm giác cát trong mắt kết hợp với mỏi mắt là dấu hiệu điển hình của tình trạng thiếu nước mắt.",
    confidence_score: 88,
    recommended_treatment: [
      "Đo thời gian phá vỡ nước mắt (TBUT)",
      "Test Schirmer",
      "Sử dụng nước mắt nhân tạo",
      "Thuốc nhỏ mắt chống viêm",
      "Massage tuyến meibomian",
      "Bổ sung omega-3",
    ],
    alternative_diagnoses: ["Viêm bờ mi", "Dị ứng mắt", "Viêm kết mạc"],
    risk_factors: ["Tuổi trung niên", "Nam giới", "Làm việc máy tính nhiều", "Khí hậu khô"],
    created_at: "2024-01-15T15:20:00Z",
    status: "pending",
    eye_images: [
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop",
    ],
  },
];
