import { NextResponse } from 'next/server';
import { generateArticleContent, generateSearchInsights, generateFullPost, generateVideoPrompt, generateVeo3Prompt } from '@/services/geminiServer';

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
      case 'generateVideoPrompt': {
        const scene = typeof payload?.scene === 'string' ? payload.scene : '';
        const basePrompt = typeof payload?.basePrompt === 'string' ? payload.basePrompt : '';
        if (!scene || !basePrompt) {
          return NextResponse.json({ error: 'Cena ou prompt base não informado.' }, { status: 400 });
        }
        const prompt = await generateVideoPrompt(scene, basePrompt);
        return NextResponse.json({ prompt });
      }
      case 'generateVeo3Prompt': {
        const itemName = typeof payload?.itemName === 'string' ? payload.itemName : '';
        if (!itemName) {
          return NextResponse.json({ error: 'Nome do item não informado.' }, { status: 400 });
        }
        const prompt = await generateVeo3Prompt(itemName);
        return NextResponse.json({ prompt });
      }
      default:
        return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });
    }
  } catch (error) {
    const message = (error as Error).message || 'Falha ao gerar conteúdo.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
