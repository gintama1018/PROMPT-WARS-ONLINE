import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Share2, RefreshCw, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { shuffleArray } from "@/lib/quiz-utils";

const QUIZ_QUESTIONS = [
  {
    question: "What is the minimum voting age in India?",
    options: ["16", "18", "21", "25"],
    correctAnswer: 1,
    explanation: "The 61st Amendment Act of 1988 lowered the voting age from 21 to 18 years.",
    relatedPage: "/how-to-vote"
  },
  {
    question: "What does NOTA stand for?",
    options: [
      "None Of The Alternatives",
      "None Of The Above",
      "Not On The Agenda",
      "No Official Terms Answer"
    ],
    correctAnswer: 1,
    explanation: "NOTA allows voters to express their dissent if they don't find any candidate suitable.",
    relatedPage: "/your-rights"
  },
  {
    question: "Which body conducts elections in India?",
    options: [
      "Parliament",
      "Supreme Court",
      "Election Commission of India",
      "President's Office"
    ],
    correctAnswer: 2,
    explanation: "The ECI is an autonomous constitutional authority responsible for administering election processes in India.",
    relatedPage: "/what-is-election"
  },
  {
    question: "What is the Silence Period before elections?",
    options: [
      "No campaigning 48 hours before voting",
      "No talking at booths",
      "No media coverage",
      "All of the above"
    ],
    correctAnswer: 0,
    explanation: "The 48-hour silence period allows voters to think peacefully without active campaigning influence.",
    relatedPage: "/timeline"
  },
  {
    question: "What is an EVM?",
    options: [
      "Electoral Voting Machine",
      "Electronic Voting Machine",
      "Emergency Vote Monitor",
      "Election Validation Method"
    ],
    correctAnswer: 1,
    explanation: "EVMs replaced paper ballots in India to make voting more secure and counting faster.",
    relatedPage: "/what-is-election"
  },
  {
    question: "What is Form 6 used for?",
    options: [
      "Requesting a polling booth",
      "Registering as a new voter",
      "Filing a complaint",
      "Applying for a job in election commission"
    ],
    correctAnswer: 1,
    explanation: "Form 6 is the application form for new voters to get their names added to the electoral roll.",
    relatedPage: "/how-to-vote"
  },
  {
    question: "What is VVPAT?",
    options: [
      "Voter Verified Paper Audit Trail",
      "Verified Vote Processing And Tabulation",
      "Valid Vote Processing Audit Tool",
      "Voter Validation Protocol"
    ],
    correctAnswer: 0,
    explanation: "VVPAT provides a printed slip that allows voters to verify that their vote was cast correctly.",
    relatedPage: "/how-to-vote"
  },
  {
    question: "Who can vote in Indian elections?",
    options: [
      "Any resident above 18",
      "Any Indian citizen above 18 registered as voter",
      "Any taxpayer",
      "Any citizen with Aadhaar"
    ],
    correctAnswer: 1,
    explanation: "Being a citizen and above 18 is not enough; you MUST be registered on the electoral roll to vote.",
    relatedPage: "/how-to-vote"
  }
];

export default function Quiz() {
  const [questions, setQuestions] = useState(QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const startQuiz = () => {
    setQuestions(shuffleArray(QUIZ_QUESTIONS));
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setIsQuizComplete(false);
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(index);
    if (index === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleShare = () => {
    const text = `I scored ${score}/${questions.length} on The People's Election Guide Quiz! Test your democracy knowledge here.`;
    if (navigator.share) {
      navigator.share({
        title: 'Election Quiz Score',
        text: text,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text + " " + window.location.href);
      alert("Score copied to clipboard!");
    }
  };

  if (isQuizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "";
    if (percentage >= 80) message = "Excellent! You are a truly informed citizen.";
    else if (percentage >= 50) message = "Good job! You know the basics well.";
    else message = "Keep learning! There's more to discover about our democracy.";

    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl flex-1 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border rounded-2xl p-8 shadow-xl text-center w-full"
        >
          <Trophy className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Quiz Complete!</h1>
          
          <div className="text-6xl font-bold text-foreground my-6">
            {score}<span className="text-3xl text-muted-foreground">/{questions.length}</span>
          </div>
          
          <p className="text-xl font-medium mb-8">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleShare} className="gap-2">
              <Share2 className="w-4 h-4" /> Share Score
            </Button>
            <Button size="lg" variant="outline" onClick={startQuiz} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Try Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold text-primary">Election Knowledge Check</h1>
        <div className="bg-muted px-4 py-1.5 rounded-full font-medium text-sm">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2.5 mb-10 overflow-hidden">
        <motion.div 
          className="bg-primary h-2.5 rounded-full" 
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1"
        >
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold mb-8 leading-tight">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswer;
              
              let btnClass = "w-full justify-start text-left h-auto py-4 px-6 text-base sm:text-lg border-2 bg-card hover:bg-muted/50 transition-all";
              
              if (showResult) {
                if (isCorrect) {
                  btnClass = "w-full justify-start text-left h-auto py-4 px-6 text-base sm:text-lg border-emerald-500 bg-emerald-50 text-emerald-900";
                } else if (isSelected && !isCorrect) {
                  btnClass = "w-full justify-start text-left h-auto py-4 px-6 text-base sm:text-lg border-destructive bg-destructive/10 text-destructive";
                } else {
                  btnClass = "w-full justify-start text-left h-auto py-4 px-6 text-base sm:text-lg border-transparent bg-card opacity-50";
                }
              }

              return (
                <Button
                  key={idx}
                  variant="outline"
                  className={btnClass}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={showResult}
                >
                  <div className="flex items-center w-full">
                    <span className="flex-1 whitespace-normal break-words">{option}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 ml-4" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-destructive shrink-0 ml-4" />}
                  </div>
                </Button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                className="mt-8"
              >
                <div className={`p-6 rounded-xl border ${selectedOption === currentQ.correctAnswer ? "bg-emerald-50 border-emerald-200" : "bg-muted/50 border-border"}`}>
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    {selectedOption === currentQ.correctAnswer ? (
                      <><span className="text-emerald-600">Correct!</span></>
                    ) : (
                      <><span className="text-foreground">Explanation</span></>
                    )}
                  </h3>
                  <p className="text-muted-foreground mb-4">{currentQ.explanation}</p>
                  <Button variant="link" className="px-0 h-auto font-semibold text-primary" asChild>
                    <Link href={currentQ.relatedPage}>
                      Read more about this <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button size="lg" onClick={handleNext} className="px-8 font-semibold">
                    {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
