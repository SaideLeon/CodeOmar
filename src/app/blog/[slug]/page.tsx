import AppShell from '@/components/AppShell';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return <AppShell initialView="ARTICLE" initialPostSlug={params.slug} />;
}
