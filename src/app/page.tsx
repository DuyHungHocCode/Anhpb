import "./vintage.css";

/* Hoa văn trang trí — tất cả vẽ bằng SVG/CSS, không dùng ảnh */

function Flourish({ width = 170 }: { width?: number }) {
  return (
    <svg
      className="flourish"
      width={width}
      height="18"
      viewBox="0 0 170 18"
      aria-hidden="true"
    >
      <line x1="2" y1="9" x2="64" y2="9" stroke="currentColor" strokeWidth="1" />
      <line x1="106" y1="9" x2="168" y2="9" stroke="currentColor" strokeWidth="1" />
      <circle cx="72" cy="9" r="1.6" fill="currentColor" />
      <circle cx="98" cy="9" r="1.6" fill="currentColor" />
      <path d="M85 3.2 L90.8 9 L85 14.8 L79.2 9 Z" fill="currentColor" />
    </svg>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  return (
    <svg
      className={`corner corner-${pos}`}
      width="46"
      height="46"
      viewBox="0 0 46 46"
      aria-hidden="true"
    >
      <path
        d="M46 3 H16 Q3 3 3 16 V46"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M46 9.5 H18.5 Q9.5 9.5 9.5 18.5 V46"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.72"
      />
      <path d="M15.5 11.5 L19.5 15.5 L15.5 19.5 L11.5 15.5 Z" fill="currentColor" />
      <circle cx="27.5" cy="9" r="1.5" fill="currentColor" />
      <circle cx="9" cy="27.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HeroUnderline() {
  return (
    <svg
      className="hero-underline"
      viewBox="0 0 240 14"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M4 9 C 60 3, 118 13, 168 7 S 230 5, 236 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

function Flower({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 36 36" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <ellipse cx="18" cy="9" rx="4" ry="7" />
        <ellipse cx="18" cy="9" rx="4" ry="7" transform="rotate(72 18 18)" />
        <ellipse cx="18" cy="9" rx="4" ry="7" transform="rotate(144 18 18)" />
        <ellipse cx="18" cy="9" rx="4" ry="7" transform="rotate(216 18 18)" />
        <ellipse cx="18" cy="9" rx="4" ry="7" transform="rotate(288 18 18)" />
        <circle cx="18" cy="18" r="2.2" />
      </g>
    </svg>
  );
}

function Postmark() {
  return (
    <svg className="postmark" viewBox="0 0 96 96" aria-hidden="true">
      <defs>
        <path id="pm-ring" d="M48 13 a35 35 0 1 1 -0.01 0" fill="none" />
      </defs>
      <circle
        cx="48"
        cy="48"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle
        cx="48"
        cy="48"
        r="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <text fontSize="7.6" letterSpacing="1.4" fill="currentColor">
        <textPath href="#pm-ring">THÀNH PHỐ MƯA BAY · 16 · 10 · 2026 ·</textPath>
      </text>
      <text
        x="48"
        y="45.5"
        textAnchor="middle"
        fontSize="9"
        letterSpacing="1"
        fill="currentColor"
      >
        16.10
      </text>
      <text
        x="48"
        y="56.5"
        textAnchor="middle"
        fontSize="9"
        letterSpacing="1"
        fill="currentColor"
      >
        2026
      </text>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="letter-stage">
      {/* Lớp vân nhám giấy + vignette phủ toàn trang */}
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="falling-petals" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => (
          <span className="falling-petal" key={index} />
        ))}
      </div>

      <p className="letterhead">Một lá thư gửi Phương Anh</p>

      <main>
        {/* ================= LÁ THỨ NHẤT ================= */}
        <article className="letter-card card-one" aria-label="Lá thư thứ nhất">
          <div className="pearl-ring" aria-hidden="true" />
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
          <Flower className="flower flower-one" />

          {/* Tem thư + con dấu bưu cục */}
          <div className="stamp" aria-hidden="true">
            <span className="stamp-top">Bưu chính</span>
            <span className="stamp-value">5 xu</span>
            <span className="stamp-bottom">Mưa Bay</span>
          </div>
          <Postmark />

          <p className="letter-date">Chiều thứ Sáu · 16 tháng Mười 2026</p>

          <p className="salutation">Gửi Phương Anh,</p>

          {/* Dòng chữ quan trọng và bắt mắt nhất của cả trang */}
          <h1 className="hero-line">
            Chúc Phương Anh
            <br />
            đã hoàn thành kỳ thi.
          </h1>
          <HeroUnderline />

          <p className="bridge-note">
            Tớ gửi cậu bó hoa này để chúc mừng — còn vài lời nhỏ, tớ viết ở
            lá thư tiếp theo nhé.
          </p>
        </article>

        {/* ================= LÁ THƯ TIẾP THEO ================= */}
        <article className="letter-card card-two" aria-label="Lá thư tiếp theo">
          <div className="pearl-ring" aria-hidden="true" />
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
          <Flower className="flower flower-two" />

          <h2 className="card-kicker">Một lời nhắn nhỏ</h2>

          <div className="letter-body">
            <p>
              Nếu kết quả không như cậu mong thì cũng đừng tự trách mình quá
              nhé.
            </p>
            <p>
              Tớ hiểu đôi khi cậu sẽ muốn yên lặng một chút để sắp xếp lại mọi
              thứ. Nhưng nếu lúc đó cậu cần một người để nói chuyện, hoặc chỉ
              ngồi cùng không cần nói gì, tớ vẫn ở đây.
            </p>
          </div>

          <div className="signoff">
            <Flourish width={140} />
            <p style={{ margin: "0.9rem 0 0" }}>
              <span className="sign-name">— Tớ.</span>
            </p>
          </div>

          <p className="postscript">
            P/s. Hy vọng cậu thích hoa.
          </p>
        </article>
      </main>

      <footer className="letter-foot">
        gõ bằng máy chữ · gửi kèm một bó hoa · chúc cậu một ngày thật vui
      </footer>
    </div>
  );
}
