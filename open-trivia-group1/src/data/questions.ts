export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: string;
}

export const questions: Question[] = [
  {
    id: 1,
    category: "react",
    question: "Which hook is used for state management?",
    options: ["useState", "useEffect", "useRef", "useMemo"],
    answer: "useState"
  },
  {
    id: 2,
    category: "javascript",
    question: "Which keyword declares a constant variable?",
    options: ["var", "let", "const", "static"],
    answer: "const"
  },
  {
    id: 3,
    category: "api",
    question: "Most APIs return data in which format?",
    options: ["JSON", "CSV", "HTML", "PHP"],
    answer: "JSON"
  },
  {
    id: 4,
    category: "webdev",
    question: "What does HTML stand for?",
    options: ["Hyper Training Markup Language", "HyperText Markup Language", "HighText Markdown Language", "HyperTool Multi Language"],
    answer: "HyperText Markup Language"
  },
  {
    id: 5,
    category: "git",
    question: "Which command uploads changes to your repository?",
    options: ["git push", "git upload", "git deploy", "git send"],
    answer: "git push"
  }
];
