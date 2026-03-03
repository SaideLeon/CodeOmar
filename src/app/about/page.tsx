import { Suspense } from 'react';
import AppShell from '@/components/AppShell';
import NeonSkeleton from '@/components/shared/NeonSkeleton';

export default function AboutPage() {
  return (
    <Suspense fallback={<NeonSkeleton />}>
      <AppShell initialView="ABOUT" />
    </Suspense>
  );
}
