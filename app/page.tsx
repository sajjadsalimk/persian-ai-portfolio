const skills = ["Python", "هوش مصنوعی", "یادگیری ماشین", "React", "Next.js", "حل مسئله"];

const projects = [
  { number: "۰۱", tag: "هوش مصنوعی", title: "دستیار هوشمند فارسی", description: "یک تجربهٔ مکالمه‌محور برای پاسخ‌گویی دقیق‌تر و ساده‌تر به پرسش‌های کاربران.", mark: "✳" },
  { number: "۰۲", tag: "وب‌اپلیکیشن", title: "داشبورد داده‌محور", description: "نمایش داده‌های پیچیده در یک فضای روشن، کاربردی و قابل‌فهم.", mark: "◫" },
  { number: "۰۳", tag: "یادگیری ماشین", title: "پیش‌بینی و تحلیل داده", description: "بررسی الگوهای داده و تبدیل آن‌ها به بینش‌هایی برای تصمیم‌گیری بهتر.", mark: "⌁" },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? "↗" : "←"}</span>;
}

function HeaderIcon({ name }: { name: "about" | "work" | "contact" | "collaborate" }) {
  const paths = {
    about: <><circle cx="12" cy="8" r="3.25" /><path d="M5.5 19a6.5 6.5 0 0 1 13 0" /></>,
    work: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M9 5V3.5h6V5M4 10h16M10 10v2h4v-2" /></>,
    contact: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-2 2v-6.1a7.5 7.5 0 1 1 16-3.4Z" /><path d="M8 11h8M8 14h5" /></>,
    collaborate: <><path d="M8 12.5 10.5 15a2.1 2.1 0 0 0 3 0l2-2" /><path d="m3.5 10 4-4 3 2 2-1.5a2 2 0 0 1 2.4.1L20.5 11l-3 3" /><path d="m3 9-2 2 4 4 2-2M21 10l2 2-4 4-2-2M9 7l-1.5-2H4" /></>,
  };
  return <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Home() {
  return (
    <main>
      <header className="site-header wrap">
        <a className="brand" href="#home" aria-label="رفتن به ابتدای صفحه"><span className="brand-mark">س</span><span>سجاد<span className="brand-dot">.</span><small>برنامه‌نویس · هوش مصنوعی</small></span></a>
        <nav className="nav" aria-label="ناوبری اصلی">
          <a href="#about" aria-label="دربارهٔ من"><HeaderIcon name="about" /><span>دربارهٔ من</span></a><a href="#work" aria-label="پروژه‌ها"><HeaderIcon name="work" /><span>پروژه‌ها</span></a><a href="#contact" aria-label="ارتباط"><HeaderIcon name="contact" /><span>ارتباط</span></a>
        </nav>
        <a className="header-cta" href="#contact"><HeaderIcon name="collaborate" /><span>برای همکاری</span><Arrow diagonal /></a>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> برنامه‌نویسی نرم‌افزار <i>×</i> هوش مصنوعی</div>
          <h1>سلام، <span className="hero-name">خوش آمدید.</span><br />کد می‌زنم برای<br /><span className="hero-highlight">آینده‌ای هوشمندتر.</span></h1>
          <p className="hero-description">از ایده تا پیاده‌سازی؛ به ساخت نرم‌افزارهایی فکر می‌کنم که هوش مصنوعی را به تجربه‌ای مفید و انسانی تبدیل می‌کنند.</p>
          <div className="hero-actions"><a className="button button-primary" href="#work">دیدن پروژه‌ها <Arrow /></a><a className="text-link" href="#about">بیشتر دربارهٔ من <Arrow /></a></div>
          <div className="hero-note"><span className="note-line" /> از کدهای تمیز تا ایده‌های جسورانه</div>
        </div>
        <div className="hero-art" aria-label="تصویر انتزاعی با الهام از شبکه‌های هوش مصنوعی">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-grid" />
          <div className="art-label label-top"><span className="tiny-pulse" /> HUMAN IDEAS / MACHINE INTELLIGENCE</div>
          <div className="art-core"><span className="core-symbol">AI</span><span className="core-caption">ساختن در مرزِ ایده و کد</span></div>
          <div className="node node-a">ML<span>یادگیری ماشین</span></div><div className="node node-b">&lt;/&gt;<span>مهندسی نرم‌افزار</span></div><div className="node node-c">✳<span>ایدهٔ انسانی</span></div>
          <div className="art-label label-bottom">طراحی برای فردا <span>✦</span></div>
        </div>
        <div className="hero-index"><span>۰۱</span><i /> معرفی</div>
        <div className="hero-side-note">SOFTWARE <span>—</span> INTELLIGENCE</div>
      </section>

      <section className="ticker" aria-label="زمینه‌های کاری"><div className="ticker-track"><span>هوش مصنوعی</span><b>✳</b><span>ساخت محصول</span><b>✳</b><span>یادگیری مداوم</span><b>✳</b><span>کدنویسی</span><b>✳</b><span>هوش مصنوعی</span><b>✳</b><span>ساخت محصول</span><b>✳</b></div></section>

      <section className="about-section section wrap" id="about">
        <div className="section-heading"><div className="section-kicker">کمی دربارهٔ من <span>۰۲</span></div><h2>علاقه‌مند به ساختن<br />چیزهایی که <span className="highlight">معنا دارند.</span></h2></div>
        <div className="about-content"><p>من یک برنامه‌نویس کنجکاوم که از ترکیب فناوری و خلاقیت انرژی می‌گیرد. این روزها تمرکزم روی <strong>هوش مصنوعی</strong> و ساخت محصولاتی است که زندگی روزمره را ساده‌تر می‌کنند.</p><p>همیشه در حال یادگیری‌ام؛ از ایدهٔ اولیه تا خط آخر کد، از حل مسئله‌های تازه لذت می‌برم و باور دارم بهترین محصول‌ها با توجه به نیاز آدم‌ها ساخته می‌شوند.</p><div className="skill-list">{skills.map((skill) => <span className="skill-chip" key={skill}>{skill}<i>✳</i></span>)}</div></div>
      </section>

      <section className="work-section section" id="work"><div className="wrap"><div className="work-top"><div><div className="section-kicker">چیزهایی که ساخته‌ام <span>۰۳</span></div><h2>پروژه‌های <span className="highlight">منتخب</span></h2></div><span className="work-note">نمونه‌کارها و ایده‌های در حال ساخت</span></div><div className="project-grid">{projects.map((project) => <article className="project-card" key={project.number}><div className="project-card-top"><span>{project.number}</span><span className="project-tag">{project.tag}</span></div><div className="project-icon">{project.mark}</div><h3>{project.title}</h3><p>{project.description}</p><a href="#contact" className="project-link" aria-label={`اطلاعات بیشتر دربارهٔ ${project.title}`}><Arrow diagonal /></a></article>)}</div></div></section>

      <section className="contact-section section wrap" id="contact"><div className="contact-card"><div className="contact-orb" /><div className="section-kicker">حرف تازه‌ای در راه است؟ <span>۰۴</span></div><h2>بیایید با هم<br /><span>چیزی بسازیم.</span></h2><p>برای همکاری، گپ‌وگفت یا تبادل ایده خوشحال می‌شوم ازت بشنوم.</p><a className="button button-light" href="mailto:hello@example.com">پیام بده <Arrow diagonal /></a><span className="contact-decoration">✳</span></div></section>

      <footer className="footer wrap"><a className="brand" href="#home"><span className="brand-mark">س</span><span>سجاد<span className="brand-dot">.</span></span></a><span className="footer-copy">با کنجکاوی ساخته شده <span>✦</span> © ۱۴۰۵</span><div className="social-links"><a href="https://github.com/" target="_blank" rel="noreferrer">گیت‌هاب <Arrow diagonal /></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">لینکدین <Arrow diagonal /></a></div></footer>
    </main>
  );
}
