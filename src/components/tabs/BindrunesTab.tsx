interface BindrunesTabProps {
  onImageClick: (src: string) => void;
}

/** Tab "Bindrunes": nội dung tĩnh giải thích bindrune + 2 ảnh minh họa có thể phóng to. */
function BindrunesTab({ onImageClick }: BindrunesTabProps) {
  return (
    <div className="rune-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>Bindrunes (Mật Chú Phối Hợp)</h2>
      <p style={{ marginBottom: '2rem', textAlign: 'center', color: '#cbd5e0', lineHeight: '1.6' }}>
        <strong>Bindrune</strong> là sự kết hợp của hai hoặc nhiều rune thành một biểu tượng duy nhất. Chúng thường được dùng để tạo nên biểu tượng mang ý định tổng hợp từ nhiều ý nghĩa rune khác nhau.
      </p>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>Cách thức vận hành của Bindrune</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.6', textAlign: 'justify' }}>
          Khi tạo ra một bindrune, các biểu tượng cổ tự sẽ được xếp chồng lên nhau, đồng thời các đường nét chung được hợp nhất. Quá trình này tạo nên một ký tự đồng nhất mang theo ý định và sức mạnh tổng hợp của từng rune đơn lẻ. Các bindrune phổ biến thường là sự kết hợp của 2-3 chữ, dù trên thực tế vẫn tồn tại những cấu trúc phức tạp hơn.
        </p>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>Tự tạo Bindrune cho riêng bạn</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.6', textAlign: 'justify' }}>
          Để kiến tạo một bindrune, trước hết hãy xác định các cổ tự có tầng ý nghĩa tương hợp với mong muốn của bạn. Sau đó, hãy phác thảo cách chúng chồng lên nhau hoặc dùng chung các nét trục. Mục tiêu là tạo nên một biểu tượng hài hòa, cân bằng, chuyển động tự nhiên nhưng vẫn giữ được các đặc điểm nhận diện cốt lõi của từng chữ.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(145deg, #1b202e, #0e111a)', borderRadius: '12px', border: '1px solid rgba(99,179,237,0.2)' }}>
          <img src={`${import.meta.env.BASE_URL}bindrunethurisazraidho1.png`} alt="Bindrune ghép Thurisaz và Raidho" style={{ maxWidth: '150px', height: 'auto', marginBottom: '1rem', cursor: 'pointer', filter: 'drop-shadow(0 0 8px rgba(99,179,237,0.4))' }} onClick={() => onImageClick(`${import.meta.env.BASE_URL}bindrunethurisazraidho1.png`)} />
          <h4 style={{ color: '#e8f4fd', marginBottom: '0.5rem', fontSize: '1.3rem' }}>Thurisaz + Raidho</h4>
          <p style={{ fontSize: '0.9rem', color: '#63b3ed', marginBottom: '0.5rem' }}>Protection + Journey</p>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e0', fontStyle: 'italic', lineHeight: '1.5', textAlign: 'justify' }}>
            Sự kết hợp giữa lá chắn phòng thủ kiên cố của Thurisaz và sự định hướng luân chuyển trôi chảy của Raidho. Mật chú này thường dùng cầu bình an, bảo hộ chủ nhân vững bước trên mọi chuyến đi xa hoặc các bước chuyển mình lớn của tâm thức.
          </p>
        </div>
        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'linear-gradient(145deg, #1b202e, #0e111a)', borderRadius: '12px', border: '1px solid rgba(99,179,237,0.2)' }}>
          <img src={`${import.meta.env.BASE_URL}bindruneingwazothala1.png`} alt="Bindrune ghép Ingwaz và Othala" style={{ maxWidth: '150px', height: 'auto', marginBottom: '1rem', cursor: 'pointer', filter: 'drop-shadow(0 0 8px rgba(99,179,237,0.4))' }} onClick={() => onImageClick(`${import.meta.env.BASE_URL}bindruneingwazothala1.png`)} />
          <h4 style={{ color: '#e8f4fd', marginBottom: '0.5rem', fontSize: '1.3rem' }}>Ingwaz + Othala</h4>
          <p style={{ fontSize: '0.9rem', color: '#63b3ed', marginBottom: '0.5rem' }}>Fertility + Heritage</p>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e0', fontStyle: 'italic', lineHeight: '1.5', textAlign: 'justify' }}>
            Nối liền kén năng lượng trù phú gieo trồng của Ingwaz với bệ đỡ vững chắc từ gia sản tổ tiên Othala. Biểu thị cho sự tiếp nối vững vàng bền bỉ, tạo lập nền tảng gia đình sung túc hoặc tiếp thêm nội lực vững chắc để thực hiện những kế hoạch dài hạn.
          </p>
        </div>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#63b3ed', marginBottom: '1rem', fontSize: '1.4rem' }}>Cách sử dụng Bindrune</h3>
        <p style={{ color: '#e8f4fd', lineHeight: '1.6', textAlign: 'justify' }}>
          Bindrune có thể được khắc lên gỗ, đá, kim loại, vẽ trên giấy, hoặc quán tưởng trong tâm trí cùng vô vàn hình thức thể hiện khác. Chúng thường được ứng dụng để cầu bình an, bảo hộ, định hướng lối đi, hoặc tập trung năng lượng hiện thực hóa một tâm nguyện cụ thể. Sức mạnh của bindrune đến từ ý chí tập trung cao độ phối hợp nhịp nhàng với tần số năng lượng của các cổ tự.
        </p>
      </div>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p style={{ fontStyle: 'italic', opacity: 0.8, color: '#b8d4e6' }}>
          Khi các rune được kết nối với nhau, ý nghĩa của chúng cộng hưởng. Hãy chọn cẩn thận, vì bindrune trở thành biểu tượng sống cho ý định của bạn.
        </p>
      </div>
    </div>
  );
}

export default BindrunesTab;
