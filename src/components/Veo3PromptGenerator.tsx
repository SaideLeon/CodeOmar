'use client';

import React, { useState } from 'react';
import { generateVeo3Prompt } from '@/services/geminiService';

const Veo3PromptGenerator: React.FC = () => {
  const [itemName, setItemName] = useState('');
  const [promptOutput, setPromptOutput] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!itemName.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateVeo3Prompt(itemName.trim());
      setPromptOutput(result.trim());
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!promptOutput) return;
    try {
      await navigator.clipboard.writeText(promptOutput);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Falha ao copiar prompt VEO3:', err);
    }
  };

  return (
    <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-900/10 to-cyan-900/10 border border-emerald-500/20 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-mono text-gray-500 uppercase">Gerador de prompt VEO 3</label>
        <button
          type="button"
          onClick={handleCopy}
          className="text-[10px] font-mono text-emerald-600 hover:text-emerald-500 disabled:opacity-50"
          disabled={!promptOutput}
        >
          {copyStatus === 'copied' ? 'Copiado!' : 'Copiar prompt'}
        </button>
      </div>
      <div>
        <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Nome do item</label>
        <div className="flex gap-2">
          <input
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="flex-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded px-2 py-2 text-xs font-mono dark:text-white"
            placeholder="Ex: Coração, Banana, Água"
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!itemName.trim() || isGenerating}
            className="px-3 py-2 rounded bg-emerald-600 text-white text-xs font-mono hover:bg-emerald-500 disabled:opacity-50"
          >
            {isGenerating ? 'Gerando...' : 'Gerar'}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Prompt completo</label>
        <textarea
          value={promptOutput}
          readOnly
          rows={10}
          className="w-full bg-white/70 dark:bg-black/30 border border-gray-200 dark:border-gray-700 rounded px-2 py-2 text-xs font-mono text-gray-700 dark:text-gray-200 resize-y"
          placeholder="O prompt VEO 3 aparece aqui..."
        />
      </div>
      <p className="text-[10px] text-gray-400 font-mono">
        Descrição visual em inglês, voz em português e tom educativo.
      </p>
    </div>
  );
};

export default Veo3PromptGenerator;
