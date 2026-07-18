import { useEffect, useState, type ReactNode } from 'react'

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

const images = {
  owners: 'https://images.unsplash.com/photo-1764391836704-8053c8a6e209?auto=format&fit=crop&q=82&w=1400',
  visitors: 'https://images.unsplash.com/photo-1775179424139-bd65d79c132e?auto=format&fit=crop&q=82&w=1400',
  process: 'https://images.unsplash.com/photo-1758840734307-aed01ccec284?auto=format&fit=crop&q=82&w=1400',
} as const

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

const benefits = [
  { icon: 'spark' as const, title: 'Premium experience', text: 'Give guests access to the defining technologies of the 21st century.' },
  { icon: 'people' as const, title: 'More visitors & loyalty', text: 'Attract ambitious people and create a reason to return.' },
  { icon: 'chart' as const, title: 'Higher value per visit', text: 'Unlock events, memberships, workshops, and new revenue.' },
  { icon: 'brain' as const, title: 'Future-ready positioning', text: 'Stand out as the intelligent, innovative place in your city.' },
]

const steps = [
  { icon: 'coffee' as const, number: '01', title: 'We onboard', text: 'We shape the premium AI concept around your existing café.' },
  { icon: 'people' as const, number: '02', title: 'We attract', text: 'Content, events, and local partnerships bring the right audience.' },
  { icon: 'scan' as const, number: '03', title: 'Guests explore', text: 'Visitors scan, learn, join workshops, and use guided AI experiences.' },
  { icon: 'chart' as const, number: '04', title: 'You grow', text: 'We measure traffic, loyalty, engagement, and commercial value.' },
]

