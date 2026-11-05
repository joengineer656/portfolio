'use client'

// Flips <html lang/dir> and remembers the choice. The language itself is shown/hidden by CSS, so no state is needed.
export default function LangSwitch() {
  const toggle = () => {
    const h = document.documentElement
    const ar = h.lang !== 'ar'
    h.lang = ar ? 'ar' : 'en'
    h.dir = ar ? 'rtl' : 'ltr'
    try { localStorage.setItem('lang', h.lang) } catch { /* private mode: the switch still works for this visit */ }
  }
  return (
    <button type="button" className="langswitch" onClick={toggle} aria-label="Switch language / تبديل اللغة">
      <span data-l="en" lang="ar">عربي</span><span data-l="ar">English</span>
    </button>
  )
}
