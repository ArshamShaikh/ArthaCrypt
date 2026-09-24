import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Printer, 
  Sparkles, 
  Scroll, 
  UserCheck,
  Shield
} from 'lucide-react';

export const QuizModule: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [student1Name, setStudent1Name] = useState<string>('Cryptanalyst Student');
  const [student2Name, setStudent2Name] = useState<string>('');
  const [collegeName, setCollegeName] = useState<string>('Cryptographic Studies Lab');

  const activeQuestion = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIdx,
    });
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (score >= 7) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIdx(0);
  };

  const score = calculateScore();
  const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  // Mumbai University NEP 2020 Grading scale from Page 107 of PDF
  let gradeLetter = 'F';
  let gradeTitle = 'Fail';
  if (percentage >= 90) {
    gradeLetter = 'O';
    gradeTitle = 'Outstanding (10 GP)';
  } else if (percentage >= 80) {
    gradeLetter = 'A+';
    gradeTitle = 'Excellent (9 GP)';
  } else if (percentage >= 70) {
    gradeLetter = 'A';
    gradeTitle = 'Very Good (8 GP)';
  } else if (percentage >= 60) {
    gradeLetter = 'B+';
    gradeTitle = 'Good (7 GP)';
  } else if (percentage >= 55) {
    gradeLetter = 'B';
    gradeTitle = 'Above Average (6 GP)';
  } else if (percentage >= 50) {
    gradeLetter = 'C';
    gradeTitle = 'Average (5 GP)';
  } else if (percentage >= 40) {
    gradeLetter = 'P';
    gradeTitle = 'Pass (4 GP)';
  }

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-5 h-5" />
              </span>
              <h1 className="font-iks text-xl font-bold text-stone-100">
                Cryptography Quiz
              </h1>
            </div>
            <p className="text-sm text-stone-400 max-w-3xl">
              Test your understanding of classical ciphers, frequency analysis, and modern AES encryption with 10 interactive questions.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono-code bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800">
            <span className="text-stone-400">Progress:</span>
            <span className="text-amber-300 font-bold">{answeredCount} / {QUIZ_QUESTIONS.length} Answered</span>
          </div>
        </div>
      </div>

      {!isSubmitted ? (
        /* Active Quiz Interface */
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-6 space-y-6">
          {/* Question Index Navigator */}
          <div className="flex flex-wrap gap-1.5 border-b border-stone-800 pb-4">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIdx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono-code font-bold transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400'
                      : isAnswered
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-800/80'
                      : 'bg-stone-950 text-stone-500 border border-stone-800 hover:text-stone-300'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="uppercase font-semibold tracking-wider text-amber-400">
                Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 font-mono-code">
                {activeQuestion.iksContext}
              </span>
            </div>

            <h2 className="text-base font-medium text-stone-100 leading-relaxed">
              {activeQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {activeQuestion.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[activeQuestion.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(activeQuestion.id, optIdx)}
                    className={`w-full p-3.5 rounded-lg text-xs text-left font-medium transition-all flex items-center space-x-3 border ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-100 shadow-sm'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-900 hover:border-stone-700'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono-code text-[11px] shrink-0 border ${
                      isSelected ? 'bg-amber-500 text-stone-950 font-bold border-amber-400' : 'bg-stone-900 text-stone-500 border-stone-700'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-800">
            <button
              onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 rounded-lg bg-stone-950 hover:bg-stone-800 disabled:opacity-40 text-stone-300 text-xs border border-stone-800 transition-colors"
            >
              Previous
            </button>

            {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-medium transition-colors"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={answeredCount < QUIZ_QUESTIONS.length}
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-amber-950/40"
              >
                Submit & Evaluate Quiz
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results & Certificate Presentation */
        <div className="space-y-6">
          {/* Result Card */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
              <div className="space-y-1">
                <span className="text-xs uppercase font-semibold text-stone-400 tracking-wider">
                  Assessment Result Summary
                </span>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold font-mono-code text-amber-300">
                    {score} / {QUIZ_QUESTIONS.length}
                  </span>
                  <span className="text-lg text-stone-400">({percentage}%)</span>
                  <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono-code text-xs font-bold">
                    Grade {gradeLetter}: {gradeTitle}
                  </span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center space-x-1.5 self-start transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>

            {/* Answer Breakdown Accordion/List */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                Detailed Answers & Academic Explanations
              </h3>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                {QUIZ_QUESTIONS.map((q) => {
                  const userAns = selectedAnswers[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div key={q.id} className="p-3 bg-stone-950 rounded-lg border border-stone-800/80 space-y-1 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-stone-200">
                          Q{q.id}. {q.question}
                        </span>
                        {isCorrect ? (
                          <span className="text-emerald-400 flex items-center space-x-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Correct</span>
                          </span>
                        ) : (
                          <span className="text-red-400 flex items-center space-x-1 shrink-0">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Incorrect</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 pt-1">
                        <strong className="text-amber-300">Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Certificate Configuration */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Configure Candidate Certificate Details</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-stone-400 text-[11px]">Primary Candidate Name:</label>
                <input
                  type="text"
                  value={student1Name}
                  onChange={(e) => setStudent1Name(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-400 text-[11px]">Partner Name (Optional):</label>
                <input
                  type="text"
                  value={student2Name}
                  onChange={(e) => setStudent2Name(e.target.value)}
                  placeholder="Optional co-analyst"
                  className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-stone-400 text-[11px]">Organization / Institution:</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded p-2 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Certificate Render (High-fidelity printable diploma frame) */}
          <div className="p-8 bg-stone-950 border-4 border-double border-amber-600/60 rounded-2xl shadow-2xl relative overflow-hidden text-center space-y-6 print:border-amber-900">
            {/* Corner Decorative Accents */}
            <div className="absolute top-2 left-2 text-amber-500/30 text-2xl font-iks select-none">❖</div>
            <div className="absolute top-2 right-2 text-amber-500/30 text-2xl font-iks select-none">❖</div>
            <div className="absolute bottom-2 left-2 text-amber-500/30 text-2xl font-iks select-none">❖</div>
            <div className="absolute bottom-2 right-2 text-amber-500/30 text-2xl font-iks select-none">❖</div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono-code tracking-widest text-amber-400 uppercase">
                ArthaCrypt Certification Program
              </span>
              <h2 className="font-iks text-2xl md:text-3xl font-bold tracking-wide text-amber-200">
                CERTIFICATE OF MASTERY & EVALUATION
              </h2>
              <p className="text-xs text-stone-400 font-mono-code">
                Classical Cryptography & Modern Authenticated Cipher Systems
              </p>
            </div>

            <div className="py-2 space-y-2 max-w-2xl mx-auto">
              <p className="text-xs text-stone-300">
                This is to certify that
              </p>
              <h3 className="font-iks text-xl md:text-2xl font-bold text-amber-300">
                {student1Name}{student2Name.trim() ? ` & ${student2Name}` : ''}
              </h3>
              <p className="text-xs text-stone-400">
                of <span className="text-stone-200 font-semibold">{collegeName}</span>
              </p>
              <p className="text-xs text-stone-300 leading-relaxed pt-2">
                has successfully demonstrated proficiency in the theoretical and practical computational mapping of ancient Indian secret communication (*Gūḍhalekhya* from the *Arthaśāstra*) to classical substitution/transposition ciphers and modern AES authenticated block ciphers.
              </p>
            </div>

            {/* Score & Badge Pill */}
            <div className="inline-flex items-center space-x-6 px-6 py-2.5 bg-stone-900/90 rounded-xl border border-amber-600/40 text-xs font-mono-code">
              <div>
                <span className="text-stone-500 block text-[10px]">Score Achieved</span>
                <span className="text-amber-300 font-bold text-sm">{percentage}% ({score}/10)</span>
              </div>
              <div className="w-px h-8 bg-stone-800" />
              <div>
                <span className="text-stone-500 block text-[10px]">Assessment Grade</span>
                <span className="text-emerald-400 font-bold text-sm">Grade {gradeLetter}</span>
              </div>
              <div className="w-px h-8 bg-stone-800" />
              <div>
                <span className="text-stone-500 block text-[10px]">Evaluation Date</span>
                <span className="text-stone-300 text-xs">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Seal & Signatures */}
            <div className="pt-6 flex items-center justify-between max-w-xl mx-auto text-[11px] text-stone-400 font-mono-code border-t border-stone-800">
              <div className="text-left">
                <span className="block border-b border-stone-700 w-32 mb-1" />
                <span>Lead Evaluator</span>
              </div>
              <div className="w-12 h-12 rounded-full border border-amber-500/40 flex items-center justify-center bg-amber-950/20 text-amber-400">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-right">
                <span className="block border-b border-stone-700 w-32 mb-1" />
                <span>Senior Cryptographer</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium inline-flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
