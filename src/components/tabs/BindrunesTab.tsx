import ZoomableImage from '../ZoomableImage';

interface BindrunesTabProps {
  onImageClick: (src: string) => void;
}

const THURISAZ_RAIDHO = `${import.meta.env.BASE_URL}bindrunethurisazraidho1.png`;
const INGWAZ_OTHALA = `${import.meta.env.BASE_URL}bindruneingwazothala1.png`;

/** Tab "Bindrunes": nội dung tĩnh giải thích bindrune + 2 ảnh minh họa có thể phóng to. */
function BindrunesTab({ onImageClick }: BindrunesTabProps) {
  return (
    <article className="rune-card prose">
      <h2 className="prose-title">Bindrunes (Mật Chú Phối Hợp)</h2>
      <p className="prose-lead">
        <strong>Bindrune</strong> là sự kết hợp của hai hoặc nhiều rune thành một biểu tượng duy nhất. Chúng thường được dùng để tạo nên biểu tượng mang ý định tổng hợp từ nhiều ý nghĩa rune khác nhau.
      </p>
      <section className="prose-section">
        <h3 className="prose-heading">Cách thức vận hành của Bindrune</h3>
        <p className="prose-text">
          Khi tạo ra một bindrune, các biểu tượng cổ tự sẽ được xếp chồng lên nhau, đồng thời các đường nét chung được hợp nhất. Quá trình này tạo nên một ký tự đồng nhất mang theo ý định và sức mạnh tổng hợp của từng rune đơn lẻ. Các bindrune phổ biến thường là sự kết hợp của 2-3 chữ, dù trên thực tế vẫn tồn tại những cấu trúc phức tạp hơn.
        </p>
      </section>
      <section className="prose-section">
        <h3 className="prose-heading">Tự tạo Bindrune cho riêng bạn</h3>
        <p className="prose-text">
          Để kiến tạo một bindrune, trước hết hãy xác định các cổ tự có tầng ý nghĩa tương hợp với mong muốn của bạn. Sau đó, hãy phác thảo cách chúng chồng lên nhau hoặc dùng chung các nét trục. Mục tiêu là tạo nên một biểu tượng hài hòa, cân bằng, chuyển động tự nhiên nhưng vẫn giữ được các đặc điểm nhận diện cốt lõi của từng chữ.
        </p>
      </section>
      <div className="figure-grid">
        <figure className="figure">
          <ZoomableImage src={THURISAZ_RAIDHO} alt="Bindrune ghép Thurisaz và Raidho" onOpen={onImageClick} />
          <h4 className="figure-title">Thurisaz + Raidho</h4>
          <p className="figure-subtitle">Protection + Journey</p>
          <p className="figure-caption">
            Sự kết hợp giữa lá chắn phòng thủ kiên cố của Thurisaz và sự định hướng luân chuyển trôi chảy của Raidho. Mật chú này thường dùng cầu bình an, bảo hộ chủ nhân vững bước trên mọi chuyến đi xa hoặc các bước chuyển mình lớn của tâm thức.
          </p>
        </figure>
        <figure className="figure">
          <ZoomableImage src={INGWAZ_OTHALA} alt="Bindrune ghép Ingwaz và Othala" onOpen={onImageClick} />
          <h4 className="figure-title">Ingwaz + Othala</h4>
          <p className="figure-subtitle">Fertility + Heritage</p>
          <p className="figure-caption">
            Nối liền kén năng lượng trù phú gieo trồng của Ingwaz với bệ đỡ vững chắc từ gia sản tổ tiên Othala. Biểu thị cho sự tiếp nối vững vàng bền bỉ, tạo lập nền tảng gia đình sung túc hoặc tiếp thêm nội lực vững chắc để thực hiện những kế hoạch dài hạn.
          </p>
        </figure>
      </div>
      <section className="prose-section">
        <h3 className="prose-heading">Cách sử dụng Bindrune</h3>
        <p className="prose-text">
          Bindrune có thể được khắc lên gỗ, đá, kim loại, vẽ trên giấy, hoặc quán tưởng trong tâm trí cùng vô vàn hình thức thể hiện khác. Chúng thường được ứng dụng để cầu bình an, bảo hộ, định hướng lối đi, hoặc tập trung năng lượng hiện thực hóa một tâm nguyện cụ thể. Sức mạnh của bindrune đến từ ý chí tập trung cao độ phối hợp nhịp nhàng với tần số năng lượng của các cổ tự.
        </p>
      </section>
      <p className="prose-closing">
        Khi các rune được kết nối với nhau, ý nghĩa của chúng cộng hưởng. Hãy chọn cẩn thận, vì bindrune trở thành biểu tượng sống cho ý định của bạn.
      </p>
    </article>
  );
}

export default BindrunesTab;
