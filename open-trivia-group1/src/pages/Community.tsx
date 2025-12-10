import { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Lightbulb, 
  AlertCircle, 
  Send, 
  User, 
  Clock, 
  ThumbsUp,
  MessageCircle,
  Loader2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// --- Firebase Imports ---
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithCustomToken,
  type User as FirebaseUser
} from "firebase/auth";

// --- Firebase Initialization (Singleton Pattern) ---
// This ensures we don't re-initialize on every render
const initFirebase = () => {
  // @ts-ignore - Check for global config injected by the environment
  const configRaw = typeof window !== 'undefined' ? window.__firebase_config : null;
  
  if (!configRaw) {
    console.warn("Firebase config not found. Forum features will be disabled.");
    return null;
  }

  try {
    const config = typeof configRaw === 'string' ? JSON.parse(configRaw) : configRaw;
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    const db = getFirestore(app);
    const auth = getAuth(app);
    // @ts-ignore
    const appId = window.__app_id || 'default-app-id';
    
    return { db, auth, appId };
  } catch (e) {
    console.error("Firebase init failed:", e);
    return null;
  }
};

const firebase = initFirebase();

// --- Types ---
type PostType = 'suggestion' | 'idea' | 'feedback';

type ForumPost = {
  id: string;
  userId: string;
  userName: string; // Anonymous names like "User 1234"
  type: PostType;
  content: string;
  timestamp: Timestamp | null;
  likes: number;
};

export default function Community() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState<PostType>('feedback');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Auth & Data Subscription ---
  useEffect(() => {
    if (!firebase) return;
    const { auth, db, appId } = firebase;

    // 1. Authenticate
    const setupAuth = async () => {
      // @ts-ignore
      const initialToken = window.__initial_auth_token;
      
      try {
        if (initialToken) {
          await signInWithCustomToken(auth, initialToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth failed:", err);
      }
    };

    setupAuth();
    const unsubAuth = onAuthStateChanged(auth, setUser);

    // 2. Subscribe to Posts (Public Data)
    // Path: /artifacts/{appId}/public/data/forum_posts
    const postsRef = collection(db, 'artifacts', appId, 'public', 'data', 'forum_posts');
    
    // Note: Simple query, we sort in memory to follow Rule 2 (No complex queries without indexes)
    const q = query(postsRef); 

    const unsubData = onSnapshot(q, (snapshot) => {
      const fetchedPosts: ForumPost[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ForumPost));

      // Sort in memory: Newest first
      fetchedPosts.sort((a, b) => {
        const tA = a.timestamp?.toMillis() || Date.now();
        const tB = b.timestamp?.toMillis() || Date.now();
        return tB - tA;
      });

      setPosts(fetchedPosts);
      setLoading(false);
    }, (err) => {
      console.error("Data fetch failed:", err);
      setLoading(false);
    });

    return () => {
      unsubAuth();
      unsubData();
    };
  }, []);

  // --- Actions ---
  const handlePost = async () => {
    if (!firebase || !user || !newPost.trim()) return;
    setIsSubmitting(true);

    try {
      const { db, appId } = firebase;
      const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'forum_posts');

      await addDoc(collectionRef, {
        userId: user.uid,
        userName: `User ${user.uid.slice(0, 5)}`,
        type: postType,
        content: newPost.trim(),
        timestamp: serverTimestamp(),
        likes: 0
      });

      setNewPost("");
      // Success toast could go here
    } catch (e) {
      console.error("Failed to post:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UI Helpers ---
  const getTypeStyles = (type: PostType) => {
    switch (type) {
      case 'idea': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'suggestion': return "bg-blue-100 text-blue-800 border-blue-200";
      case 'feedback': return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: PostType) => {
    switch (type) {
      case 'idea': return <Lightbulb className="w-3 h-3 mr-1" />;
      case 'suggestion': return <MessageSquare className="w-3 h-3 mr-1" />;
      case 'feedback': return <AlertCircle className="w-3 h-3 mr-1" />;
    }
  };

  const formatTime = (timestamp: Timestamp | null) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // seconds

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  if (!firebase) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold">Community Offline</h2>
        <p>Database connection is not available in this environment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 h-full flex flex-col">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MessageCircle className="h-8 w-8 text-primary" />
          Community Forum
        </h1>
        <p className="text-muted-foreground mt-1">
          Share your ideas, give feedback, and help us improve the quiz!
        </p>
      </div>

      <Separator />

      {/* Input Area */}
      <Card className="shadow-md border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Create a Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            className="w-full min-h-[100px] p-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2">
              {(['feedback', 'idea', 'suggestion'] as PostType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setPostType(t)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center capitalize
                    ${postType === t ? getTypeStyles(t) + " ring-2 ring-offset-1 ring-primary/20" : "bg-transparent border-transparent hover:bg-muted"}
                  `}
                >
                  {getTypeIcon(t)} {t}
                </button>
              ))}
            </div>
            <Button 
              onClick={handlePost} 
              disabled={!newPost.trim() || isSubmitting || !user}
              className="gap-2 w-full sm:w-auto"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-4 flex-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Recent Discussions 
          <Badge variant="secondary" className="rounded-full">{posts.length}</Badge>
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-xl bg-muted/30">
            <p className="text-muted-foreground">No posts yet. Be the first to say hello!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium leading-none">
                        {post.userName}
                      </CardTitle>
                      <CardDescription className="text-xs flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> {formatTime(post.timestamp)}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className={`capitalize font-normal ${getTypeStyles(post.type)}`}>
                    {getTypeIcon(post.type)} {post.type}
                  </Badge>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>
                </CardContent>
                <CardFooter className="pt-0 text-muted-foreground">
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1 hover:text-primary">
                    <ThumbsUp className="h-3 w-3" /> Like
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}