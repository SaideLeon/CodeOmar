'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ViewState, BlogPost, UserProfile } from '@/types';
import GridBackground from '@/components/GridBackground';
import Hero from '@/components/Hero';
import WindowFrame from '@/components/WindowFrame';
import ArticleView from '@/components/ArticleView';
import SubscribeView from '@/components/SubscribeView';
import AboutView from '@/components/AboutView';
import AdminView from '@/components/AdminView';
import AuthModal from '@/components/AuthModal'; 
import { supabase } from '@/services/supabaseClient'; 
import { Search, Cpu, ChevronRight, Sparkles, ShieldAlert, Layers, Filter } from 'lucide-react';
import { generateSearchInsights } from '@/services/geminiService';
import { useRouter } from 'next/navigation';

interface AppShellProps {
  initialView: ViewState;
  initialPostSlug?: string;
}

const AppShell: React.FC<AppShellProps> = ({ initialView, initialPostSlug }) => {
  const router = useRouter();
  const [viewState, setViewState] = useState<ViewState>(initialView);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInsight, setSearchInsight] = useState('');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  
  // Data State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Auth State
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setViewState(initialView);
  }, [initialView]);

  // Helper to check for abort errors
  const isAbortError = (err: any) => {
    return (
      err?.name === 'AbortError' || 
      (err?.message && (
         err.message.includes('signal is aborted') || 
         err.message.includes('AbortError')
      ))
    );
  };

  // Fetch Posts from Supabase
  const fetchPosts = async () => {
    // Only set loading on initial fetch if posts are empty to avoid flicker on realtime updates
    if (posts.length === 0) setLoadingPosts(true);
    
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      // Logic: If user is NOT admin, only show 'published'.
      // If user IS admin, show everything.
      if (userProfile?.role !== 'admin') {
         query = query.eq('status', 'published');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        const formattedPosts: BlogPost[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          excerpt: p.excerpt,
          category: p.category,
          subcategory: p.subcategory, // Map subcategory
          readTime: p.read_time,
          date: new Date(p.created_at).toLocaleDateString('pt-BR'),
          content: p.content,
          tags: p.tags,
          slug: p.slug,
          status: p.status
        }));
        setPosts(formattedPosts);
      }
    } catch (err: any) {
      if (isAbortError(err)) {
          return;
      }
      console.error('Error loading posts from Supabase:', err.message || err);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserProfile(session.user.id);
    }).catch(err => {
        if (!isAbortError(err)) console.error("Session check error:", err);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    // Realtime subscription for Posts
    const postsChannel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts(); // Refresh on any change
      })
      .subscribe();

    fetchPosts();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(postsChannel);
    };
  }, []);

  // When userProfile changes (e.g. login as admin), re-fetch posts to potentially reveal drafts
  useEffect(() => {
     fetchPosts();
  }, [userProfile]);

  useEffect(() => {
    if (!initialPostSlug || posts.length === 0) return;

    const match = posts.find((post) => post.slug === initialPostSlug);
    if (match) {
      setSelectedPost(match);
      setViewState('ARTICLE');
    }
  }, [initialPostSlug, posts]);

  // Reset subcategory when category changes
  useEffect(() => {
    setActiveSubcategory('all');
  }, [activeCategory]);

  const fetchUserProfile = async (userId: string) => {
    try {
        const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
        if (error) throw error;

        if (data) {
            setUserProfile(data as UserProfile);
        }
    } catch (err: any) {
        if (!isAbortError(err)) {
            // Only log real errors
            console.error("Error fetching user profile:", err);
        }
    }
  };

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setViewState('ARTICLE');
    window.scrollTo(0, 0);
    if (post.slug) {
      router.push(`/blog/${post.slug}`);
    }
  };

  const handleBack = () => {
    setViewState('HOME');
    setSelectedPost(null);
    window.scrollTo(0, 0);
    router.push('/');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length > 2) {
        setIsGeneratingInsight(true);
        const insight = await generateSearchInsights(searchQuery);
        setSearchInsight(insight);
        setIsGeneratingInsight(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setViewState('HOME');
  };
  
  const routeByView: Record<ViewState, string> = {
    HOME: '/',
    ARTICLE: selectedPost?.slug ? `/blog/${selectedPost.slug}` : '/',
    SEARCH: '/',
    SUBSCRIBE: '/subscribe',
    ABOUT: '/about',
    ADMIN: '/admin',
  };

  const handleNavigation = (view: ViewState) => {
    setViewState(view);
    if (view !== 'ARTICLE') {
      setSelectedPost(null);
    }
    window.scrollTo(0, 0);
    const target = routeByView[view];
    if (target) {
      router.push(target);
    }
  };


  // --- Filtering Logic ---

  // 0. Compute Available Categories from database posts
  const availableCategories = useMemo(() => {
    const postCategories = posts.map(p => p.category).filter(c => !!c && c.trim() !== '');
    const cats = Array.from(new Set(postCategories));
    return cats.sort();
  }, [posts]);
  const isAdmin = userProfile?.role === 'admin';

  // 1. Compute Available Subcategories based on active Category
  const availableSubcategories = useMemo(() => {
    const filteredByCat = activeCategory === 'all' 
      ? posts 
      : posts.filter(p => p.category === activeCategory);
      
    // Extract unique, non-empty subcategories
    const subs = Array.from(new Set(
      filteredByCat
        .map(p => p.subcategory)
        .filter((sub): sub is string => !!sub && sub.trim() !== '')
    ));
    
    return subs.sort();
  }, [posts, activeCategory]);

  // 2. Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSubcategory = activeSubcategory === 'all' || post.subcategory === activeSubcategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const currentPostIndex = selectedPost ? posts.findIndex(p => p.id === selectedPost.id) : -1;
  const previousPost = currentPostIndex > 0 ? posts[currentPostIndex - 1] : null;
  const nextPost = currentPostIndex !== -1 && currentPostIndex < posts.length - 1 ? posts[currentPostIndex + 1] : null;

  return (
    <div className="min-h-screen relative selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-200">
      <GridBackground />
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <main className="relative min-h-screen flex flex-col">
        
        {viewState === 'HOME' && (
          <>
            <Hero onSubscribe={() => handleNavigation('SUBSCRIBE')} />
            
            <div className="max-w-7xl mx-auto px-4 w-full pb-20">
              
              {/* Filter Section */}
              <div className="mb-12 space-y-4">
                
                {/* Top Row: Categories & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Category Filter */}
                  <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
                    <button 
                      onClick={() => setActiveCategory('all')}
                      className={`px-4 py-2 rounded-full text-sm font-mono transition-all whitespace-nowrap border ${activeCategory === 'all' 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' 
                        : 'bg-white dark:bg-[#0b0e11] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-emerald-500/50'}`}
                    >
                      Todos os Sistemas
                    </button>
                    {availableCategories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-mono transition-all whitespace-nowrap border ${activeCategory === cat
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' 
                          : 'bg-white dark:bg-[#0b0e11] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-emerald-500/50'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search */}
                  <form onSubmit={handleSearch} className="relative w-full md:w-64 flex-shrink-0">
                     <div className="relative group">
                       <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                       <input 
                         type="text" 
                         placeholder="grep 'termo_busca'" 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-full bg-white dark:bg-[#0b0e11] border border-gray-200 dark:border-gray-800 rounded-lg py-2 pl-10 pr-4 text-sm font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-gray-900 dark:text-white"
                       />
                     </div>
                  </form>
                </div>

                {/* Bottom Row: Subcategories (Dynamic) */}
                {availableSubcategories.length > 0 && (
                  <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 uppercase tracking-wider">
                      <Layers size={12} className="text-emerald-500" />
                      <span className="hidden sm:inline">Subcategorias:</span>
                    </div>
                    <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide flex-1">
                       <button
                          onClick={() => setActiveSubcategory('all')}
                          className={`px-3 py-1 rounded text-xs font-mono transition-all whitespace-nowrap border ${activeSubcategory === 'all'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : 'bg-transparent text-gray-500 border-transparent hover:text-emerald-500 hover:bg-emerald-500/5'
                          }`}
                       >
                         Todas
                       </button>
                       {availableSubcategories.map(sub => (
                          <button
                            key={sub}
                            onClick={() => setActiveSubcategory(sub)}
                            className={`px-3 py-1 rounded text-xs font-mono transition-all whitespace-nowrap border ${activeSubcategory === sub
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-transparent text-gray-500 border-transparent hover:text-emerald-500 hover:bg-emerald-500/5'
                            }`}
                          >
                            {sub}
                          </button>
                       ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Insight Box (Visible only when searching) */}
              {isGeneratingInsight && (
                <div className="mb-12">
                  <WindowFrame title="insight_ia.log" className="bg-gradient-to-r from-emerald-500/5 to-transparent border-emerald-500/20">
                    <div className="space-y-3 p-4">
                      <div className="h-3 w-24 animate-pulse rounded bg-emerald-500/30" />
                      <div className="h-3 w-full animate-pulse rounded bg-emerald-500/20" />
                      <div className="h-3 w-3/4 animate-pulse rounded bg-emerald-500/20" />
                    </div>
                  </WindowFrame>
                </div>
              )}

              {searchQuery.length > 2 && searchInsight && !isGeneratingInsight && (
                  <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <WindowFrame title="insight_ia.log" className="bg-gradient-to-r from-emerald-500/5 to-transparent border-emerald-500/20">
                        <div className="p-4 flex gap-4 items-start">
                             <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <Sparkles size={20} />
                             </div>
                             <div>
                                <h4 className="text-xs font-mono text-emerald-600 dark:text-emerald-500 mb-1 uppercase tracking-wider">Análise Neural</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
                                   "{searchInsight}"
                                </p>
                             </div>
                        </div>
                    </WindowFrame>
                  </div>
              )}

              {/* Blog Grid */}
              {loadingPosts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-64 rounded-lg bg-gray-200 dark:bg-[#111] animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <div 
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="group relative bg-white dark:bg-[#0b0e11] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:border-emerald-500/50 transition-all duration-300 cursor-pointer flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1"
                    >
                      {/* Top Bar Decoration */}
                      <div className="h-1 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 group-hover:from-emerald-500 group-hover:to-teal-500 transition-all duration-300"></div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-500 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/10 rounded border border-emerald-500/10">
                                {post.category}
                              </span>
                              {post.subcategory && (
                                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <ChevronRight size={10} /> {post.subcategory}
                                </span>
                              )}
                          </div>
                          <span className="text-xs text-gray-400 font-mono">{post.date}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/50">
                          <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                             <Cpu size={12} /> {post.readTime}
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Ler <ChevronRight size={16} className="text-emerald-500" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loadingPosts && filteredPosts.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-block p-4 rounded-full bg-gray-100 dark:bg-[#111] text-gray-400 mb-4">
                     <Filter size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nenhum dado encontrado</h3>
                  <p className="text-gray-500 font-mono">
                    Nenhum post corresponde aos filtros de Categoria/Subcategoria selecionados.
                  </p>
                  <button 
                    onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                    className="mt-4 text-emerald-600 dark:text-emerald-500 text-sm font-mono underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {viewState === 'ARTICLE' && selectedPost && (
          <ArticleView 
            post={selectedPost} 
            user={user}
            onAuthRequest={() => setShowAuthModal(true)}
            onBack={handleBack}
            previousPost={previousPost}
            nextPost={nextPost}
            onNavigate={handlePostClick}
          />
        )}

        {viewState === 'SUBSCRIBE' && <SubscribeView />}
        
        {viewState === 'ABOUT' && <AboutView />}

        {viewState === 'ADMIN' && (
          isAdmin ? (
            <AdminView user={user} />
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-16">
              <WindowFrame title="acesso_restrito.log">
                <div className="p-10 bg-white dark:bg-[#0b0e11] text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10 text-red-500 mb-4">
                    <ShieldAlert size={28} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Acesso restrito</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mb-6">
                    Apenas administradores podem criar, editar ou remover postagens pelo painel.
                  </p>
                  {!user && (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-mono text-sm font-bold transition-colors shadow-lg shadow-emerald-900/20"
                    >
                      Entrar como admin
                    </button>
                  )}
                </div>
              </WindowFrame>
            </div>
          )
        )}

      </main>

    </div>
  );
};

export default AppShell;
