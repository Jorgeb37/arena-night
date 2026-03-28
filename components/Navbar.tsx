import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/cartelera', label: 'Cartelera' },
  { href: '/votaciones', label: 'Votaciones' },
  { href: '/resultados', label: 'Resultados' },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Arena<span className="text-amber-500">Night</span>
        </Link>
        <ul className="flex gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
