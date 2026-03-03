import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import AppShell from '@/components/AppShell';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface PostSeo {
  title: string;
  excerpt: string;
  slug: string;
  status: 'draft' | 'published';
}

const supabaseServer = createClient(
  'https://gmdxjmqlyjjochdxdooh.supabase.co',
  'sb_publishable_mz7zwem7RctVA80FD9lBxw_y0xR9NWV',
);

async function getPostSeoBySlug(slug: string): Promise<PostSeo | null> {
  const { data, error } = await supabaseServer
    .from('posts')
    .select('title, excerpt, slug, status')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data || data.status !== 'published') {
    return null;
  }

  return data;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostSeoBySlug(slug);

  if (!post) {
    return {
      title: 'Post não encontrado | CodeOmar',
      description: 'O artigo solicitado não foi encontrado.',
    };
  }

  const canonicalUrl = `https://codeomar.com/blog/${post.slug}`;

  return {
    title: `${post.title} | CodeOmar`,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostSeoBySlug(slug);

  if (!post) {
    notFound();
  }

  return <AppShell initialView="ARTICLE" initialPostSlug={slug} />;
}
