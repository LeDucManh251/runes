export interface Annotation {
  word: string;
  translated: string;
  historyNote: string;
}

export interface Rune {
  id: string;
  symbol: string;
  name: string;
  meaning: string;
  description: string;
  /** Suy luận/gợi ý chung khi tra từ điển (không phụ thuộc câu hỏi tiên đoán). */
  interpretation: string;
  /**
   * Mẫu lời khuyên dùng khi rút bài tiên đoán. Hỗ trợ 2 placeholder:
   * {subject} - chủ đề câu hỏi người dùng nhập (hoặc "tình huống của bạn")
   * {name}    - tên rune (vd: "Uruz")
   */
  advice: string;
  annotations?: Annotation[];
}

export const runes: Rune[] = [
  {
    id: "fehu",
    symbol: "ᚠ",
    name: "Fehu",
    meaning: "Của cải / Thịnh vượng",
    description: "Đại diện cho của cải vật chất, sự sung túc và quyền năng kiến tạo. Ký tự này biểu trưng cho năng lượng hiện thực hóa và dòng chảy của các nguồn lực trong cuộc sống của bạn.",
    interpretation: "Tài lộc và năng lượng dồi dào đang luân chuyển, mang đến cơ hội biến ước mơ thành hiện thực.",
    advice: "hãy nhìn vào điều đang có giá trị trong {subject}. Rune này hướng bạn đến nguồn lực, sự trao đổi thực tế và thứ có thể nuôi lớn quyết định kế tiếp.",
    annotations: [
      {
        word: "Cattle",
        translated: "Gia súc",
        historyNote: "Thời Bắc Âu cổ, gia súc là thước đo tài sản có tính thanh khoản cao nhất, có thể di chuyển và trao đổi thay cho tiền mặt."
      },
      {
        word: "Wealth",
        translated: "Của cải",
        historyNote: "Khái niệm giàu có ở đây không tĩnh lặng, mà là dòng chảy năng lượng được luân chuyển liên tục để tạo ra giá trị."
      },
      {
        word: "Prosperity",
        translated: "Thịnh vượng",
        historyNote: "Sự thịnh vượng đến từ việc phân phối và sử dụng nguồn lực một cách khôn ngoan chứ không phải tích trữ cực đoan."
      }
    ]
  },
  {
    id: "uruz",
    symbol: "ᚢ",
    name: "Uruz",
    meaning: "Sức mạnh / Sinh lực",
    description: "Hiện thân của sức mạnh thô mộc, năng lượng nguyên sơ và quyền năng chuyển hóa. Ký tự này đại diện cho một mãnh lực hoang dã, bất kham ẩn sâu bên trong cùng lòng can đảm đối diện với mọi thử thách.",
    interpretation: "Đã đến lúc khai phá nội lực mãnh liệt và lòng dũng cảm để vượt qua ranh giới, đón nhận sự thay đổi lớn.",
    advice: "hãy phản hồi từ sự vững vàng, không phải từ áp lực. {name} cho thấy bạn có nhiều sức bền hơn vẻ ngoài của tình huống.",
    annotations: [
      {
        word: "Aurochs",
        translated: "Bò rừng cổ đại",
        historyNote: "Loài bò rừng khổng lồ hung dữ đã tuyệt chủng của châu Âu. Người Germanic cổ coi việc hạ gục một con Aurochs là biểu tượng của sự trưởng thành."
      },
      {
        word: "Strength",
        translated: "Sức mạnh",
        historyNote: "Không chỉ là cơ bắp, đây là sức mạnh tinh thần bền bỉ để vượt qua áp lực và tôi luyện bản thân qua nghịch cảnh."
      },
      {
        word: "Vitality",
        translated: "Sinh lực",
        historyNote: "Nguồn năng lượng sống thô sơ, nguyên bản nhất giúp cơ thể chữa lành tự nhiên và duy trì ý chí sinh tồn."
      }
    ]
  },
  {
    id: "thurisaz",
    symbol: "ᚦ",
    name: "Thurisaz",
    meaning: "Xung đột / Phòng thủ",
    description: "Tượng trưng cho sự che chở, phòng vệ và năng lực vượt qua những rào cản. Ký tự này đại diện cho tinh thần của một chiến binh và khả năng gìn giữ, bảo vệ những gì thực sự quan trọng đối với bạn.",
    interpretation: "Hãy thiết lập ranh giới phòng thủ vững chắc để bảo toàn sức mạnh và vượt qua chướng ngại vật trước mắt.",
    advice: "hãy đặt ranh giới trước khi hành động. Lời khuyên là bảo vệ điều quan trọng và đừng phản ứng chỉ vì sợ hãi.",
    annotations: [
      {
        word: "Thorn",
        translated: "Cái gai",
        historyNote: "Vũ khí tự vệ của tự nhiên. Cái gai vừa cảnh báo nguy hiểm, vừa đóng vai trò như một lá chắn bảo vệ phần lõi dễ bị tổn thương."
      },
      {
        word: "Protection",
        translated: "Bảo vệ",
        historyNote: "Gắn liền với chiếc búa Mjölnir của thần Thor – biểu tượng tối cao để trấn áp quỷ dữ và bảo vệ nhân loại khỏi hỗn mang."
      },
      {
        word: "Defense",
        translated: "Phòng thủ",
        historyNote: "Lời khuyên cần vạch rõ ranh giới cá nhân, biết nói 'không' và phòng thủ chủ động trước khi các tác động tiêu cực xâm nhập."
      }
    ]
  },
  {
    id: "ansuz",
    symbol: "ᚨ",
    name: "Ansuz",
    meaning: "Giao tiếp / Trí tuệ",
    description: "Đại diện cho trí tuệ thiêng liêng, khả năng truyền thông và sức mạnh của ngôn từ. Ký tự này biểu trưng cho nguồn cảm hứng, tri thức rộng lớn và sợi dây kết nối với tầng nhận thức cao hơn.",
    interpretation: "Hãy chú ý đến những thông điệp xung quanh, lắng nghe tiếng gọi của trí tuệ và trực giác để tìm ra hướng đi sáng suốt.",
    advice: "hãy làm rõ lời nói, tín hiệu hoặc lời khuyên quanh {subject}. Một cuộc trò chuyện thẳng thắn có thể mở ra bước tiếp theo.",
    annotations: [
      {
        word: "God",
        translated: "Thần linh",
        historyNote: "Đại diện trực tiếp cho Tối cao thần Odin. Thần thoại kể rằng Odin đã thổi hơi thở sự sống đầu tiên để tạo ra con người."
      },
      {
        word: "Communication",
        translated: "Giao tiếp",
        historyNote: "Sức mạnh của ngôn từ, thi ca và các thông điệp. Biểu thị cho việc truyền đạt tri thức và sự thấu hiểu lẫn nhau."
      },
      {
        word: "Wisdom",
        translated: "Trí tuệ",
        historyNote: "Tri thức tâm linh đỉnh cao có được từ sự chiêm nghiệm, học hỏi hoặc lời khuyên từ những bậc tiền bối uyên bác."
      }
    ]
  },
  {
    id: "raidho",
    symbol: "ᚱ",
    name: "Raidho",
    meaning: "Hành trình / Chuyển động",
    description: "Hiện thân của chuyến hành trình trong đời sống, bao gồm cả những chuyển động thể xác lẫn nấc thang tinh thần. Ký tự này nói về sự tiến triển, nhịp điệu hướng về phía trước và con đường phát triển cá nhân của bạn.",
    interpretation: "Cuộc sống của bạn đang chuyển động đúng quỹ đạo. Hãy kiên định tiến bước trên hành trình tự hoàn thiện bản thân.",
    advice: "hãy xem đây là một hành trình, không chỉ là một quyết định đơn lẻ. Một bước nhỏ được kiểm chứng cẩn thận có giá trị hơn câu trả lời hoàn hảo.",
    annotations: [
      {
        word: "Journey",
        translated: "Hành trình",
        historyNote: "Hành trình tiến hóa của linh hồn. Gợi ý rằng mọi trải nghiệm (dù tốt hay xấu) đều là các chặng cần thiết của cuộc đời."
      },
      {
        word: "Travel",
        translated: "Du hành",
        historyNote: "Nghĩa đen gắn liền với cỗ xe ngựa của các chiến binh. Biểu thị cho sự dịch chuyển địa lý, đi lại, hoặc đổi mới môi trường."
      },
      {
        word: "Movement",
        translated: "Chuyển động",
        historyNote: "Hành động đưa trật tự vào trong hỗn mang, giữ cho cuộc sống vận hành liên tục, không bị sa lầy vào trì trệ."
      }
    ]
  },
  {
    id: "kenaz",
    symbol: "ᚲ",
    name: "Kenaz",
    meaning: "Tri thức / Sáng tạo",
    description: "Tượng trưng cho ánh sáng của tri thức, tư duy sáng tạo và nguồn cảm hứng bất tận. Ký tự này đại diện cho ngọn lửa chuyển hóa và quyền năng soi rọi, làm sáng tỏ con đường phía trước.",
    interpretation: "Ánh sáng từ sự hiểu biết và cảm hứng sáng tạo sẽ giúp bạn xua tan bóng tối hoài nghi, nhìn rõ lối đi.",
    advice: "hãy đưa phần mơ hồ ra ánh sáng. Thu thập dữ kiện, gọi tên mô thức, rồi lựa chọn với nhiều sáng tạo hơn.",
    annotations: [
      {
        word: "Torch",
        translated: "Ngọn đuốc",
        historyNote: "Ngọn đuốc nhân tạo do con người kiểm soát. Nó đại diện cho ánh sáng dẫn đường trong bóng tối và sự ấm áp của mái nhà."
      },
      {
        word: "Knowledge",
        translated: "Tri thức",
        historyNote: "Ánh sáng tri thức xua tan sự mơ hồ. Nhận thức rõ bản chất sự vật giúp bạn không còn bị dẫn dắt bởi ảo tưởng."
      },
      {
        word: "Creativity",
        translated: "Sáng tạo",
        historyNote: "Ngọn lửa của nghệ thuật, nghề rèn và kỹ nghệ. Sức mạnh biến đổi nguyên liệu thô thành những tác phẩm có giá trị."
      }
    ]
  },
  {
    id: "gebo",
    symbol: "ᚷ",
    name: "Gebo",
    meaning: "Món quà / Trao đổi",
    description: "Đại diện cho sự trao đổi thiêng liêng của những món quà, mối quan hệ cộng tác và trạng thái cân bằng hoàn hảo giữa cho và nhận. Ký tự này biểu trưng cho sự hòa hợp và lòng tôn trọng lẫn nhau.",
    interpretation: "Một mối lương duyên, sự cam kết hay khế ước cân bằng sẽ mang lại sự hòa hợp và những món quà giá trị cho cuộc sống của bạn.",
    advice: "hãy chú ý đến sự trao đổi. Câu trả lời lành mạnh thường là nơi cho và nhận vẫn còn cân bằng.",
    annotations: [
      {
        word: "Gift",
        translated: "Món quà",
        historyNote: "Người phương Bắc cổ tin rằng một món quà luôn đi kèm một nghĩa vụ cam kết. Nhận quà đồng nghĩa với việc thiết lập mối quan hệ."
      },
      {
        word: "Exchange",
        translated: "Trao đổi",
        historyNote: "Dòng chảy hai chiều của năng lượng. Mọi mối quan hệ muốn bền vững đều phải dựa trên nguyên tắc cho và nhận công bằng."
      },
      {
        word: "Partnership",
        translated: "Hợp tác",
        historyNote: "Sự kết giao dựa trên lòng tôn trọng độc lập của nhau, không bên nào áp đặt hay nuốt chửng bản ngã của bên nào."
      }
    ]
  },
  {
    id: "wunjo",
    symbol: "ᚹ",
    name: "Wunjo",
    meaning: "Niềm vui / Hài hòa",
    description: "Hiện thân của niềm vui thuần khiết, sự hòa hợp và khoảnh khắc mọi ước nguyện được viên mãn. Ký tự này đại diện cho trạng thái hạnh phúc tuyệt đối khi ý chí của bạn được đồng điệu với định mệnh.",
    interpretation: "Giai đoạn của sự mãn nguyện và bình yên đang đến. Bạn sẽ tìm thấy sự hòa hợp trọn vẹn giữa mong muốn cá nhân và số phận.",
    advice: "hãy tìm lựa chọn giúp khôi phục sự nhẹ nhõm mà vẫn không né tránh thực tế. Niềm vui ở đây là một tín hiệu đáng lắng nghe.",
    annotations: [
      {
        word: "Joy",
        translated: "Niềm vui",
        historyNote: "Niềm vui không đến từ kích động bên ngoài, mà là trạng thái bình yên, nhẹ nhõm sâu sắc khi không còn xung đột nội tâm."
      },
      {
        word: "Harmony",
        translated: "Hài hòa",
        historyNote: "Hình ảnh các thành viên trong bộ tộc chung sống hòa thuận dưới một mái nhà, cùng chia sẻ thành quả sau chuỗi ngày gian khổ."
      },
      {
        word: "Bliss",
        translated: "Hạnh phúc",
        historyNote: "Trạng thái may mắn tối thượng khi cái tôi cá nhân vận hành trôi chảy dọc theo dòng chảy sắp đặt của số phận."
      }
    ]
  },
  {
    id: "hagalaz",
    symbol: "ᚺ",
    name: "Hagalaz",
    meaning: "Xáo trộn / Biến đổi",
    description: "Tượng trưng cho những biến động bất ngờ, sự gián đoạn dữ dội và sức mạnh không thể cưỡng lại từ tự nhiên. Ký tự này đại diện cho sự đổ vỡ tất yếu cần phải có trước khi quá trình kiến tạo và tái sinh bắt đầu.",
    interpretation: "Đừng e sợ những xáo trộn mang tính thanh lọc. Sự tan rã của cái cũ chính là điều kiện tiên quyết để gieo mầm cho những khởi đầu mới.",
    advice: "đừng vội xem xáo trộn là thất bại. Có thể một cấu trúc cũ cần nứt ra trước khi hình dạng tốt hơn xuất hiện.",
    annotations: [
      {
        word: "Hail",
        translated: "Mưa đá",
        historyNote: "Trận thiên tai tàn phá mùa màng đột ngột từ bầu trời. Tuy nhiên, khi đá tan ra, nó lại biến thành nước nuôi dưỡng đất đai."
      },
      {
        word: "Disruption",
        translated: "Xáo trộn",
        historyNote: "Những biến cố nằm ngoài tầm kiểm soát của con người, phá vỡ những thói quen cũ kỹ để ép buộc ta phải thức tỉnh."
      },
      {
        word: "Change",
        translated: "Biến đổi",
        historyNote: "Sự hủy diệt mang tính xây dựng. Một cấu trúc buộc phải vỡ ra thì bản thể mới có không gian để phát triển."
      }
    ]
  },
  {
    id: "naudhiz",
    symbol: "ᚾ",
    name: "Naudhiz",
    meaning: "Nhu cầu / Giới hạn",
    description: "Đại diện cho những nhu cầu thực tế, sự bắt buộc của hoàn cảnh và các giới hạn gánh nặng giúp rèn giũa nhân cách. Ký tự này biểu trưng cho những bài học xương máu có được thông qua nghịch cảnh và sự thiếu thốn.",
    interpretation: "Áp lực và giới hạn hiện tại chính là bài học kiên nhẫn, giúp bạn nhận ra giá trị thực sự và gia tăng sức chịu đựng.",
    advice: "hãy gọi tên giới hạn thật sự. Rune này hỏi điều gì là cần thiết, điều gì là tùy chọn, và điều gì bạn có thể ngừng mang theo.",
    annotations: [
      {
        word: "Need",
        translated: "Nhu cầu",
        historyNote: "Gắn liền với hình ảnh hai thanh gỗ cọ xát vào nhau để tạo ra 'ngọn lửa sinh tồn' trong mùa đông thiếu thốn."
      },
      {
        word: "Necessity",
        translated: "Sự cần thiết",
        historyNote: "Hoàn cảnh bắt buộc không thể né tránh. Nó ép con người phải tư duy sáng tạo và tìm lối thoát khi bị đẩy vào chân tường."
      },
      {
        word: "Constraint",
        translated: "Giới hạn",
        historyNote: "Những giới hạn định hình nên tính cách. Nhận biết và chấp nhận giới hạn giúp bạn tích lũy kỷ luật tự giác cao độ."
      }
    ]
  },
  {
    id: "isa",
    symbol: "ᛁ",
    name: "Isa",
    meaning: "Tĩnh lặng / Kiên nhẫn",
    description: "Hiện thân của sự tĩnh tại, lòng kiên nhẫn và sức mạnh của việc chờ đợi. Ký tự này đại diện cho một khoảnh khắc bị đóng băng trong thời gian, nhắc nhở về sự cần thiết phải tạm dừng chân trước khi tiếp tục tiến bước.",
    interpretation: "Mọi thứ đang rơi vào trạng thái tĩnh lặng. Đừng nóng vội cưỡng cầu, hãy tận dụng lúc này để suy ngẫm và kiên nhẫn chờ băng tan.",
    advice: "hãy tạm dừng trước khi ép kết quả. Sự chờ đợi có thể để lộ thông tin mà cảm giác cấp bách sẽ bỏ qua.",
    annotations: [
      {
        word: "Ice",
        translated: "Băng giá",
        historyNote: "Trạng thái đóng băng mặt nước, ngăn chặn mọi sự chuyển động bên ngoài nhưng bảo toàn năng lượng cốt lõi bên trong."
      },
      {
        word: "Stillness",
        translated: "Tĩnh lặng",
        historyNote: "Sự tĩnh lặng cần thiết để quan sát lại tình hình. Khi vạn vật xung quanh hỗn loạn, việc giữ tâm bất biến là sức mạnh tối thượng."
      },
      {
        word: "Patience",
        translated: "Kiên nhẫn",
        historyNote: "Sự chờ đợi có ý thức. Nhắc nhở rằng mùa đông rồi sẽ qua và việc thúc ép kết quả lúc này chỉ làm gãy vỡ cấu trúc."
      }
    ]
  },
  {
    id: "jera",
    symbol: "ᛃ",
    name: "Jera",
    meaning: "Mùa gặt / Chu kỳ",
    description: "Tượng trưng cho mùa màng bội thu, sự hoàn tất trọn vẹn của các chu kỳ và phần thưởng xứng đáng của lòng kiên trì. Ký tự này biểu trưng cho nhịp điệu tự nhiên của đời sống và quả ngọt của quá trình lao động.",
    interpretation: "Thời điểm thu hoạch thành quả sau chuỗi ngày nỗ lực bền bỉ đã đến. Mọi hạt giống bạn gieo trồng đang cho trái ngọt.",
    advice: "hãy cân nhắc thời điểm. Rune này nói về chu kỳ, hệ quả và thành quả từ những gì đã được gieo trước đó.",
    annotations: [
      {
        word: "Harvest",
        translated: "Mùa gặt",
        historyNote: "Mùa gặt hái thành công. Biểu thị quy luật gieo nhân nào gặt quả nấy; nỗ lực trong quá khứ nay đã đến ngày nhận thưởng."
      },
      {
        word: "Year",
        translated: "Chu kỳ năm",
        historyNote: "Đại diện cho một năm trọn vẹn, sự lặp lại của bốn mùa. Nhắc nhở rằng mọi thành tựu lớn đều cần một quá trình tích lũy đủ lâu."
      },
      {
        word: "Cycle",
        translated: "Chu kỳ",
        historyNote: "Nhịp điệu tuần hoàn của vạn vật. Hiểu được chu kỳ giúp bạn hành động hợp thời thế, biết lúc nào nên gieo và lúc nào nên gặt."
      }
    ]
  },
  {
    id: "eihwaz",
    symbol: "ᛇ",
    name: "Eihwaz",
    meaning: "Sức bền / Chuyển hóa",
    description: "Đại diện cho cây thủy tùng – biểu tượng của sức chịu đựng vượt thời gian và vòng lặp đóng lại rồi mở ra. Ký tự này biểu trưng cho nội lực để kiên cường vượt qua và trí tuệ của sự chuyển hóa sâu sắc.",
    interpretation: "Bạn có đủ sự bền bỉ để bước qua một giai đoạn kết thúc, sẵn sàng chuyển hóa sang một vòng đời mới mạnh mẽ hơn.",
    advice: "hãy để một phiên bản cũ của vấn đề khép lại. Con đường hữu ích có thể cần sức bền và một sự chuyển hóa rõ ràng.",
    annotations: [
      {
        word: "Yew Tree",
        translated: "Cây thủy tùng",
        historyNote: "Loài cây xanh tốt quanh năm, sống hàng ngàn tuổi, gỗ dùng làm cung tên cho chiến binh. Biểu tượng kết nối sự sống và cái chết."
      },
      {
        word: "Endurance",
        translated: "Sức chịu đựng",
        historyNote: "Khả năng đứng vững trước thử thách khắc nghiệt nhất mà không bị gục ngã, duy trì sự kiên cường vững vàng."
      },
      {
        word: "Death",
        translated: "Sự kết thúc",
        historyNote: "Không phải cái chết sinh học, mà là sự khép lại bắt buộc của một chương cũ để giải phóng năng lượng cho sự tái sinh."
      }
    ]
  },
  {
    id: "perthro",
    symbol: "ᛈ",
    name: "Perthro",
    meaning: "Bí ẩn / Số phận",
    description: "Hiện thân của những bí ẩn, vòng quay số phận và những điều chưa được hé lộ. Ký tự này đại diện cho các khía cạnh ẩn giấu của đời sống và vai trò của sự ngẫu nhiên, may rủi đối với định mệnh.",
    interpretation: "Hãy sẵn sàng đón nhận những điều bất ngờ nằm ngoài tầm kiểm soát của lý trí. Số phận luôn có những lối rẽ bí ẩn đầy thú vị.",
    advice: "hãy chừa chỗ cho điều chưa biết. Không phải mọi yếu tố đều đã hiện ra, nên bước tiếp theo nên đủ linh hoạt.",
    annotations: [
      {
        word: "Dice Cup",
        translated: "Cốc xúc xắc",
        historyNote: "Chiếc cốc dùng để gieo các quẻ bói hoặc chơi trò xúc xắc cổ. Biểu trưng cho các quy luật ẩn tàng vận hành thế giới."
      },
      {
        word: "Mystery",
        translated: "Bí ẩn",
        historyNote: "Những bí mật nằm trong bóng tối chưa được phơi bày. Nhắc nhở rằng lý trí con người không thể tính toán hết mọi biến số."
      },
      {
        word: "Fate",
        translated: "Số phận",
        historyNote: "Mạng lưới định mệnh được dệt bởi các Norn. Biểu thị yếu tố may rủi, nhân duyên ngẫu nhiên thúc đẩy cuộc sống rẽ hướng."
      }
    ]
  },
  {
    id: "algiz",
    symbol: "ᛉ",
    name: "Algiz",
    meaning: "Bảo vệ / Kết nối",
    description: "Tượng trưng cho sự che chở, mối kết nối thiêng liêng với đấng tối cao và quyền năng của sự phòng hộ về mặt tinh thần. Ký tự này chính là cây cầu nối liền giữa mặt đất và bầu trời.",
    interpretation: "Bạn đang được bảo vệ an toàn trên hành trình của mình. Hãy tin tưởng vào sự dẫn dắt tâm linh và bản năng tự vệ bên trong.",
    advice: "hãy đặt ranh giới trước khi hành động. Lời khuyên là bảo vệ điều quan trọng và đừng phản ứng chỉ vì sợ hãi.",
    annotations: [
      {
        word: "Elk",
        translated: "Nai sừng tấm",
        historyNote: "Loài nai có gạc lớn như vũ khí bảo vệ. Từ này cũng ám chỉ loài cỏ bám ở đầm lầy, lá sắc nhọn khiến kẻ thù không thể xâm nhập."
      },
      {
        word: "Protection",
        translated: "Bảo vệ",
        historyNote: "Sự che chở từ thế giới tâm linh hoặc bản năng tự vệ trỗi dậy đúng lúc giúp bạn né tránh được các hiểm họa rình rập."
      },
      {
        word: "Connection",
        translated: "Kết nối",
        historyNote: "Hình dáng ký tự giống như một người đang giơ tay hướng lên trời. Biểu thị cây cầu giao tiếp giữa phàm trần và thần thánh."
      }
    ]
  },
  {
    id: "sowilo",
    symbol: "ᛋ",
    name: "Sowilo",
    meaning: "Mặt trời / Thành công",
    description: "Đại diện cho ánh mặt trời rực rỡ, thành tựu hiển hách và nguồn năng lượng ban phát sự sống để nuôi dưỡng vạn vật. Ký tự này biểu trưng cho chiến thắng, quyền lực và sức mạnh của ý chí.",
    interpretation: "Ánh sáng rực rỡ của thành công đang chiếu rọi con đường bạn đi. Hãy giải phóng nguồn sinh lực và ý chí mạnh mẽ để đạt tới vinh quang.",
    advice: "hãy đi về phía điều sáng rõ, tiếp thêm năng lượng và trung thực. Rune này ủng hộ sự tự tin dựa trên sự thật có thể nhìn thấy.",
    annotations: [
      {
        word: "Sun",
        translated: "Mặt trời",
        historyNote: "Nguồn năng lượng ban phát sự sống tối cao trong vũ trụ quan phương Bắc, sưởi ấm vạn vật và xua tan băng giá mùa đông."
      },
      {
        word: "Success",
        translated: "Thành công",
        historyNote: "Sự sáng rõ tuyệt đối đạt được sau khi vượt qua bóng tối hoài nghi. Biểu thị thành tựu, vinh quang và mục tiêu được hoàn thành."
      },
      {
        word: "Energy",
        translated: "Năng lượng",
        historyNote: "Nhiệt huyết dồi dào và sức mạnh ý chí tập trung cao độ, giúp bạn có đủ động lực mạnh mẽ để càn quét mọi rào cản."
      }
    ]
  },
  {
    id: "tiwaz",
    symbol: "ᛏ",
    name: "Tiwaz",
    meaning: "Công lý / Danh dự",
    description: "Hiện thân của cán cân công lý, danh dự cao quý và quy luật thép của một chiến binh. Ký tự này đại diện cho sự hy sinh vị tha vì đại cuộc, cùng việc kiên định theo đuổi sự thật và lẽ phải.",
    interpretation: "Hãy hành động với tinh thần trách nhiệm, danh dự và lòng trung thực. Chiến thắng và công lý sẽ đứng về phía người chính trực.",
    advice: "hãy chọn con đường bạn có thể đứng vững sau đó. Công bằng, chính trực và hy sinh cho điều đúng là trọng tâm ở đây.",
    annotations: [
      {
        word: "Tyr",
        translated: "Thần Tyr",
        historyNote: "Vị thần bảo hộ công lý, người đã dũng cảm hy sinh một bàn tay vào miệng sói dữ Fenrir để giữ lời thề bảo vệ chư thần."
      },
      {
        word: "Justice",
        translated: "Công lý",
        historyNote: "Sự công bằng, thượng tôn luật pháp và chính nghĩa. Chiến thắng đạt được bằng con đường công chính, minh bạch."
      },
      {
        word: "Honor",
        translated: "Danh dự",
        historyNote: "Quy tắc đạo đức cao cả, lòng trung thành và ý chí sẵn sàng hy sinh lợi ích nhỏ của cá nhân vì đại cuộc."
      }
    ]
  },
  {
    id: "berkano",
    symbol: "ᛒ",
    name: "Berkano",
    meaning: "Sinh trưởng / Khởi đầu mới",
    description: "Tượng trưng cho sự phát triển, những khởi đầu mới mẻ và nguồn năng lượng nuôi dưỡng, che chở từ đất mẹ. Ký tự này đại diện cho sự màu mỡ, hồi sinh và sức mạnh nguyên bản của sự kiến tạo.",
    interpretation: "Một hạt giống mới đang nảy mầm trong cuộc sống của bạn. Hãy nuôi dưỡng nó bằng tình yêu thương và sự kiên nhẫn để đón nhận sự sinh trưởng.",
    advice: "hãy tạo điều kiện cho cái mới phát triển. Sự dịu dàng, đều đặn và kiên nhẫn có thể hiệu quả hơn việc thúc ép.",
    annotations: [
      {
        word: "Birch",
        translated: "Cây bạch dương",
        historyNote: "Loài cây đầu tiên đâm chồi nảy lộc xanh tươi sau khi mùa đông băng giá kết thúc. Biểu tượng của sự hồi sinh và sinh nở."
      },
      {
        word: "Growth",
        translated: "Sinh trưởng",
        historyNote: "Quá trình tiến hóa và phát triển một cách tự nhiên, đều đặn. Cần sự chăm sóc dịu dàng và kiên nhẫn để lớn mạnh."
      },
      {
        word: "New Beginnings",
        translated: "Khởi đầu mới",
        historyNote: "Sự xuất hiện của các cơ hội mới, dự án mới hoặc sự tái sinh của một tâm hồn sau chuỗi ngày kiệt quệ."
      }
    ]
  },
  {
    id: "ehwaz",
    symbol: "ᛖ",
    name: "Ehwaz",
    meaning: "Đồng hành / Tiến triển",
    description: "Đại diện cho tình bạn đồng hành, niềm tin tuyệt đối và năng lực dịch chuyển mạnh mẽ. Ký tự này biểu trưng cho sợi dây liên kết bền chặt giữa kỵ sĩ và chiến mã, cũng như hành trình của sự hợp tác đôi bên.",
    interpretation: "Sự tiến bộ và thành công sẽ đến từ tinh thần cộng tác, sự tin tưởng lẫn nhau giữa những người bạn đồng hành chung chí hướng.",
    advice: "hãy xem đây là một hành trình, không chỉ là một quyết định đơn lẻ. Một bước nhỏ được kiểm chứng cẩn thận có giá trị hơn câu trả lời hoàn hảo.",
    annotations: [
      {
        word: "Horse",
        translated: "Chiến mã",
        historyNote: "Con ngựa linh thiêng trong văn hóa phương Bắc, phương tiện dịch chuyển chiến lược giúp con người sinh tồn và săn bắn."
      },
      {
        word: "Partnership",
        translated: "Đồng hành",
        historyNote: "Mối liên kết khăng khít dựa trên sự tin tưởng tuyệt đối lẫn nhau. Hai thực thể hòa làm một để cùng hướng về mục tiêu."
      },
      {
        word: "Movement",
        translated: "Tiến triển",
        historyNote: "Sức mạnh chuyển động có tốc độ và sự phối hợp nhịp nhàng, giúp đưa kế hoạch tiến lên phía trước một cách suôn sẻ."
      }
    ]
  },
  {
    id: "mannaz",
    symbol: "ᛗ",
    name: "Mannaz",
    meaning: "Con người / Cộng đồng",
    description: "Hiện thân của nhân tính, các mối quan hệ xã hội và sức mạnh của trí tuệ con người. Ký tự này đại diện cho bản chất kết nối cộng đồng và tầm quan trọng của việc xây dựng các mối quan hệ.",
    interpretation: "Hãy nhìn nhận lại vị trí của bản thân trong tập thể. Trí tuệ lớn nằm ở sự thấu hiểu chính mình và kết nối sâu sắc với đồng loại.",
    advice: "hãy tính đến yếu tố con người. Câu hỏi quan trọng là điều này ảnh hưởng thế nào đến niềm tin, cộng đồng và cảm nhận của bạn về chính mình.",
    annotations: [
      {
        word: "Human",
        translated: "Con người",
        historyNote: "Bản chất bên trong của một con người, bao gồm cả điểm mạnh, điểm yếu, tư duy lý trí và lòng trắc ẩn."
      },
      {
        word: "Community",
        translated: "Cộng đồng",
        historyNote: "Mạng lưới xã hội xung quanh bạn. Nhắc nhở rằng cá nhân không thể tồn tại cô độc mà luôn là một mắt xích của tập thể."
      },
      {
        word: "Intelligence",
        translated: "Trí tuệ",
        historyNote: "Khả năng thấu hiểu cấu trúc thế giới, tư duy logic và năng lực tự nhận thức để điều chỉnh hành vi sống phù hợp."
      }
    ]
  },
  {
    id: "laguz",
    symbol: "ᛚ",
    name: "Laguz",
    meaning: "Trực giác / Dòng chảy",
    description: "Tượng trưng cho nước, cảm xúc sâu thẳm và sức mạnh vô hạn của trực giác. Ký tự này đại diện cho vùng đất của tiềm thức, thế giới nội tâm và khả năng linh hoạt thích ứng với mọi sự thay đổi.",
    interpretation: "Hãy để bản thân trôi theo dòng chảy tự nhiên, lắng nghe tiếng nói của trực giác và cảm xúc để tìm ra câu trả lời thay vì dùng lý trí khiên cưỡng.",
    advice: "hãy lắng nghe dòng cảm xúc bên dưới. Khả năng thích nghi và trực giác là một phần của câu trả lời, không phải thứ gây nhiễu.",
    annotations: [
      {
        word: "Water",
        translated: "Nước",
        historyNote: "Nước vừa mang lại sự sống nhưng cũng ẩn chứa những vực sâu bí ẩn. Đại diện cho thế giới cảm xúc luân chuyển không ngừng."
      },
      {
        word: "Flow",
        translated: "Dòng chảy",
        historyNote: "Khả năng thích ứng mềm dẻo như dòng nước. Khi gặp vật cản, nước không đối đầu trực diện mà tự tìm lối rẽ để đi tiếp."
      },
      {
        word: "Intuition",
        translated: "Trực giác",
        historyNote: "Tiếng nói vô thức của tâm linh dẫn đường, vượt lên trên các lập luận logic khô khan của trí óc thông thường."
      }
    ]
  },
  {
    id: "ingwaz",
    symbol: "ᛜ",
    name: "Ingwaz",
    meaning: "Sinh sôi / Hoàn thành",
    description: "Đại diện cho sự phì nhiêu, sinh sôi, sự hoàn thành trọn vẹn và quyền năng tiềm tàng của lòng đất. Ký tự này biểu trưng cho thời điểm thu hoạch thành quả của đời người và sự khai phá toàn bộ tiềm năng ẩn giấu.",
    interpretation: "Một chu kỳ chuẩn bị khép lại một cách viên mãn. Mọi năng lượng bạn tích lũy bấy lâu nay đã chín muồi để chuẩn bị bộc phát.",
    advice: "hãy tạo điều kiện cho cái mới phát triển. Sự dịu dàng, đều đặn và kiên nhẫn có thể hiệu quả hơn việc thúc ép.",
    annotations: [
      {
        word: "Ing",
        translated: "Thần Ing",
        historyNote: "Vị thần của lòng đất và nông nghiệp. Đại diện cho chiếc kén an toàn bảo vệ hạt giống qua mùa đông để chờ ngày nảy mầm."
      },
      {
        word: "Fertility",
        translated: "Sự sinh sôi",
        historyNote: "Trạng thái năng lượng dồi dào, mang thai ý tưởng hoặc tích lũy đủ các nguồn lực cần thiết bên trong không gian kín."
      },
      {
        word: "Completion",
        translated: "Hoàn thành",
        historyNote: "Sự kết thúc của giai đoạn chuẩn bị âm thầm. Chiếc kén sắp vỡ ra để giải phóng một bản thể trọn vẹn ra thế giới."
      }
    ]
  },
  {
    id: "dagaz",
    symbol: "ᛞ",
    name: "Dagaz",
    meaning: "Thức tỉnh / Chuyển hóa",
    description: "Hiện thân của ánh bình minh, sự thức tỉnh tâm trí và quyền năng của sự chuyển hóa toàn diện. Ký tự này đại diện cho khoảnh khắc khai tâm, khai sáng và sự bắt đầu của một chương hoàn toàn mới.",
    interpretation: "Bóng tối và hoài nghi đang lùi xa nhường chỗ cho ánh sáng của sự thức tỉnh. Bạn sắp trải qua một bước chuyển mình mang tính đột phá.",
    advice: "hãy tìm điểm chuyển sáng. Rune này gợi một khoảnh khắc nhận ra vấn đề theo cách mới và bước qua ngưỡng cũ.",
    annotations: [
      {
        word: "Day",
        translated: "Ban ngày",
        historyNote: "Khoảnh khắc ánh sáng bình minh xua tan đêm đen hoàn toàn. Biểu thị điểm đảo chiều của cục diện từ tối sang sáng."
      },
      {
        word: "Awakening",
        translated: "Thức tỉnh",
        historyNote: "Khoảnh khắc 'Aha!' khi bạn đột nhiên ngộ ra bản chất của vấn đề, tư duy bừng sáng và thoát khỏi u mê."
      },
      {
        word: "Transformation",
        translated: "Chuyển hóa",
        historyNote: "Bước nhảy vọt về chất. Sự thay đổi diện mạo hoàn toàn của cuộc sống theo hướng tự do, tươi sáng và thông suốt."
      }
    ]
  },
  {
    id: "othala",
    symbol: "ᛟ",
    name: "Othala",
    meaning: "Di sản / Tổ tiên",
    description: "Tượng trưng cho di sản truyền thống, mái nhà thân thương và sợi dây kết nối linh thiêng với tổ tiên. Ký tự này đại diện cho trí tuệ được đúc kết từ quá khứ, cùng nền tảng vững chắc của gia đình.",
    interpretation: "Hãy tìm kiếm sức mạnh từ cội nguồn, gia đình và những giá trị cốt lõi lâu đời. Đó là bệ đỡ vững chắc nhất cho tương lai của bạn.",
    advice: "hãy nhìn vào gốc rễ của câu hỏi. Gia đình, nơi chốn, di sản hoặc giá trị được thừa hưởng có thể đang định hình câu trả lời.",
    annotations: [
      {
        word: "Heritage",
        translated: "Di sản",
        historyNote: "Những giá trị, truyền thống, hoặc tài sản tinh thần/vật chất được kế thừa từ thế hệ trước để làm bệ đỡ cho hiện tại."
      },
      {
        word: "Home",
        translated: "Mái nhà",
        historyNote: "Đất đai kiên cố, bất động sản thuộc quyền sở hữu của gia tộc. Nơi mang lại cảm giác an toàn và thuộc về vững bền."
      },
      {
        word: "Ancestors",
        translated: "Tổ tiên",
        historyNote: "Sợi dây kết nối tâm linh và huyết thống với cội nguồn. Lời khuyên nên tìm kiếm câu trả lời dựa trên nền tảng kinh nghiệm lịch sử."
      }
    ]
  }
];

export const getRandomRune = (): Rune => {
  const randomIndex = Math.floor(Math.random() * runes.length);
  return runes[randomIndex];
};

/**
 * Ghép mẫu `rune.advice` (chứa placeholder {subject}/{name}) với ngữ cảnh
 * câu hỏi tiên đoán thực tế của người dùng. Có fallback cho rune không có
 * field advice (phòng khi thêm rune mới mà quên điền).
 */
export const interpolateAdvice = (rune: Rune, subject: string): string => {
  const template = rune.advice
    ?? `hãy liên hệ ý nghĩa của {name} với {subject}. Hãy để rune gợi ra hành động trung thực kế tiếp, thay vì một lời tiên đoán cố định.`;
  return template.replace(/\{subject\}/g, subject).replace(/\{name\}/g, rune.name);
};
