import "./vintage.css";

export default function Home() {
  return (
    <div className="press">
      {/* Lớp vân nhám giấy + vignette phủ toàn trang */}
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <header>
        <div className="topbar">
          <span>Thành phố Mưa Bay · Bản chiều</span>
          <span>Thứ Sáu, ngày 16 tháng Mười năm 2026</span>
          <span>Giá 5 xu mực · Số 247</span>
        </div>

        <h1 className="masthead">Tiếng Máy Chữ</h1>
        <p className="masthead-sub">
          Tuần báo hoài cổ dành cho người yêu chữ, giấy và những thứ chậm rãi ·
          Lập bản năm 1954 · Chữ nào ra chữ đó, không có nút xóa
        </p>

        <hr className="rule-double" />

        <nav className="sections" aria-label="Mục của tờ báo">
          <a href="#trang-nhat">Trang nhất</a>
          <a href="#co-vat">Cổ vật</a>
          <a href="#bao-ton">Bảo tồn</a>
          <a href="#thu-ngo">Thư ngỏ</a>
          <a href="#rao-vat">Rao vặt</a>
        </nav>

        <hr className="rule-thin" />
      </header>

      <main>
        {/* ================= BÀI CHÍNH ================= */}
        <article id="trang-nhat" aria-labelledby="headline-lead">
          <p className="kicker">Bài chính · Trang nhất</p>
          <h2 className="headline" id="headline-lead">
            Giấy trắng vẫn còn chỗ cho mực đen
          </h2>
          <p className="deck">
            Giữa thời đại của những màn hình phát sáng, một chiếc máy đánh chữ
            cũ trong góc phố vẫn gõ đều nhịp như trái tim của một thời đã qua.
            Chúng tôi về thăm tiệm sửa máy đánh chữ cuối phố, nơi người ta vẫn
            tin rằng chữ phải thật thì giấy mới khỏi thừa.
          </p>
          <p className="byline">
            Ký: T. T. Khôi · Ảnh: một chiếc đèn dầu · Chưa từng được kiểm chứng
            bởi bất kỳ thuật toán nào
          </p>

          <div className="lead-body">
            <p>
              Trong ngăn kéo cuối cùng của chiếc bàn gỗ mun, ông Tư Chữ vẫn
              giữ nguyên cuốn sổ bìa brun đã ố vàng theo năm tháng. Mỗi trang
              là những dòng chữ đánh máy đều tăm tắp, các chữ cái nghiêng nhẹ
              về bên phải như đội quân đứng nghiêng mình chào. Ông bảo, chữ
              máy không đẹp như chữ viết tay, nhưng nó thật — thật đến từng cú
              gõ phím.
            </p>
            <p>
              Người ta bảo thời nay chẳng ai còn dùng thứ đồ cổ lỗ sĩ ấy nữa.
              Màn hình sáng, bàn phím cơ rít rào, chữ xóa được, chép được, gửi
              đi ngàn dặm trong tích tắc. Vậy mà mỗi độ chiều muộn, tiệm sửa
              máy đánh chữ nhỏ xíu cuối phố lại có khách ghé. Có người mang
              chiếc Underwood năm 1937 đến xin thay ruy-băng mực; có người chỉ
              tới để ngồi nghe mùi dầu máy và nhớ về căn phòng năm xưa, nơi bà
              ngoại viết thư cho người chồng xa xôi.
            </p>
            <p>
              Cú gõ phím của người xưa đặt xuống giấy một đường mực không thể
              xóa. Nghĩ rồi mới viết, viết rồi mới gửi. Chậm rãi là thế, nhưng
              mỗi lá thư gửi đi đều mang trọn một khoảng lặng của người viết.
              Chưa nói đến thứ âm thanh — lạch xạch, leng keng — nghe đã tai
              hơn hẳn tiếng gõ khô khan của thời số hóa.
            </p>
            <p>
              Nhiều bạn trẻ ngày nay tìm đến lớp học đánh chữ bằng máy, học
              cách xếp ngón tay lên ba hàng phím, học cách căn lề bằng mắt
              thường. Máy đánh chữ không có nút xóa: sai một chữ, phải dừng
              lại chà nhẹ bằng giấy nhám mịn, hoặc bắt đầu lại từ đầu. Có kẻ
              gọi đó là bất tiện, nhưng cũng có kẻ gọi đó là sự tử tế — bắt
              người viết phải nghĩ cho kỹ trước khi đặt chữ xuống đời.
            </p>
            <p>
              Cuối buổi chiều, ông Tư khóa cửa tiệm, thắp lên ngọn đèn bọc vải
              nâu và gõ lại một câu cũ của người cha: “Giấy có thể ố, mực có
              thể phai, duy chữ thật thì còn mãi.” Tiếng máy ngân lên trong
              căn phòng nhỏ, đều đặn như nhịp tim giữa thành phố đang ngủ.
            </p>
          </div>
        </article>

        {/* ================= TRÍCH DẪN NỔI ================= */}
        <blockquote className="pullquote">
          <p>
            “Giấy có thể ố, mực có thể phai — duy chữ thật thì còn mãi.”
          </p>
          <footer>— Câu cũ trong cuốn sổ của ông Tư Chữ</footer>
        </blockquote>

        <div className="ornament" aria-hidden="true">
          * * *
        </div>

        {/* ================= BA CỘT TIN NGẮN ================= */}
        <section aria-label="Tin và bài ngắn">
          <div className="trio">
            <article id="co-vat" aria-labelledby="hed-co-vat">
              <p className="kicker" style={{ marginTop: 0 }}>
                Cổ vật
              </p>
              <h3 className="hed" id="hed-co-vat">
                Hộp thư đỏ góc phố
              </h3>
              <p>
                Hộp thư sơn đỏ ở đầu đường Lê Lợi vừa được người dân góp tiền
                sơn lại lần thứ mười bảy. Không có công văn nào bắt phải giữ
                nó, nhưng sáng nào bà bán xôi cũng thấy một ông lão dừng xe,
                lau bụi cho hộp thư như lau mặt cho một ông bạn già.
              </p>
              <p>
                Bên trong đã lâu không còn thư, chỉ có gió. Vậy mà cứ chiều
                về, ánh nắng cuối ngày rơi qua khe hở vẫn thấy bên trong đỏ
                rực như một ngọn lửa nhỏ không chịu tắt. Phường treo bên cạnh
                tấm bảng nhỏ: “Di vật tình nguyện của khu phố”. Không ai ký
                tên, không ai nhận công, và chẳng ai thắc mắc vì sao.
              </p>
              <p className="more">
                <a href="#thu-ngo">Đọc tiếp ở mục thư ngỏ →</a>
              </p>
            </article>

            <article id="bao-ton" className="tips-box" aria-labelledby="hed-bao-ton">
              <p className="kicker-inline">Bảo tồn · Cẩm nang</p>
              <h3 className="hed" id="hed-bao-ton">
                Năm điều giữ cho máy chữ không chết
              </h3>
              <ol>
                <li>
                  Che bụi bằng vải lanh, đừng dùng nilon — máy cũng cần được
                  thở.
                </li>
                <li>
                  Thay ruy-băng mỗi năm một lần, dù mực chưa cạn. Mực cũ để
                  lâu thành tính khí.
                </li>
                <li>
                  Không bấm hai phím cùng lúc; chữ nào ra chữ đó, vội cũng
                  thế.
                </li>
                <li>
                  Đánh máy mỗi tuần ít nhất một trang giấy, cho máy khỏi buồn
                  và cho tay khỏi quên.
                </li>
                <li>
                  Hỏng thì mang đi sửa, đừng bỏ. Người thợ còn đó là máy chưa
                  chết.
                </li>
              </ol>
            </article>

            <article id="thu-ngo" aria-labelledby="hed-thu-ngo">
              <p className="kicker" style={{ marginTop: 0 }}>
                Thư ngỏ
              </p>
              <h3 className="hed" id="hed-thu-ngo">
                Thư gửi tòa soạn
              </h3>
              <p>
                Độc giả ở Hà Nội gửi thư hỏi: “Báo mình có in được chữ nào to
                hơn chữ nào không, hay tất cả phải bằng nhau như máy đánh
                chữ?” Tòa soạn xin trả lời: máy đánh chữ vốn công bằng, chữ
                nào cũng một feet; muốn to thì gõ hai lần, muốn nhấn mạnh thì
                gõ ba.
              </p>
              <p>
                Sự công bằng ấy đã giữ cho trang báo này không bao giờ hô hào
                điều gì quá lớn, và cũng không bợ đỡ điều gì quá nhỏ. Chữ to
                chữ bé trên đời thường là chuyện của kẻ khoe khoang; chúng tôi
                chỉ biết gõ cho đều.
              </p>
              <div className="weather">
                <b>Trời nay:</b> mưa rào rải rác lúc chiều. Nhớ mang ô, nhớ
                mang theo một lá thư cũ để đọc ở chỗ chờ xe. Trời tối sớm,
                chữ vẫn sáng.
              </div>
            </article>
          </div>
        </section>

        {/* ================= RAO VẶT ================= */}
        <section id="rao-vat" className="classifieds" aria-labelledby="hed-rao-vat">
          <hr className="rule-double" />
          <h3 className="classifieds-title" id="hed-rao-vat">
            Rao vặt
          </h3>
          <div className="ads-grid">
            <p className="ad">
              <b>Bán</b>
              Máy Underwood 1937, còn nguyên ruột, kèm một cuộn ruy-băng tím.
              Giá: một dĩa hến xào và câu chuyện về ngày xưa.
            </p>
            <p className="ad">
              <b>Tìm</b>
              Người nào nhặt được lá thư rơi ở bến phà, xin giữ giùm. Người
              viết sẽ quay lại đúng một năm sau, đúng chỗ cũ, mặc áo sờn vai.
            </p>
            <p className="ad">
              <b>Dạy</b>
              Lớp đánh chữ mười ngón, khai giảng vào mùa mưa. Học phí: kiên
              nhẫn và một bịch trà. Cam kết gõ xong bài chưa chắc đã nhớ lời
              thầy.
            </p>
            <p className="ad">
              <b>Cảm ơn</b>
              Bạn đọc vô danh đã gửi về tòa soạn một cái gọt bút chì bằng
              đồng. Tòa soạn xin gửi lại đúng một trang báo in dấu tích của
              nó.
            </p>
          </div>
        </section>
      </main>

      {/* ================= CUỐN BÁO ================= */}
      <footer className="colophon">
        <hr className="rule-double" />
        <p>
          Tiếng Máy Chữ — in thử trên giấy trắng ngà, chữ mực đen, máy chữ
          chưa biết nói dối.
        </p>
        <p>
          Xưởng in giả tưởng, 13 hẻm Bông Sen · Tổng biên tập: một chiếc ghế
          gỗ · Phát hành mỗi khi có người còn muốn đọc
        </p>
        <p>
          © 1954–2026 · Bản quyền thuộc về những ai còn thích chữ. Sao chép xin
          để lại một lỗi đánh máy làm quà.
        </p>
      </footer>
    </div>
  );
}
