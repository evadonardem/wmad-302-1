import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCategories } from '../services/triviaService';
import { Category } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { 
  Gamepad2, Globe, Beaker, Music, Film, Book, Tv, Brain, 
  Search, Filter, Play, Palette, Landmark, Car, PawPrint, 
  Cpu, Medal, Map, Mic2, ChevronDown, Check
} from 'lucide-react';

// -- Assets & Mappings --

const iconMap: Record<string, any> = {
  'General Knowledge': Globe,
  'Books': Book,
  'Film': Film,
  'Music': Music,
  'Musicals & Theatres': Mic2,
  'Television': Tv,
  'Video Games': Gamepad2,
  'Board Games': Gamepad2,
  'Science & Nature': Beaker,
  'Computers': Cpu,
  'Mathematics': Brain,
  'Mythology': Landmark,
  'Sports': Medal,
  'Geography': Map,
  'History': Landmark,
  'Politics': Landmark,
  'Art': Palette,
  'Celebrities': Mic2,
  'Animals': PawPrint,
  'Vehicles': Car,
  'Comics': Book,
  'Gadgets': Cpu,
  'Japanese Anime & Manga': Tv,
  'Cartoon & Animations': Tv,
};

// Local Fallback Image (Base64 SVG) - Stored locally to ensure availability
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%230f172a;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23312e81;stop-opacity:1' /%3E%3C/linearGradient%3E%3Cpattern id='pattern' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(255,255,255,0.05)' /%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bg)' /%3E%3Crect width='100%25' height='100%25' fill='url(%23pattern)' /%3E%3C/svg%3E";

// Curated pools of high-quality images for each category
const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  'General Knowledge': [
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d', // books/globe
    'https://images.unsplash.com/photo-1488866006004-53bd58485457', // library
    'https://images.unsplash.com/photo-1505664194779-8beaceb93744', // thinking
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa', // abstract globe
  ],
  'Books': [
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d', // open book
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6', // library aisle
    'https://images.unsplash.com/photo-1524995943201-191aeb324639', // reading
    'https://images.unsplash.com/photo-1512820790803-83ca734da794', // stacked books
  ],
  'Film': [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba', // cinema
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1', // movie theater
    'https://images.unsplash.com/photo-1478720568477-152d9b164e63', // film reel
    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0', // projector
  ],
  'Music': [
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d', // piano
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae', // concert
    'https://images.unsplash.com/photo-1507838153419-480373a37b52', // vinyl
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745', // DJ
  ],
  'Video Games': [
    'https://images.unsplash.com/photo-1552820728-8b83bb6b773f', // gaming setup
    'https://images.unsplash.com/photo-1538481199705-a8da985d233c', // controller
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f', // arcade
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575', // VR
  ],
  'Science & Nature': [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d', // lab
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31', // microscope
    'https://images.unsplash.com/photo-1507668018357-37690321a6cd', // chemistry
    'https://images.unsplash.com/photo-1530053969600-caed2596d242', // ocean
  ],
  'Computers': [
    'https://images.unsplash.com/photo-1518770660439-4636190af475', // code
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', // laptop
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', // cyberpunk city
    'https://images.unsplash.com/photo-1591405351990-4726e331f141', // server room
  ],
  'History': [
    'https://images.unsplash.com/photo-1461360370896-922624d12aa1', // vintage camera
    'https://images.unsplash.com/photo-1599839571027-ae130f1d4386', // ancient architecture
    'https://images.unsplash.com/photo-1555881400-74d7acaacd81', // columns
    'https://images.unsplash.com/photo-1505535162959-9bbcb4fe3bbc', // mayan ruins
  ],
  'Geography': [
    'https://images.unsplash.com/photo-1524661135-423995f22d0b', // map
    'https://images.unsplash.com/photo-1451161208764-c79a3098e676', // globe
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1', // travel
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470', // landscape
  ],
  'Art': [
    'https://images.unsplash.com/photo-1579783902614-a3fb39279c42', // paint
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f', // gallery
    'https://images.unsplash.com/photo-1536924940846-227afb31e2a5', // colorful paint
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b', // brushes
  ],
  'Sports': [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211', // stadium
    'https://images.unsplash.com/photo-1517649763962-0c623066013b', // gym
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55', // soccer
    'https://images.unsplash.com/photo-1515523110800-9415d13b84a8', // ski
  ],
  'Animals': [
    'https://images.unsplash.com/photo-1474511320723-9a56873867b5', // fox
    'https://images.unsplash.com/photo-1504006833117-8886a355efbf', // forest deer
    'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f', // turtle
    'https://images.unsplash.com/photo-1546182990-dced7187a680', // lion
  ],
  'Vehicles': [
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7', // car
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c', // car dashboard
    'https://images.unsplash.com/photo-1559067515-bf7d799b23e2', // classic car
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8', // mustang
  ]
};

