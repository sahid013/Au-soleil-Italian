/**
 * Brand badge — the stamped "Au Soleil Italien" crest in charter colours.
 * Pure presentational SVG; size via the `.logo-badge` class set by the parent.
 * `idPrefix` keeps the internal arc-path ids unique when several logos render
 * on one page (nav, page-head, footer).
 */
export function Logo({ idPrefix = "logo", title = "Au Soleil Italien" }: { idPrefix?: string; title?: string }) {
  const top = `${idPrefix}-arcTop`;
  const bot = `${idPrefix}-arcBot`;
  return (
    <svg className="logo-badge" viewBox="0 0 200 200" role="img" aria-label={title}>
      <defs>
        <path id={top} d="M 100 100 m -74 0 a 74 74 0 0 1 148 0" />
        <path id={bot} d="M 100 100 m -68 0 a 68 68 0 0 0 136 0" />
      </defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke="#C79A3B" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#C79A3B" strokeWidth="1" opacity="0.6" />
      <text fontFamily="Cinzel, serif" fontSize="15" letterSpacing="4" fontWeight="600" fill="#1E3B2C">
        <textPath href={`#${top}`} startOffset="50%" textAnchor="middle">
          PIZZERIA
        </textPath>
      </text>
      <text fontFamily="Cinzel, serif" fontSize="15" letterSpacing="4" fontWeight="600" fill="#1E3B2C">
        <textPath href={`#${bot}`} startOffset="50%" textAnchor="middle">
          RISTORANTE
        </textPath>
      </text>
      {/* sun rays */}
      <g stroke="#C79A3B" strokeWidth="2.2" strokeLinecap="round">
        <line x1="100" y1="48" x2="100" y2="40" />
        <line x1="84" y1="52" x2="80" y2="45" />
        <line x1="116" y1="52" x2="120" y2="45" />
        <line x1="72" y1="62" x2="66" y2="57" />
        <line x1="128" y1="62" x2="134" y2="57" />
      </g>
      <path d="M 74 70 a 26 26 0 0 1 52 0 Z" fill="#EBA94C" />
      {/* script name */}
      <text x="100" y="118" textAnchor="middle" fontFamily="'Great Vibes', cursive" fontSize="30" fill="#1E3B2C">
        Au Soleil
      </text>
      <text x="100" y="142" textAnchor="middle" fontFamily="'Great Vibes', cursive" fontSize="30" fill="#9E2F2F">
        Italien
      </text>
      {/* crossed fork & knife */}
      <g stroke="#C79A3B" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9">
        <line x1="86" y1="150" x2="94" y2="162" />
        <line x1="114" y1="150" x2="106" y2="162" />
      </g>
    </svg>
  );
}
