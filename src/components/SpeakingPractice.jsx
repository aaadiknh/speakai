import React, { useState, useEffect, useRef } from "react";
import { Bot, ChevronRight, CheckCircle } from "lucide-react";
import { saveSpeakingScore } from "../services/saveScore";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import reboisasi from "../assets/reboisasi.jpg";
import olahraga from "../assets/olahraga.jpg";

const scenarios = {

  introduction: {
    practice: ["Now, please introduce yourself first."],
    evaluate: ["Welcome back! Please introduce yourself again for the evaluation."]
  },
  picture: {
    practice: [
      "Look at the picture. Describe the situation and give your suggestion."
    ],
    evaluate: [
      "Look at the picture. Describe the situation and give one suggestion to solve the problem for the evaluation."
    ],
    image: {
      practice: olahraga,
      evaluate: reboisasi
    }
  },
  role: {
    practice: [
      "Hello! I have a problem and I need your suggestion. I often get distracted by my smartphone during class. I think I should be more disciplined.",
      "Okay, However, sometimes I still find it difficult to stop using my smartphone during class. Do you have any suggestions to help me control it?",
      "What else can I do to stay focused in class?",
      "Do you have any advice to reduce distraction from my smartphone?"
    ],
    evaluate: [
      "Now for the evaluation. I have a problem and I need your suggestion. I often stay up late and eat unhealthy food. I think I should change my habits.",
      "Okay, however, sometimes I still find it difficult to avoid junk food. Do you have any suggestions to help me control it?",
      "What else can I do to live a healthier life?",
      "Do you have any advice to maintain this habit consistently?",
      "Okay, your responses are recorded."
    ],
      topic: {
        practice: "Using Smartphones in Class",
        evaluate: " Maintaining a Healthy Lifestyle"
      }
  },
  opinion: {
    practice: [
      "Hello! Let’s talk about a school problem. Today, we will talk about students being late to school. I think being late is not a big problem. Some students are just tired. What do you think? ",
      "What should we do to solve this problem?",
      "I'm not sure about that solution. What do you think?",
      "Do you have any suggestions to solve this problem?"
    ],
    evaluate: [
      "Now for the evaluation. Let’s discuss a school problem. Today, we will talk about students who do not respect school rules. Why is this problem important?",
      "What should we do to solve this problem?",
      "I’m not sure if that solution will work well. What do you think?",
      "Do you have another solution?",
      "Thank you for your responses. Your answers have been recorded."
    ],
    topic: {
      practice: "Many students are late to school.",
      evaluate: "Students Do Not Keep the Classroom Clean"
    }
  }
};

