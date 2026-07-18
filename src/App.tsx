import { useEffect, useState, type ReactNode } from 'react'

type Language = 'en' | 'tr'
type IconName =
  | 'spark'
  | 'people'
  | 'chart'
  | 'brain'
  | 'coffee'
  | 'scan'
  | 'calendar'
  | 'return'
  | 'arrow'
  | 'menu'
  | 'close'
  | 'check'
  | 'download'

const repoUrl = 'https://github.com/safal207/ai-cafe-network'
const applicationUrl = `${repoUrl}/issues/new?template=pilot-application.yml`

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    spark: <><path d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8L12 2Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></>,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/><path d="M16 7h4v4"/></>,
    brain: <><path d="M9.5 4.5A3.5 3.5 0 0 0 6 8v.3A3.5 3.5 0 0 0 4 11.5 3.5 3.5 0 0 0 7.5 15H9"/><path d="M14.5 4.5A3.5 3.5 0 0 1 18 8v.3a3.5 3.5 0 0 1 2 3.2 3.5 3.5 0 0 1-3.5 3.5H15"/><path d="M9.5 4.5V20a2 2 0 0 0 4 0V4.5"/><path d="M6 8.3h3.5M14.5 8.3H18M7.5 15H10m4 0h2.5"/></>,
    coffee: <><path d="M3 8h13v7a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Z"/><path d="M16 10h2a3 3 0 0 1 0 6h-2"/><path d="M6 2v3m4-3v3m4-3v3"/></>,
    scan: <><path d="M3 7V4a1 1 0 0 1 1-1h3M17 3h3a1 1 0 0 1 1 1v3M21 17v3a1 1 0 0 1-1 1h-3M7 21H4a1 1 0 0 1-1-1v-3"/><rect x="7" y="7" width="3" height="3"/><rect x="14" y="7" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><path d="M14 14h3v3h-3z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/><path d="m9 16 2 2 4-4"/></>,
    return: <><path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 6 6v5"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="AI Café Network home">
      <span className="logo-mark"><Icon name="coffee" size={25} /></span>
      <span><b>AI CAFÉ</b><small>NETWORK</small></span>
    </a>
  )
}

