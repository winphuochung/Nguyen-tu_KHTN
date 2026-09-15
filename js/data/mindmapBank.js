/**
 * 20 Bài tập Sơ đồ tư duy điền khuyết cấu tạo nguyên tử chuẩn SGK KNTT
 */
const MINDMAP_BANK = [
  {
    "id": "mm_01",
    "title": "Sơ đồ 1: Cấu tạo tổng thể của Nguyên tử",
    "description": "Điền các thành phần cơ bản của nguyên tử vào sơ đồ tư duy:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Bộ phận nằm ở trung tâm nguyên tử:",
        "correctText": "Hạt nhân",
        "options": [
          "Hạt nhân",
          "Lớp vỏ electron",
          "Quỹ đạo",
          "Phân tử"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Hạt mang điện dương trong hạt nhân:",
        "correctText": "Proton",
        "options": [
          "Proton",
          "Neutron",
          "Electron",
          "Ion"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Hạt không mang điện trong hạt nhân:",
        "correctText": "Neutron",
        "options": [
          "Neutron",
          "Proton",
          "Electron",
          "Alpha"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Bộ phận chuyển động xung quanh hạt nhân:",
        "correctText": "Lớp vỏ electron",
        "options": [
          "Lớp vỏ electron",
          "Phân tử",
          "Tế bào",
          "Đám mây proton"
        ]
      }
    ],
    "explanation": "Nguyên tử cấu tạo gồm hạt nhân ở trung tâm (gồm proton và neutron) và lớp vỏ electron chuyển động xung quanh."
  },
  {
    "id": "mm_02",
    "title": "Sơ đồ 2: Điện tích của các loại hạt cơ bản",
    "description": "Xác định điện tích quy ước của 3 loại hạt cấu tạo nên nguyên tử:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Điện tích của một hạt proton:",
        "correctText": "+1",
        "options": [
          "+1",
          "-1",
          "0",
          "+2"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Điện tích của một hạt electron:",
        "correctText": "-1",
        "options": [
          "-1",
          "+1",
          "0",
          "-2"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Điện tích của một hạt neutron:",
        "correctText": "Không mang điện (0)",
        "options": [
          "Không mang điện (0)",
          "+1",
          "-1",
          "+0.5"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Tổng điện tích của toàn bộ nguyên tử:",
        "correctText": "Bằng 0 (Trung hòa)",
        "options": [
          "Bằng 0 (Trung hòa)",
          "Dương (+)",
          "Âm (-)",
          "Biến thiên"
        ]
      }
    ],
    "explanation": "Proton mang điện tích +1, electron mang điện tích -1, neutron không mang điện. Vì số proton = số electron nên nguyên tử trung hòa về điện (tổng điện tích = 0)."
  },
  {
    "id": "mm_03",
    "title": "Sơ đồ 3: Khối lượng nguyên tử và đơn vị amu",
    "description": "Hoàn thành sơ đồ tư duy về khối lượng các loại hạt cơ bản:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Khối lượng của 1 proton xấp xỉ:",
        "correctText": "1 amu",
        "options": [
          "1 amu",
          "0 amu",
          "2 amu",
          "0.00055 amu"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Khối lượng của 1 neutron xấp xỉ:",
        "correctText": "1 amu",
        "options": [
          "1 amu",
          "0 amu",
          "0.5 amu",
          "10 amu"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Khối lượng của hạt electron:",
        "correctText": "Rất nhỏ (không đáng kể)",
        "options": [
          "Rất nhỏ (không đáng kể)",
          "1 amu",
          "Lớn gấp 2 lần proton",
          "10 gam"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Khối lượng nguyên tử tập trung chủ yếu ở:",
        "correctText": "Hạt nhân",
        "options": [
          "Hạt nhân",
          "Vỏ electron",
          "Đám mây quang tử",
          "Khoảng không gian rỗng"
        ]
      }
    ],
    "explanation": "Khối lượng proton và neutron xấp xỉ 1 amu, trong khi electron rất nhỏ (~0.00055 amu) nên khối lượng nguyên tử tập trung hầu như hoàn toàn ở hạt nhân."
  },
  {
    "id": "mm_04",
    "title": "Sơ đồ 4: Quy tắc phân bố electron vào các lớp vỏ",
    "description": "Điền số lượng electron tối đa cho phép ở từng lớp vỏ nguyên tử:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Số electron tối đa ở lớp trong cùng (Lớp 1):",
        "correctText": "2 electron",
        "options": [
          "2 electron",
          "8 electron",
          "18 electron",
          "1 electron"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Số electron tối đa ở Lớp thứ 2:",
        "correctText": "8 electron",
        "options": [
          "8 electron",
          "2 electron",
          "18 electron",
          "6 electron"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Các electron được sắp xếp theo thứ tự:",
        "correctText": "Từ trong ra ngoài",
        "options": [
          "Từ trong ra ngoài",
          "Từ ngoài vào trong",
          "Ngẫu nhiên",
          "Tùy ý"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Lớp e ngoài cùng quyết định:",
        "correctText": "Tính chất hóa học",
        "options": [
          "Tính chất hóa học",
          "Khối lượng nguyên tử",
          "Số proton",
          "Màu sắc nguyên tử"
        ]
      }
    ],
    "explanation": "Electron xếp từ trong ra ngoài: Lớp 1 chứa tối đa 2e, lớp 2 chứa tối đa 8e. Electron lớp ngoài cùng quyết định tính chất hóa học của nguyên tố."
  },
  {
    "id": "mm_05",
    "title": "Sơ đồ 5: Mô hình nguyên tử Rutherford - Bohr",
    "description": "Điền các luận điểm chính của mô hình nguyên tử hành tinh:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Các electron chuyển động xung quanh:",
        "correctText": "Hạt nhân",
        "options": [
          "Hạt nhân",
          "Mặt trời",
          "Nguyên phân",
          "Phân tử"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Electron chuyển động trên:",
        "correctText": "Các lớp vỏ xác định",
        "options": [
          "Các lớp vỏ xác định",
          "Đường thẳng",
          "Mặt phẳng ngang",
          "Trực giao ngẫu nhiên"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Lực giữ electron không bay ra ngoài là:",
        "correctText": "Lực hút tĩnh điện",
        "options": [
          "Lực hút tĩnh điện",
          "Lực hấp dẫn Trái Đất",
          "Lực ma sát",
          "Lực từ trường ngoài"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Nguyên tử có kích thước:",
        "correctText": "Rất lớn so với hạt nhân",
        "options": [
          "Rất lớn so với hạt nhân",
          "Bằng hạt nhân",
          "Nhỏ hơn hạt nhân",
          "Vô hạn"
        ]
      }
    ],
    "explanation": "Theo Rutherford - Bohr, electron chuyển động quanh hạt nhân theo các quỹ đạo/lớp vỏ xác định nhờ lực hút tĩnh điện giữa hạt nhân (+) và electron (-)."
  },
  {
    "id": "mm_06",
    "title": "Sơ đồ 6: Cấu tạo nguyên tử Hydrogen (Hiđrô - Z = 1)",
    "description": "Đặc điểm cấu tạo của nguyên tử đơn giản và nhẹ nhất trong vũ trụ:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Số proton trong hạt nhân Hydrogen:",
        "correctText": "1 proton",
        "options": [
          "1 proton",
          "2 proton",
          "0 proton",
          "3 proton"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Số neutron trong hạt nhân Hydrogen thường:",
        "correctText": "0 neutron",
        "options": [
          "0 neutron",
          "1 neutron",
          "2 neutron",
          "4 neutron"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Số electron ở lớp vỏ:",
        "correctText": "1 electron",
        "options": [
          "1 electron",
          "2 electron",
          "0 electron",
          "8 electron"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Khối lượng nguyên tử Hydrogen là:",
        "correctText": "1 amu",
        "options": [
          "1 amu",
          "2 amu",
          "0 amu",
          "1.008 gam"
        ]
      }
    ],
    "explanation": "Nguyên tử Hydrogen phổ biến nhất có 1p ở hạt nhân, không có neutron, và 1e ở vỏ; khối lượng nguyên tử xấp xỉ 1 amu."
  },
  {
    "id": "mm_07",
    "title": "Sơ đồ 7: Cấu tạo nguyên tử Helium (Heli - Z = 2)",
    "description": "Nguyên tử khí hiếm đầu tiên trong bảng tuần hoàn:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Số proton trong hạt nhân Helium:",
        "correctText": "2 proton",
        "options": [
          "2 proton",
          "1 proton",
          "4 proton",
          "0 proton"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Số neutron trong hạt nhân Helium:",
        "correctText": "2 neutron",
        "options": [
          "2 neutron",
          "1 neutron",
          "3 neutron",
          "4 neutron"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Lớp vỏ electron duy nhất của Helium:",
        "correctText": "Đã bão hòa (chứa đủ 2e)",
        "options": [
          "Đã bão hòa (chứa đủ 2e)",
          "Còn thiếu 6e",
          "Trống",
          "Có 4e"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Nhờ lớp vỏ bão hòa, Helium là một:",
        "correctText": "Khí hiếm (bền vững)",
        "options": [
          "Khí hiếm (bền vững)",
          "Kim loại mạnh",
          "Phi kim hoạt động",
          "Chất phóng xạ"
        ]
      }
    ],
    "explanation": "Helium có 2p, 2n, 2e. Lớp 1 chứa tối đa 2e nên đã bão hòa, giúp Helium có tính trơ hóa học bền vững (khí hiếm)."
  },
  {
    "id": "mm_08",
    "title": "Sơ đồ 8: Cấu tạo nguyên tử Carbon (Cacbon - Z = 6)",
    "description": "Nguyên tố cơ sở của sự sống trên Trái Đất:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Số hạt proton ở hạt nhân:",
        "correctText": "6 proton",
        "options": [
          "6 proton",
          "12 proton",
          "4 proton",
          "8 proton"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Phân bố electron ở Lớp 1 (trong cùng):",
        "correctText": "2 electron",
        "options": [
          "2 electron",
          "4 electron",
          "6 electron",
          "1 electron"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Phân bố electron ở Lớp 2 (ngoài cùng):",
        "correctText": "4 electron",
        "options": [
          "4 electron",
          "2 electron",
          "6 electron",
          "8 electron"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Khối lượng nguyên tử Carbon chuẩn:",
        "correctText": "12 amu",
        "options": [
          "12 amu",
          "6 amu",
          "14 amu",
          "16 amu"
        ]
      }
    ],
    "explanation": "Carbon (Z = 6) có 6p, 6n; 6 electron chia thành 2 lớp: lớp 1 có 2e và lớp 2 có 4e; khối lượng xấp xỉ 12 amu."
  },
  {
    "id": "mm_09",
    "title": "Sơ đồ 9: Cấu tạo nguyên tử Oxygen (Oxi - Z = 8)",
    "description": "Khí duy trì sự sống và sự cháy:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Điện tích hạt nhân của Oxygen:",
        "correctText": "+8",
        "options": [
          "+8",
          "-8",
          "0",
          "+16"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Số electron ở lớp ngoài cùng (Lớp 2):",
        "correctText": "6 electron",
        "options": [
          "6 electron",
          "2 electron",
          "8 electron",
          "4 electron"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Số electron còn thiếu để đạt vỏ bền (8e):",
        "correctText": "2 electron",
        "options": [
          "2 electron",
          "1 electron",
          "3 electron",
          "0 electron"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Khối lượng nguyên tử Oxygen xấp xỉ:",
        "correctText": "16 amu",
        "options": [
          "16 amu",
          "8 amu",
          "18 amu",
          "32 amu"
        ]
      }
    ],
    "explanation": "Oxygen có 8p và 8e, phân bố: lớp 1 có 2e, lớp 2 có 6e (còn thiếu 2e để bão hòa 8e); khối lượng ~ 16 amu."
  },
  {
    "id": "mm_10",
    "title": "Sơ đồ 10: Cấu tạo nguyên tử Sodium (Natri - Z = 11)",
    "description": "Kim loại kiềm hoạt động mạnh:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Tổng số lớp electron của Sodium:",
        "correctText": "3 lớp",
        "options": [
          "3 lớp",
          "2 lớp",
          "1 lớp",
          "4 lớp"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Số e ở Lớp 1 và Lớp 2:",
        "correctText": "2e và 8e",
        "options": [
          "2e và 8e",
          "2e và 9e",
          "1e và 10e",
          "4e và 7e"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Số e ở Lớp 3 (ngoài cùng):",
        "correctText": "1 electron",
        "options": [
          "1 electron",
          "2 electron",
          "8 electron",
          "3 electron"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Khối lượng nguyên tử Sodium (11p, 12n):",
        "correctText": "23 amu",
        "options": [
          "23 amu",
          "11 amu",
          "12 amu",
          "22 amu"
        ]
      }
    ],
    "explanation": "Sodium có cấu hình 3 lớp: 2, 8, 1; lớp ngoài cùng có 1e nên dễ nhường 1e để thành ion Na+; khối lượng = 11 + 12 = 23 amu."
  },
  {
    "id": "mm_11",
    "title": "Sơ đồ 11: Cấu tạo nguyên tử Chlorine (Clo - Z = 17)",
    "description": "Phi kim halogen dùng khử trùng nước sinh hoạt:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Số hạt proton trong hạt nhân:",
        "correctText": "17 proton",
        "options": [
          "17 proton",
          "35 proton",
          "18 proton",
          "7 proton"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Số electron ở lớp ngoài cùng:",
        "correctText": "7 electron",
        "options": [
          "7 electron",
          "1 electron",
          "8 electron",
          "5 electron"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Để đạt lớp vỏ bền 8e, Clo có xu hướng:",
        "correctText": "Nhận thêm 1 electron",
        "options": [
          "Nhận thêm 1 electron",
          "Nhường 7 electron",
          "Nhận thêm 2 electron",
          "Không biến đổi"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Khối lượng nguyên tử Clo phổ biến:",
        "correctText": "35 amu",
        "options": [
          "35 amu",
          "17 amu",
          "18 amu",
          "70 amu"
        ]
      }
    ],
    "explanation": "Chlorine (Z = 17) có cấu hình e: 2, 8, 7; lớp ngoài cùng có 7e nên có xu hướng nhận 1e thành ion Cl-."
  },
  {
    "id": "mm_12",
    "title": "Sơ đồ 12: Không gian rỗng trong nguyên tử",
    "description": "Khám phá kích thước tương quan giữa vỏ và hạt nhân:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Đường kính nguyên tử so với hạt nhân lớn hơn:",
        "correctText": "Khoảng 10.000 đến 100.000 lần",
        "options": [
          "Khoảng 10.000 đến 100.000 lần",
          "2 lần",
          "10 lần",
          "Bằng nhau"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Phần lớn thể tích của nguyên tử là:",
        "correctText": "Không gian rỗng",
        "options": [
          "Không gian rỗng",
          "Vật chất đặc quánh",
          "Chất lỏng",
          "Kim loại nguyên khối"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Nếu phóng to hạt nhân như hòn bi (1cm) thì nguyên tử to bằng:",
        "correctText": "Sân vận động bóng đá",
        "options": [
          "Sân vận động bóng đá",
          "Quả bóng rổ",
          "Ngôi nhà nhỏ",
          "Hạt cát"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Mặc dù rỗng, nguyên tử không bị xẹp vì:",
        "correctText": "Chuyển động tốc độ cao của electron",
        "options": [
          "Chuyển động tốc độ cao của electron",
          "Áp suất không khí",
          "Trọng lực Trái Đất",
          "Có màng bao bọc"
        ]
      }
    ],
    "explanation": "Nguyên tử có cấu tạo rỗng, đường kính hạt nhân chỉ bằng 1/10.000 đến 1/100.000 đường kính nguyên tử."
  },
  {
    "id": "mm_13",
    "title": "Sơ đồ 13: Định nghĩa đơn vị khối lượng nguyên tử amu",
    "description": "Quy ước chuẩn đo lường trong hóa học:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Chữ viết tắt amu bắt nguồn từ:",
        "correctText": "Atomic Mass Unit",
        "options": [
          "Atomic Mass Unit",
          "Atom Matter Unit",
          "Auto Mass Universal",
          "Atomic Model Unit"
        ]
      },
      {
        "id": "s2",
        "label": "(2) 1 amu được quy ước bằng:",
        "correctText": "1/12 khối lượng nguyên tử Carbon-12",
        "options": [
          "1/12 khối lượng nguyên tử Carbon-12",
          "Khối lượng 1 nguyên tử Hydrogen",
          "1 gam",
          "1/16 nguyên tử Oxygen"
        ]
      },
      {
        "id": "s3",
        "label": "(3) 1 amu đổi ra gam xấp xỉ bằng:",
        "correctText": "1,6605 x 10^-24 gam",
        "options": [
          "1,6605 x 10^-24 gam",
          "1 gam",
          "0.001 gam",
          "9.1 x 10^-28 gam"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Lợi ích khi dùng amu thay vì gam là:",
        "correctText": "Số gọn gàng, dễ tính toán",
        "options": [
          "Số gọn gàng, dễ tính toán",
          "Đo được bằng cân cơ học",
          "Đạt chuẩn mét hệ SI",
          "Không cần nhớ"
        ]
      }
    ],
    "explanation": "1 amu = 1/12 khối lượng nguyên tử carbon-12 ≈ 1,6605 × 10^-24 g, giúp biểu diễn khối lượng nguyên tử bằng các số nguyên đơn giản."
  },
  {
    "id": "mm_14",
    "title": "Sơ đồ 14: Phân loại nguyên tố dựa vào electron ngoài cùng",
    "description": "Quy tắc nhận biết kim loại, phi kim và khí hiếm:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Nguyên tử có 1, 2, 3e ở lớp ngoài cùng thường là:",
        "correctText": "Kim loại",
        "options": [
          "Kim loại",
          "Phi kim",
          "Khí hiếm",
          "Á kim"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Nguyên tử có 5, 6, 7e ở lớp ngoài cùng thường là:",
        "correctText": "Phi kim",
        "options": [
          "Phi kim",
          "Kim loại",
          "Khí hiếm",
          "Chất trơ"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Nguyên tử có 8e (hoặc 2e ở He) ở lớp ngoài cùng là:",
        "correctText": "Khí hiếm",
        "options": [
          "Khí hiếm",
          "Kim loại mạnh",
          "Axit",
          "Oxit"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Nguyên tử có 4e lớp ngoài cùng (như C, Si) có thể là:",
        "correctText": "Phi kim hoặc á kim",
        "options": [
          "Phi kim hoặc á kim",
          "Chắc chắn kim loại",
          "Khí hiếm",
          "Không tồn tại"
        ]
      }
    ],
    "explanation": "Số e lớp ngoài cùng: 1-3e thường là kim loại, 5-7e thường là phi kim, 8e (hoặc 2e với He) là khí hiếm."
  },
  {
    "id": "mm_15",
    "title": "Sơ đồ 15: Cấu tạo nguyên tử Aluminium (Nhôm - Z = 13)",
    "description": "Kim loại nhẹ làm vỏ máy bay và vật dụng gia đình:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Số electron ở lớp ngoài cùng của Aluminium:",
        "correctText": "3 electron",
        "options": [
          "3 electron",
          "1 electron",
          "2 electron",
          "4 electron"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Hạt nhân gồm 13 proton và:",
        "correctText": "14 neutron",
        "options": [
          "14 neutron",
          "13 neutron",
          "12 neutron",
          "15 neutron"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Khối lượng nguyên tử Aluminium là:",
        "correctText": "27 amu",
        "options": [
          "27 amu",
          "26 amu",
          "13 amu",
          "28 amu"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Cấu hình electron theo từng lớp:",
        "correctText": "2, 8, 3",
        "options": [
          "2, 8, 3",
          "2, 9, 2",
          "3, 8, 2",
          "2, 8, 8"
        ]
      }
    ],
    "explanation": "Aluminium (Z = 13) có cấu hình e: 2, 8, 3; khối lượng nguyên tử = 13 + 14 = 27 amu."
  },
  {
    "id": "mm_16",
    "title": "Sơ đồ 16: Cấu tạo nguyên tử Canxi (Calcium - Z = 20)",
    "description": "Nguyên tố thiết yếu cấu tạo xương và răng:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Tổng số lớp electron của Canxi:",
        "correctText": "4 lớp",
        "options": [
          "4 lớp",
          "3 lớp",
          "2 lớp",
          "5 lớp"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Cấu hình electron từng lớp (1, 2, 3, 4):",
        "correctText": "2, 8, 8, 2",
        "options": [
          "2, 8, 8, 2",
          "2, 8, 9, 1",
          "2, 8, 10, 0",
          "2, 10, 8, 0"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Số electron ở lớp ngoài cùng (Lớp 4):",
        "correctText": "2 electron",
        "options": [
          "2 electron",
          "8 electron",
          "1 electron",
          "4 electron"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Khối lượng nguyên tử Canxi (20p, 20n):",
        "correctText": "40 amu",
        "options": [
          "40 amu",
          "20 amu",
          "42 amu",
          "39 amu"
        ]
      }
    ],
    "explanation": "Canxi (Z = 20) có 4 lớp electron với phân bố 2, 8, 8, 2; khối lượng nguyên tử = 20 + 20 = 40 amu."
  },
  {
    "id": "mm_17",
    "title": "Sơ đồ 17: Cấu tạo nguyên tử Kali (Potassium - Z = 19)",
    "description": "Khoáng chất quan trọng trong chuối và phân bón NPK:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Số electron ở lớp ngoài cùng của Kali:",
        "correctText": "1 electron",
        "options": [
          "1 electron",
          "2 electron",
          "7 electron",
          "8 electron"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Phân bố electron qua 4 lớp vỏ:",
        "correctText": "2, 8, 8, 1",
        "options": [
          "2, 8, 8, 1",
          "2, 8, 9",
          "2, 9, 8",
          "1, 8, 8, 2"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Hạt nhân gồm 19 proton và:",
        "correctText": "20 neutron",
        "options": [
          "20 neutron",
          "19 neutron",
          "18 neutron",
          "21 neutron"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Khối lượng nguyên tử Kali là:",
        "correctText": "39 amu",
        "options": [
          "39 amu",
          "38 amu",
          "40 amu",
          "19 amu"
        ]
      }
    ],
    "explanation": "Potassium (Z = 19) có cấu hình e: 2, 8, 8, 1; khối lượng nguyên tử = 19 + 20 = 39 amu."
  },
  {
    "id": "mm_18",
    "title": "Sơ đồ 18: Sự khác nhau giữa Proton và Neutron",
    "description": "Phân biệt 2 loại hạt nằm trong hạt nhân nguyên tử:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Hạt quyết định tên gọi và số thứ tự nguyên tố là:",
        "correctText": "Proton",
        "options": [
          "Proton",
          "Neutron",
          "Electron",
          "Positron"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Hạt đóng vai trò 'chất keo' ổn định hạt nhân:",
        "correctText": "Neutron",
        "options": [
          "Neutron",
          "Proton",
          "Electron",
          "Quang tử"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Hạt có điện tích trái dấu với electron là:",
        "correctText": "Proton",
        "options": [
          "Proton",
          "Neutron",
          "Hạt nhân",
          "Ion âm"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Nguyên tử duy nhất không có neutron là:",
        "correctText": "Hydrogen (thường)",
        "options": [
          "Hydrogen (thường)",
          "Helium",
          "Carbon",
          "Oxygen"
        ]
      }
    ],
    "explanation": "Số proton quyết định điện tích hạt nhân và tính chất nguyên tố; neutron không mang điện giúp giữ các proton gắn kết trong hạt nhân."
  },
  {
    "id": "mm_19",
    "title": "Sơ đồ 19: Khí hiếm Neon (Z = 10) và đèn quảng cáo",
    "description": "Nguyên tử khí hiếm phát sáng màu đỏ cam đặc trưng:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Số electron ở lớp ngoài cùng của Neon:",
        "correctText": "8 electron",
        "options": [
          "8 electron",
          "2 electron",
          "10 electron",
          "6 electron"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Trạng thái lớp vỏ ngoài cùng của Neon:",
        "correctText": "Bão hòa bền vững",
        "options": [
          "Bão hòa bền vững",
          "Dễ nhận thêm e",
          "Dễ mất e",
          "Không ổn định"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Số hạt mang điện trong nguyên tử Neon:",
        "correctText": "20 hạt (10p + 10e)",
        "options": [
          "20 hạt (10p + 10e)",
          "10 hạt",
          "30 hạt",
          "0 hạt"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Khối lượng nguyên tử Neon (10p, 10n):",
        "correctText": "20 amu",
        "options": [
          "20 amu",
          "10 amu",
          "18 amu",
          "22 amu"
        ]
      }
    ],
    "explanation": "Neon (Z = 10) có 2 lớp electron (2, 8); lớp ngoài cùng có 8e bão hòa nên rất bền, không tham gia phản ứng hóa học thông thường."
  },
  {
    "id": "mm_20",
    "title": "Sơ đồ 20: Bản đồ tư duy tổng kết toàn bài 'Cấu tạo nguyên tử'",
    "description": "Hệ thống hóa toàn bộ 3 trụ cột cốt lõi của Bài 2 KHTN 7:",
    "slots": [
      {
        "id": "s1",
        "label": "(1) Mối quan hệ cân bằng điện tích trong nguyên tử:",
        "correctText": "Số proton = Số electron",
        "options": [
          "Số proton = Số electron",
          "Số proton = Số neutron",
          "Số neutron = Số electron",
          "Tổng hạt = 0"
        ]
      },
      {
        "id": "s2",
        "label": "(2) Công thức tính gần đúng khối lượng nguyên tử:",
        "correctText": "Khối lượng ≈ Số p + Số n",
        "options": [
          "Khối lượng ≈ Số p + Số n",
          "Khối lượng ≈ Số p + Số e",
          "Khối lượng ≈ Số p x 2",
          "Khối lượng = Số e"
        ]
      },
      {
        "id": "s3",
        "label": "(3) Chiều phân bố electron vào các lớp vỏ:",
        "correctText": "Từ lớp trong cùng ra ngoài",
        "options": [
          "Từ lớp trong cùng ra ngoài",
          "Từ lớp ngoài vào trong",
          "Vào hạt nhân trước",
          "Tùy ý"
        ]
      },
      {
        "id": "s4",
        "label": "(4) Đơn vị đo khối lượng nguyên tử chuẩn quốc tế:",
        "correctText": "amu",
        "options": [
          "amu",
          "gam",
          "kilogam",
          "tấn"
        ]
      }
    ],
    "explanation": "Ghi nhớ cốt lõi: Nguyên tử trung hòa điện (p = e), khối lượng tập trung ở hạt nhân (m ≈ p + n đo bằng amu), electron xếp thành từng lớp từ trong ra ngoài."
  }
];