// Helper to get a random image from the pool based on category
const getRandomImage = (name: string): string => {
  let pool = CATEGORY_IMAGE_POOLS[name];

  // If no direct match, try to find a relevant pool via keywords
  if (!pool) {
    if (name.includes('Science') || name.includes('Nature')) pool = CATEGORY_IMAGE_POOLS['Science & Nature'];
    else if (name.includes('Game')) pool = CATEGORY_IMAGE_POOLS['Video Games'];
    else if (name.includes('Music') || name.includes('Theatres')) pool = CATEGORY_IMAGE_POOLS['Music'];
    else if (name.includes('Book') || name.includes('Comic')) pool = CATEGORY_IMAGE_POOLS['Books'];
    else if (name.includes('Film') || name.includes('Animation') || name.includes('Anime')) pool = CATEGORY_IMAGE_POOLS['Film'];
    else if (name.includes('Gadget') || name.includes('Math')) pool = CATEGORY_IMAGE_POOLS['Computers'];
    else if (name.includes('Myth') || name.includes('Politic')) pool = CATEGORY_IMAGE_POOLS['History'];
    else pool = CATEGORY_IMAGE_POOLS['General Knowledge']; // Ultimate fallback
  }

  // Pick a random image from the determined pool
  const randomIndex = Math.floor(Math.random() * pool.length);
  const imageUrl = pool[randomIndex];
  
  // Append query param for size and quality optimization
  return `${imageUrl}?auto=format&fit=crop&w=600&q=80`;
};

// Quick Filters
const FILTERS = ['All', 'Entertainment', 'Science', 'History', 'Geography', 'Art', 'Sports'];

