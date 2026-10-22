import { CellPartInfo } from '../types';

export const CELL_PARTS: CellPartInfo[] = [
  {
    id: 'outerMembrane',
    name: 'Màng ngoài',
    color: 'Xanh ngọc / Xanh lam',
    hexColor: 0x20b2aa,
    description: 'Lớp bao ngoài đặc trưng ở nhiều vi khuẩn (đặc biệt là vi khuẩn Gram âm), tạo nên ranh giới ngoài cùng và góp phần bảo vệ tế bào trước các tác động môi trường.',
    functionText: 'Bảo vệ tế bào, tham gia kiểm soát sự trao đổi chất qua màng và tạo lớp chắn chọn lọc với môi trường bên ngoài.',
    funFact: 'Ở nhiều vi khuẩn Gram âm, màng ngoài chứa các lipopolysaccharide có thể hoạt động như kháng nguyên hoặc độc tố khi vi khuẩn xâm nhập.',
    category: 'envelope'
  },
  {
    id: 'cellWall',
    name: 'Thành tế bào',
    color: 'Xanh đậm / Xanh rêu',
    hexColor: 0x1e5631,
    description: 'Lớp vỏ cứng chắc nằm phía trong màng ngoài (hoặc bên ngoài màng tế bào tùy loại), được cấu tạo chủ yếu bởi peptidoglycan giúp duy trì hình dạng tế bào.',
    functionText: 'Quyết định hình dạng tế bào và bảo vệ tế bào khỏi bị vỡ do áp suất thẩm thấu cao ở bên trong.',
    funFact: 'Thành tế bào là đích tác dụng của nhiều loại kháng sinh như penicillin (ức chế tổng hợp peptidoglycan khiến vi khuẩn bị tiêu diệt).',
    category: 'envelope'
  },
  {
    id: 'plasmaMembrane',
    name: 'Màng tế bào',
    color: 'Cam nhạt / Vàng sậm',
    hexColor: 0xd4a373,
    description: 'Lớp màng sinh chất nằm phía trong thành tế bào, cấu tạo từ lớp kép phospholipid và protein.',
    functionText: 'Kiểm soát sự vận chuyển các chất ra vào tế bào, là nơi diễn ra các quá trình chuyển hóa năng lượng và tổng hợp protein màng.',
    funFact: 'Màng tế bào ở vi khuẩn thường gấp nếp tạo thành các thể nguyên sinh (mesosome) hỗ trợ quá trình hô hấp tế bào.',
    category: 'envelope'
  },
  {
    id: 'cytoplasm',
    name: 'Tế bào chất',
    color: 'Vàng kem / Vàng nhạt',
    hexColor: 0xfefae0,
    description: 'Phần keo bán lỏng nằm bên trong màng tế bào, chứa nước, các ion khoáng, các phân tử hữu cơ và các bào quan nhỏ.',
    functionText: 'Là môi trường diễn ra hầu hết các phản ứng hóa sinh và quá trình trao đổi chất của tế bào nhân sơ.',
    funFact: 'Tế bào chất không có hệ thống màng nội chất phức tạp hay các bào quan có màng bao bọc như ở tế bào nhân thực.',
    category: 'cytoplasm'
  },
  {
    id: 'nucleoid',
    name: 'Vùng nhân chứa DNA',
    color: 'Tím / Xanh tím',
    hexColor: 0x7b2cbf,
    description: 'Khu vực dạng sợi xoắn tập trung phân tử DNA mạch kép dạng vòng lớn, không có màng nhân bao bọc.',
    functionText: 'Chứa thông tin di truyền quy định mọi hoạt động sống, sinh trưởng và sinh sản của vi khuẩn.',
    funFact: 'Vì không có màng nhân, quá trình phiên mã và dịch mã ở vi khuẩn có thể diễn ra đồng thời ngay trong tế bào chất.',
    category: 'genetic'
  },
  {
    id: 'ribosome',
    name: 'Ribosome',
    color: 'Hồng tím / Đỏ nhạt',
    hexColor: 0xff595e,
    description: 'Các hạt nhỏ li ti phân bố rải rác trong tế bào chất, được cấu tạo từ rRNA và protein (loại 70S).',
    functionText: 'Là nhà máy tổng hợp protein chính của tế bào.',
    funFact: 'Trong mỗi tế bào vi khuẩn có thể chứa hàng chục nghìn hạt ribosome để đáp ứng nhu cầu tổng hợp protein cực nhanh.',
    category: 'cytoplasm'
  },
  {
    id: 'plasmid',
    name: 'Plasmid',
    color: 'Tím sáng / Hồng sáng',
    hexColor: 0x9d4edd,
    description: 'Các phân tử DNA nhỏ dạng vòng độc lập với DNA vùng nhân chính.',
    functionText: 'Mang các gen bổ sung (như gen kháng kháng sinh hoặc gen độc tố), có thể trao đổi giữa các vi khuẩn qua tiếp hợp.',
    funFact: 'Plasmid là công cụ quan trọng trong công nghệ gen để làm thể truyền (vector) chuyển gen mong muốn vào tế bào.',
    category: 'genetic'
  },
  {
    id: 'pili',
    name: 'Lông (Pili)',
    color: 'Xanh lá nhạt',
    hexColor: 0x52b788,
    description: 'Các cấu trúc dạng sợi ngắn mọc tua tủa trên bề mặt tế bào vi khuẩn.',
    functionText: 'Giúp vi khuẩn bám dính chắc vào các bề mặt, giá thể hoặc tế bào chủ, đồng thời tham gia quá trình tiếp hợp trao đổi DNA.',
    funFact: 'Một số loại lông (sex pili) đóng vai trò như chiếc cầu nối để vi khuẩn truyền plasmid cho nhau.',
    category: 'appendage'
  },
  {
    id: 'flagella',
    name: 'Roi (Flagellum)',
    color: 'Xanh lục sáng',
    hexColor: 0x40916c,
    description: 'Cấu trúc sợi dài, mảnh và uốn lượn xuất phát từ bề mặt tế bào, cấu tạo từ protein flagellin.',
    functionText: 'Giúp vi khuẩn di chuyển linh hoạt trong môi trường lỏng hướng về chất dinh dưỡng hoặc tránh chất độc.',
    funFact: 'Roi vi khuẩn hoạt động giống như một chân vịt quay nhờ động cơ proton ở gốc roi, tốc độ quay có thể đạt hàng nghìn vòng/phút.',
    category: 'appendage'
  }
];
