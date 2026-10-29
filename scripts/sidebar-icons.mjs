/** Inline SVG icons for top Main Navigation (VitePress renders nav text via v-html). */
function svgIcon(paths) {
  const body = paths.map((d) =>
    d.startsWith('<') ? d : `<path d="${d}"/>`
  ).join('')
  return (
    `<svg class="nav-ico" xmlns="http://www.w3.org/2000/svg" width="16" height="16" ` +
    `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ` +
    `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`
  )
}

const TOP_NAV_ICONS = {
  '文档指南': svgIcon([
    'M4 19.5A2.5 2.5 0 0 1 6.5 17H20',
    'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'
  ]),
  '交易业务': svgIcon([
    'M3 3v16a2 2 0 0 0 2 2h16',
    'm19 9-5 5-4-4-3 3'
  ]),
  '部署与运维': svgIcon([
    '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/>',
    '<rect width="20" height="8" x="2" y="14" rx="2" ry="2"/>',
    '<line x1="6" x2="6.01" y1="6" y2="6"/>',
    '<line x1="6" x2="6.01" y1="18" y2="18"/>'
  ]),
  // dropdown: 交易业务
  '现货手册': svgIcon([
    '<circle cx="8" cy="8" r="6"/>',
    '<path d="M18.09 10.37A6 6 0 1 1 10.34 18"/>',
    '<path d="M7 6h1v4"/>',
    '<path d="M16.71 13.88h.01"/>'
  ]),
  '合约手册': svgIcon([
    'M3 3v16a2 2 0 0 0 2 2h16',
    'm7 14 4-4 4 4 5-6'
  ]),
  '期权手册': svgIcon([
    '<circle cx="12" cy="12" r="10"/>',
    '<circle cx="12" cy="12" r="3"/>'
  ]),
  '钱包手册': svgIcon([
    '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>',
    '<path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>',
    '<path d="M18 12h.01"/>'
  ]),
  'OTC手册': svgIcon([
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>',
    '<circle cx="9" cy="7" r="4"/>',
    '<path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
    '<path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
  ])
}

export function withTopNavIcon(title) {
  const ico = TOP_NAV_ICONS[title]
  if (!ico) return title
  return `${ico}<span class="nav-label">${title}</span>`
}