// OptionGroup Component
const OptionGroup = ({ label, options, current, onChange }: any) => (
  <div className="mb-6">
    <label className="block text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">{label}</label>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {options.map((opt: any) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-all border
            ${current === opt.value 
              ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25' 
              : 'bg-muted border-transparent text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Modal State
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [difficulty, setDifficulty] = useState('any');
  const [questionType, setQuestionType] = useState('any');
  const [amount, setAmount] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data);
      setFilteredCategories(data);
      setLoading(false);
    });
  }, []);

  // Generate a map of random images for the current session/mount
  const categoryImagesMap = useMemo(() => {
    const map: Record<number, string> = {};
    if (categories.length > 0) {
      categories.forEach(cat => {
        map[cat.id] = getRandomImage(cat.name);
      });
    }
    return map;
  }, [categories]);

  useEffect(() => {
    let result = categories;

    // Apply Tab Filter
    if (activeFilter !== 'All') {
      result = result.filter(cat => 
        (cat as any).originalName?.includes(activeFilter) || cat.name.includes(activeFilter)
      );
    }

    // Apply Search
    if (searchQuery) {
      result = result.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCategories(result);
  }, [searchQuery, activeFilter, categories]);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleStartQuiz = () => {
    if (!selectedCategory) return;
    setIsModalOpen(false);
    navigate(`/quiz/${selectedCategory.id}?difficulty=${difficulty}&type=${questionType}&amount=${amount}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Explore Categories</h1>
          <p className="text-muted-foreground">Choose a topic and configure your game preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-sm"
            />
          </div>

          {/* Professional Dropdown Filter */}
          <div className="relative z-30 w-full md:w-auto">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full md:w-56 flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 text-foreground hover:bg-muted/50 transition-all group shadow-sm"
            >
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-medium text-sm">{activeFilter} Categories</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-full md:w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden p-1.5"
                    >
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => {
                                        setActiveFilter(filter);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        activeFilter === filter 
                                            ? 'bg-primary text-white shadow-md' 
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    <span>{filter}</span>
                                    {activeFilter === filter && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat, idx) => {
            const Icon = iconMap[cat.name] || Globe;
            const bgImage = categoryImagesMap[cat.id] || getRandomImage(cat.name);
            
            return (
              <Card 
                key={cat.id} 
                hoverEffect={true} 
                delay={idx * 0.05}
                className="cursor-pointer group relative h-48 border-0 !p-0 overflow-hidden"
              >
                {/* Background Image */}
                <img 
                  src={bgImage} 
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                    e.currentTarget.onerror = null;
                  }}
                />
                
                {/* Overlay Gradients - Dark overlay ensures white text is readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:via-black/40 group-hover:to-black/10 transition-all duration-500" />
                
                {/* Content */}
                <div 
                   onClick={() => handleCategoryClick(cat)}
                   className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center"
                >
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 mb-3 text-white group-hover:bg-primary/80 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 shadow-xl">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white leading-tight drop-shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300">
                    {cat.name}
                  </h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                    <span className="text-xs font-bold text-primary-foreground bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                      Play Now
                    </span>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            <Filter className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-bold mb-2">No categories found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Game Setup Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Game Preferences"
      >
        <div className="space-y-1">
          {/* Modal Header with Image */}
          <div className="relative mb-6 rounded-xl overflow-hidden h-32 flex items-end p-4 border border-border">
             <img 
                src={selectedCategory ? (categoryImagesMap[selectedCategory.id] || getRandomImage(selectedCategory.name)) : ''} 
                className="absolute inset-0 w-full h-full object-cover opacity-60" 
                alt="Header"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                  e.currentTarget.onerror = null;
                }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
             
             <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 bg-primary/90 rounded-lg shadow-lg">
                    {selectedCategory && React.createElement(iconMap[selectedCategory.name] || Globe, { className: "w-6 h-6 text-white" })}
                </div>
                <div>
                   <p className="text-xs text-white/80 uppercase font-bold tracking-wider mb-0.5">Selected Topic</p>
                   <h2 className="text-2xl font-display font-bold text-white shadow-black drop-shadow-md">{selectedCategory?.name}</h2>
                </div>
             </div>
          </div>

          <OptionGroup 
            label="Difficulty"
            current={difficulty}
            onChange={setDifficulty}
            options={[
              { label: 'Any', value: 'any' },
              { label: 'Easy', value: 'easy' },
              { label: 'Medium', value: 'medium' },
              { label: 'Hard', value: 'hard' },
            ]}
          />

          <OptionGroup 
            label="Question Type"
            current={questionType}
            onChange={setQuestionType}
            options={[
              { label: 'Any', value: 'any' },
              { label: 'Multiple', value: 'multiple' },
              { label: 'True/False', value: 'boolean' },
            ]}
          />
           
           <div className="mb-8">
              <label className="block text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                Number of Questions: <span className="text-foreground font-display text-lg">{amount}</span>
              </label>
              <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground font-bold">5</span>
                  <input 
                    type="range" 
                    min="5" 
                    max="50" 
                    step="5" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary hover:accent-accent transition-all"
                  />
                  <span className="text-xs text-muted-foreground font-bold">50</span>
              </div>
           </div>

          <Button size="lg" className="w-full" onClick={handleStartQuiz}>
            <Play className="w-5 h-5 mr-2" /> Start Quiz
          </Button>
        </div>
      </Modal>
    </div>
  );
};