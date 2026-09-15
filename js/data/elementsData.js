/**
 * Dữ liệu 20 nguyên tố hóa học đầu tiên (Z = 1 đến 20)
 * Chuẩn chương trình KHTN 7 - Bộ sách "Kết nối tri thức với cuộc sống"
 */

const ELEMENTS_DATA = [
  {
    z: 1,
    symbol: "H",
    nameVi: "Hiđrô (Hydrogen)",
    nameIupac: "Hydrogen",
    p: 1,
    n: 0,
    e: 1,
    massAmu: 1,
    shells: [1], // Lớp 1: 1e
    color: "#60a5fa",
    category: "Phi kim",
    application: "Làm nhiên liệu sạch cho tàu vũ trụ và ô tô tương lai, dùng để sản xuất amoniac (phân bón)."
  },
  {
    z: 2,
    symbol: "He",
    nameVi: "Heli (Helium)",
    nameIupac: "Helium",
    p: 2,
    n: 2,
    e: 2,
    massAmu: 4,
    shells: [2], // Lớp 1 bão hòa: 2e
    color: "#c084fc",
    category: "Khí hiếm",
    application: "Bơm khí cầu, khinh khí cầu do nhẹ hơn không khí và không bắt lửa, làm mát máy chụp MRI."
  },
  {
    z: 3,
    symbol: "Li",
    nameVi: "Liti (Lithium)",
    nameIupac: "Lithium",
    p: 3,
    n: 4,
    e: 3,
    massAmu: 7,
    shells: [2, 1], // Lớp 1: 2e, Lớp 2: 1e
    color: "#f87171",
    category: "Kim loại kiềm",
    application: "Thành phần cốt lõi trong pin Lithium-ion của điện thoại, máy tính bảng và xe điện."
  },
  {
    z: 4,
    symbol: "Be",
    nameVi: "Beri (Beryllium)",
    nameIupac: "Beryllium",
    p: 4,
    n: 5,
    e: 4,
    massAmu: 9,
    shells: [2, 2],
    color: "#fb923c",
    category: "Kim loại kiềm thổ",
    application: "Làm kính thiên văn vũ trụ (kính James Webb) và linh kiện hàng không vũ trụ siêu nhẹ, siêu cứng."
  },
  {
    z: 5,
    symbol: "B",
    nameVi: "Bo (Boron)",
    nameIupac: "Boron",
    p: 5,
    n: 6,
    e: 5,
    massAmu: 11,
    shells: [2, 3],
    color: "#facc15",
    category: "Á kim",
    application: "Chế tạo thủy tinh borosilicate chịu nhiệt trong phòng thí nghiệm, sản xuất gốm sứ cao cấp."
  },
  {
    z: 6,
    symbol: "C",
    nameVi: "Cacbon (Carbon)",
    nameIupac: "Carbon",
    p: 6,
    n: 6,
    e: 6,
    massAmu: 12,
    shells: [2, 4],
    color: "#34d399",
    category: "Phi kim",
    application: "Cơ sở của mọi dạng sống hữu cơ; kim cương (trang sức), than chì (ruột bút chì), sợi carbon siêu bền."
  },
  {
    z: 7,
    symbol: "N",
    nameVi: "Nitơ (Nitrogen)",
    nameIupac: "Nitrogen",
    p: 7,
    n: 7,
    e: 7,
    massAmu: 14,
    shells: [2, 5],
    color: "#38bdf8",
    category: "Phi kim",
    application: "Chiếm khoảng 78% khí quyển Trái Đất; bảo quản thực phẩm chống ôi thiu, sản xuất phân đạm."
  },
  {
    z: 8,
    symbol: "O",
    nameVi: "Oxi (Oxygen)",
    nameIupac: "Oxygen",
    p: 8,
    n: 8,
    e: 8,
    massAmu: 16,
    shells: [2, 6],
    color: "#f43f5e",
    category: "Phi kim",
    application: "Duy trì sự hô hấp của sinh vật và sự cháy; dùng trong bình dưỡng khí y tế và thợ lặn."
  },
  {
    z: 9,
    symbol: "F",
    nameVi: "Flo (Fluorine)",
    nameIupac: "Fluorine",
    p: 9,
    n: 10,
    e: 9,
    massAmu: 19,
    shells: [2, 7],
    color: "#a3e635",
    category: "Halogen",
    application: "Hợp chất fluorua giúp chống sâu răng trong kem đánh răng, phủ chống dính chảo teflon."
  },
  {
    z: 10,
    symbol: "Ne",
    nameVi: "Neon",
    nameIupac: "Neon",
    p: 10,
    n: 10,
    e: 10,
    massAmu: 20,
    shells: [2, 8], // Lớp 2 bão hòa: 8e
    color: "#fb7185",
    category: "Khí hiếm",
    application: "Làm đèn quảng cáo phát sáng màu đỏ cam rực rỡ, đèn tín hiệu hải đăng."
  },
  {
    z: 11,
    symbol: "Na",
    nameVi: "Natri (Sodium)",
    nameIupac: "Sodium",
    p: 11,
    n: 12,
    e: 11,
    massAmu: 23,
    shells: [2, 8, 1], // Bắt đầu lớp 3
    color: "#fbbf24",
    category: "Kim loại kiềm",
    application: "Thành phần của muối ăn (NaCl), duy trì áp suất thẩm thấu và cân bằng điện giải cơ thể."
  },
  {
    z: 12,
    symbol: "Mg",
    nameVi: "Magie (Magnesium)",
    nameIupac: "Magnesium",
    p: 12,
    n: 12,
    e: 12,
    massAmu: 24,
    shells: [2, 8, 2],
    color: "#a78bfa",
    category: "Kim loại kiềm thổ",
    application: "Thành phần trung tâm của diệp lục trong lá cây giúp quang hợp; hợp kim nhẹ trong xe hơi."
  },
  {
    z: 13,
    symbol: "Al",
    nameVi: "Nhôm (Aluminium)",
    nameIupac: "Aluminium",
    p: 13,
    n: 14,
    e: 13,
    massAmu: 27,
    shells: [2, 8, 3],
    color: "#94a3b8",
    category: "Kim loại",
    application: "Làm vỏ máy bay, dây dẫn điện cao thế, cửa sổ và đồ gia dụng nhờ nhẹ và bền chống gỉ."
  },
  {
    z: 14,
    symbol: "Si",
    nameVi: "Silic (Silicon)",
    nameIupac: "Silicon",
    p: 14,
    n: 14,
    e: 14,
    massAmu: 28,
    shells: [2, 8, 4],
    color: "#2dd4bf",
    category: "Á kim",
    application: "Trái tim của cuộc cách mạng công nghệ số: chế tạo chip vi xử lý máy tính, pin mặt trời."
  },
  {
    z: 15,
    symbol: "P",
    nameVi: "Photpho (Phosphorus)",
    nameIupac: "Phosphorus",
    p: 15,
    n: 16,
    e: 15,
    massAmu: 31,
    shells: [2, 8, 5],
    color: "#e879f9",
    category: "Phi kim",
    application: "Thành phần cấu tạo DNA, xương và răng; sản xuất phân lân nông nghiệp và đầu que diêm."
  },
  {
    z: 16,
    symbol: "S",
    nameVi: "Lưu huỳnh (Sulfur)",
    nameIupac: "Sulfur",
    p: 16,
    n: 16,
    e: 16,
    massAmu: 32,
    shells: [2, 8, 6],
    color: "#fde047",
    category: "Phi kim",
    application: "Sản xuất axit sunfuric (chất hóa học công nghiệp quan trọng nhất), lưu hóa cao su lốp xe."
  },
  {
    z: 17,
    symbol: "Cl",
    nameVi: "Clo (Chlorine)",
    nameIupac: "Chlorine",
    p: 17,
    n: 18,
    e: 17,
    massAmu: 35.5,
    shells: [2, 8, 7],
    color: "#4ade80",
    category: "Halogen",
    application: "Khử trùng nước máy, nước hồ bơi, thành phần muối ăn NaCl và nhựa PVC."
  },
  {
    z: 18,
    symbol: "Ar",
    nameVi: "Agon (Argon)",
    nameIupac: "Argon",
    p: 18,
    n: 22,
    e: 18,
    massAmu: 40,
    shells: [2, 8, 8], // Lớp 3 bão hòa trong nhóm chu kì nhỏ
    color: "#818cf8",
    category: "Khí hiếm",
    application: "Bơm vào bóng đèn sợi đốt để bảo vệ dây tóc, khí trơ bảo vệ trong hàn kim loại cao cấp."
  },
  {
    z: 19,
    symbol: "K",
    nameVi: "Kali (Potassium)",
    nameIupac: "Potassium",
    p: 19,
    n: 20,
    e: 19,
    massAmu: 39,
    shells: [2, 8, 8, 1], // Bắt đầu lớp 4
    color: "#f472b6",
    category: "Kim loại kiềm",
    application: "Phân bón kali cho cây trồng tăng sức chống chịu sâu bệnh, truyền dẫn xung thần kinh ở người."
  },
  {
    z: 20,
    symbol: "Ca",
    nameVi: "Canxi (Calcium)",
    nameIupac: "Calcium",
    p: 20,
    n: 20,
    e: 20,
    massAmu: 40,
    shells: [2, 8, 8, 2],
    color: "#67e8f9",
    category: "Kim loại kiềm thổ",
    application: "Hình thành khung xương và vỏ trứng, thành phần chính của đá vôi, vôi sống và xi măng xây dựng."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ELEMENTS_DATA };
}
