import React, { useState, useEffect, useRef } from "react";
import { Bot, ChevronRight, CheckCircle, Volume2 } from "lucide-react";

const PronunciationPractice = ({ lesson, onComplete, onNext, completedLessons }) => {

  if (!lesson || !lesson.words) return null;

  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [wrongIndexes, setWrongIndexes] = useState([]);
  const recognitionRef = useRef(null);
  const currentWordRef = useRef(null);
  const words = lesson.words;
  const isAlreadyCompleted = completedLessons?.includes(lesson.id);
  const [isCompleted, setIsCompleted] = useState(isAlreadyCompleted || false);
  const initialIndex = isAlreadyCompleted ? words.length - 1 : 0;
  const [index, setIndex] = useState(initialIndex);
  const currentWord = words[index]; 

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript
        .toLowerCase()
        .split(" ")
        .slice(-1)[0];
      setTranscript(speech);
      const latestWord = currentWordRef.current;
      if (!latestWord) return;
      checkPronunciation(speech, latestWord);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {}
      }
    };
  }, []);

  useEffect(() => {
    if (!isCompleted && currentWord && !introPlayed) {
      window.speechSynthesis.cancel();
      const intro = new SpeechSynthesisUtterance(
        "Let's learn pronunciation. Repeat after the Speakai."
      );
      intro.lang = "en-US";
      intro.onend = () => {
        speakWord();
        setIntroPlayed(true);
      };
      speechSynthesis.speak(intro);
    }
  }, [currentWord, isCompleted, introPlayed]); 

  const nextWord = () => {
    speechSynthesis.cancel();
    if (index < words.length - 1) {
      setIndex(prev => prev + 1);
      setTranscript("");
      setIsCorrect(null);
      setIntroPlayed(false);
    } else {
      setIsCompleted(true);
      if (onComplete) onComplete(lesson.id, lesson?.xpReward || 50);
    }
  };

  useEffect(() => {
    const alreadyDone = completedLessons?.includes(lesson.id);
    setIsCompleted(alreadyDone || false);
    setIntroPlayed(false);
    setIndex(alreadyDone ? words.length - 1 : 0);
    setTranscript("");
    setIsCorrect(null);
    window.speechSynthesis.cancel();
  }, [lesson.id]);

  const speakWord = () => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(currentWord.word);
    speech.lang = "en-US";
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  };

  const getWrongIndexes = (spoken, target) => {
    const wrong = [];
    const max = Math.max(spoken.length, target.length);
    for (let i = 0; i < max; i++) {
      if (spoken[i] !== target[i]) {
        wrong.push(i);
      }
    }
    return wrong;
  };

  const similarity = (s1, s2) => {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const longerLength = longer.length;
    if (longerLength === 0) return 1;
    const distance = levenshtein(longer, shorter);
    return (longerLength - distance) / longerLength;
  };

  const levenshtein = (a, b) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };

  useEffect(() => {
    currentWordRef.current = currentWord;
  }, [currentWord]);

  const checkPronunciation = (speech, wordData ) => {
    const normalize = (text) => {
      if (!text) return "";
      return text
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    };

    const target = normalize(wordData.word);
    const spoken = normalize(speech);
    console.log("TARGET:", target);
    console.log("SPOKEN:", spoken);
    if (spoken === target) {
      setIsCorrect(true);
      setWrongIndexes([]);
      speechSynthesis.cancel();
      setTimeout(() => {
        const praise = new SpeechSynthesisUtterance("Excellent");
        speechSynthesis.speak(praise);
      }, 100);
      return;
    }

    const score = similarity(spoken, target);
    console.log("SCORE:", score);
    if (score >= 0.8) {
      setIsCorrect(true);
      setWrongIndexes([]);
      speechSynthesis.cancel();
      setTimeout(() => {
        const praise = new SpeechSynthesisUtterance("Excellent");
        speechSynthesis.speak(praise);
      }, 100);
    } else {
      const wrong = getWrongIndexes(spoken, target);
      setWrongIndexes(wrong);
      setIsCorrect(false);
    }
  };

  const startRecording = () => {
    window.speechSynthesis.cancel();
    if (!recognitionRef.current) return;
    setTranscript("");
    setIsCorrect(null);
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    if (!isCompleted && currentWord) {
      speakWord();
    }
  }, [index, isCompleted]);

  const highlightIPA = () => {
    const ipa = currentWord.ipa.split("");
    return ipa.map((char, index) => {
      if (wrongIndexes.includes(index)) {
        return (
          <span key={index} className="text-red-400 font-bold">
            {char}
          </span>
        );
      }
      return <span key={index}>{char}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
      {/* BOT */}
      <div className="w-32 h-32 rounded-full bg-cyan-600/20 flex items-center justify-center animate-pulse">
        <Bot className="w-16 h-16 text-cyan-400" />
      </div>
      {/* WORD */}
      {!isCompleted && (
        <div className="max-w-xl w-full bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-slate-200">
          <p className="text-cyan-400 font-semibold mb-2">
            Repeat after Speakai
          </p>
          <p className="text-2xl font-bold">
            {currentWord.word}
          </p>
          <p className="text-1xl text-gray-400">
            {currentWord.ipa}
          </p>
          <button
            onClick={speakWord}
            className="mt-4 px-4 py-2 bg-cyan-700 rounded-lg text-white 
                      flex items-center gap-2 
                      justify-self-center"
          >
            <Volume2 className="w-5 h-5 text-white" />
            Listen Again
          </button>
        </div>
      )}
      {/* RESULT */}
      {!isCompleted && transcript && (
        <div className="max-w-xl w-full bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-slate-200">
          <p className="text-slate-400">Your Speech:</p>
          <p className="text-lg mt-2">{transcript}</p>
          {isCorrect === false && (
            <div className="mt-4 space-y-2">
              <p className="text-yellow-400">
                Try again. The correct word is <b>{currentWord.word}</b>
              </p>
              <p className="text-gray-300">
                Correct Pronunciation:{" "}
                <span className="text-lg font-semibold">
                  {highlightIPA()}
                </span>
              </p>
            </div>
          )}
          {isCorrect && (
            <p className="text-green-400 mt-4 font-bold">
              Excellent!
            </p>
          )}
        </div>
      )}
      {/* BUTTON */}
      {!isCompleted && (
        <div className="flex gap-4">
          {isRecording && (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-500 rounded-xl text-white"
            >
              End
            </button>
          )}
          {!isRecording && isCorrect === null && (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-emerald-600 rounded-xl text-white"
            >
              Start Speaking
            </button>
          )}
          {!isRecording && isCorrect === false && (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-emerald-600 rounded-xl text-white"
            >
              Try Again
            </button>
          )}
          {!isRecording && isCorrect === true && (
            <button
              onClick={nextWord}
              className="px-6 py-3 bg-emerald-600 rounded-xl text-white"
            >
              Next Word
            </button>
          )}
        </div>
      )}
      {/* COMPLETE SCREEN */}
      {isCompleted && (
        <div className="space-y-3 w-full max-w-2xl mx-auto">
          <div className="w-full p-4 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl text-center font-bold flex flex-col items-center gap-2 animate-bounce-short">
            <CheckCircle className="w-8 h-8" />
            Mission Complete! +{lesson.xpReward} XP
          </div>
          {onNext && (
            <button
              onClick={onNext}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Next Lesson <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PronunciationPractice;