const faq = [
  ['Do we need to rebuild our café?', 'No. The pilot upgrades the experience, positioning, community program, and technology layer around the space you already have.'],
  ['Is this only for technical people?', 'No. The experience is designed for entrepreneurs, students, creators, remote workers, families, and curious first-time AI users.'],
  ['Does the café need to buy expensive hardware?', 'The initial pilot is intentionally lightweight. A reliable internet connection, a display area, QR materials, and space for small events are enough to begin.'],
  ['Is this an official OpenAI program?', 'No. AI Café Network is an independent concept-stage project and does not currently claim affiliation with any AI provider.'],
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    const onScroll = () => document.body.classList.toggle('scrolled', window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className="site-header">
        <div className="container nav-wrap">
          <Logo />
          <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
          <nav className={menuOpen ? 'nav open' : 'nav'} onClick={() => setMenuOpen(false)}>
            <a href="#premium">Premium</a>
            <a href="#benefits">Benefits</a>
            <a href="#experience">Experience</a>
            <a href="#how">How it works</a>
            <a href="#pilot">Pilot</a>
            <a className="nav-cta" href={applicationUrl}>Apply for pilot <Icon name="arrow" size={17} /></a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-image" role="img" aria-label="Premium AI-enabled café experience" />
          <div className="hero-shade" />
          <div className="container hero-content">
            <div className="eyebrow"><span /> 90-day pilot · Alanya & Antalya</div>
            <h1>Turn your café into a <em>premium AI destination.</em></h1>
            <p className="hero-copy">Give your guests access to the technologies, knowledge, and community shaping the 21st century — without rebuilding the café they already love.</p>
            <div className="hero-actions">
              <a className="button button-gold" href={applicationUrl}>Apply for the pilot <Icon name="arrow" size={19} /></a>
              <a className="button button-ghost" href="#experience">Explore the concept</a>
            </div>
            <p className="microcopy"><Icon name="check" size={16} /> Limited to 3–5 design-partner cafés</p>
          </div>
          <div className="container hero-proof">
            {benefits.map((item) => (
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
              <div className="eyebrow dark"><span /> The new meaning of premium</div>
              <h2>Premium is no longer only marble, gold, and expensive furniture.</h2>
            </div>
            <div className="premium-statement">
              <p>In the 21st century, premium means <strong>access</strong>: access to intelligence, useful technology, ambitious people, new skills, and meaningful opportunity.</p>
              <blockquote>Same café. New status. Bigger future.</blockquote>
            </div>
          </div>
        </section>

        <section className="benefits section dark-section" id="benefits">
          <div className="container">
            <div className="section-heading centered">
              <div className="eyebrow"><span /> More than coffee</div>
              <h2>A premium experience your guests can feel.</h2>
              <p>We make the café more valuable, not merely more expensive.</p>
            </div>
            <div className="benefit-grid">
              {benefits.map((item, index) => (
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
              <div className="eyebrow dark"><span /> The experience layer</div>
              <h2>One network. Three kinds of value.</h2>
            </div>
            <div className="story-grid">
              <article className="story-card owners-card">
                <img src={images.owners} alt="AI Café Network concept for café owners" loading="lazy" />
                <div className="story-copy">
                  <span>For café owners</span>
                  <h3>Turn unused hours into community, loyalty, and revenue.</h3>
                  <p>Premium positioning, AI workshops, local partnerships, and measurable visitor growth.</p>
                </div>
              </article>
              <article className="story-card visitors-card">
                <img src={images.visitors} alt="AI Café Network community experience" loading="lazy" />
                <div className="story-copy">
                  <span>For visitors</span>
                  <h3>Learn, work, build, and connect with AI.</h3>
                  <p>A welcoming way to move from curiosity to practical action alongside other ambitious people.</p>
                </div>
              </article>
              <article className="story-card process-card">
                <img src={images.process} alt="How the AI Café Network experience works" loading="lazy" />
                <div className="story-copy">
                  <span>For the ecosystem</span>
                  <h3>A measurable physical channel for responsible AI adoption.</h3>
                  <p>Local education, real-world activation, qualified business leads, and repeatable case studies.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="how section" id="how">
          <div className="container">
            <div className="section-heading centered">
              <div className="eyebrow dark"><span /> Simple by design</div>
              <h2>How the transformation works.</h2>
            </div>
            <div className="steps">
              {steps.map((step) => (
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
              <div className="eyebrow"><span /> Founding pilot</div>
              <h2>Build the first premium AI café network in Türkiye.</h2>
              <p>We are selecting a small group of design-partner cafés in Alanya and Antalya for a focused 90-day validation program.</p>
              <ul>
                <li><Icon name="check" size={18} /> Premium positioning and launch concept</li>
                <li><Icon name="check" size={18} /> QR onboarding and guest experiences</li>
                <li><Icon name="check" size={18} /> Workshops, events, and community activation</li>
                <li><Icon name="check" size={18} /> Measurement, feedback, and pilot case study</li>
              </ul>
              <div className="hero-actions">
                <a className="button button-gold" href={applicationUrl}>Become a founding café <Icon name="arrow" size={19} /></a>
                <a className="button button-ghost" href={repoUrl}>View the public project</a>
              </div>
            </div>
            <div className="pilot-stats">
              <div><strong>3–5</strong><span>partner cafés</span></div>
              <div><strong>90</strong><span>days of validation</span></div>
              <div><strong>500+</strong><span>visitor target</span></div>
              <div><strong>1</strong><span>repeatable launch playbook</span></div>
            </div>
          </div>
        </section>

        <section className="faq section">
          <div className="container faq-grid">
            <div className="section-heading">
              <div className="eyebrow dark"><span /> Clear answers</div>
              <h2>Questions café owners ask first.</h2>
              <p>The pilot is designed to be practical, lightweight, and measurable.</p>
            </div>
            <div className="accordion">
              {faq.map(([question, answer], index) => (
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
              <div className="eyebrow"><span /> The future is local</div>
              <h2>Same café.<br /><em>Premium future.</em></h2>
            </div>
            <div>
              <p>Join the first wave of cafés bringing premium AI access, practical learning, and ambitious communities into everyday life.</p>
              <a className="button button-gold" href={applicationUrl}>Apply for the pilot <Icon name="arrow" size={19} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-grid">
          <div><Logo /><p>Transforming everyday cafés into premium AI destinations.</p></div>
          <div><b>Explore</b><a href="#benefits">Benefits</a><a href="#experience">Experience</a><a href="#how">How it works</a><a href="#pilot">Pilot</a></div>
          <div><b>Project</b><a href={repoUrl}>GitHub repository</a><a href={applicationUrl}>Pilot application</a><a href={`${repoUrl}/blob/main/README.md`}><Icon name="download" size={15} /> Concept brief</a></div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 AI Café Network · Photography via Unsplash</span>
          <span>Independent concept-stage project. Not affiliated with or endorsed by any AI provider.</span>
        </div>
      </footer>
    </>
  )
}

export default App
