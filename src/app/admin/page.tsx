import { Suspense } from 'react';
import AppShell from '@/components/AppShell';
import NeonSkeleton from '@/components/shared/NeonSkeleton';

export default function AdminPage() {
  return (
    <Suspense fallback={<NeonSkeleton />}>
      <AppShell initialView="ADMIN" />
    </Suspense>
  );
import AppShell from '@/components/AppShell';

export default function AdminPage() {
  return <AppShell initialView="ADMIN" />;
}