const content = {
  en: {
    nav: ['Premium', 'Benefits', 'Experience', 'How it works', 'Pilot'],
    apply: 'Apply for pilot',
    heroEyebrow: '90-day pilot · Alanya & Antalya',
    heroTitle: <>Turn your café into a <em>premium AI destination.</em></>,
    heroCopy: 'Give your guests access to the technologies, knowledge, and community shaping the 21st century — without rebuilding the café they already love.',
    explore: 'Explore the concept',
    limited: 'Limited to 3–5 design-partner cafés',
    premiumEyebrow: 'The new meaning of premium',
    premiumTitle: 'Premium is no longer only marble, gold, and expensive furniture.',
    premiumText: <>In the 21st century, premium means <strong>access</strong>: access to intelligence, useful technology, ambitious people, new skills, and meaningful opportunity.</>,
    premiumQuote: 'Same café. New status. Bigger future.',
    benefitsEyebrow: 'More than coffee',
    benefitsTitle: 'A premium experience your guests can feel.',
    benefitsCopy: 'We make the café more valuable, not merely more expensive.',
    experienceEyebrow: 'The experience layer',
    experienceTitle: 'One network. Three kinds of value.',
    howEyebrow: 'Simple by design',
    howTitle: 'How the transformation works.',
    pilotEyebrow: 'Founding pilot',
    pilotTitle: 'Build the first premium AI café network in Türkiye.',
    pilotCopy: 'We are selecting a small group of design-partner cafés in Alanya and Antalya for a focused 90-day validation program.',
    founding: 'Become a founding café',
    publicProject: 'View the public project',
    faqEyebrow: 'Clear answers',
    faqTitle: 'Questions café owners ask first.',
    faqCopy: 'The pilot is designed to be practical, lightweight, and measurable.',
    finalEyebrow: 'The future is local',
    finalTitle: <>Same café.<br /><em>Premium future.</em></>,
    finalCopy: 'Join the first wave of cafés bringing premium AI access, practical learning, and ambitious communities into everyday life.',
    footerTagline: 'Transforming everyday cafés into premium AI destinations.',
    exploreLabel: 'Explore',
    projectLabel: 'Project',
    benefits: [
      { icon: 'spark' as const, title: 'Premium experience', text: 'Give guests access to the defining technologies of the 21st century.' },
      { icon: 'people' as const, title: 'More visitors & loyalty', text: 'Attract ambitious people and create a reason to return.' },
      { icon: 'chart' as const, title: 'Higher value per visit', text: 'Unlock events, memberships, workshops, and new revenue.' },
      { icon: 'brain' as const, title: 'Future-ready positioning', text: 'Stand out as the intelligent, innovative place in your city.' },
    ],
    stories: [
      { variant: 'owners' as const, label: 'For café owners', title: 'Turn unused hours into community, loyalty, and revenue.', text: 'Premium positioning, AI workshops, local partnerships, and measurable visitor growth.', visual: ['Visitor growth', 'Community engagement', 'Event impact'] },
      { variant: 'visitors' as const, label: 'For visitors', title: 'Learn, work, build, and connect with AI.', text: 'A welcoming way to move from curiosity to practical action alongside other ambitious people.', visual: ['Learn', 'Build', 'Connect'] },
      { variant: 'ecosystem' as const, label: 'For the ecosystem', title: 'A measurable physical channel for responsible AI adoption.', text: 'Local education, real-world activation, qualified business leads, and repeatable case studies.', visual: ['Scan', 'Explore', 'Attend', 'Return'] },
    ],
    steps: [
      { icon: 'coffee' as const, number: '01', title: 'We onboard', text: 'We shape the premium AI concept around your existing café.' },
      { icon: 'people' as const, number: '02', title: 'We attract', text: 'Content, events, and local partnerships bring the right audience.' },
      { icon: 'scan' as const, number: '03', title: 'Guests explore', text: 'Visitors scan, learn, join workshops, and use guided AI experiences.' },
      { icon: 'chart' as const, number: '04', title: 'You grow', text: 'We measure traffic, loyalty, engagement, and commercial value.' },
    ],
    pilotItems: ['Premium positioning and launch concept', 'QR onboarding and guest experiences', 'Workshops, events, and community activation', 'Measurement, feedback, and pilot case study'],
    stats: [['3–5', 'partner cafés'], ['90', 'days of validation'], ['500+', 'visitor target'], ['1', 'repeatable launch playbook']],
    faq: [
      ['Do we need to rebuild our café?', 'No. The pilot upgrades the experience, positioning, community program, and technology layer around the space you already have.'],
      ['Is this only for technical people?', 'No. The experience is designed for entrepreneurs, students, creators, remote workers, families, and curious first-time AI users.'],
      ['Does the café need to buy expensive hardware?', 'The initial pilot is intentionally lightweight. A reliable internet connection, a display area, QR materials, and space for small events are enough to begin.'],
      ['Is this an official OpenAI program?', 'No. AI Café Network is an independent concept-stage project and does not currently claim affiliation with any AI provider.'],
    ],
    footerLinks: ['Benefits', 'Experience', 'How it works', 'Pilot'],
    repo: 'GitHub repository',
    application: 'Pilot application',
    brief: 'Concept brief',
    copyright: '© 2026 AI Café Network · Independent visual system',
    notice: 'Independent concept-stage project. Not affiliated with or endorsed by any AI provider.',
  },
  tr: {
    nav: ['Premium', 'Avantajlar', 'Deneyim', 'Nasıl çalışır', 'Pilot'],
    apply: 'Pilota başvur',
    heroEyebrow: '90 günlük pilot · Alanya & Antalya',
    heroTitle: <>Kafenizi <em>premium bir AI destinasyonuna</em> dönüştürün.</>,
    heroCopy: 'Misafirlerinize 21. yüzyılı şekillendiren teknolojiye, bilgiye ve topluluğa erişim sunun — sevdikleri kafeyi yeniden inşa etmeden.',
    explore: 'Konsepti keşfet',
    limited: '3–5 kurucu partner kafe ile sınırlı',
    premiumEyebrow: 'Premiumun yeni anlamı',
    premiumTitle: 'Premium artık sadece mermer, altın ve pahalı mobilya değildir.',
    premiumText: <>21. yüzyılda premium, <strong>erişim</strong> demektir: zekâya, faydalı teknolojiye, iddialı insanlara, yeni becerilere ve anlamlı fırsatlara erişim.</>,
    premiumQuote: 'Aynı kafe. Yeni statü. Daha büyük gelecek.',
    benefitsEyebrow: 'Kahveden daha fazlası',
    benefitsTitle: 'Misafirlerinizin hissedebileceği premium bir deneyim.',
    benefitsCopy: 'Kafeyi sadece daha pahalı değil, daha değerli hâle getiriyoruz.',
    experienceEyebrow: 'Deneyim katmanı',
    experienceTitle: 'Tek ağ. Üç farklı değer.',
    howEyebrow: 'Basit tasarım',
    howTitle: 'Dönüşüm nasıl çalışır?',
    pilotEyebrow: 'Kurucu pilot',
    pilotTitle: 'Türkiye’nin ilk premium AI kafe ağını birlikte kurun.',
    pilotCopy: 'Alanya ve Antalya’da 90 günlük odaklı doğrulama programı için küçük bir kurucu partner kafe grubu seçiyoruz.',
    founding: 'Kurucu kafe olun',
    publicProject: 'Açık projeyi görüntüle',
    faqEyebrow: 'Net cevaplar',
    faqTitle: 'Kafe sahiplerinin ilk sorduğu sorular.',
    faqCopy: 'Pilot pratik, hafif ve ölçülebilir olacak şekilde tasarlandı.',
    finalEyebrow: 'Gelecek yereldir',
    finalTitle: <>Aynı kafe.<br /><em>Premium gelecek.</em></>,
    finalCopy: 'Premium AI erişimini, pratik öğrenmeyi ve iddialı toplulukları günlük hayata taşıyan ilk kafe dalgasına katılın.',
    footerTagline: 'Günlük kafeleri premium AI destinasyonlarına dönüştürüyoruz.',
    exploreLabel: 'Keşfet',
    projectLabel: 'Proje',
    benefits: [
      { icon: 'spark' as const, title: 'Premium deneyim', text: 'Misafirlere 21. yüzyılın belirleyici teknolojilerine erişim sunun.' },
      { icon: 'people' as const, title: 'Daha fazla ziyaretçi ve sadakat', text: 'İddialı insanları çekin ve tekrar gelmeleri için gerçek bir neden yaratın.' },
      { icon: 'chart' as const, title: 'Ziyaret başına daha yüksek değer', text: 'Etkinlikler, üyelikler, atölyeler ve yeni gelir fırsatları açın.' },
      { icon: 'brain' as const, title: 'Geleceğe hazır konumlandırma', text: 'Şehrinizin akıllı ve yenilikçi buluşma noktası olarak öne çıkın.' },
    ],
    stories: [
      { variant: 'owners' as const, label: 'Kafe sahipleri için', title: 'Boş saatleri topluluğa, sadakate ve gelire dönüştürün.', text: 'Premium konumlandırma, AI atölyeleri, yerel ortaklıklar ve ölçülebilir ziyaretçi büyümesi.', visual: ['Ziyaretçi büyümesi', 'Topluluk etkileşimi', 'Etkinlik etkisi'] },
      { variant: 'visitors' as const, label: 'Ziyaretçiler için', title: 'AI ile öğrenin, çalışın, üretin ve bağ kurun.', text: 'Meraktan pratik eyleme geçmek için sıcak, erişilebilir ve güçlü bir ortam.', visual: ['Öğren', 'Üret', 'Bağ kur'] },
      { variant: 'ecosystem' as const, label: 'Ekosistem için', title: 'Sorumlu AI benimsenmesi için ölçülebilir fiziksel kanal.', text: 'Yerel eğitim, gerçek kullanım, nitelikli iş bağlantıları ve tekrarlanabilir vaka çalışmaları.', visual: ['Tara', 'Keşfet', 'Katıl', 'Geri dön'] },
    ],
    steps: [
      { icon: 'coffee' as const, number: '01', title: 'Hazırlıyoruz', text: 'Premium AI konseptini mevcut kafenizin çevresinde tasarlıyoruz.' },
      { icon: 'people' as const, number: '02', title: 'Kitleyi çekiyoruz', text: 'İçerik, etkinlikler ve yerel ortaklıklarla doğru insanları getiriyoruz.' },
      { icon: 'scan' as const, number: '03', title: 'Misafirler keşfediyor', text: 'Ziyaretçiler tarıyor, öğreniyor, atölyelere katılıyor ve AI deneyimlerini kullanıyor.' },
      { icon: 'chart' as const, number: '04', title: 'Birlikte büyüyoruz', text: 'Trafiği, sadakati, etkileşimi ve ticari değeri ölçüyoruz.' },
    ],
    pilotItems: ['Premium konumlandırma ve lansman konsepti', 'QR onboarding ve misafir deneyimleri', 'Atölyeler, etkinlikler ve topluluk aktivasyonu', 'Ölçüm, geri bildirim ve pilot vaka çalışması'],
    stats: [['3–5', 'partner kafe'], ['90', 'gün doğrulama'], ['500+', 'ziyaretçi hedefi'], ['1', 'tekrarlanabilir lansman sistemi']],
    faq: [
      ['Kafeyi yeniden inşa etmemiz gerekir mi?', 'Hayır. Pilot, zaten sahip olduğunuz alanın deneyimini, konumlandırmasını, topluluk programını ve teknoloji katmanını geliştirir.'],
      ['Bu sadece teknik insanlar için mi?', 'Hayır. Deneyim girişimciler, öğrenciler, üreticiler, uzaktan çalışanlar, aileler ve AI ile ilk kez tanışan meraklı insanlar için tasarlanmıştır.'],
      ['Pahalı donanım satın almak gerekir mi?', 'İlk pilot bilinçli olarak hafiftir. Güvenilir internet, küçük bir tanıtım alanı, QR materyalleri ve küçük etkinlikler için alan başlangıç için yeterlidir.'],
      ['Bu resmi bir OpenAI programı mı?', 'Hayır. AI Café Network bağımsız, konsept aşamasındaki bir projedir ve şu anda herhangi bir AI sağlayıcısıyla resmi bağlantı iddia etmez.'],
    ],
    footerLinks: ['Avantajlar', 'Deneyim', 'Nasıl çalışır', 'Pilot'],
    repo: 'GitHub deposu',
    application: 'Pilot başvurusu',
    brief: 'Konsept özeti',
    copyright: '© 2026 AI Café Network · Bağımsız görsel sistem',
    notice: 'Bağımsız konsept aşaması projesi. Herhangi bir AI sağlayıcısına bağlı veya onun tarafından onaylanmış değildir.',
  },
} as const

