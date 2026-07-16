import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="rounded-3xl border border-border bg-surface p-8 shadow-panel">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Bem-vindo ao Paranormal Nexus</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Console estável para agentes e campanhas</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300">
            Um sistema offline inspirado em C.R.I.S., SCP Foundation e interfaces militares. Crie e gerencie agentes, campanhas, monstros e mapas sem dependências externas.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/agents" className="rounded-3xl border border-border bg-[#11121a] p-6 text-left transition hover:border-accent/80">
            <h2 className="text-xl font-semibold text-white">Agentes</h2>
            <p className="mt-2 text-sm text-neutral-400">Crie, edite e gerencie seus agentes paranormais.</p>
          </Link>
          <Link to="/campaigns" className="rounded-3xl border border-border bg-[#11121a] p-6 text-left transition hover:border-accent/80">
            <h2 className="text-xl font-semibold text-white">Campanhas</h2>
            <p className="mt-2 text-sm text-neutral-400">Controle campanhas, jogadores, monstros e mapas em um ambiente offline.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
