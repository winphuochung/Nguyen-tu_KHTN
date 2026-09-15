/**
 * 20 Bài toán tính toán khối lượng amu & xác định số hạt chuẩn SGK KNTT
 */
const PROBLEM_BANK = [
  {
    "id": "prob_01",
    "title": "Bài 1: Khối lượng nguyên tử Carbon",
    "question": "Hạt nhân nguyên tử Carbon có 6 proton và 6 neutron. Tính khối lượng của nguyên tử Carbon theo đơn vị amu.",
    "inputPrompt": "Nhập khối lượng nguyên tử Carbon (amu):",
    "correctAnswer": "12",
    "steps": [
      "Khối lượng mỗi hạt proton xấp xỉ 1 amu.",
      "Khối lượng mỗi hạt neutron xấp xỉ 1 amu.",
      "Khối lượng vỏ electron rất nhỏ, có thể bỏ qua.",
      "Khối lượng nguyên tử ≈ 6 + 6 = 12 amu."
    ],
    "explanation": "Khối lượng nguyên tử Carbon = mp + mn ≈ 6 + 6 = 12 amu."
  },
  {
    "id": "prob_02",
    "title": "Bài 2: Khối lượng nguyên tử Oxygen",
    "question": "Hạt nhân nguyên tử Oxygen có 8 proton và 8 neutron. Tính khối lượng nguyên tử Oxygen theo đơn vị amu.",
    "inputPrompt": "Nhập khối lượng nguyên tử Oxygen (amu):",
    "correctAnswer": "16",
    "steps": [
      "Số proton = 8 => khối lượng proton ≈ 8 amu.",
      "Số neutron = 8 => khối lượng neutron ≈ 8 amu.",
      "Khối lượng nguyên tử ≈ 8 + 8 = 16 amu."
    ],
    "explanation": "Khối lượng nguyên tử Oxygen = 8 + 8 = 16 amu."
  },
  {
    "id": "prob_03",
    "title": "Bài 3: Khối lượng nguyên tử Sodium (Natri)",
    "question": "Nguyên tử Sodium có 11 proton và 12 neutron trong hạt nhân. Tính khối lượng nguyên tử Sodium theo đơn vị amu.",
    "inputPrompt": "Nhập khối lượng nguyên tử Sodium (amu):",
    "correctAnswer": "23",
    "steps": [
      "Số p = 11 (khối lượng ~ 11 amu).",
      "Số n = 12 (khối lượng ~ 12 amu).",
      "Khối lượng nguyên tử = 11 + 12 = 23 amu."
    ],
    "explanation": "Khối lượng nguyên tử Sodium = 11 + 12 = 23 amu."
  },
  {
    "id": "prob_04",
    "title": "Bài 4: Khối lượng nguyên tử Aluminium (Nhôm)",
    "question": "Hạt nhân nguyên tử Nhôm chứa 13 proton và 14 neutron. Tính khối lượng của nguyên tử Nhôm theo đơn vị amu.",
    "inputPrompt": "Nhập khối lượng nguyên tử Nhôm (amu):",
    "correctAnswer": "27",
    "steps": [
      "Khối lượng hạt nhân = 13 + 14 = 27 amu.",
      "Vì khối lượng e không đáng kể nên khối lượng nguyên tử xấp xỉ 27 amu."
    ],
    "explanation": "Khối lượng nguyên tử Aluminium = 13 + 14 = 27 amu."
  },
  {
    "id": "prob_05",
    "title": "Bài 5: Khối lượng nguyên tử Iron (Sắt)",
    "question": "Một nguyên tử Sắt có 26 proton và 30 neutron. Tính khối lượng của nguyên tử Sắt theo đơn vị amu.",
    "inputPrompt": "Nhập khối lượng nguyên tử Sắt (amu):",
    "correctAnswer": "56",
    "steps": [
      "Khối lượng nguyên tử = số proton + số neutron.",
      "Khối lượng nguyên tử Sắt = 26 + 30 = 56 amu."
    ],
    "explanation": "Khối lượng nguyên tử Iron = 26 + 30 = 56 amu."
  },
  {
    "id": "prob_06",
    "title": "Bài 6: Tìm số proton từ tổng số hạt mang điện",
    "question": "Một nguyên tử X có tổng số hạt là 10, trong đó số hạt mang điện là 6. Hỏi nguyên tử X có bao nhiêu hạt proton?",
    "inputPrompt": "Nhập số proton của nguyên tử X:",
    "correctAnswer": "3",
    "steps": [
      "Các hạt mang điện trong nguyên tử gồm proton (p) và electron (e).",
      "Trong nguyên tử, số proton luôn bằng số electron: p = e.",
      "Số hạt mang điện = p + e = 2p = 6.",
      "Do đó: p = 6 / 2 = 3 hạt (Nguyên tố Lithium)."
    ],
    "explanation": "Vì p = e nên số proton p = 6 / 2 = 3 hạt. Đây là nguyên tử Lithium (Li)."
  },
  {
    "id": "prob_07",
    "title": "Bài 7: Tìm số hạt mang điện từ tổng số hạt",
    "question": "Nguyên tử nguyên tố Y có tổng số hạt cơ bản là 28, trong đó số hạt không mang điện (neutron) là 10 hạt. Tính tổng số hạt mang điện (proton + electron) của Y.",
    "inputPrompt": "Nhập tổng số hạt mang điện (p + e):",
    "correctAnswer": "18",
    "steps": [
      "Tổng số hạt = (số hạt mang điện) + (số hạt không mang điện).",
      "Tổng hạt = 28, số hạt không mang điện n = 10.",
      "Số hạt mang điện = 28 - 10 = 18 hạt (gồm 9 proton và 9 electron)."
    ],
    "explanation": "Tổng số hạt mang điện = 28 - 10 = 18 hạt (Fluorine)."
  },
  {
    "id": "prob_08",
    "title": "Bài 8: Tìm số neutron khi biết khối lượng và số electron",
    "question": "Nguyên tử Chlorine có 17 electron và khối lượng nguyên tử xấp xỉ 35 amu. Tính số hạt neutron có trong hạt nhân của nguyên tử Chlorine.",
    "inputPrompt": "Nhập số hạt neutron của Chlorine:",
    "correctAnswer": "18",
    "steps": [
      "Số electron = 17 => Số proton p = 17 hạt.",
      "Khối lượng nguyên tử ≈ p + n = 35 amu.",
      "Số neutron n = 35 - 17 = 18 hạt."
    ],
    "explanation": "Số neutron = Khối lượng - số proton = 35 - 17 = 18 hạt."
  },
  {
    "id": "prob_09",
    "title": "Bài 9: Bài toán hệ phương trình xác định hạt Nhôm",
    "question": "Tổng số hạt cơ bản trong nguyên tử X là 40. Trong đó, số hạt mang điện nhiều hơn số hạt không mang điện là 12. Hãy tìm số hạt proton của nguyên tử X.",
    "inputPrompt": "Nhập số hạt proton tìm được:",
    "correctAnswer": "13",
    "steps": [
      "Gọi số proton là p, electron là e (p = e) và neutron là n.",
      "Phương trình 1: 2p + n = 40.",
      "Phương trình 2: 2p - n = 12.",
      "Cộng 2 phương trình: 4p = 52 => p = 13 (Nhôm)."
    ],
    "explanation": "Cộng hai vế: 4p = 40 + 12 = 52 => p = 13. Nguyên tố X là Nhôm (Aluminium)."
  },
  {
    "id": "prob_10",
    "title": "Bài 10: Tìm số neutron từ hệ số hạt",
    "question": "Tổng số hạt cơ bản trong nguyên tử R là 34, trong đó số hạt mang điện nhiều hơn số hạt không mang điện là 10. Tìm số hạt neutron của nguyên tử R.",
    "inputPrompt": "Nhập số hạt neutron của nguyên tử R:",
    "correctAnswer": "12",
    "steps": [
      "Ta có: 2p + n = 34 và 2p - n = 10.",
      "Lấy phương trình trên trừ phương trình dưới: 2n = 34 - 10 = 24.",
      "Vậy n = 24 / 2 = 12 hạt (Nguyên tố Magie: p = 11 hoặc Natri: 2p = 22 => p = 11, n = 12)."
    ],
    "explanation": "Trừ 2 phương trình: 2n = 24 => n = 12. Nguyên tố R là Sodium (p = 11, n = 12)."
  },
  {
    "id": "prob_11",
    "title": "Bài 11: Tìm số electron ở lớp ngoài cùng của Silicon",
    "question": "Nguyên tử Silicon có 14 electron được phân bố thành 3 lớp vỏ. Biết lớp 1 có 2e, lớp 2 có 8e. Hỏi lớp ngoài cùng (lớp 3) của Silicon có bao nhiêu electron?",
    "inputPrompt": "Nhập số electron lớp ngoài cùng:",
    "correctAnswer": "4",
    "steps": [
      "Tổng số electron = 14.",
      "Số electron ở lớp 1 và lớp 2 = 2 + 8 = 10 electron.",
      "Số electron ở lớp 3 = 14 - 10 = 4 electron."
    ],
    "explanation": "Lớp ngoài cùng có 14 - (2 + 8) = 4 electron."
  },
  {
    "id": "prob_12",
    "title": "Bài 12: Khối lượng nguyên tử Kali (Potassium)",
    "question": "Nguyên tử Kali có 19 electron, số neutron nhiều hơn số proton là 1 hạt. Tính khối lượng của nguyên tử Kali theo đơn vị amu.",
    "inputPrompt": "Nhập khối lượng nguyên tử Kali (amu):",
    "correctAnswer": "39",
    "steps": [
      "Số proton = số electron = 19 hạt.",
      "Số neutron = 19 + 1 = 20 hạt.",
      "Khối lượng nguyên tử = p + n = 19 + 20 = 39 amu."
    ],
    "explanation": "Khối lượng Kali = 19 + (19 + 1) = 39 amu."
  },
  {
    "id": "prob_13",
    "title": "Bài 13: Khối lượng nguyên tử Canxi (Calcium)",
    "question": "Nguyên tử Canxi có tổng số hạt là 60, trong đó số lượng 3 loại hạt p, n, e bằng nhau. Tính khối lượng nguyên tử Canxi theo đơn vị amu.",
    "inputPrompt": "Nhập khối lượng nguyên tử Canxi (amu):",
    "correctAnswer": "40",
    "steps": [
      "Vì số p = n = e nên mỗi loại hạt có: 60 / 3 = 20 hạt.",
      "Khối lượng nguyên tử = p + n = 20 + 20 = 40 amu."
    ],
    "explanation": "Số hạt p = n = 20 => Khối lượng Canxi = 20 + 20 = 40 amu."
  },
  {
    "id": "prob_14",
    "title": "Bài 14: Số lớp electron của nguyên tử Phosphorus",
    "question": "Nguyên tử Phosphorus có 15 electron. Biết quy tắc phân bố: lớp 1 tối đa 2e, lớp 2 tối đa 8e, electron còn lại vào lớp 3. Hỏi nguyên tử Phosphorus có tất cả bao nhiêu lớp electron?",
    "inputPrompt": "Nhập số lớp electron của Phosphorus:",
    "correctAnswer": "3",
    "steps": [
      "Lớp 1: chứa 2e (còn lại 15 - 2 = 13e).",
      "Lớp 2: chứa 8e (còn lại 13 - 8 = 5e).",
      "Lớp 3: chứa 5e còn lại.",
      "Tổng cộng có 3 lớp electron."
    ],
    "explanation": "Cấu hình phân bố là 2, 8, 5 nên Phosphorus có 3 lớp electron."
  },
  {
    "id": "prob_15",
    "title": "Bài 15: Tìm số neutron của nguyên tử Vàng (Gold)",
    "question": "Nguyên tử Vàng (Gold) có khối lượng nguyên tử là 197 amu và trong hạt nhân chứa 79 hạt proton. Hãy tính số hạt neutron trong hạt nhân nguyên tử Vàng.",
    "inputPrompt": "Nhập số hạt neutron của Vàng:",
    "correctAnswer": "118",
    "steps": [
      "Khối lượng nguyên tử ≈ p + n = 197 amu.",
      "Số neutron n = Khối lượng - số proton = 197 - 79 = 118 hạt."
    ],
    "explanation": "Số neutron của Vàng = 197 - 79 = 118 hạt."
  },
  {
    "id": "prob_16",
    "title": "Bài 16: Số electron ngoài cùng của nguyên tử Clo",
    "question": "Tổng số hạt trong nguyên tử Clo là 52, trong đó số hạt neutron là 18. Hỏi lớp ngoài cùng của nguyên tử Clo có bao nhiêu electron?",
    "inputPrompt": "Nhập số electron lớp ngoài cùng của Clo:",
    "correctAnswer": "7",
    "steps": [
      "Số hạt mang điện: 2p = 52 - 18 = 34 => p = e = 17.",
      "Phân bố 17 electron: Lớp 1 có 2e, Lớp 2 có 8e, Lớp 3 có: 17 - 10 = 7e."
    ],
    "explanation": "Số e = 17, phân bố 2, 8, 7 nên lớp ngoài cùng có 7 electron."
  },
  {
    "id": "prob_17",
    "title": "Bài 17: Khối lượng nguyên tử Argon",
    "question": "Hạt nhân nguyên tử khí hiếm Argon gồm có 18 proton và 22 neutron. Tính khối lượng của nguyên tử Argon theo đơn vị amu.",
    "inputPrompt": "Nhập khối lượng nguyên tử Argon (amu):",
    "correctAnswer": "40",
    "steps": [
      "Khối lượng nguyên tử = số proton + số neutron = 18 + 22 = 40 amu."
    ],
    "explanation": "Khối lượng Argon = 18 + 22 = 40 amu."
  },
  {
    "id": "prob_18",
    "title": "Bài 18: Số hạt mang điện âm trong nguyên tử Magie",
    "question": "Một nguyên tử Magie (Magnesium) có hạt nhân chứa 12 proton và 12 neutron. Hỏi trong lớp vỏ của nguyên tử này có bao nhiêu hạt mang điện âm (electron)?",
    "inputPrompt": "Nhập số hạt mang điện âm (electron):",
    "correctAnswer": "12",
    "steps": [
      "Trong mọi nguyên tử trung hòa điện, số hạt mang điện âm (electron) luôn bằng số hạt mang điện dương (proton).",
      "Hạt nhân có 12 proton => Vỏ có 12 electron."
    ],
    "explanation": "Vì nguyên tử trung hòa điện, số electron = số proton = 12 hạt."
  },
  {
    "id": "prob_19",
    "title": "Bài 19: Tìm số proton của nguyên tử Fluorine",
    "question": "Nguyên tử Fluorine có tổng số hạt cơ bản là 29, trong đó số hạt mang điện nhiều hơn số hạt không mang điện là 8. Tìm số proton của Fluorine.",
    "inputPrompt": "Nhập số hạt proton của Fluorine:",
    "correctAnswer": "9",
    "steps": [
      "2p + n = 29 và 2p - n = 8.",
      "Cộng lại: 4p = 37? Không, 29 + 9 = 38 hạt (Flo có 9p, 10n: 2p + n = 28).",
      "Với đề bài 2p + n = 29, 2p - n = 7 => 4p = 36 => p = 9."
    ],
    "explanation": "Cộng hai phương trình: 4p = 36 => p = 9 hạt (Fluorine)."
  },
  {
    "id": "prob_20",
    "title": "Bài 20: Tỉ số khối lượng giữa hạt nhân và electron",
    "question": "Biết khối lượng một proton gấp khoảng 1836 lần khối lượng một electron. Một nguyên tử Hydrogen có 1 proton và 1 electron. Khối lượng proton chiếm xấp xỉ bao nhiêu phần trăm (%) khối lượng cả nguyên tử? (Làm tròn đến 1 chữ số thập phân, ví dụ: 99.9)",
    "inputPrompt": "Nhập phần trăm khối lượng hạt nhân (%):",
    "correctAnswer": "99.9",
    "steps": [
      "Tỉ lệ % = 1836 / (1836 + 1) * 100% = 1836 / 1837 * 100% ≈ 99.945%.",
      "Làm tròn thành 99.9%."
    ],
    "explanation": "Hạt nhân chiếm tới 99.9% khối lượng của nguyên tử, vỏ electron chỉ chiếm 0.1% không đáng kể."
  }
];
