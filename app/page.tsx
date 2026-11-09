import ChatWidget from "./components/chat-widget";

const skills = [
  { icon: "code", title: "توسعهٔ وب", items: "React · Next.js · TypeScript", detail: "ساخت رابط‌های سریع و قابل‌استفاده" },
  { icon: "brain", title: "هوش مصنوعی", items: "Python · یادگیری ماشین · LLM", detail: "تبدیل مدل‌ها به ابزارهای کاربردی" },
  { icon: "database", title: "داده و زیرساخت", items: "API · پایگاه داده · Git", detail: "طراحی اجزای پایدار برای محصول" },
];

const projects = [
  { number: "۰۱", tag: "هوش مصنوعی", title: "دستیار هوشمند فارسی", description: "طراحی یک تجربهٔ مکالمه‌محور برای پاسخ‌گویی دقیق و طبیعی به پرسش‌های کاربران.", mark: "✳", stack: ["Python", "LLM", "Next.js"], color: "lilac" },
  { number: "۰۲", tag: "محصول داده‌محور", title: "داشبورد تحلیل داده", description: "نمایش داده‌های پیچیده در قالبی روشن و قابل‌فهم برای تصمیم‌گیری بهتر.", mark: "◫", stack: ["React", "Charts", "API"], color: "blue" },
  { number: "۰۳", tag: "یادگیری ماشین", title: "پیش‌بینی و تحلیل", description: "بررسی الگوهای داده و ساخت یک جریان ساده برای تبدیل داده به بینش.", mark: "⌁", stack: ["Python", "ML", "Data"], color: "peach" },
];

type IconName = "about" | "work" | "contact" | "collaborate" | "code" | "brain" | "database" | "spark" | "arrow" | "download" | "github" | "linkedin" | "mail" | "check" | "layers" | "globe";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    about: <><circle cx="12" cy="8" r="3.25" /><path d="M5.5 19a6.5 6.5 0 0 1 13 0" /></>,
    work: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M9 5V3.5h6V5M4 10h16M10 10v2h4v-2" /></>,
    contact: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-2 2v-6.1a7.5 7.5 0 1 1 16-3.4Z" /><path d="M8 11h8M8 14h5" /></>,
    collaborate: <><path d="M8 12.5 10.5 15a2.1 2.1 0 0 0 3 0l2-2" /><path d="m3.5 10 4-4 3 2 2-1.5a2 2 0 0 1 2.4.1L20.5 11l-3 3" /></>,
    code: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></>,
    brain: <><path d="M12 5a3 3 0 0 0-5.8 1.1A3.5 3.5 0 0 0 5 12a3.5 3.5 0 0 0 2 6.3A3 3 0 0 0 12 17Z" /><path d="M12 5a3 3 0 0 1 5.8 1.1A3.5 3.5 0 0 1 19 12a3.5 3.5 0 0 1-2 6.3A3 3 0 0 1 12 17ZM9 9h.01M15 9h.01M9 14h.01M15 14h.01M12 5v12" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 16 .9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z" /></>,
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 20h16" /></>,
    github: <><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.2-1.5 6.2-6.8a5.3 5.3 0 0 0-1.4-3.7 4.9 4.9 0 0 0-.1-3.7s-1.2-.4-3.8 1.4a13.3 13.3 0 0 0-6.9 0C5.5.8 4.3 1.2 4.3 1.2a4.9 4.9 0 0 0-.1 3.7 5.3 5.3 0 0 0-1.4 3.7c0 5.3 3.2 6.5 6.2 6.8a3.4 3.4 0 0 0-.9 2.7V22" /></>,
    linkedin: <><path d="M4 9v11M4 4v.01M9 20v-7a4 4 0 0 1 8 0v7M9 9v11" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? "↗" : "←"}</span>;
}

