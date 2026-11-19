export const categories = ['Tất cả', 'Quần', 'Áo', 'Váy', 'Phụ kiện', 'Mũ']

export const FREE_SHIPPING_THRESHOLD = 1000000
export const SHIPPING_FEE = 35000
export const COUPONS = {
  LUMA10: {
    code: 'LUMA10',
    rate: 0.1,
    label: 'Giảm 10% toàn bộ đơn hàng',
  },
}

export const categoryMeta = [
  {
    name: 'Quần',
    subtitle: 'Phom suông & cắt may chuẩn mực',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Áo',
    subtitle: 'Linen, lụa & cotton hữu cơ',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Váy',
    subtitle: 'Đường cắt mềm mại & nữ tính',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Phụ kiện',
    subtitle: 'Điểm nhấn tối giản tinh tế',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Mũ',
    subtitle: 'Hoàn thiện phong cách mỗi ngày',
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80',
  },
]

export const products = [
  {
    id: 1,
    name: 'Quần Jeans Ống Rộng Luna',
    category: 'Quần',
    price: 689000,
    oldPrice: 850000,
    rating: 4.9,
    sold: 1240,
    badge: 'Bán chạy',
    isNew: false,
    color: '#D8DFEA',
    swatches: [
      { name: 'Xanh Indigo Nhạt', hex: '#9FB3C8' },
      { name: 'Kem Ngà', hex: '#EDE8DF' },
      { name: 'Than Chì', hex: '#2B2B2B' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: '100% Cotton Denim 12oz không co rút',
    description:
      'Phom ống suông cạp cao giúp kéo dài tỷ lệ đôi chân, giữ dáng đứng thanh lịch nhưng vẫn mềm mại khi di chuyển cả ngày.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Áo Sơ Mi Linen Thanh Lịch',
    category: 'Áo',
    price: 549000,
    oldPrice: 690000,
    rating: 4.9,
    sold: 980,
    badge: 'Yêu thích',
    isNew: true,
    color: '#EFE7DC',
    swatches: [
      { name: 'Trắng Sứ', hex: '#F7F5F0' },
      { name: 'Be Cát', hex: '#D8C7B2' },
      { name: 'Nâu Espresso', hex: '#4E3B31' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: '70% Linen Bỉ, 30% Cotton tự nhiên thoáng khí',
    description:
      'Thiết kế cổ đức tinh gọn, hàng khuy vỏ trai ánh xà cừ cùng độ rủ tự nhiên của sợi lanh cao cấp, dễ phối cùng quần vải suông.',
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Váy Midi Lụa Mùa Hè Solis',
    category: 'Váy',
    price: 890000,
    oldPrice: 1120000,
    rating: 4.9,
    sold: 640,
    badge: 'Mới',
    isNew: true,
    color: '#F2E5DF',
    swatches: [
      { name: 'Champagne', hex: '#D8C3A5' },
      { name: 'Đen Tuyền', hex: '#1A1A1A' },
      { name: 'Hồng Phấn Khói', hex: '#DFC5C0' },
    ],
    sizes: ['S', 'M', 'L'],
    fabric: 'Lụa Tencel cao cấp bề mặt mờ sang trọng',
    description:
      'Đường cắt thiên vải (bias-cut) ôm nhẹ đường nét cơ thể, mang lại chuyển động uyển chuyển cho những buổi tiệc tối hay dạo phố.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Túi Đeo Vai Da Mini Luna',
    category: 'Phụ kiện',
    price: 720000,
    oldPrice: 890000,
    rating: 4.8,
    sold: 430,
    badge: '',
    isNew: false,
    color: '#E7DDD2',
    swatches: [
      { name: 'Nâu Caramel', hex: '#9A6B4A' },
      { name: 'Đen Cổ Điển', hex: '#181818' },
      { name: 'Kem Sữa', hex: '#EDE6DB' },
    ],
    sizes: ['Free Size'],
    fabric: 'Da thực vật vân mịn, khóa kim loại mạ vàng nhạt',
    description:
      'Phom túi bán nguyệt tối giản, kích thước gọn nhẹ nhưng đủ không gian cho điện thoại, ví và thỏi son hàng ngày.',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Mũ Bucket Cotton Minimal',
    category: 'Mũ',
    price: 289000,
    oldPrice: 360000,
    rating: 4.8,
    sold: 920,
    badge: 'Giá tốt',
    isNew: false,
    color: '#EAE4D8',
    swatches: [
      { name: 'Be Tự Nhiên', hex: '#DDD3C2' },
      { name: 'Đen Than', hex: '#1E1E1E' },
      { name: 'Xanh Olive', hex: '#6E735B' },
    ],
    sizes: ['Free Size'],
    fabric: '100% Cotton Twill dệt chéo dày dặn',
    description:
      'Vành mũ độ rộng vừa phải giúp che nắng tinh tế và giữ phom đứng, dễ gấp gọn mang theo trong mọi chuyến đi.',
    image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Quần Tây Ống Suông Atelier',
    category: 'Quần',
    price: 620000,
    oldPrice: 780000,
    rating: 4.9,
    sold: 750,
    badge: 'Bán chạy',
    isNew: false,
    color: '#E3DFD7',
    swatches: [
      { name: 'Đen Obsidian', hex: '#161616' },
      { name: 'Xám Đá', hex: '#8E8B85' },
      { name: 'Kem Bơ', hex: '#EAE2D3' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: 'Vải tuyết mưa pha rayon ít nhăn, rủ mượt',
    description:
      'Chi tiết xếp ly đôi phía trước tạo độ rủ sắc nét, là mảnh ghép chuẩn mực cho tủ đồ công sở và dạo phố hiện đại.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 7,
    name: 'Áo Thun Cotton Hữu Cơ Everyday',
    category: 'Áo',
    price: 320000,
    oldPrice: 390000,
    rating: 4.9,
    sold: 1850,
    badge: 'Bán chạy',
    isNew: false,
    color: '#E5E8E4',
    swatches: [
      { name: 'Trắng Tinh Khôi', hex: '#FAF9F6' },
      { name: 'Đen Than', hex: '#1B1B1B' },
      { name: 'Xám Tro', hex: '#A5A39E' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: '100% Cotton Compact 240gsm bề mặt mịn',
    description:
      'Cổ tròn bo dày dặn không bai dão, đường may vai tinh tế mang lại cảm giác thoải mái tuyệt đối từ sáng đến tối.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 8,
    name: 'Váy Denim Dáng Chữ A Clair',
    category: 'Váy',
    price: 690000,
    oldPrice: 860000,
    rating: 4.7,
    sold: 390,
    badge: '',
    isNew: true,
    color: '#D5DEE6',
    swatches: [
      { name: 'Xanh Cổ Điển', hex: '#4F6D8C' },
      { name: 'Trắng Kem', hex: '#F1ECE2' },
    ],
    sizes: ['S', 'M', 'L'],
    fabric: 'Cotton Denim mềm đã xử lý wash enzym',
    description:
      'Phom chữ A chiết eo nhẹ cùng đường chỉ nổi tinh xảo, cân bằng giữa vẻ trẻ trung và sự chỉn chu tối giản.',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 9,
    name: 'Áo Blazer Dáng Suông Noir',
    category: 'Áo',
    price: 1290000,
    oldPrice: 1590000,
    rating: 5.0,
    sold: 510,
    badge: 'Mới',
    isNew: true,
    color: '#E6E2DC',
    swatches: [
      { name: 'Đen Tuyền', hex: '#151515' },
      { name: 'Be Yến Mạch', hex: '#D6CBB9' },
      { name: 'Nâu Khói', hex: '#6B5B50' },
    ],
    sizes: ['S', 'M', 'L'],
    fabric: 'Wool-blend cao cấp, lót lụa Habutai thoáng nhẹ',
    description:
      'Cầu vai dựng tự nhiên, ve áo sắc nét và khuy bọc vải đồng màu — biểu tượng thanh lịch cho mọi bản phối layering.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 10,
    name: 'Quần Short Linen Cạp Cao Verve',
    category: 'Quần',
    price: 420000,
    oldPrice: 520000,
    rating: 4.8,
    sold: 470,
    badge: 'Giá tốt',
    isNew: false,
    color: '#ECE6DA',
    swatches: [
      { name: 'Cát Sáng', hex: '#DFD4C2' },
      { name: 'Nâu Đất', hex: '#8A6B52' },
      { name: 'Đen Mờ', hex: '#222222' },
    ],
    sizes: ['S', 'M', 'L'],
    fabric: '100% Linen sợi mảnh thoáng mát',
    description:
      'Độ dài qua giữa đùi lịch sự kết hợp túi chéo sâu tiện dụng, hoàn hảo cho những ngày nắng nhẹ cuối tuần.',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 11,
    name: 'Thắt Lưng Da Bản Mảnh Élan',
    category: 'Phụ kiện',
    price: 390000,
    oldPrice: 480000,
    rating: 4.8,
    sold: 615,
    badge: 'Yêu thích',
    isNew: false,
    color: '#E9E2D7',
    swatches: [
      { name: 'Đen Khóa Vàng', hex: '#1B1B1B' },
      { name: 'Nâu Cognac', hex: '#7F4F2E' },
    ],
    sizes: ['Free Size'],
    fabric: 'Da thật nguyên tấm, khóa đồng thau chải xước',
    description:
      'Bản rộng 2.2cm thanh thoát giúp nhấn eo cho áo blazer, đầm sơ mi hoặc quần tây cạp cao một cách đầy tinh tế.',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 12,
    name: 'Mũ Lưỡi Trai Len Cashmere Blend',
    category: 'Mũ',
    price: 349000,
    oldPrice: 430000,
    rating: 4.9,
    sold: 380,
    badge: 'Mới',
    isNew: true,
    color: '#E5DFD5',
    swatches: [
      { name: 'Xám Chì', hex: '#595856' },
      { name: 'Kem Yến Mạch', hex: '#E4DACB' },
      { name: 'Đen Cổ Điển', hex: '#181818' },
    ],
    sizes: ['Free Size'],
    fabric: 'Len pha Cashmere mềm mịn, khóa chỉnh kim loại mờ',
    description:
      'Phom mũ ôm đầu mềm mại không logo phô trương, nâng tầm vẻ ngoài tối giản cho trang phục thường nhật.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80',
  },
]

const fallbackById = new Map(products.map((p) => [p.id, p]))
const fallbackByCategory = new Map()
products.forEach((p) => {
  if (!fallbackByCategory.has(p.category)) {
    fallbackByCategory.set(p.category, p)
  }
})

/**
 * Chuẩn hóa dữ liệu sản phẩm từ FastAPI backend (snake_case, ít trường hơn)
 * sang định dạng editorial đầy đủ ảnh, bảng màu và kích thước.
 */
export function normalizeProduct(raw) {
  const ref = fallbackById.get(raw.id) || fallbackByCategory.get(raw.category) || products[0]
  return {
    ...ref,
    ...raw,
    oldPrice: raw.old_price ?? raw.oldPrice ?? ref.oldPrice ?? null,
    badge: raw.badge ?? '',
    swatches: raw.swatches || ref.swatches,
    sizes: raw.sizes || ref.sizes,
    image: raw.image || ref.image,
    fabric: raw.fabric || ref.fabric,
    description: raw.description || ref.description,
  }
}

export const formatPrice = (value) =>
  new Intl.NumberFormat('vi-VN').format(Math.round(value || 0)) + '₫'
