"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useRef, useState, useMemo } from "react";
import {
  BookText,
  Loader2,
  Quote,
  Search,
  Wand2,
  Volume2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  word: z.string().min(1, { message: "Please enter a word." }),
});

type Phonetic = {
  text?: string;
  audio?: string;
  sourceUrl?: string;
};

type Definition = {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
};

type Meaning = {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
};

type WordData = {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls: string[];
};

type SearchState = 'idle' | 'loading' | 'success' | 'error';


const SentenceGenerator = ({ word }: { word: string }) => {
  const [sentences, setSentences] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateSentences = async () => {
    setIsGenerating(true);
    setSentences([]);
    try {
      const response = await fetch('/api/generate-sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate sentences.');
      }

      const data = await response.json();
      setSentences(data.sentences);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate example sentences. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-accent/20 border-accent/30 mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-accent-foreground/80" />
          Sentence Generator
        </CardTitle>
        <CardDescription>See {`'${word}'`} in action with AI-generated examples.</CardDescription>
      </CardHeader>
      <CardContent>
        {isGenerating && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}
        {sentences.length > 0 && (
          <ul className="space-y-3">
            {sentences.map((sentence, i) => (
              <li key={i} className="flex items-start gap-3">
                <Quote className="h-5 w-5 mt-1 shrink-0 text-accent-foreground/60" />
                <span className="italic">{sentence.replace(new RegExp(`\\b${word}\\b`, 'gi'), (match) => `<strong>${match}</strong>`)}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateSentences} disabled={isGenerating} variant="outline" className="bg-accent/50 hover:bg-accent/80 border-accent/50">
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Generate Examples
        </Button>
      </CardFooter>
    </Card>
  );
};

const WordResult = ({ data }: { data: WordData }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioSrc = useMemo(() => data.phonetics.find(p => p.audio)?.audio, [data.phonetics]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="w-full animate-in fade-in-0 zoom-in-95 duration-300">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">{data.word}</h2>
              <p className="text-xl text-primary">{data.phonetic}</p>
            </div>
            {audioSrc && (
              <>
                <audio ref={audioRef} src={audioSrc} preload="auto" />
                <Button onClick={playAudio} variant="outline" size="icon" aria-label="Play pronunciation">
                  <Volume2 />
                </Button>
              </>
            )}
          </div>
        </CardHeader>
      </Card>

      {data.meanings.map((meaning, i) => (
        <Card key={i} className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <span className="italic font-normal">{meaning.partOfSpeech}</span>
              <Separator className="flex-1" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-4 pl-5">
              {meaning.definitions.map((def, j) => (
                <li key={j} className="space-y-1">
                  <p>{def.definition}</p>
                  {def.example && (
                    <p className="text-muted-foreground italic">"{def.example}"</p>
                  )}
                </li>
              ))}
            </ul>

            {meaning.synonyms && meaning.synonyms.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Synonyms</h4>
                <div className="flex flex-wrap gap-2">
                  {meaning.synonyms.map(syn => <Badge key={syn} variant="secondary">{syn}</Badge>)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <SentenceGenerator word={data.word} />

    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="w-full space-y-6 animate-pulse">
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-[80%]" />
        <div className="pt-4 space-y-2">
            <Skeleton className="h-5 w-20" />
            <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
            </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function HomePage() {
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [result, setResult] = useState<WordData | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { word: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSearchState('loading');
    setResult(null);
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${values.word}`);
      if (!response.ok) {
        throw new Error('Word not found');
      }
      const data: WordData[] = await response.json();
      setResult(data[0]);
      setSearchState('success');
    } catch (error) {
      setSearchState('error');
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Could not find the word "${values.word}". Please check the spelling and try again.`,
      });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-headline">Word Assistant</h1>
          <p className="text-muted-foreground mt-2 text-lg">Your friendly guide to the world of words.</p>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-start mb-8">
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="Enter a word..." className="pl-10 h-12 text-lg" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="h-12" disabled={searchState === 'loading'}>
              {searchState === 'loading' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5 sm:hidden" />
              )}
              <span className="hidden sm:inline">Search</span>
            </Button>
          </form>
        </Form>

        <div className="w-full" aria-live="polite">
          {searchState === 'idle' && (
            <div className="text-center text-muted-foreground py-16 flex flex-col items-center">
              <BookText size={48} className="mb-4"/>
              <p>Look up a word to get started.</p>
            </div>
          )}
          {searchState === 'loading' && <LoadingSkeleton />}
          {searchState === 'success' && result && <WordResult data={result} />}
          {searchState === 'error' && (
             <div className="text-center text-destructive-foreground bg-destructive/80 p-8 rounded-lg">
                <p>Word not found. Try another search.</p>
             </div>
          )}
        </div>

      </div>
    </main>
  );
}
