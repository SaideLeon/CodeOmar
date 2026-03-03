import { Suspense } from 'react';
import AppShell from '@/components/AppShell';
import NeonSkeleton from '@/components/shared/NeonSkeleton';

export default function AdminPage() {
  return (
    <Suspense fallback={<NeonSkeleton />}>
      <AppShell initialView="ADMIN" />
    </Suspense>
  );
}