const SpeakingPractice = ({ lesson, milestone, onComplete, onNext, showPopup, saveScore, completedLessons, score, user }) => {

  const [mode, setMode] = useState("practice");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [transcript, setTranscript] = useState("");
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const transcriptRef = useRef("");
  const [hasSpeech, setHasSpeech] = useState(false);
  const [detailScores, setDetailScores] = useState([]);
  const stopManuallyRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const scenario = scenarios[milestone.id];
  const isCompleted = completedLessons?.includes(lesson.id);
  const currentSteps =
    mode === "practice"
      ? scenario?.practice || []
      : scenario?.evaluate || [];
  const currentImage = scenario?.image?.[mode];
  const currentTopic = scenario?.topic?.[mode];
  const [feedback, setFeedback] = useState(null);
  const modeRef = useRef(mode);
  const stepsRef = useRef(currentSteps);
  
  useEffect(() => {
    if (score && !scores) {
      setScores(score);
      setMode("done");
    }
  }, [score]);

  const stepRef = useRef(step);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    modeRef.current = mode;
    stepsRef.current = currentSteps;
  }, [mode, currentSteps]);

  useEffect(() => {
    if (isCompleted) {
      if (score) {
        setScores(score);
      }
      setMode("done");
    }
  }, [isCompleted, score]);

  useEffect(() => {
    const fetchScore = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      try {
        const ref = doc(db, "speakingScores", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const milestoneScore = data[milestone.id];
          if (milestoneScore) {
            setScores(milestoneScore);
          }
        }
      } catch (err) {
        console.error("Fetch score error:", err);
      }
    };
    fetchScore();
  }, [milestone.id]);

  useEffect(() => {
  return () => {
    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };
}, []);

  const speakAI = (text) => {
    if (isRecording) {
    window.speechSynthesis.cancel();
  }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  };
  useEffect(() => {
    if (isCompleted) {
      window.speechSynthesis.cancel();
    }
  }, [isCompleted]);

  useEffect(() => {
    if (isCompleted || scores || mode === "done") return;
    const steps =
      mode === "practice"
        ? scenario?.practice || []
        : scenario?.evaluate || [];
    const text = steps[step];
    if (!text) return;
    speakAI(text);
  }, [step, mode, scores]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showPopup("Speech Recognition not supported in this browser");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        }
      }
      if (finalText) {
        transcriptRef.current += " " + finalText;
        setTranscript(transcriptRef.current);
        setHasSpeech(true);
      }
    };
    recognition.onerror = (e) => {
      console.error("Speech error:", e);
      if (e.error === "network") {
        showPopup("Connection lost. Restarting mic...");
        setTimeout(() => {
          try {
            recognition.stop();
            setTimeout(() => {
              recognition.start();
            }, 200);
          } catch (err) {
            console.log("Restart failed");
          }
        }, 500);
      }
    };
    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setIsRecording(true);
    };
    recognition.onend = () => {
    isRecognizingRef.current = false;
    if (!stopManuallyRef.current) return;
    const cleanTranscript = transcriptRef.current.trim();
    if (!cleanTranscript) {
      showPopup("No speech detected. Please speak again.");
      return;
    }
    setAnswers(prev => {
      const updated = [...prev, cleanTranscript];
      setTranscript("");
      transcriptRef.current = "";
      const steps = stepsRef.current;
      const modeNow = modeRef.current;
      const currentStep = stepRef.current;
      if (currentStep + 1 < steps.length) {
        const nextStep = currentStep + 1;
        setStep(nextStep);
        
      } else {
        if (modeNow === "practice") {
          generateFeedback(updated);
        } else {
          evaluateSpeaking(updated);
        }
      }
        return updated;
      });
    };
    recognitionRef.current = recognition;
    }, []); 

  const startRecording = () => {
    if (!recognitionRef.current) return;
    window.speechSynthesis.cancel();
    setTranscript("");
    transcriptRef.current = "";
    setHasSpeech(false);
    stopManuallyRef.current = false;
    try {
      recognitionRef.current.stop();
    } catch (e) {
    }
    setTimeout(() => {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.log("Start error:", err);
      }
    }, 20);
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    stopManuallyRef.current = true;
    recognitionRef.current.stop();
    setIsRecording(false);
  };

  const generateFeedback = async (answers) => {
    try {
      setLoading(true);
      const pairedQA = currentSteps.map((q, i) => ({
        question: q,
        answer: answers[i] || ""
      }));
      console.log("SEND TO BACKEND:", pairedQA);
      const res = await fetch(
        "https://api.speakai.my.id/api/practice-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            qa: pairedQA
          })
        }
      );
      const data = await res.json();
    console.log("FEEDBACK DATA:", data);
    const combinedCorrected = data.perQuestion
    ?.map(q => q.correctedText || "No correction")
    .join(" ");
    const combinedFeedback = data.perQuestion
      ?.map(item => item.feedback?.general || "")
      .join(" ");
    setFeedback({
      corrected: data.corrected || "No correction available",
      feedback: data.feedback || "No feedback available"
    });
    setLoading(false);
    } catch (err) {
      console.error("FEEDBACK ERROR:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isCompleted) {
      setMode("practice");
      setStep(0);
      setAnswers([]);
      setTranscript("");
      transcriptRef.current = "";
      setFeedback(null);
      setScores(null);
    }
  }, [lesson.id, isCompleted]);

  const evaluateSpeaking = async (answers) => {
    try {
      setLoading(true);
      const pairedQA = currentSteps.map((q, i) => ({
        question: q,
        answer: answers[i] || ""
      }));
      const res = await fetch(
        "https://api.speakai.my.id/api/evaluate-speaking",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            qa: pairedQA
          })
        }
      );
      const data = await res.json();
      console.log("HASIL BACKEND:", data);
      setDetailScores(data.perQuestion);

  const uid = auth.currentUser?.uid;
    if (!uid) return;
  const combinedCorrected = data.perQuestion
  ?.map(q => q.correctedText || q.corrected || "")
  .filter(Boolean)
  .join(" ");
  const safeData = {
    pronunciation: data.summary?.pronunciation ?? 0,
    grammar: data.summary?.grammar ?? 0,
    vocabulary: data.summary?.vocabulary ?? 0,
    fluency: data.summary?.fluency ?? 0,
    comprehension: data.summary?.comprehension ?? 0,
    total: data.summary?.total ?? 0,
    finalScore: data.summary?.finalScore ?? 0,
    correctedText: combinedCorrected,
    feedback: data.summary?.feedback || {}
  };
  setScores(safeData); 
  setMode("done");
  await saveSpeakingScore(uid, lesson.id, {
    summary: safeData,
    perQuestion: data.perQuestion
  });
    if (saveScore) {
      saveScore(lesson.id, safeData);
    }
    if (onComplete) {
      onComplete(lesson.id, lesson.xpReward);
    }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const tryAgain = () => {
    window.speechSynthesis.cancel();
    setTranscript("");
    transcriptRef.current = "";
    setFeedback(null);
    setAnswers([]);
    setStep(0);
    if (currentSteps[0]) {
      speakAI(currentSteps[0]);
    }
  };

  const lastSpokenRef = useRef("");
  useEffect(() => {
    if (isCompleted || scores || mode === "done") return;
    const steps =
      mode === "practice"
        ? scenario?.practice || []
        : scenario?.evaluate || [];
    const text = steps[step];
    if (!text) return;
    if (lastSpokenRef.current === text) return;
    lastSpokenRef.current = text;
    window.speechSynthesis.cancel();
    speakAI(text);
  }, [step, mode]);

  const startEvaluation = () => {
    window.speechSynthesis.cancel();
    setMode("evaluate");
    setStep(0);
    setAnswers([]);
    setTranscript("");
    transcriptRef.current = "";
    setFeedback(null);
    setTimeout(() => {
      const first = scenarios[milestone.id]?.evaluate?.[0];
      if (first) speakAI(first);
    }, 300);
  };

  const finalScores = scores ;
  useEffect(() => {
    if (isCompleted && score) {
      setScores(score); 
    }
  }, [isCompleted, score]);

  console.log("SCORE FROM PARENT:", score);
  console.log("LOCAL SCORES:", scores);

  useEffect(() => {
    console.log("FINAL SCORES:", finalScores);
  }, [finalScores]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
      <div className="w-32 h-32 rounded-full bg-cyan-600/20 flex items-center justify-center animate-pulse">
        <Bot className="w-16 h-16 text-cyan-400" />
      </div>
      {mode !== "done" && (
        <div className="max-w-xl w-full bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-slate-200">
          <div className="text-cyan-400 font-semibold mb-2">
            {milestone.id === "introduction" && "Personal Introduction"}
            {milestone.id === "picture" && "Picture Description"}
            {milestone.id === "role" && (
              <>
                <div className="text-cyan-400 font-semibold mb-1">
                  Role Play
                </div>
                {currentTopic && (
                  <span className="text-sm text-cyan-300">
                    Topic: {currentTopic}
                  </span>
                )}
              </>
            )}
            {milestone.id === "opinion" && (
              <>
                <div className="text-cyan-400 font-semibold mb-1">
                  Problem Solving
                </div>
                {currentTopic && (
                  <span className="text-sm text-cyan-300">
                    Topic: {currentTopic}
                  </span>
                )}
              </>
            )}
          </div>
          <p className="text-lg">
            {currentSteps[step]}
          </p>
          {milestone.id === "picture" && currentImage && (
          <img
            src={currentImage}
            alt="Scenario"
            className="mt-4 rounded-lg w-full max-h-72 object-cover"
          />
        )}
        </div>
      )}
      {mode === "practice" && transcript && !scores && (
        <div className="max-w-xl w-full bg-slate-800 p-4 rounded-xl text-left text-slate-300">
          <p className="text-slate-400">Your Speech:</p>
          <p>{transcript}</p>
        </div>
      )}
      {/* LOADING */}
      {loading && (
        <div className="animate-pulse max-w-xl w-full p-6 text-yellow-400">
          Speakai is analyzing your speaking...
        </div>
      )}
      {/* PRACTICE FEEDBACK */}
      {feedback && mode === "practice" && (
        <div className="max-w-xl w-full bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-left text-slate-200">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">
            Practice Feedback
          </h2>
          <p className="font-semibold text-yellow-300">
            Corrected Sentence
          </p>
          <p className="mt-1">
            {feedback.corrected}
          </p>
          <p className="font-semibold text-green-400 mt-4">
            Speakai Feedback
          </p>
          <p className="mt-1 text-gray-400">
            {feedback.feedback }
          </p>
        </div>
      )}
      {/* SCORE */}
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
            Speakio Corrected Sentence:
          </p>
          <p className="text-yellow-300">
            {finalScores?.correctedText}
          </p>
        </div>
      )}
      {/* BUTTON */}
      {mode !== "done" && !finalScores && !feedback && (
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
      {feedback && mode === "practice" && (
        <div className="flex gap-4">
          <button
            onClick={tryAgain}
            className="px-6 py-3 bg-red-600 rounded-xl text-white"
          >
            Try Again
          </button>
          <button
            onClick={startEvaluation}
            className="px-6 py-3 bg-emerald-600 rounded-xl text-white"
          >
            Continue to Evaluation
          </button>
        </div>
      )}
      {mode === "done" && finalScores && (
        <div className="space-y-4 w-full max-w-2xl mx-auto">
          {/* MISSION COMPLETE */}
          <div className="w-full p-4 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl text-center font-bold flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8" />
            Mission Complete! +{lesson.xpReward} XP
          </div>
          {/* NEXT BUTTON */}
          {onNext && (
            <button
              onClick={onNext}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl"
            >
              Next Lesson <ChevronRight className="w-5 h-5 inline" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SpeakingPractice;