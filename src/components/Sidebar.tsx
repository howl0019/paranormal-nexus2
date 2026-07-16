import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/agents', label: 'Agentes' },
  { to: '/campaigns', label: 'Campanhas' },
];

export function Sidebar() {
  return (
    <aside className="w-full max-w-[260px] shrink-0 border-r border-border bg-surface px-4 py-6 xl:px-6">
      <div className="mb-8">
        <div className="mb-4 text-xs uppercase tracking-[0.3em] text-neutral-400">Paranormal Nexus</div>
        <h1 className="text-2xl font-semibold text-white">C.R.I.S. Console</h1>
        <p className="mt-2 text-sm text-neutral-400">Sistema offline de agentes e campanhas.</p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? 'bg-accent/15 text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
