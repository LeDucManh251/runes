import ZoomableImage from '../ZoomableImage';

interface WyrdTabProps {
  onImageClick: (src: string) => void;
}

const WEB_OF_WYRD_1 = `${import.meta.env.BASE_URL}webofwyrd1.png`;
const WEB_OF_WYRD_2 = `${import.meta.env.BASE_URL}webofwyrd2.png`;

/** Tab "Mạng lưới định mệnh (Wyrd)": nội dung tĩnh + 2 ảnh Web of Wyrd có thể phóng to. */
function WyrdTab({ onImageClick }: WyrdTabProps) {
  return (
    <article className="rune-card prose">
      <h2 className="prose-title">Mạng lưới định mệnh (Wyrd)</h2>
      <p className="prose-lead">
        <strong>Mạng lưới Wyrd</strong> biểu trưng cho bản chất liên kết chặt chẽ của vạn vật – giữa quá khứ, hiện tại và tương lai. Đây chính là tấm thảm định mệnh được ba vị nữ thần Norn dệt nên dưới rễ cây thế giới, nơi mỗi hành vi đơn lẻ đều tạo ra những gợn sóng lan tỏa khắp không gian và thời gian.
      </p>
      <section className="prose-section">
        <h3 className="prose-heading">Ba nữ thần số mệnh (Norn)</h3>
        <p className="prose-text">
          <strong>Urd (Quá khứ)</strong> – Người cai quản những gì đã qua, đại diện cho những sợi chỉ đã dệt cố định vào lòng thực tại.<br />
          <strong>Verdandi (Hiện tại)</strong> – Người biểu thị cho những gì đang diễn ra, khoảnh khắc của sự kiến tạo và quyền chủ động lựa chọn.<br />
          <strong>Skuld (Tương lai)</strong> – Người nắm giữ những gì sẽ đến, đại diện cho tiềm năng và những hệ quả nối tiếp từ quá khứ.
        </p>
      </section>
      <section className="prose-section">
        <h3 className="prose-heading">Cửu giới</h3>
        <p className="prose-text">
          Mạng lưới định mệnh kết nối trọn vẹn cả chín cõi giới trong vũ trụ quan thần thoại Bắc Âu, từ đỉnh Asgard linh thiêng đến vực sâu Hel tối tăm. Mỗi thế giới đều tác động qua lại lẫn nhau, và những sợi chỉ của Wyrd buộc chặt chúng lại trong vũ điệu nhân quả vĩnh cửu.
        </p>
      </section>
      <section className="prose-section">
        <h3 className="prose-heading">Hiểu về Wyrd</h3>
        <p className="prose-text">
          Wyrd không đơn thuần là số phận hay định mệnh an bài cố định, mà là một hệ thống mạng lưới phức tạp đan xen giữa các mối quan hệ, những quyết định và hệ quả định hình nên cuộc đời ta. Mỗi lựa chọn ta đưa ra đều tác động tới mô thức chung, và mỗi hành động đều lan tỏa chạm đến vạn vật xung quanh. Quá khứ ảnh hưởng tới hiện tại, hiện tại tạo hình tương lai, nhưng sâu thẳm bên trong, ta luôn giữ quyền tự do để chọn cách bước đi trên con đường của chính mình.
        </p>
      </section>
      <div className="figure-row">
        <ZoomableImage src={WEB_OF_WYRD_1} alt="Biểu tượng Web of Wyrd, mẫu 1" className="figure-img--square" onOpen={onImageClick} />
        <ZoomableImage src={WEB_OF_WYRD_2} alt="Biểu tượng Web of Wyrd, mẫu 2" className="figure-img--square" onOpen={onImageClick} />
      </div>
      <section className="prose-section">
        <h3 className="prose-heading">Biểu tượng</h3>
        <p className="prose-text">
          Toàn bộ 24 Rune Elder Futhark đều có thể được tìm thấy trong Mạng lưới Wyrd. Khi học rune, ta cũng đang đọc các mô thức của chính Wyrd. Rune không tách khỏi Lưới, mà là một phần của nó được biểu hiện thành ký hiệu. Khi bạn rút rune hoặc làm việc với chúng, bạn đang chạm vào các sợi Wyrd. Mỗi rune mang một phần trí tuệ của Lưới và có thể hé lộ cách quá khứ, hiện tại, tương lai đan vào đời sống của bạn.
        </p>
      </section>
    </article>
  );
}

export default WyrdTab;
