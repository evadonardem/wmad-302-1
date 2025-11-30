import { Category, Question, FormattedQuestion } from '../types';

const BASE_URL = 'https://opentdb.com';

// Helper to decode HTML entities returned by the API
const decodeHtml = (html: string) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api_category.php`);
    const data = await response.json();
    return data.trivia_categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name.replace('Entertainment: ', '').replace('Science: ', ''),
      originalName: cat.name // Keep original for filtering if needed
    }));
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return [];
  }
};

export const fetchQuestions = async (
  amount: number,
  categoryId?: number,
  difficulty?: string,
  type?: string
): Promise<FormattedQuestion[]> => {
  let url = `${BASE_URL}/api.php?amount=${amount}`;
  
  if (categoryId) url += `&category=${categoryId}`;
  if (difficulty && difficulty !== 'any') url += `&difficulty=${difficulty}`;
  if (type && type !== 'any') url += `&type=${type}`;
  // Simple in-memory/localStorage cache to avoid hammering the API when possible
  const cacheKey = `ot:questions:${amount}:${categoryId || 'any'}:${difficulty || 'any'}:${type || 'any'}`;
  const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getCached = (): FormattedQuestion[] | null => {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts > CACHE_TTL_MS) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      return parsed.data as FormattedQuestion[];
    } catch (e) {
      return null;
    }
  };

  const setCached = (data: FormattedQuestion[]) => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
    } catch (e) {
      // ignore storage errors
    }
  };

  // Return cached copy immediately if present (helps during rate limits)
  const cached = getCached();
  if (cached) return cached;

  const maxRetries = 6;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url);

      // If rate limited, respect `Retry-After` header if present
      if (response.status === 429) {
        const ra = response.headers.get('Retry-After');
        let waitMs: number;
        if (ra) {
          // Retry-After can be seconds or HTTP-date; try parse as integer seconds first
          const secs = parseInt(ra, 10);
          waitMs = (!isNaN(secs) && secs > 0) ? secs * 1000 : 1000 * Math.pow(2, attempt);
        } else {
          // exponential backoff with small jitter
          const base = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s, 8s...
          const jitter = Math.floor(Math.random() * 500);
          waitMs = base + jitter;
        }
        console.warn(`Rate limited. Waiting ${waitMs}ms before retry...`);
        await sleep(waitMs);
        continue;
      }

      const data = await response.json();

      if (data.response_code !== 0) {
        console.warn('API Response Code:', data.response_code);
        throw new Error('Failed to fetch questions or not enough questions found.');
      }

      const mapped: FormattedQuestion[] = data.results.map((q: Question, index: number) => {
        const answers = [...q.incorrect_answers, q.correct_answer]
          .map(a => decodeHtml(a))
          .sort(() => Math.random() - 0.5);

        return {
          ...q,
          id: `q-${index}-${Date.now()}`,
          question: decodeHtml(q.question),
          correct_answer: decodeHtml(q.correct_answer),
          incorrect_answers: q.incorrect_answers.map(a => decodeHtml(a)),
          answers,
        };
      });

      // cache results for subsequent requests
      setCached(mapped);
      return mapped;
    } catch (error) {
      lastError = error as Error;
      // If we have a cached copy, return it instead of failing immediately
      const fallback = getCached();
      if (fallback) {
        console.warn('Using cached questions due to fetch error:', lastError);
        return fallback;
      }

      if (attempt < maxRetries - 1) {
        const waitTime = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s, 8s...
        console.warn(`Attempt ${attempt + 1} failed. Waiting ${waitTime}ms before retry...`, lastError);
        await sleep(waitTime + Math.floor(Math.random() * 500));
        continue;
      }
    }
  }

  console.error("Error fetching quiz after retries", lastError);
  return [];
};