export default function Home() {
  return (
    <main>
      <header className="site-header wrap">
        <a className="brand" href="#home" aria-label="رفتن به ابتدای صفحه"><span className="brand-mark">س</span><span>سجاد<span className="brand-dot">.</span><small>مهندس نرم‌افزار · هوش مصنوعی</small></span></a>
        <nav className="nav" aria-label="ناوبری اصلی">
          <a href="#about"><Icon name="about" /><span>دربارهٔ من</span></a><a href="#work"><Icon name="work" /><span>پروژه‌ها</span></a><a href="#resume"><Icon name="layers" /><span>مسیر حرفه‌ای</span></a>
        </nav>
        <a className="header-cta" href="#contact"><Icon name="collaborate" /><span>دعوت به همکاری</span><Arrow diagonal /></a>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> برنامه‌نویس و علاقه‌مند به هوش مصنوعی <i>✳</i></div>
          <h1>سلام، من سجادم.<br /><span className="hero-highlight">همسر نگین خانم</span></h1>
          <p className="hero-description">کد می‌نویسم، مسئله حل می‌کنم و به ایده‌هایی جان می‌دهم که می‌توانند زندگی را ساده‌تر کنند. تمرکزم روی توسعهٔ نرم‌افزار و تجربه‌های کاربردی هوش مصنوعی است.</p>
          <div className="hero-actions"><a className="button button-primary" href="#work"><Icon name="work" /> دیدن پروژه‌ها <Arrow /></a><a className="button button-outline" href="#resume"><Icon name="download" /> مسیر حرفه‌ای من</a></div>
          <div className="hero-note"><span className="note-line" /> آمادهٔ یادگیری، ساختن و همکاری</div>
        </div>
        <div className="hero-art" aria-label="تصویر انتزاعی با الهام از شبکه‌های هوش مصنوعی">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-grid" />
          <div className="art-label label-top"><span className="tiny-pulse" /> HUMAN IDEAS / MACHINE INTELLIGENCE</div>
          <div className="art-core"><span className="core-symbol">AI</span><span className="core-caption">ساختن در مرزِ ایده و کد</span></div>
          <div className="node node-a">ML<span>یادگیری ماشین</span></div><div className="node node-b">&lt;/&gt;<span>مهندسی نرم‌افزار</span></div><div className="node node-c">✳<span>ایدهٔ انسانی</span></div>
          <div className="art-label label-bottom">طراحی برای فردا <span>✦</span></div>
        </div>
        <div className="hero-index"><span>۰۱</span><i /> معرفی</div><div className="hero-side-note">SOFTWARE <span>—</span> INTELLIGENCE</div>
      </section>

      <section className="ticker" aria-label="زمینه‌های کاری"><div className="ticker-track"><span>هوش مصنوعی</span><b>✳</b><span>توسعهٔ نرم‌افزار</span><b>✳</b><span>ساخت محصول</span><b>✳</b><span>یادگیری مداوم</span><b>✳</b><span>هوش مصنوعی</span><b>✳</b><span>توسعهٔ نرم‌افزار</span></div></section>

      <section className="intro-strip wrap" aria-label="خلاصهٔ حرفه‌ای">
        <div className="intro-copy"><span className="intro-icon"><Icon name="spark" size={20} /></span><div><strong>ایده را به تجربه تبدیل می‌کنم</strong><span>از منطق پشت سیستم تا جزئیات رابط کاربری</span></div></div>
        <div className="intro-metrics"><div><strong>۰۱</strong><span>نرم‌افزار</span></div><i /><div><strong>۰۲</strong><span>هوش مصنوعی</span></div><i /><div><strong>۰۳</strong><span>محصول‌محور</span></div></div>
      </section>

      <section className="about-section section wrap" id="about">
        <div className="section-heading"><div className="section-kicker">کمی دربارهٔ من <span>۰۲</span></div><h2>علاقه‌مند به ساختن<br />چیزهایی که <span className="highlight">معنا دارند.</span></h2><p className="heading-caption">ترکیب کنجکاوی مهندسی با نگاه انسانی به محصول</p></div>
        <div className="about-content"><p>من یک برنامه‌نویس کنجکاوم که از ترکیب فناوری و خلاقیت انرژی می‌گیرد. این روزها تمرکزم روی <strong>هوش مصنوعی</strong> و ساخت محصولاتی است که زندگی روزمره را ساده‌تر می‌کنند.</p><p>همیشه در حال یادگیری‌ام؛ از ایدهٔ اولیه تا خط آخر کد، از حل مسئله‌های تازه لذت می‌برم و باور دارم بهترین محصول‌ها با توجه به نیاز آدم‌ها ساخته می‌شوند.</p><div className="about-points"><span><i><Icon name="check" size={15} /></i> توجه به جزئیات و کیفیت</span><span><i><Icon name="check" size={15} /></i> یادگیری و رشد مستمر</span><span><i><Icon name="check" size={15} /></i> همکاری و حل مسئله</span></div></div>
      </section>

      <section className="expertise-section section" id="expertise"><div className="expertise-scene" aria-hidden="true"><div className="scene-grid"/><div className="scene-orbit scene-orbit-one"/><div className="scene-orbit scene-orbit-two"/><div className="scene-sphere"><span>AI</span><i/></div><b className="scene-node scene-node-one">ML</b><b className="scene-node scene-node-two">✳</b><b className="scene-node scene-node-three">&lt;/&gt;</b><span className="scene-caption">NEURAL / NETWORK</span></div><div className="wrap"><div className="work-top"><div><div className="section-kicker">جعبه‌ابزار من <span>۰۳</span></div><h2>تخصص‌هایی برای <span className="highlight">ساختن</span></h2></div><span className="work-note">مهارت‌ها با دریافت رزومهٔ کامل دقیق‌تر می‌شوند</span></div><div className="expertise-grid">{skills.map((skill) => <article className="expertise-card" key={skill.title}><div className="expertise-icon"><Icon name={skill.icon as IconName} size={21} /></div><span className="expertise-index">تخصص {skill.title === "توسعهٔ وب" ? "۰۱" : skill.title === "هوش مصنوعی" ? "۰۲" : "۰۳"}</span><h3>{skill.title}</h3><p>{skill.detail}</p><div className="expertise-tags">{skill.items.split(" · ").map((item) => <span key={item}>{item}</span>)}</div></article>)}</div></div></section>

      <section className="work-section section" id="work"><div className="wrap"><div className="work-top"><div><div className="section-kicker">چیزهایی که ساخته‌ام <span>۰۴</span></div><h2>پروژه‌های <span className="highlight">منتخب</span></h2></div><a className="all-projects" href="https://github.com/sajjadsalimk" target="_blank" rel="noreferrer"><Icon name="github" size={17} /> مشاهده در گیت‌هاب <Arrow diagonal /></a></div><div className="project-grid">{projects.map((project) => <article className={`project-card project-${project.color}`} key={project.number}><div className="project-card-top"><span>{project.number}</span><span className="project-tag"><i />{project.tag}</span></div><div className="project-art"><div className="project-art-orbit" /><div className="project-icon">{project.mark}</div><span className="project-art-label">CASE STUDY / {project.number}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="project-card-bottom"><div className="project-stack">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div><a href="#contact" className="project-link" aria-label={`گفت‌وگو دربارهٔ ${project.title}`}><Icon name="arrow" size={17} /></a></div></article>)}</div><p className="project-disclaimer"><Icon name="spark" size={15} /> این بخش فعلاً قالب نمایشی است؛ با دریافت رزومه و نمونه‌کارها، پروژه‌های واقعی جایگزین می‌شوند.</p></div></section>

      <section className="resume-section section wrap" id="resume"><div className="resume-banner"><div className="resume-glow" /><div className="resume-heading"><div className="section-kicker">مسیر حرفه‌ای <span>۰۵</span></div><h2>هر خط کد،<br /><span>یک قدم رو به جلو.</span></h2><p>تجربه‌ها، تحصیلات و دستاوردهایم اینجا قرار می‌گیرند تا تصویر روشنی از مسیر من بسازند.</p><a className="button button-light" href="#contact"><Icon name="mail" /> دربارهٔ رزومه‌ام بپرسید <Arrow diagonal /></a></div><div className="resume-timeline"><div className="timeline-card"><span className="timeline-symbol"><Icon name="code" /></span><div><span className="timeline-label">تجربهٔ کاری</span><strong>اطلاعات پس از دریافت رزومه تکمیل می‌شود</strong><small>عنوان شغلی · شرکت · بازهٔ زمانی</small></div><span className="timeline-pending">در انتظار</span></div><div className="timeline-card"><span className="timeline-symbol"><Icon name="layers" /></span><div><span className="timeline-label">تحصیلات و دوره‌ها</span><strong>اطلاعات پس از دریافت رزومه تکمیل می‌شود</strong><small>رشته یا دورهٔ تخصصی · مؤسسه</small></div><span className="timeline-pending">در انتظار</span></div><div className="timeline-card"><span className="timeline-symbol"><Icon name="spark" /></span><div><span className="timeline-label">دستاوردها</span><strong>پروژه‌ها و نتایج شاخص</strong><small>جزئیات بر اساس سوابق واقعی اضافه خواهد شد</small></div><span className="timeline-pending">در انتظار</span></div></div></div></section>

      <section className="contact-section section wrap" id="contact"><div className="contact-card"><div className="contact-orb" /><div className="contact-copy"><div className="section-kicker">فرصت‌های تازه <span>۰۶</span></div><h2>یک ایده دارید؟<br /><span>با هم بسازیمش.</span></h2><p>برای همکاری، گفت‌وگو یا تبادل ایده خوشحال می‌شوم از شما بشنوم.</p><a className="button button-light" href="mailto:hello@example.com"><Icon name="mail" /> شروع گفت‌وگو <Arrow diagonal /></a></div><div className="contact-side"><span className="contact-decoration">✳</span><span className="contact-side-caption">OPEN TO<br />GOOD IDEAS</span><span className="contact-side-line" /></div></div></section>

      <footer className="footer wrap"><a className="brand" href="#home"><span className="brand-mark">س</span><span>سجاد<span className="brand-dot">.</span></span></a><span className="footer-copy">با کنجکاوی و دقت ساخته شده <span>✦</span> © ۱۴۰۵</span><div className="social-links"><a href="https://github.com/sajjadsalimk" target="_blank" rel="noreferrer" aria-label="گیت‌هاب"><Icon name="github" /><span>گیت‌هاب</span><Arrow diagonal /></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="لینکدین"><Icon name="linkedin" /><span>لینکدین</span><Arrow diagonal /></a></div></footer>
      <ChatWidget />
    </main>
  );
}
