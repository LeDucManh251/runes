interface WyrdTabProps {
  onImageClick: (src: string) => void;
}

/** Tab "Mạng lưới định mệnh (Wyrd)": nội dung tĩnh + 2 ảnh Web of Wyrd có thể phóng to. */
function WyrdTab({ onImageClick }: WyrdTabProps) {
  return (
    <div className="rune-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>Mạng lưới định mệnh (Wyrd)</h2>
      <p style={{ marginBottom: '2rem', textAlign: 'center', color: '#cbd5e0', lineHeight: '1.6' }}>
        <strong>Mạng lưới Wyrd</strong> biểu trưng cho bản chất liên kết chặt chẽ của vạn vật – giữa quá khứ, hiện tại và tương lai. Đây chính là tấm thảm định mệnh được ba vị nữ thần Norn dệt nên dưới rễ cây thế giới, nơi mỗi hành vi đơn lẻ đều tạo ra những gợn sóng lan tỏa khắp không gian và thời gian.
      </p>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>BA NỮ THẦN SỐ MỆNH (NORN)</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.8', textAlign: 'justify' }}>
          <strong>Urd (Quá khứ)</strong> – Người cai quản những gì đã qua, đại diện cho những sợi chỉ đã dệt cố định vào lòng thực tại.<br />
          <strong>Verdandi (Hiện tại)</strong> – Người biểu thị cho những gì đang diễn ra, khoảnh khắc của sự kiến tạo và quyền chủ động lựa chọn.<br />
          <strong>Skuld (Tương lai)</strong> – Người nắm giữ những gì sẽ đến, đại diện cho tiềm năng và những hệ quả nối tiếp từ quá khứ.
        </p>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>CỬU GIỚI</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.6', textAlign: 'justify' }}>
          Mạng lưới định mệnh kết nối trọn vẹn cả chín cõi giới trong vũ trụ quan thần thoại Bắc Âu, từ đỉnh Asgard linh thiêng đến vực sâu Hel tối tăm. Mỗi thế giới đều tác động qua lại lẫn nhau, và những sợi chỉ của Wyrd buộc chặt chúng lại trong vũ điệu nhân quả vĩnh cửu.
        </p>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>HIỂU VỀ WYRD</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.6', textAlign: 'justify' }}>
          Wyrd không đơn thuần là số phận hay định mệnh an bài cố định, mà là một hệ thống mạng lưới phức tạp đan xen giữa các mối quan hệ, những quyết định và hệ quả định hình nên cuộc đời ta. Mỗi lựa chọn ta đưa ra đều tác động tới mô thức chung, và mỗi hành động đều lan tỏa chạm đến vạn vật xung quanh. Quá khứ ảnh hưởng tới hiện tại, hiện tại tạo hình tương lai, nhưng sâu thẳm bên trong, ta luôn giữ quyền tự do để chọn cách bước đi trên con đường của chính mình.
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <img src={`${import.meta.env.BASE_URL}webofwyrd1.png`} alt="Web of Wyrd 1" style={{ width: '180px', height: '180px', objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(99,179,237,0.2)', cursor: 'pointer' }} onClick={() => onImageClick(`${import.meta.env.BASE_URL}webofwyrd1.png`)} />
        <img src={`${import.meta.env.BASE_URL}webofwyrd2.png`} alt="Web of Wyrd 2" style={{ width: '180px', height: '180px', objectFit: 'contain', borderRadius: '8px', border: '1px solid rgba(99,179,237,0.2)', cursor: 'pointer' }} onClick={() => onImageClick(`${import.meta.env.BASE_URL}webofwyrd2.png`)} />
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>BIỂU TƯỢNG</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.6', textAlign: 'justify' }}>
          Toàn bộ 24 Rune Elder Futhark đều có thể được tìm thấy trong Mạng lưới Wyrd. Khi học rune, ta cũng đang đọc các mô thức của chính Wyrd. Rune không tách khỏi Lưới, mà là một phần của nó được biểu hiện thành ký hiệu. Khi bạn rút rune hoặc làm việc với chúng, bạn đang chạm vào các sợi Wyrd. Mỗi rune mang một phần trí tuệ của Lưới và có thể hé lộ cách quá khứ, hiện tại, tương lai đan vào đời sống của bạn.
        </p>
      </div>
    </div>
  );
}

export default WyrdTab;
