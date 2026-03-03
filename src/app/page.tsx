import { Suspense } from 'react';
import AppShell from '@/components/AppShell';
import NeonSkeleton from '@/components/shared/NeonSkeleton';

export default function HomePage() {
  return (
    <Suspense fallback={<NeonSkeleton />}>
      <AppShell initialView="HOME" />
    </Suspense>
  );
}
