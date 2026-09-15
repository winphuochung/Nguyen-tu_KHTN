/**
 * Ngân hàng câu hỏi đa tầng chuẩn KHTN 7 KNTT - Bài 2: Cấu tạo nguyên tử
 * Tầng nhận thức:
 * - NB: Nhận biết
 * - TH: Thông hiểu
 * - VD: Vận dụng
 * - VDC: Vận dụng cao (Problem Solving)
 * Dạng bài:
 * - mcq: Trắc nghiệm lựa chọn
 * - short_answer: Trả lời ngắn (nhập số hoặc chữ)
 * - drag_drop_particles: Kéo thả hạt cơ bản vào hạt nhân và các lớp vỏ
 * - cloze_mindmap: Điền khuyết vào sơ đồ tư duy cấu tạo nguyên tử
 * - problem_solving: Bài toán tính toán khối lượng amu và số lượng hạt
 */

const QUESTION_BANK = [
  // ================= TẦNG 1: NHẬN BIẾT (NB) =================
  {
    id: "q_nb_01",
    level: "NB",
    topic: "nucleus",
    topicName: "Cấu tạo hạt nhân & điện tích",
    type: "mcq",
    question: "Nguyên tử gồm các loại hạt cơ bản nào sau đây?",
    options: [
      "Proton, neutron và electron",
      "Chỉ gồm proton và electron",
      "Chỉ gồm neutron và electron",
      "Proton, positron và photon"
    ],
    correct: 0,
    explanation: "Theo chương trình KHTN 7, nguyên tử được cấu tạo từ ba loại hạt cơ bản: proton (p), neutron (n) ở hạt nhân và electron (e) ở lớp vỏ.",
    media: null
  },
  {
    id: "q_nb_02",
    level: "NB",
    topic: "nucleus",
    topicName: "Cấu tạo hạt nhân & điện tích",
    type: "mcq",
    question: "Hạt mang điện tích âm trong nguyên tử là hạt nào?",
    options: [
      "Proton",
      "Neutron",
      "Electron",
      "Hạt nhân"
    ],
    correct: 2,
    explanation: "Electron (kí hiệu là e) là hạt mang điện tích âm (-1), chuyển động quanh hạt nhân.",
    media: null
  },
  {
    id: "q_nb_03",
    level: "NB",
    topic: "concept",
    topicName: "Khái niệm & Kích thước nguyên tử",
    type: "mcq",
    question: "Vì sao nói nguyên tử là hạt trung hòa về điện?",
    options: [
      "Vì số proton bằng số electron",
      "Vì số proton bằng số neutron",
      "Vì số neutron bằng số electron",
      "Vì trong nguyên tử không có hạt mang điện"
    ],
    correct: 0,
    explanation: "Mỗi proton mang điện tích +1, mỗi electron mang điện tích -1. Trong nguyên tử, số proton luôn bằng số electron nên nguyên tử trung hòa về điện.",
    media: null
  },
  {
    id: "q_nb_04",
    level: "NB",
    topic: "mass_amu",
    topicName: "Khối lượng nguyên tử & Đơn vị amu",
    type: "mcq",
    question: "Đơn vị thường dùng để biểu thị khối lượng của nguyên tử là gì?",
    options: [
      "gam (g)",
      "kilôgam (kg)",
      "amu (atomic mass unit)",
      "miligam (mg)"
    ],
    correct: 2,
    explanation: "Khối lượng nguyên tử vô cùng nhỏ nên người ta dùng đơn vị đo chuyên dụng là amu (1 amu ≈ 1,6605 × 10⁻²⁴ g).",
    media: null
  },
  {
    id: "q_nb_05",
    level: "NB",
    topic: "shells",
    topicName: "Cấu trúc vỏ electron",
    type: "mcq",
    question: "Số lượng electron tối đa có thể chứa ở lớp thứ nhất (lớp trong cùng sát hạt nhân) là bao nhiêu?",
    options: [
      "2 electron",
      "8 electron",
      "18 electron",
      "1 electron"
    ],
    correct: 0,
    explanation: "Lớp electron thứ nhất (lớp trong cùng) chứa tối đa 2 electron.",
    media: null
  },
  {
    id: "q_nb_06",
    level: "NB",
    topic: "shells",
    topicName: "Cấu trúc vỏ electron",
    type: "short_answer",
    question: "Lớp electron thứ 2 có thể chứa tối đa bao nhiêu electron? (Nhập số)",
    correctAnswer: "8",
    acceptAnswers: ["8", "tám"],
    explanation: "Lớp electron thứ 2 chứa tối đa 8 electron."
  },

  // ================= TẦNG 2: THÔNG HIỂU (TH) =================
  {
    id: "q_th_01",
    level: "TH",
    topic: "mass_amu",
    topicName: "Khối lượng nguyên tử & Đơn vị amu",
    type: "mcq",
    question: "Khối lượng của nguyên tử tập trung hầu hết ở đâu và vì sao?",
    options: [
      "Ở hạt nhân, vì khối lượng của electron rất nhỏ bé so với proton và neutron",
      "Ở lớp vỏ, vì các electron chuyển động rất nhanh",
      "Phân bố đều khắp nguyên tử giữa các lớp vỏ và hạt nhân",
      "Ở neutron, vì neutron nặng gấp 1000 lần proton"
    ],
    correct: 0,
    explanation: "Khối lượng 1 electron chỉ khoảng 0,00055 amu, nhỏ hơn proton và neutron khoảng 1836 lần. Khối lượng nguyên tử tập trung hơn 99,95% ở hạt nhân.",
    media: null
  },
  {
    id: "q_th_02",
    level: "TH",
    topic: "shells",
    topicName: "Cấu trúc vỏ electron",
    type: "mcq",
    question: "Nguyên tử Carbon (Z = 6) có 6 electron. Sự phân bố electron vào các lớp từ trong ra ngoài là:",
    options: [
      "Lớp 1 có 2 electron, lớp 2 có 4 electron",
      "Lớp 1 có 4 electron, lớp 2 có 2 electron",
      "Lớp 1 có 3 electron, lớp 2 có 3 electron",
      "Cả 6 electron đều nằm ở lớp 1"
    ],
    correct: 0,
    explanation: "Lớp 1 chỉ chứa tối đa 2 electron. 4 electron còn lại sẽ phân bố vào lớp 2 (2 + 4 = 6).",
    media: "carbon_shells"
  },
  {
    id: "q_th_03",
    level: "TH",
    topic: "nucleus",
    topicName: "Cấu tạo hạt nhân & điện tích",
    type: "mcq",
    question: "Một nguyên tử có điện tích hạt nhân là +11. Số hạt electron ở lớp vỏ nguyên tử này là bao nhiêu?",
    options: [
      "11 hạt",
      "12 hạt",
      "23 hạt",
      "22 hạt"
    ],
    correct: 0,
    explanation: "Điện tích hạt nhân +11 nghĩa là có 11 proton. Do nguyên tử trung hòa về điện, số electron = số proton = 11.",
    media: null
  },
  {
    id: "q_th_04",
    level: "TH",
    topic: "shells",
    topicName: "Cấu trúc vỏ electron",
    type: "short_answer",
    question: "Nguyên tử Natri (Na) có 11 electron. Hãy cho biết lớp vỏ ngoài cùng của nguyên tử Natri có bao nhiêu electron? (Nhập số)",
    correctAnswer: "1",
    acceptAnswers: ["1", "một"],
    explanation: "Sự phân bố electron của Na (11e): Lớp 1 có 2e, Lớp 2 có 8e, Lớp 3 có 1e. Như vậy lớp ngoài cùng có 1 electron."
  },
  {
    id: "q_th_05",
    level: "TH",
    topic: "mass_amu",
    topicName: "Khối lượng nguyên tử & Đơn vị amu",
    type: "mcq",
    question: "Hạt nhân nguyên tử Nhôm (Al) gồm 13 proton và 14 neutron. Khối lượng nguyên tử Nhôm xấp xỉ bằng bao nhiêu?",
    options: [
      "27 amu",
      "13 amu",
      "14 amu",
      "40 amu"
    ],
    correct: 0,
    explanation: "Khối lượng nguyên tử coi như bằng khối lượng hạt nhân = số proton + số neutron = 13 + 14 = 27 amu.",
    media: null
  },

  // ================= TẦNG 3: VẬN DỤNG (VD) =================
  {
    id: "q_vd_01",
    level: "VD",
    topic: "problem_solving",
    topicName: "Giải quyết vấn đề & Tính toán hạt",
    type: "problem_solving",
    question: "Tổng số hạt proton, neutron và electron trong một nguyên tử X là 28 hạt. Trong đó, số hạt không mang điện (neutron) là 10 hạt. Hãy xác định số hạt proton và tên nguyên tố X.",
    steps: [
      "Tổng số hạt: p + n + e = 28",
      "Biết n = 10 và p = e (nguyên tử trung hòa về điện)",
      "Suy ra: 2p + 10 = 28 => 2p = 18 => p = 9",
      "Tra cứu Z = 9 là nguyên tố Flo (Fluorine, F)"
    ],
    inputPrompt: "Nhập số hạt proton của X:",
    correctAnswer: "9",
    acceptAnswers: ["9", "chín"],
    elementResult: "Fluorine (F)",
    explanation: "Ta có: 2p + n = 28. Với n = 10 thì 2p = 18 => p = e = 9. Nguyên tố có Z = 9 là Flo (F)."
  },
  {
    id: "q_vd_02",
    level: "VD",
    topic: "problem_solving",
    topicName: "Giải quyết vấn đề & Tính toán hạt",
    type: "problem_solving",
    question: "Một nguyên tử Y có tổng số các loại hạt là 40 hạt. Trong đó, số hạt mang điện nhiều hơn số hạt không mang điện là 12 hạt. Tính số hạt proton của nguyên tử Y.",
    steps: [
      "Tổng số hạt: (p + e) + n = 40 => 2p + n = 40 (1)",
      "Số hạt mang điện là (p + e) = 2p; hạt không mang điện là n",
      "Theo đề bài: 2p - n = 12 (2)",
      "Cộng (1) và (2): 4p = 52 => p = 13"
    ],
    inputPrompt: "Nhập số hạt proton của Y:",
    correctAnswer: "13",
    acceptAnswers: ["13", "mười ba"],
    elementResult: "Nhôm (Aluminium, Al)",
    explanation: "Hệ phương trình: 2p + n = 40 và 2p - n = 12. Cộng hai vế ta được 4p = 52 => p = 13. Nguyên tố là Nhôm (Al)."
  },
  {
    id: "q_vd_03",
    level: "VD",
    topic: "shells",
    topicName: "Cấu trúc vỏ electron",
    type: "mcq",
    question: "Nguyên tử của nguyên tố Z có 3 lớp electron và lớp ngoài cùng có 7 electron. Nguyên tố Z thuộc loại nguyên tố nào và có bao nhiêu electron?",
    options: [
      "Phi kim (Halogen) với tổng cộng 17 electron (Clo)",
      "Kim loại kiềm với tổng cộng 11 electron (Natri)",
      "Khí hiếm với tổng cộng 18 electron (Agon)",
      "Kim loại với tổng cộng 13 electron (Nhôm)"
    ],
    correct: 0,
    explanation: "Nguyên tử có 3 lớp electron: Lớp 1 có 2e, Lớp 2 có 8e, Lớp 3 có 7e => Tổng số e = 2 + 8 + 7 = 17e. Đây là nguyên tố Clo (Chlorine), một phi kim thuộc nhóm halogen.",
    media: null
  },

  // ================= TẦNG 4: VẬN DỤNG CAO (VDC) & BÀI TẬP TƯƠNG TÁC ĐẶC BIỆT =================
  {
    id: "q_vdc_01",
    level: "VDC",
    topic: "problem_solving",
    topicName: "Giải quyết vấn đề & Tính toán hạt",
    type: "problem_solving",
    question: "Khối lượng của một nguyên tử Canxi (Calcium) là 40 amu. Hạt nhân của nó chứa số hạt proton bằng số hạt neutron. Nếu bỏ qua khối lượng của electron, một mẫu chất chứa 2 gam Canxi sẽ chứa khoảng bao nhiêu nguyên tử Canxi? (Biết 1 amu ≈ 1,6605 × 10⁻²⁴ g).",
    steps: [
      "Khối lượng 1 nguyên tử Canxi = 40 × 1,6605 × 10⁻²⁴ g = 6,642 × 10⁻²³ g",
      "Số nguyên tử trong 2 gam Canxi = 2 / (6,642 × 10⁻²³ g) ≈ 3,01 × 10²² nguyên tử"
    ],
    inputPrompt: "Chọn đáp án đúng về số nguyên tử Canxi có trong 2g:",
    options: [
      "Khoảng 3,01 × 10²² nguyên tử",
      "Khoảng 6,02 × 10²³ nguyên tử",
      "Khoảng 1,20 × 10²¹ nguyên tử",
      "Khoảng 4,00 × 10²⁰ nguyên tử"
    ],
    correct: 0,
    explanation: "m_1 nguyên tử Ca = 40 × 1,6605 × 10⁻²⁴ g = 6,642 × 10⁻²³ g. Số nguyên tử = 2 / (6,642 × 10⁻²³) ≈ 3,01 × 10²² nguyên tử."
  },

  // ================= DẠNG KÉO THẢ HẠT CƠ BẢN (Drag & Drop) =================
  {
    id: "q_drag_oxygen",
    level: "VD",
    topic: "drag_drop",
    topicName: "Kéo thả hạt vào mô hình nguyên tử",
    type: "drag_drop_particles",
    question: "Hãy kéo và đặt đúng số lượng các loại hạt cơ bản vào mô hình nguyên tử Oxi (8p, 8n, 8e): kéo Proton và Neutron vào Tâm Hạt Nhân, kéo Electron vào Vòng Lớp 1 (tối đa 2e) và Vòng Lớp 2 (tối đa 6e).",
    elementSymbol: "O",
    elementName: "Oxi (Oxygen - Z = 8, A = 16)",
    targetP: 8,
    targetN: 8,
    targetShell1: 2,
    targetShell2: 6,
    instruction: "Hãy kéo và đặt đúng số lượng các loại hạt cơ bản vào mô hình nguyên tử Oxi (8p, 8n, 8e): kéo Proton và Neutron vào Tâm Hạt Nhân, kéo Electron vào Vòng Lớp 1 (tối đa 2e) và Vòng Lớp 2 (tối đa 6e).",
    explanation: "Nguyên tử Oxi (Z = 8) có hạt nhân chứa 8 proton mang điện tích +8, 8 neutron không mang điện. Lớp vỏ gồm 8 electron phân bố: lớp trong cùng chứa 2 electron, lớp ngoài cùng chứa 6 electron."
  },
  {
    id: "q_drag_carbon",
    level: "TH",
    topic: "drag_drop",
    topicName: "Kéo thả hạt vào mô hình nguyên tử",
    type: "drag_drop_particles",
    question: "Kéo thả 6 Proton và 6 Neutron vào Hạt Nhân, phân bố 6 Electron vào Lớp 1 (2e) và Lớp 2 (4e) của nguyên tử Carbon.",
    elementSymbol: "C",
    elementName: "Cacbon (Carbon - Z = 6, A = 12)",
    targetP: 6,
    targetN: 6,
    targetShell1: 2,
    targetShell2: 4,
    instruction: "Kéo thả 6 Proton và 6 Neutron vào Hạt Nhân, phân bố 6 Electron vào Lớp 1 (2e) và Lớp 2 (4e) của nguyên tử Carbon.",
    explanation: "Nguyên tử Carbon có hạt nhân gồm 6 proton và 6 neutron; 6 electron ở vỏ phân bố thành 2 lớp: lớp 1 có 2 electron và lớp 2 có 4 electron."
  },

  // ================= DẠNG ĐIỀN KHUYẾT SƠ ĐỒ TƯ DUY (Mind Map Cloze) =================
  {
    id: "q_mindmap_01",
    level: "TH",
    topic: "cloze_mindmap",
    topicName: "Điền khuyết sơ đồ tư duy cấu tạo nguyên tử",
    type: "cloze_mindmap",
    question: "Điền các từ khóa chính xác vào các ô trống (1), (2), (3), (4) trên sơ đồ tư duy cấu tạo nguyên tử:",
    title: "Sơ Đồ Tư Duy Cấu Tạo Nguyên Tử",
    description: "Kéo hoặc chọn các từ khóa chính xác vào các ô trống (1), (2), (3), (4) trên sơ đồ tư duy:",
    slots: [
      {
        id: "slot_1",
        label: "(1) Thành phần ở tâm nguyên tử",
        correctText: "Hạt nhân",
        options: ["Hạt nhân", "Vỏ electron", "Quỹ đạo", "Phân tử"]
      },
      {
        id: "slot_2",
        label: "(2) Hạt mang điện tích dương (+1)",
        correctText: "Proton",
        options: ["Proton", "Neutron", "Electron", "Ion"]
      },
      {
        id: "slot_3",
        label: "(3) Hạt không mang điện (điện tích = 0)",
        correctText: "Neutron",
        options: ["Neutron", "Proton", "Electron", "Hạt alpha"]
      },
      {
        id: "slot_4",
        label: "(4) Hạt mang điện tích âm (-1) ở lớp vỏ",
        correctText: "Electron",
        options: ["Electron", "Proton", "Neutron", "Quang tử"]
      }
    ],
    explanation: "Nguyên tử gồm: (1) Hạt nhân ở giữa gồm (2) Proton (mang điện +1) và (3) Neutron (không mang điện); lớp vỏ gồm các (4) Electron (mang điện -1)."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QUESTION_BANK };
}