type StoryVariant = 'owners' | 'visitors' | 'ecosystem'

function BrandVisual({ variant, labels }: { variant: StoryVariant; labels: readonly string[] }) {
  if (variant === 'owners') {
    return (
      <div className="brand-visual owner-visual" aria-hidden="true">
        <div className="visual-brand"><span><Icon name="coffee" size={20} /></span> AI CAFÉ NETWORK</div>
        <div className="metric-stack">
          <div><small>{labels[0]}</small><strong>+42%</strong><i className="sparkline"><b /><b /><b /><b /><b /></i></div>
          <div><small>{labels[1]}</small><strong>78%</strong><span className="ring-meter" /></div>
          <div><small>{labels[2]}</small><strong>312</strong><Icon name="people" size={29} /></div>
        </div>
        <div className="visual-glow" />
      </div>
    )
  }

  if (variant === 'visitors') {
    return (
      <div className="brand-visual visitor-visual" aria-hidden="true">
        <div className="visual-brand"><span><Icon name="spark" size={20} /></span> IDEAS · PEOPLE · AI</div>
        <div className="network-orbit">
          <span className="orbit-node node-a"><Icon name="people" /></span>
          <span className="orbit-node node-b"><Icon name="brain" /></span>
          <span className="orbit-node node-c"><Icon name="coffee" /></span>
          <span className="orbit-core">AI</span>
        </div>
        <div className="visual-pills">{labels.map((label) => <span key={label}>{label}</span>)}</div>
        <div className="visual-glow" />
      </div>
    )
  }

  return (
    <div className="brand-visual ecosystem-visual" aria-hidden="true">
      <div className="visual-brand"><span><Icon name="scan" size={20} /></span> 90-DAY PILOT</div>
      <div className="journey-line">
        {labels.map((label, index) => (
          <div key={label}><span>{index + 1}</span><b>{label}</b></div>
        ))}
      </div>
      <div className="impact-card"><Icon name="chart" /><span>LOCAL IMPACT</span><strong>GLOBAL VISION</strong></div>
      <div className="visual-glow" />
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = window.localStorage.getItem('ai-cafe-language')
    if (saved === 'tr' || saved === 'en') return saved
    return navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en'
  })
  const copy = content[language]

  useEffect(() => {
    const onScroll = () => document.body.classList.toggle('scrolled', window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem('ai-cafe-language', language)
  }, [language])

  const switchLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage)
    setMenuOpen(false)
  }

  return (
    <>
      <header className="site-header">
        <div className="container nav-wrap">
          <Logo />
          <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
          <nav className={menuOpen ? 'nav open' : 'nav'} onClick={() => setMenuOpen(false)}>
            <a href="#premium">{copy.nav[0]}</a>
            <a href="#benefits">{copy.nav[1]}</a>
            <a href="#experience">{copy.nav[2]}</a>
            <a href="#how">{copy.nav[3]}</a>
            <a href="#pilot">{copy.nav[4]}</a>
            <div className="language-switch" aria-label="Language selector">
              <button className={language === 'en' ? 'active' : ''} onClick={(event) => { event.stopPropagation(); switchLanguage('en') }}>EN</button>
              <button className={language === 'tr' ? 'active' : ''} onClick={(event) => { event.stopPropagation(); switchLanguage('tr') }}>TR</button>
            </div>
            <a className="nav-cta" href={applicationUrl}>{copy.apply} <Icon name="arrow" size={17} /></a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-image" role="img" aria-label="Premium AI-enabled café experience" />
          <div className="hero-shade" />
          <div className="container hero-content">
            <div className="eyebrow"><span /> {copy.heroEyebrow}</div>
            <h1>{copy.heroTitle}</h1>
            <p className="hero-copy">{copy.heroCopy}</p>
            <div className="hero-actions">
              <a className="button button-gold" href={applicationUrl}>{copy.apply} <Icon name="arrow" size={19} /></a>
              <a className="button button-ghost" href="#experience">{copy.explore}</a>
            </div>
            <p className="microcopy"><Icon name="check" size={16} /> {copy.limited}</p>
          </div>
          <div className="container hero-proof">
            {copy.benefits.map((item) => (
              <article key={item.title}>
                <span><Icon name={item.icon} /></span>
                <div><b>{item.title}</b><small>{item.text}</small></div>
              </article>
            ))}
          </div>
        </section>

        <section className="premium-section section" id="premium">
          <div className="container premium-grid">
            <div>
              <div className="eyebrow dark"><span /> {copy.premiumEyebrow}</div>
              <h2>{copy.premiumTitle}</h2>
            </div>
            <div className="premium-statement">
              <p>{copy.premiumText}</p>
              <blockquote>{copy.premiumQuote}</blockquote>
            </div>
          </div>
        </section>

        <section className="benefits section dark-section" id="benefits">
          <div className="container">
            <div className="section-heading centered">
              <div className="eyebrow"><span /> {copy.benefitsEyebrow}</div>
              <h2>{copy.benefitsTitle}</h2>
              <p>{copy.benefitsCopy}</p>
            </div>
            <div className="benefit-grid">
              {copy.benefits.map((item, index) => (
                <article className="benefit-card" key={item.title}>
                  <span className="card-number">0{index + 1}</span>
                  <div className="icon-ring"><Icon name={item.icon} size={28} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="experience section" id="experience">
          <div className="container">
            <div className="section-heading">
              <div className="eyebrow dark"><span /> {copy.experienceEyebrow}</div>
              <h2>{copy.experienceTitle}</h2>
            </div>
            <div className="story-grid">
              {copy.stories.map((story) => (
                <article className={`story-card ${story.variant}-card`} key={story.label}>
                  <BrandVisual variant={story.variant} labels={story.visual} />
                  <div className="story-copy">
                    <span>{story.label}</span>
                    <h3>{story.title}</h3>
                    <p>{story.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="how section" id="how">
          <div className="container">
            <div className="section-heading centered">
              <div className="eyebrow dark"><span /> {copy.howEyebrow}</div>
              <h2>{copy.howTitle}</h2>
            </div>
            <div className="steps">
              {copy.steps.map((step) => (
                <article className="step" key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <div className="step-icon"><Icon name={step.icon} size={28} /></div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pilot section" id="pilot">
          <div className="container pilot-panel">
            <div className="pilot-copy">
              <div className="eyebrow"><span /> {copy.pilotEyebrow}</div>
              <h2>{copy.pilotTitle}</h2>
              <p>{copy.pilotCopy}</p>
              <ul>
                {copy.pilotItems.map((item) => <li key={item}><Icon name="check" size={18} /> {item}</li>)}
              </ul>
              <div className="hero-actions">
                <a className="button button-gold" href={applicationUrl}>{copy.founding} <Icon name="arrow" size={19} /></a>
                <a className="button button-ghost" href={repoUrl}>{copy.publicProject}</a>
              </div>
            </div>
            <div className="pilot-stats">
              {copy.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
            </div>
          </div>
        </section>

        <section className="faq section">
          <div className="container faq-grid">
            <div className="section-heading">
              <div className="eyebrow dark"><span /> {copy.faqEyebrow}</div>
              <h2>{copy.faqTitle}</h2>
              <p>{copy.faqCopy}</p>
            </div>
            <div className="accordion">
              {copy.faq.map(([question, answer], index) => (
                <article className={openFaq === index ? 'faq-item open' : 'faq-item'} key={question}>
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                    {question}<span>{openFaq === index ? '−' : '+'}</span>
                  </button>
                  <div><p>{answer}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta section dark-section">
          <div className="container cta-inner">
            <div>
              <div className="eyebrow"><span /> {copy.finalEyebrow}</div>
              <h2>{copy.finalTitle}</h2>
            </div>
            <div>
              <p>{copy.finalCopy}</p>
              <a className="button button-gold" href={applicationUrl}>{copy.apply} <Icon name="arrow" size={19} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-grid">
          <div><Logo /><p>{copy.footerTagline}</p></div>
          <div><b>{copy.exploreLabel}</b><a href="#benefits">{copy.footerLinks[0]}</a><a href="#experience">{copy.footerLinks[1]}</a><a href="#how">{copy.footerLinks[2]}</a><a href="#pilot">{copy.footerLinks[3]}</a></div>
          <div><b>{copy.projectLabel}</b><a href={repoUrl}>{copy.repo}</a><a href={applicationUrl}>{copy.application}</a><a href={`${repoUrl}/blob/main/README.md`}><Icon name="download" size={15} /> {copy.brief}</a></div>
        </div>
        <div className="container footer-bottom">
          <span>{copy.copyright}</span>
          <span>{copy.notice}</span>
        </div>
      </footer>
    </>
  )
}

export default App
