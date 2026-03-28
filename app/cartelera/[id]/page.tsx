import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FightDetail from '@/components/FightDetail';
import fights from '@/data/combates.json';
import type { Fight } from '@/data/types';

export const dynamicParams = false;

export function generateStaticParams() {
  return (fights as Fight[]).map((fight) => ({ id: fight.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const fight = (fights as Fight[]).find((f) => f.id === id);
  if (!fight) return { title: 'Not Found — Arena Night' };

  return {
    title: `${fight.fighter1.name} vs ${fight.fighter2.name} — Arena Night`,
    description: `${fight.category} — ${fight.fighter1.name} (${fight.fighter1.record}) vs ${fight.fighter2.name} (${fight.fighter2.record}). Arena Night, 15 de Julio 2026.`,
  };
}

export default async function FightPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fight = (fights as Fight[]).find((f) => f.id === id);
  if (!fight) notFound();

  return (
    <section className="px-4 py-20">
      <FightDetail fight={fight} />
    </section>
  );
}
