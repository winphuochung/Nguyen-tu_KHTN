/**
 * Nội dung lý thuyết trọng tâm, kịch bản Micro-learning và "Em có biết"
 * Chuẩn chương trình KHTN 7 - Bộ sách "Kết nối tri thức với cuộc sống" - Bài 2: Nguyên tử
 */

const DIDACTIC_CONTENT = {
  // 1. Hệ thống hóa lý thuyết cốt lõi
  theoryChapters: [
    {
      id: "concept",
      title: "1. Khái Niệm Nguyên Tử & Kích Thước",
      icon: "atom",
      summary: "Nguyên tử là những hạt vô cùng nhỏ, tạo nên tất cả các chất trong vũ trụ.",
      bullets: [
        "Mọi vật thể xung quanh chúng ta (nước ta uống, không khí ta thở, cơ thể ta) đều được cấu tạo từ các nguyên tử.",
        "Kích thước nguyên tử cực kì nhỏ bé, khoảng $10^{-10}\\text{ m}$ (hay $0{,}1\\text{ nm}$).",
        "Nếu xếp 100 triệu nguyên tử nối tiếp nhau thành một hàng thẳng, chiều dài đó chỉ khoảng 1 centimet!",
        "Nguyên tử có cấu tạo rỗng: kích thước hạt nhân chỉ bằng khoảng $1/10.000$ đến $1/100.000$ kích thước toàn bộ nguyên tử."
      ],
      analogy: "Nếu tưởng tượng nguyên tử to bằng một sân vận động bóng đá khổng lồ, thì hạt nhân ở giữa chỉ bé bằng một hạt cát hoặc một quả bóng tennis đặt ở chấm giao bóng tâm sân!"
    },
    {
      id: "structure",
      title: "2. Cấu Tạo Hạt Nhân Nguyên Tử",
      icon: "nucleus",
      summary: "Hạt nhân nằm ở tâm nguyên tử, mang điện tích dương, gồm các hạt proton và neutron.",
      bullets: [
        "Hạt nhân gồm hai loại hạt chính: **proton** (kí hiệu là p) và **neutron** (kí hiệu là n).",
        "**Proton**: Mang điện tích dương, quy ước là $+1$. Mỗi proton có khối lượng xấp xỉ $1\\text{ amu}$.",
        "**Neutron**: Không mang điện (trung hòa về điện, điện tích bằng 0). Mỗi neutron có khối lượng xấp xỉ $1\\text{ amu}$.",
        "Điện tích của hạt nhân bằng tổng điện tích của các proton trong hạt nhân (ví dụ hạt nhân có 6 proton thì điện tích là $+6$)."
      ],
      keyRule: "Số đơn vị điện tích hạt nhân = Số proton trong hạt nhân (kí hiệu là Z)."
    },
    {
      id: "electrons",
      title: "3. Cấu Trúc Vỏ Nguyên Tử & Các Lớp Electron",
      icon: "orbits",
      summary: "Vỏ nguyên tử gồm các electron chuyển động rất nhanh xung quanh hạt nhân và sắp xếp thành từng lớp.",
      bullets: [
        "**Electron** (kí hiệu là e): Mang điện tích âm, quy ước là $-1$.",
        "**Nguyên tử trung hòa về điện**: Trong một nguyên tử, tổng số điện tích dương ở hạt nhân luôn bằng tổng số điện tích âm ở lớp vỏ, tức là: **Số proton (p) = Số electron (e)**.",
        "Các electron chuyển động rất nhanh quanh hạt nhân theo mô hình Rutherford - Bohr và sắp xếp thành các lớp từ trong ra ngoài:",
        "• Lớp 1 (trong cùng, gần hạt nhân nhất): Chứa tối đa **2 electron**.",
        "• Lớp 2: Chứa tối đa **8 electron**.",
        "• Lớp 3: Chứa tối đa **8 electron** (đối với 20 nguyên tố đầu tiên trong KHTN 7)."
      ],
      tip: "Số electron ở lớp ngoài cùng quyết định nhiều tính chất hóa học quan trọng của nguyên tố (ví dụ: phi kim, kim loại hay khí hiếm)."
    },
    {
      id: "mass",
      title: "4. Khối Lượng Nguyên Tử & Đơn Vị amu",
      icon: "balance",
      summary: "Khối lượng nguyên tử vô cùng nhỏ, tập trung hầu hết ở hạt nhân.",
      bullets: [
        "Vì khối lượng của một nguyên tử tính bằng gam hoặc kilôgam là số quá nhỏ ($10^{-24}\\text{ g}$), các nhà khoa học quy ước dùng đơn vị **amu** (atomic mass unit).",
        "$1\\text{ amu} \\approx 1{,}6605 \\times 10^{-24}\\text{ gam}$.",
        "Khối lượng của 1 proton $\\approx 1\\text{ amu}$; Khối lượng của 1 neutron $\\approx 1\\text{ amu}$.",
        "Khối lượng của 1 electron rất nhỏ, chỉ khoảng $0{,}00055\\text{ amu}$ (nhỏ hơn khối lượng proton khoảng 1836 lần).",
        "Do khối lượng electron quá nhỏ bé không đáng kể, nên **khối lượng của nguyên tử coi như bằng khối lượng của hạt nhân**: $M \\approx m_p + m_n$."
      ],
      formula: "Khối lượng nguyên tử (amu) $\\approx$ Số proton + Số neutron"
    }
  ],

  // 2. Thư viện Micro-learning (dưới 2 phút) với trực quan hóa hoạt hình
  microLearnings: [
    {
      id: "rutherford-gold",
      title: "Thí nghiệm Rutherford: Khám phá bí ẩn hạt nhân",
      duration: "1:45",
      badge: "Lịch sử khám phá",
      overview: "Năm 1911, nhà vật lý Ernest Rutherford bắn chùm hạt alpha qua lá vàng siêu mỏng và kinh ngạc phát hiện bí mật chấn động!",
      scenes: [
        {
          second: "0:00 - 0:25",
          title: "Bắn phá lá vàng mỏng",
          desc: "Rutherford phóng một chùm hạt alpha (hạt mang điện dương) thẳng vào một lá vàng mỏng chỉ dày vài trăm nguyên tử.",
          visual: "alpha-beam-gold",
          takeaway: "Hầu hết các hạt alpha đi thẳng xuyên qua lá vàng mà không bị cản trở."
        },
        {
          second: "0:25 - 0:50",
          title: "Hiện tượng bất ngờ",
          desc: "Cứ khoảng 8.000 hạt thì có 1 hạt bị lệch hướng góc lớn, thậm chí bật ngược trở lại!",
          visual: "alpha-deflected",
          takeaway: "Rutherford ví nó như bắn một viên đại bác 15 inch vào tờ giấy lụa mà viên đạn lại nảy ngược lại vào người bắn."
        },
        {
          second: "0:50 - 1:45",
          title: "Kết luận vĩ đại",
          desc: "1. Nguyên tử có cấu tạo rỗng. 2. Toàn bộ điện tích dương và phần lớn khối lượng tập trung ở một vùng trung tâm cực nhỏ: HẠT NHÂN NGUYÊN TỬ.",
          visual: "atom-model-born",
          takeaway: "Mô hình hành tinh nguyên tử Rutherford - Bohr ra đời từ thí nghiệm lịch sử này!"
        }
      ]
    },
    {
      id: "electron-shells",
      title: "Vũ điệu của các lớp vỏ Electron",
      duration: "1:30",
      badge: "Cấu trúc vỏ e",
      overview: "Các electron không bay hỗn loạn mà phân bố có trật tự trên các lớp vỏ như những hành tinh quanh Mặt Trời!",
      scenes: [
        {
          second: "0:00 - 0:30",
          title: "Quy tắc lấp đầy từ trong ra ngoài",
          desc: "Electron sẽ ưu tiên chiếm giữ các mức năng lượng thấp nhất (lớp gần hạt nhân nhất) trước khi ra các lớp ngoài.",
          visual: "shell-filling",
          takeaway: "Lớp 1 chứa tối đa 2e. Đầy lớp 1 mới nhảy sang lớp 2."
        },
        {
          second: "0:30 - 1:00",
          title: "Sức chứa tối đa của từng lớp",
          desc: "Lớp 1: Max 2e. Lớp 2: Max 8e. Lớp 3: Max 8e (với 20 nguyên tố đầu tiên).",
          visual: "shell-limits",
          takeaway: "Quy tắc vàng 2 - 8 - 8 giúp học sinh giải nhanh mọi bài tập cấu tạo nguyên tử KHTN 7."
        },
        {
          second: "1:00 - 1:30",
          title: "Bí mật của lớp electron ngoài cùng",
          desc: "Khí hiếm (He, Ne, Ar) có lớp vỏ ngoài cùng bền vững (2e ở He, 8e ở Ne và Ar) nên rất trơ về mặt hóa học.",
          visual: "noble-gases",
          takeaway: "Các nguyên tố khác sẽ nhường, nhận hoặc dùng chung e để đạt vỏ bền vững như khí hiếm!"
        }
      ]
    },
    {
      id: "amu-scale",
      title: "amu là gì? Đo lường thế giới siêu vi",
      duration: "1:20",
      badge: "Khối lượng nguyên tử",
      overview: "Tại sao chúng ta không dùng gam hay kilôgam để cân nguyên tử? Hãy khám phá chiếc cân phân tử kỳ diệu!",
      scenes: [
        {
          second: "0:00 - 0:25",
          title: "Số 0 bất tận trong khối lượng gam",
          desc: "Một nguyên tử Carbon chỉ nặng 0,00000000000000000000001992 gam. Quá khó để nhớ và tính toán!",
          visual: "gram-zeroes",
          takeaway: "Con người cần một đơn vị đo lường mới dành riêng cho thế giới hạt siêu vi."
        },
        {
          second: "0:25 - 0:55",
          title: "Đơn vị amu ra đời",
          desc: "1 amu bằng 1/12 khối lượng nguyên tử Carbon-12. Khi đó: 1 proton = 1 amu, 1 neutron = 1 amu.",
          visual: "amu-definition",
          takeaway: "Khối lượng nguyên tử trở thành những con số nguyên tròn trịa dễ tính (H = 1, C = 12, O = 16)!"
        },
        {
          second: "0:55 - 1:20",
          title: "Electron nhẹ như sợi lông chim",
          desc: "Một proton nặng bằng khoảng 1836 electron. Do đó, người ta bỏ qua khối lượng electron khi tính khối lượng nguyên tử.",
          visual: "mass-comparison",
          takeaway: "Khối lượng nguyên tử tập trung hơn 99,95% ở hạt nhân!"
        }
      ]
    },
    {
      id: "empty-space",
      title: "Nguyên tử rỗng đến mức nào?",
      duration: "1:15",
      badge: "Khám phá bất ngờ",
      overview: "Bạn có biết cơ thể bạn và chiếc bàn gỗ thực chất được tạo nên từ 99,9999999% khoảng trống không gian rỗng?",
      scenes: [
        {
          second: "0:00 - 0:25",
          title: "Tỷ lệ giật mình",
          desc: "Đường kính nguyên tử lớn gấp khoảng 10.000 đến 100.000 lần đường kính của hạt nhân nguyên tử!",
          visual: "stadium-analogy",
          takeaway: "Khoảng cách giữa hạt nhân và lớp vỏ electron là một khoảng không gian mênh mông trống rỗng."
        },
        {
          second: "0:25 - 1:15",
          title: "Nếu ép hết khoảng trống nguyên tử...",
          desc: "Nếu loại bỏ hoàn toàn khoảng trống của tất cả các nguyên tử cấu tạo nên 8 tỷ người trên Trái Đất, toàn bộ nhân loại sẽ bị nén lại chỉ bằng kích thước... MỘT VIÊN ĐƯỜNG!",
          visual: "sugar-cube-compress",
          takeaway: "Tuy nhiên viên đường ấy sẽ nặng bằng cả khối lượng của toàn bộ loài người cộng lại!"
        }
      ]
    }
  ],

  // 3. Chuyên mục "Em có biết?" - Mở rộng kiến thức thực tiễn
  didYouKnow: [
    {
      id: "atomic-clock",
      title: "Đồng hồ nguyên tử Cesium - Cỗ máy thời gian chính xác nhất hành tinh",
      tag: "Công nghệ cao",
      icon: "clock",
      content: "Đồng hồ nguyên tử hoạt động dựa trên tần số dao động điện từ của nguyên tử Cesium-133 (dao động chính xác 9.192.631.770 chu kỳ mỗi giây). Nó chính xác đến mức sai số không quá 1 giây sau mỗi... 100 triệu năm! Hệ thống định vị GPS trên điện thoại của bạn hoạt động được là nhờ đồng hồ nguyên tử này."
    },
    {
      id: "human-atoms",
      title: "Cơ thể bạn chứa bao nhiêu nguyên tử?",
      tag: "Sinh học & Con người",
      icon: "body",
      content: "Một cơ thể người trưởng thành nặng khoảng 70 kg chứa xấp xỉ 7 tỷ tỷ tỷ ($7 \\times 10^{27}$) nguyên tử! Trong đó, nguyên tử Hydrogen chiếm khoảng 62% về số lượng, tiếp theo là Oxygen (24%) và Carbon (12%). Rất nhiều nguyên tử trong cơ thể bạn từng là một phần của các vì sao cổ đại cách đây hàng tỷ năm."
    },
    {
      id: "nuclear-medicine",
      title: "Y học hạt nhân: Nguyên tử cứu người",
      tag: "Y tế & Sức khỏe",
      icon: "medical",
      content: "Đồng vị phóng xạ của Iod (Iodine-131) được đưa vào cơ thể để chữa trị ung thư tuyến giáp, vì tuyến giáp hấp thụ hầu hết lượng iod. Trong chụp cắt lớp PET, các hạt positron (phản electron) phát ra từ nguyên tử giúp bác sĩ nhìn thấy khối u kích thước siêu nhỏ mà mắt thường không thể phát hiện."
    },
    {
      id: "gold-stars",
      title: "Vàng trên ngón tay bạn đến từ vụ nổ sao trong vũ trụ",
      tag: "Thiên văn học",
      icon: "gold",
      content: "Những nguyên tử nặng như Vàng (Au) và Bạch kim (Pt) không thể được tạo ra trong các phản ứng hóa học thông thường hay thậm chí trong tâm Mặt Trời. Chúng chỉ được sinh ra trong các sự kiện vũ trụ khủng khiếp nhất: vụ nổ siêu tân tinh (Supernova) hoặc va chạm giữa hai ngôi sao neutron cách đây hàng tỷ năm trước khi Trái Đất hình thành!"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DIDACTIC_CONTENT };
}
