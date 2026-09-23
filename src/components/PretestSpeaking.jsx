import React, { useState, useEffect, useRef } from "react";
import { Bot, ChevronRight, CheckCircle } from "lucide-react";
import { saveSpeakingScore } from "../services/saveScore";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import sungai from "../assets/sungai.jpg";

const steps = [
  "Welcome to Speakai. Are you ready to practice speaking? Let’s start. Please introduce yourself!",
  "Okay nice. Next, Look at the picture. Please describe what you see in the picture!",
  "Hello! I have an idea and I need your suggestion",
  "I want to start living a more eco-friendly lifestyle. What should I include in my daily habits?",
  "Do you have any other suggestions?",
  "What else can I do to support a green lifestyle?",
  "What would you do in my place to live more sustainably?",
  "Alright, your responses are recorded.",
  "Okay, Next! Let’s talk about a school problem",
  "Today, we will talk about students not completing their homework on time. I think homework is not very important because students are already busy with other activities. What do you think?",
  "What should we do to solve this problem?",
  "I'm not sure about that solution. What do you think?",
  "Do you have any other suggestions to solve this problem?",
  "Okay, your responses are recorded."
];

const aiOnlySteps = [2, 7, 8, 13];

const PretestSpeaking = ({ lesson, onComplete, onNext, showPopup, saveScore, completedLessons, score, user}) => {

  const [step, setStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const transcriptRef = useRef("");
  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("test"); 
  const isCompleted = mode === "done";
  const recognitionRef = useRef(null);
  const [detailScores, setDetailScores] = useState([]);

  useEffect(() => {
    const fetchScore = async () => {
      const uid = auth.currentUser?.uid;
        if (!uid) return;
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const lessonScore = data.scores?.[lesson.id];
        if (lessonScore) {
          console.log("FOUND EXISTING SCORE:", lessonScore);
          setScores(lessonScore.summary); 
          setDetailScores(lessonScore.perQuestion || []); 
          setMode("done");
        }
      }
    };
    fetchScore();
    }, [lesson.id]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.lang = "en-US";
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.onresult = (event) => {
            let finalTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const result = event.results[i];
              if (result.isFinal) {
                finalTranscript += result[0].transcript;
              }
            }
            if (finalTranscript !== "") {
              transcriptRef.current += " " + finalTranscript;
              setTranscript((prev) => prev + " " + finalTranscript);
            }
          };
          recognition.onerror = (event) => {
            console.log("Speech recognition error:", event.error);
          };
          recognitionRef.current = recognition;
        }
      }, []);

  useEffect(() => {
    speechSynthesis.cancel();
    if (step < steps.length && !scores && mode !== "done") {
      const speech = new SpeechSynthesisUtterance(steps[step]);
      speech.lang = "en-US";
      speech.onend = () => {
        if (aiOnlySteps.includes(step)) {
          setTimeout(() => {
            if (step + 1 < steps.length) {
              setStep(step + 1);
            } else {
              evaluateSpeaking(answers);
            }
          }, 800); 
        }
      };
      speechSynthesis.speak(speech);
    }
  }, [step, scores, mode]);

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const startRecording = () => {
    speechSynthesis.cancel();
    if (isRecording) return;
    setTranscript("");
    transcriptRef.current = "";
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        console.log("Recognition already started");
      }
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setTimeout(() => {
      const cleanTranscript = transcriptRef.current.trim();
      let newAnswers = [...answers];
      if (cleanTranscript) {
        newAnswers = [...answers, cleanTranscript];
      }
      setAnswers(newAnswers);
      setTranscript("");
      transcriptRef.current = "";
      if (step + 1 < steps.length) {
        setStep(step + 1);
      } else {
        evaluateSpeaking(newAnswers);
      }
    }, 300); 
  };

  const completeStudySession = () => {
    if (isCompleted) return;
    if (onComplete) {
      onComplete(lesson.id, lesson?.xpReward || 50);
    }
  };

  const evaluateSpeaking = async (answers) => {
    try {
      setLoading(true);
      const filteredAnswers = answers.filter((a) => a.trim() !== "");
      if (filteredAnswers.length === 0) {
        showPopup("Please speak something first.");
        setLoading(false);
        return;
      }
      let answerIndex = 0;
      const pairedQA = steps
        .map((q, i) => {
          if (aiOnlySteps.includes(i)) return null;
          const answer = answers[answerIndex] || "";
          answerIndex++;
          return {
            question: q,
            answer
          };
        })
        .filter(item => item && item.answer.trim() !== "");
      const res = await fetch("https://api.speakai.my.id/api/evaluate-speaking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qa: pairedQA
        }),
      });
      const data = await res.json();
      console.log("DATA DARI BACKEND:", data);
      if (!data || !data.summary || !data.perQuestion) {
        console.error("DATA INVALID, TIDAK DISAVE:", data);
        return;
      }
      const combinedCorrected = data.perQuestion
        ?.map(q => q.correctedText || "")
        .filter(Boolean)
        .join(" ");
      const safeData = {
        summary: {
          pronunciation: data.summary?.pronunciation ?? 0,
          grammar: data.summary?.grammar ?? 0,
          vocabulary: data.summary?.vocabulary ?? 0,
          fluency: data.summary?.fluency ?? 0,
          comprehension: data.summary?.comprehension ?? 0,
          total: data.summary?.total ?? 0,
          finalScore: data.summary?.finalScore ?? 0,
          feedback: data.summary?.feedback || {}
        },
        perQuestion: data.perQuestion || []
      };
      setScores(safeData.summary);
      setDetailScores(safeData.perQuestion);
      setMode("done");
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      await saveSpeakingScore(uid, lesson.id, safeData);
      if (saveScore) {
        saveScore(lesson.id, safeData); 
      }
      setLoading(false);
      completeStudySession();
        } catch (err) {
          console.error("Error evaluating speaking:", err);
          setLoading(false);
          }
        };
      useEffect(() => {
        if (mode === "done") {
          speechSynthesis.cancel();
        }
      }, [mode]);

      const finalScores = scores || score?.summary || score;
      console.log("SCORE FROM PARENT:", score);
      console.log("SCORE FROM PARENT:", score);
      console.log("LOCAL SCORES:", scores);

      useEffect(() => {
        console.log("FINAL SCORES:", finalScores);
      }, [finalScores]);

      useEffect(() => {
        if (score && !scores) {
        setScores(score.summary || score);
        setDetailScores(score.perQuestion || []);
        setMode("done");
      }
      }, [score]);

      const combinedCorrected = detailScores
        ?.map(q => q.correctedText)
        .join(" ");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
      <div className="w-32 h-32 rounded-full bg-cyan-600/20 flex items-center justify-center animate-pulse">
        <Bot className="w-16 h-16 text-cyan-400" />
      </div>
      {mode !== "done" && (
        <div className="max-w-xl w-full bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-slate-200">
          <p className="text-cyan-400 font-semibold mb-2">
            {step === 0 && "Personal Introduction"}
            {step === 1 && "Picture Description"}
            {step >= 2 && step <= 7 && (
              <>
                Role Play <br />
                <span className="text-sm text-cyan-300">
                  Topic: Adopting a Green Lifestyle
                </span>
              </>
            )}
            {step >= 8 && (
              <>
                Problem Solving <br />
                <span className="text-sm text-cyan-300">
                  Topic: Students do not complete their homework on time
                </span>
              </>
            )}
          </p>
          <p className="text-lg">{steps[step]}</p>
          {step === 1 && (
            <img
              src={sungai}
              alt="Sungai"
              className="mt-4 rounded-lg w-full max-h-72 object-cover"
            />
          )}
        </div>
      )}
      {loading && (
        <p className="animate-pulse text-yellow-400">
          Speakai is evaluating your speaking...
        </p>
      )}
      {finalScores && (
        <div className="max-w-2xl w-full mx-auto bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-left text-slate-200">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">
            Your Score
          </h2>
          <p>Vocabulary: {finalScores?.vocabulary}</p>
          <p className="text-sm text-gray-400">
            {finalScores?.feedback?.vocabulary || ""}
          </p>
          <p>Pronunciation: {finalScores?.pronunciation}</p>
          <p className="text-sm text-gray-400">
            {finalScores?.feedback?.pronunciation || ""}
          </p>
          <p>Fluency: {finalScores?.fluency}</p>
          <p className="text-sm text-gray-400">
            {finalScores?.feedback?.fluency || ""}
          </p>
          <p>Grammar: {finalScores?.grammar}</p>
          <p className="text-sm text-gray-400">
            {finalScores?.feedback?.grammar || ""}
          </p>
          <p>Comprehension: {finalScores?.comprehension}</p>
          <p className="text-sm text-gray-400">
            {finalScores?.feedback?.comprehension || ""}
          </p>
          <p className="mt-4 font-bold text-green-400">
            Total: {finalScores?.total}
          </p>
          <p className="mt-4 font-bold text-red-500">
            Final Score: {finalScores?.finalScore}
          </p>
          <p className="mt-4 font-bold text-yellow-300">
            Speakai Corrected Sentence:
          </p>
          <p className="text-yellow-300">
            {combinedCorrected}
          </p>
        </div>
      )}
      {mode === "done" && finalScores && (
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
      {mode !== "done" && !aiOnlySteps.includes(step) && (
        <div className="flex gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-emerald-600 rounded-xl text-white"
            >
              Start Speaking
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-500 rounded-xl text-white"
            >
              End
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PretestSpeaking;