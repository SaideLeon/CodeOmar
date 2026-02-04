import { NextResponse } from 'next/server';
import { generateArticleContent, generateSearchInsights, generateFullPost } from '@/services/geminiServer';

export async function POST(request: Request) {
  let body: { action?: string; payload?: Record<string, unknown> } = {};
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
  }

  const { action, payload } = body;

  try {
    switch (action) {
      case 'generateArticleContent': {
        const title = typeof payload?.title === 'string' ? payload.title : '';
        const excerpt = typeof payload?.excerpt === 'string' ? payload.excerpt : '';
        if (!title) {
          return NextResponse.json({ error: 'Título não informado.' }, { status: 400 });
        }
        const content = await generateArticleContent(title, excerpt);
        return NextResponse.json({ content });
      }
      case 'generateSearchInsights': {
        const query = typeof payload?.query === 'string' ? payload.query : '';
        if (!query) {
          return NextResponse.json({ insight: '' });
        }
        const insight = await generateSearchInsights(query);
        return NextResponse.json({ insight });
      }
      case 'generateFullPost': {
        const topic = typeof payload?.topic === 'string' ? payload.topic : '';
        if (!topic) {
          return NextResponse.json({ error: 'Tópico não informado.' }, { status: 400 });
        }
        const post = await generateFullPost(topic);
        return NextResponse.json({ post });
      }
      default:
        return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });
    }
  } catch (error) {
    const message = (error as Error).message || 'Falha ao gerar conteúdo.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
