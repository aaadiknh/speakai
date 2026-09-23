import React, { useState, useEffect, useRef } from 'react';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import confetti from "canvas-confetti";
import LandingPageInfo from './LandingPageInfo';
import LoginPage from './LandingPage';
import base from './assets/base.png';
import headphone from './assets/headphone.png';
import jacket from './assets/jaket.png';
import beanie from './assets/beanie.png';
import headphoneJacket from './assets/headphone+jaket.png';
import beanieJacket from './assets/beanie+jaket.png';
import PretestSpeaking from "./components/PretestSpeaking";
import PronunciationPractice from "./components/PronunciationPractice";
import SpeakingPractice from "./components/SpeakingPractice";
import PosttestSpeaking from "./components/PosttestSpeaking";
import { 
  Bot,
  Trophy, 
  Play, 
  CheckCircle, 
  User, 
  Zap, 
  Star, 
  Lock, 
  Unlock, 
  ChevronRight,
  Flame,
  Award,    
  Link as LinkIcon,
  LogOut,
  Shirt,
  ClipboardCheck,
  BookOpen,
  Gamepad2,
  Compass,
  Mic,
  MessageCircle,
  Target,
  Volume2,
  Map,
  Rocket,
  Theater,
  Route,
  Flag,
  Crosshair,
  Puzzle,
  Key,
  Lightbulb,
  ListCheck,
  ClipboardList
} from 'lucide-react';

const CURRICULUM = [
  {
    id: 'pretest',
    title: 'PRE-TEST',
    icon: ClipboardCheck,
    color: 'text-white',
    bgColor: 'bg-gradient-to-r from-red-500 to-orange-400',
    progressColor: 'bg-gradient-to-r from-red-500 to-orange-400',
    description: 'Baseline Speaking Skill',
    lessons: [
      {
        id: 'pretest-1',
        title: 'Start Pretest',
        content: 'lets start the pretest.',
        taskType: 'speaking',
        xpReward: 50
      }
    ]
  },
  {
    id: 'introduction',
    title: 'PERSONAL INTRODUCTION ',
    icon: User,
    color: 'text-white',
    bgColor: 'bg-gradient-to-r from-orange-500 to-yellow-400',
    progressColor: 'bg-gradient-to-r from-orange-500 to-yellow-400',
    description: 'Guided Speaking.',
    lessons: [
      {
        id: 'introduction-1',
        title: 'Module',
        taskType: 'study',
        xpReward: 60,
        material: {
          description: `In this section, students will learn how to introduce themselves and ask for suggestions in English. These skills are important because they help students start a conversation and ask for help or advice in daily situations.`,
          sections: [
            {
              title: 'Definition',
              content: `Asking and giving opinion is a way that someone does to ask and give opinions to other people. This is the act of using expressions to request someone else's thoughts, ideas, or viewpoints on a specific subject. When carrying out daily activities, we usually cannot be separated from this common expression.`
            },
            {
              title: 'Purpose',
              content: 'The purpose of asking and giving opinion:',
              items: [
                'To get information of something or to give information to someone who need that information.',
                'To gather information, understand other perspectives, or find a solution to a problem through shared insights.',
                'To help the decision-making process or solve problems.'
              ]
            },
            {
              title: 'Personal Introduction (Short):',
              content: [
                'Before asking for suggestions, we usually begin by introducing ourselves. Personal introduction is used to give basic information about who we are. For example, we can mention our name, where we live, our school, and our hobbies. This helps make communication more polite and friendly.',
                'Some simple expressions that can be used are: '
              ],
              items: [
                'My name is …',
                'I am a grade eleven student.',
                'I live in …',
                'My hobbies are …',
                'I like …'
              ]
            },
            {
              title: 'Asking for Suggestions',
              content:[
                'Asking for suggestions refers to expressions used to request advice, input, or recommendations about something in English.',
                'The purpose of asking for suggestions or advice is to help in making decisions or solving problems we are facing. By asking others for their suggestions, we can gain new perspectives and generate ideas on how to deal with or solve the problem effectively.',
                'Some expressions that can be used are:'
              ],
              items: [
                'Any ideas on this?',
                'Can you help me out here?',
                'What would you do in my shoes?',
                'Got any suggestions?',
                'What`s your take on this?',
                'What should I do about this?',
                'Any advice on this?',
                'How would you handle this?',
                'What do you think I should do?',
                'Can you suggest any possible solutions?',
                'What do you believe is the best course of action?',
                'Could you share your thoughts on this matter?',
                'Do you have any recommendations for this situation?',
                'Can you guide me on what should be done next?',
                'What would you propose we do in this situation?',
                'Considering your expertise, what would you advise?',
                'Can you give me a tip on this?'
              ]
            }
          ]
        }
      },
      {
        id: 'introduction-2',
        title: 'Pronunciation Practice',
        taskType: 'pronunciation',
        xpReward: 70,
        words: [
          { word: "suggestion", ipa: "/səˈdʒes.tʃən/" },
          { word: "advice", ipa: "/ədˈvaɪs/" },
          { word: "improve", ipa: "/ɪmˈpruːv/" },
          { word: "practice", ipa: "/ˈpræk.tɪs/" },
          { word: "confident", ipa: "/ˈkɒn.fɪ.dənt/" }
        ]
      },
      {
        id: 'introduction-3',
        title: 'Speaking Practice',
        taskType: 'speaking',
        xpReward: 85
      }
    ]
  },
  {
    id: 'picture',
    title: 'PICTURE DESCRIPTION',
    icon: BookOpen,
    color: 'text-white',
    bgColor: 'bg-gradient-to-r from-yellow-400 to-green-500',
    progressColor: 'bg-gradient-to-r from-yellow-400 to-green-500',
    description: 'Picture-based speaking',
    lessons: [
      {
        id: 'picture-1',
        title: 'Module',
        taskType: 'study',
        xpReward: 60,
        material: {
          description: `In this section, students will learn how to describe a picture or situation and give suggestions based on it. These skills help students express their ideas and provide solutions to problems in real-life situations.`,
          sections: [
            {
              title: 'Picture Description',
              content:[ 
                'When describing a picture, we explain what we see and what is happening.',
                'Some useful expressions are:'
              ],
              items: [
                'In the picture, I can see …',
                'The picture shows … ',
                'There is / There are … ',
                'The situation shows …',
                'This situation happens because …'
              ]
            },
            {
              title: 'Giving Suggestion',
              content: [
                'Giving suggestions refers to expressions used to offer advice, input, or recommendations about something in English.',
                'The purpose of giving suggestions or advice is to provide perspectives, ideas, or recommendations to others about the best course of action to solve a problem.',
                'Some expressions that can be used are:',
                'Patterns — Examples',
              ],
              items: [
                `Why don’t + Subject + Verb 1 → Why don’t you go to the police station?
                `,
                `Why not + Verb 1 → Why not track your phone with my phone?`,
                `Why not + Verb 1 → Why not track your phone with my phone?`,
                `Let’s + Verb 1 → Let’s go on vacation!`,
                `How about + Subject + Verb 1 → How about telling the truth?`,
                `What about + Verb-ing → What about wearing these clothes?`,
                `I suggest that + Subject + Verb 1 → I suggest that you submit your homework soon`,
                `You should + Verb 1 → You should bring your own book`,
                `You ought to + Verb 1 → You ought to ask your mother`,
                `You had better + Verb 1 → You had better go to the hospital.`
              ]
            },
          ]
        }
      },
      {
        id: 'picture-2',
        title: 'Pronunciation Practice',
        taskType: 'pronunciation',
        xpReward: 70,
        words: [
          { word: "solution", ipa: "/səˈluː.ʃən/" },
          { word: "problem", ipa: "/ˈprɒb.ləm/" },
          { word: "environment", ipa: "/ɪnˈvaɪ.rən.mənt" },
          { word: "prevent", ipa: "/prɪˈvent/" },
          { word: "situation", ipa: "/ˌsɪtʃ.uˈeɪ.ʃən/" }
        ]
      },
      {
        id: 'picture-3',
        title: 'Speaking Practice',
        taskType: 'speaking',
        xpReward: 85
      }
    ]
  },
  {
    id: 'role',
    title: 'ROLE PLAY',
    icon: Mic,
    color: 'text-white',
    bgColor: 'bg-gradient-to-r from-green-400 to-blue-500',
    progressColor: 'bg-gradient-to-r from-green-400 to-blue-500',
    description: 'Controlled Conversation',
    lessons: [
      {
        id: 'role-1',
        title: 'Module',
        taskType: 'study',
        xpReward: 60,
        material: {
          description: `In this section, students will practice asking for and giving suggestions through a role play with Speakai AI. Students will respond to problems related to school and daily life.`,
          sections: [
            {
              title: 'Role Play',
              content: 'Role play is an activity where students practice conversations by acting in certain situations. In this activity, students will interact with Speakai AI to ask for and give suggestions, as well as respond to suggestions.',
            },
            {
              title: 'Accepting Suggestion',
              content: 'If you agree with someone else’s suggestion, express your appreciation and gratitude to them through some examples of expressions like the ones below:',
              items: [
                'Great idea!',
                "That's a cool suggestion.",
                "Sounds good to me.",
                "I'm on board with that idea.",
                "You make a solid point.",
                "I'm up for trying your suggestion.",
                `I think you're onto something.`,
                "That's an interesting idea.",
                "Thanks for the tip.",
                "Your suggestion is appreciated and I will take it into consideration.",
                "Thank you for recommending a solution. I plan to act on it.",
                "I appreciate your advice and will use it to improve my performance.",
                "Your idea is valuable and I will give it serious thought.",
                "Thank you for your insight. I will use it to make informed decisions.",
                "I am open to your suggestions and look forward to hearing more.",
                "Your recommendation is well-received, and I plan to follow through with it.",
                'Thank you for advising me on this matter. I will take it into account.',
                'Your input is highly valued, and I will use it to enhance my work.',
                'I appreciate your guidance and will use it to achieve my goals.',
              ]
            },
            {
              title: ' Examples :',
              items: [
                `Suggestion: I recommend that you hire a professional photographer to capture your special moments on your graduation day.Response: Thank you for the recommendation, we were just discussing that yesterday.`,
                `Suggestion: I suggest we go for a picnic at the park. We haven't done that in a while. 
                Response: Thank you for recommending a solution. I plan to act on it with my family next weekend.`
              ]
            }
          ]
        }
      },
      {
        id: 'role-2',
        title: 'Pronunciation Practice',
        taskType: 'pronunciation',
        xpReward: 70,
        words: [
          { word: "focus", ipa: "/ˈfəʊ.kəs/" },
          { word: "habit", ipa: "/ˈhæb.ɪt/" },
          { word: "decision", ipa: "/dɪˈsɪʒ.ən/" },
          { word: "communicate", ipa: "/kəˈmjuː.nɪ.keɪt/" },
          { word: "discuss", ipa: "/dɪˈskʌs/" }
        ]
      },
      {
        id: 'role-3',
        title: 'Speaking Practice',
        taskType: 'speaking',
        xpReward: 85
      }
    ]
  },
  {
    id: 'opinion',
    title: 'PROBLEM SOLVING',
    icon: MessageCircle,
    color: 'text-white',
    bgColor: 'bg-gradient-to-r from-blue-700 to-cyan-500',
    progressColor: 'bg-gradient-to-r from-blue-700 to-cyan-500',
    description: 'Free Speaking',
    lessons: [
      {
        id: 'opinion-1',
        title: 'Module',
        taskType: 'study',
        xpReward: 60,
        material: {
          description: `In this section, students will learn how to identify problems and give suggestions to solve them in daily situations.`,
          sections: [
            {
              title: 'Problem Solving',
              content:'Problem solving is the ability to identify a problem and give appropriate suggestions to solve it. In daily life, we often face problems and need to think of possible solutions.',
            },
            {
              title: 'Refusing Suggestion',
              content:`If you feel the advice or suggestion isn't right for you, don't hesitate to reject it. Here's an example:`,
              items: [
                `Not possible, sorry.`,
                `Respectfully decline, not the best fit.`,
                `Appreciate it, but we have to decline.`,
                `Thank you, but we must pass.`,
                `Regretfully decline, doesn't align with our needs.`,
                `Can't proceed, sorry.`,
                `While we appreciate your input, we have to decline.`,
                `Unfortunately, we have to pass.`,
                `Regret to decline, doesn't meet our requirements.`,
                `Thanks for your suggestion, but it's not feasible.`,
                `Sorry, not feeling it.`,
                `No thanks, not for me.`,
                `Thanks, but no.`
              ]
            },
            {
              title: 'Note :',
              content: 'When giving advice or counsel to anyone, use kind language and avoid any judgmental language. So, always give advice and counsel well.'
            },
            {
              title: 'Examples :',
              items: [
                `Suggestion: I advise you to start a savings plan to prepare for your future financial needs.
                Response: Thank you for the advice, but I prefer to focus on enjoying the present rather than worrying about the future.`,
                `Suggestion: You had better do this task in the library.
                Response: Thanks for your suggestion, but it's not feasible. The library will be closed at 3 P.M.`
              ]
            }
          ]
        }
      },
      {
        id: 'opinion-2',
        title: 'Pronunciation Practice',
        taskType: 'pronunciation',
        xpReward: 70,
        words: [
          { word: "responsibility", ipa: "/rɪˌspɒn.səˈbɪl.ə.ti/" },
          { word: "discipline", ipa: "/ˈdɪs.ə.plɪn/" },
          { word: "schedule", ipa: "/ˈskedʒ.uːl/" },
          { word: "important", ipa: "/ɪmˈpɔː.tənt/" },
          { word: "behavior", ipa: "/bɪˈheɪ.vjər/" }
        ]
      },
      {
        id: 'opinion-3',
        title: 'Speaking Practice',
        taskType: 'speaking',
        xpReward: 85
      }
    ]
  },
  {
    id: 'posttest',
    title: 'POST-TEST',
    icon: Award,
    color: 'text-white',
    bgColor: 'bg-gradient-to-r from-cyan-400 to-purple-600',
    progressColor: 'bg-gradient-to-r from-cyan-400 to-purple-600',
    description: 'Evaluation',
    lessons: [
      {
        id: 'posttest-1',
        title: 'Start Evaluation',
        content: 'lets start the posttest.',
        taskType: 'speaking',
        xpReward: 50
      }
    ]
  },
];

const ALL_LESSONS = CURRICULUM.flatMap(m => m.lessons);

const BADGES = {
  pretest: {name: "Speaking Starter", icon: Mic, color: "text-red-400" },
  introduction: { name: "Self Introduction Speaker", icon: User, color: "text-yellow-400" },
  picture: { name: "Picture Description Pro", icon: BookOpen, color: "text-green-400" },
  role: { name: "Conversation Master", icon: MessageCircle, color: "text-blue-400" },
  opinion: { name: "Opinion Speaker", icon: Star, color: "text-cyan-400" },
  posttest: { name: "Speaking Graduate", icon: Trophy, color: "text-purple-400" },
  master: { name: "Speakai Champion", icon: Award, color: "text-yellow-500" }
};

const RANK_SYSTEM = {
  none: { name: "Speaking Rookie", icon: Mic, color: "text-slate-400" },
  beginner: { name: "Basic Speaker", icon: MessageCircle, color: "text-green-400" },
  intermediate: { name: "Confident Speaker", icon: Star, color: "text-blue-400" },
  advanced: { name: "Fluent Speaker", icon: Award, color: "text-purple-400" },
  expert: { name: "Speakai Champion", icon: Trophy,color: "text-yellow-400" }
};

const getRankBasedOnMilestones = (completedMilestones) => {
  const count = completedMilestones.length;
  if (count >= 6) {
    return RANK_SYSTEM.expert;
  } 
  else if (count >= 4) {
    return RANK_SYSTEM.advanced;
  } 
  else if (count >= 2) {
    return RANK_SYSTEM.intermediate;
  } 
  else if (count >= 1) {
    return RANK_SYSTEM.beginner;
  }
  return RANK_SYSTEM.none;
};

const Confetti = ({ active }) => {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex justify-center items-center">
      <div className="absolute animate-ping w-24 h-24 bg-yellow-400 rounded-full opacity-20"></div>
      <div className="text-4xl animate-bounce">🎉</div>
      <div className="absolute top-1/4 left-1/4 text-4xl animate-pulse">✨</div>
      <div className="absolute top-1/4 right-1/4 text-4xl animate-pulse delay-75">🔥</div>
      <div className="absolute bottom-1/4 left-1/3 text-4xl animate-pulse delay-150">🌟</div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, user, onLogout, clearActiveLesson, character, getCharacterImage }) => (
  <div className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col items-center md:items-stretch py-6 transition-all duration-300">
    <div className="px-6 mb-10 flex items-center justify-center md:justify-start gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-400 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-cyan-500/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-white"
        >
        {/* Microphone */}
        <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z"/>
        <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11z"/>
        {/* Robot Face */}
        <rect x="7" y="3" width="10" height="8" rx="2" ry="2" opacity="0.25"/>
        <circle cx="10" cy="7" r="1"/>
        <circle cx="14" cy="7" r="1"/>
        </svg>
        </div>
      <span className="hidden md:block font-bold text-xl text-white tracking-tight">Speakai</span>
    </div>
    <nav className="flex-1 space-y-2 px-3">
      {[
        { id: 'dashboard', icon: Bot, label: 'Dashboard' },
        { id: 'learn', icon: Trophy, label: 'Quests' },
        { id: 'character', icon: Shirt, label: 'Character' },
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'guide', icon: BookOpen, label: 'Guide' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => {
            clearActiveLesson();
            setActiveTab(item.id);
          }}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
            activeTab === item.id 
              ? 'bg-cyan-600/10 text-cyan-400' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'stroke-[2.5px]' : ''}`} />
          <span className="hidden md:block font-medium">{item.label}</span>
          {activeTab === item.id && (
            <div className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]"></div>
          )}
        </button>
      ))}
    </nav>
    <div className="mt-auto px-4 py-4 border-t border-slate-800/50 w-full space-y-4">
      <div className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
          <img src={getCharacterImage()} alt="Character" className="w-8 h-8" />
        </div>
        <div className="hidden md:block overflow-hidden">
          <p className="text-sm font-bold text-slate-200 truncate">{user.name}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {user.xp} XP
          </p>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <span className="font-bold text-yellow-400">$</span> {user.coins} Coins
          </p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden md:block">Logout</span>
      </button>
    </div>
  </div>
);

const LessonView = ({ milestone, lesson, onComplete, onBack, onNext, completedLessons, showPopup, saveScore, user }) => {
  if (!lesson) {
    return (
      <div className="text-white text-center mt-10">
        Lesson not found
      </div>
    );
  }
  
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const isCompleted = completedLessons.includes(lesson.id);
  const isPretest = milestone.id === 'pretest';
  const isPosttest = milestone.id === 'posttest';
  const completeStudySession = () => {
  setIsCompleted(true);
  if (onComplete) {
    onComplete(lesson.id, lesson?.xpReward || 50);
  }
};

if (!user || !user.scores) {
  return <p className="text-white">Loading user data...</p>;
}

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {lesson.title}
            {isCompleted && <CheckCircle className="text-cyan-400 w-6 h-6" />}
          </h2>
          <p className="text-slate-400 text-sm">{milestone.title} • {lesson.xpReward} XP Reward</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 h-full overflow-y-auto pb-20">
  {/* PRETEST MODE */}
  {isPretest && lesson.taskType === 'speaking' && (
    <PretestSpeaking
      lesson={lesson}
      onComplete={onComplete}
      onNext={onNext}
      showPopup={showPopup}
      saveScore={saveScore} 
      score={user?.scores?.[lesson.id] || null}
      completedLessons={completedLessons}
      user={user} 
    />
  )}
  {/* POSTTEST MODE */}
  {isPosttest && lesson.taskType === 'speaking' && (
    <PosttestSpeaking
      lesson={lesson}
      onComplete={onComplete}
      onNext={onNext}
      showPopup={showPopup} 
      saveScore={saveScore}
      score={user?.scores?.[lesson.id] || null}
      completedLessons={completedLessons} 
      user={user}
    />
  )}
  {lesson.taskType === "pronunciation" && (
    <PronunciationPractice
      lesson={lesson}
      onComplete={onComplete}
      onNext={onNext}
      completedLessons={completedLessons}
    />
  )}
  {/* SPEAKING PRACTICE */}
  {!isPretest && !isPosttest && lesson.taskType === "speaking" && (
    <SpeakingPractice
      lesson={lesson}
      milestone={milestone}
      onComplete={onComplete}
      onNext={onNext}
      showPopup={showPopup} 
      saveScore={saveScore}
      score={user.scores?.[lesson.id] || null}
  completedLessons={completedLessons}
      user={user}
    />
  )}
  {/* MODE NORMAL (STUDY / QUIZ) */}
  {lesson.taskType === "study" && (
    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-cyan-400">
          Core Concepts
        </h3>
      </div>
      <p className="text-slate-300 leading-relaxed">
        {lesson.content}
      </p>
      {lesson.taskType === 'study' && (
        <>
          <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-700/40">
            <p className="text-slate-300">
              {lesson.material.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.material?.sections?.map((section, idx) => (
            <div
              key={section.title + idx}
              className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/40"
            >
              <h4 className="text-cyan-400 font-semibold mb-3">
                {section.title}
              </h4>
              {section.content && (
                Array.isArray(section.content) ? (
                  section.content.map((text, i) => (
                    <p key={i} className="text-slate-300 text-sm leading-relaxed mb-3">
                      {text}
                    </p>
                  ))
                ) : (
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    {section.content}
                  </p>
                )
              )}
              {section.items && (
                <ul className="space-y-2 text-slate-300 text-sm">
                  {section.items.map((item, i) => (
                    <li key={item + i} className="flex gap-2">
                      <span className="text-cyan-400">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          </div>
        </>
      )}
      {lesson.taskType === 'study' && !isCompleted && (
        <button
          onClick={() => onComplete(lesson.id, lesson.xpReward)}
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl"
        >
          Complete Study Session
        </button>
      )}
      {isCompleted && (
        <div className="space-y-3">
          <div className="p-4 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl text-center font-bold flex flex-col items-center gap-2 animate-bounce-short">
          <CheckCircle className="w-8 h-8" />
          Mission Complete! +{lesson.xpReward} XP
          </div>
          {onNext && (
            <button
              onClick={onNext}
                      className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25  transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Next Lesson  <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  )}
</div>
</div>
  );
};

const CharacterView = ({ user, character, setCharacter, spendCoins, getCharacterImage, showPopup }) => {
  const shopItems = [
    { name: 'headphone', cost: 100 },
    { name: 'jacket', cost: 250 },
    { name: 'beanie', cost: 400 },
  ];

  const purchaseItem = (item) => {
    if (user.coins >= item.cost && !character.purchasedItems.includes(item.name)) {
      spendCoins(item.cost);
      setCharacter(prev => ({
        ...prev,
        purchasedItems: [...prev.purchasedItems, item.name]
      }));
      showPopup("Item purchased successfully! ");
    } else if (character.purchasedItems.includes(item.name)) {
      showPopup("You already own this item!");
    } else {
      showPopup("Not enough coins!");
    }
  };

  const toggleEquip = (itemName) => {
    const { equipped } = character;
    const isCurrentlyEquipped = equipped[itemName];
    if (!isCurrentlyEquipped) {
      if (itemName === 'headphone' && equipped.beanie) {
        showPopup("Cannot equip headphone with beanie!");
        return;
      }
      if (itemName === 'beanie' && equipped.headphone) {
        showPopup("Cannot equip beanie with headphone!");
        return;
      }
    }

    setCharacter(prev => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [itemName]: !isCurrentlyEquipped
      }
    }));
  };
  
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your Avatar</h2>
          <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
            <img src={getCharacterImage()} alt="Character" className="w-48 h-48" />
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Accessory Shop</h2>
            <p className="text-slate-400 mb-6">Your Coins: <span className="font-bold text-yellow-400">{user.coins}</span></p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {shopItems.map(item => (
                <div key={item.name} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-center">
                  <h3 className="font-bold text-slate-200 capitalize">{item.name}</h3>
                  <p className="text-sm text-yellow-400 font-bold mb-4">{item.cost} coins</p>
                  <button
                    onClick={() => purchaseItem(item)}
                    disabled={character.purchasedItems.includes(item.name)}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 rounded-xl transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed"
                  >
                    {character.purchasedItems.includes(item.name) ? 'Owned' : 'Buy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Inventory</h2>
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
              {character.purchasedItems.map(itemName => (
                <div key={itemName} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-center">
                  <h3 className="font-bold text-slate-200 capitalize">{itemName}</h3>
                  <button
                    onClick={() => toggleEquip(itemName)}
                    className={`w-full mt-4 font-bold py-2 rounded-xl transition-colors ${
                      character.equipped[itemName]
                        ? 'bg-red-500 hover:bg-red-700 text-white'
                        : 'bg-green-500 hover:bg-green-700 text-white'
                    }`}
                  >
                    {character.equipped[itemName] ? 'Unequip' : 'Equip'}
                  </button>
                </div>
              ))}
              {character.purchasedItems.length === 0 && <p className="text-slate-500">Your inventory is empty.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  
  const [currentPage, setCurrentPage] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeLesson, setActiveLesson] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [guideLang, setGuideLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    level: 1,
    xp: 0,
    xpToNext: 200,
    badges: [],
    completedLessons: [],
    coins: 0
  });
  const [character, setCharacter] = useState({
    purchasedItems: [],
    equipped: {
      headphone: false,
      jacket: false,
      beanie: false
    }
  });

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      setIsLoggedIn(true);
      const docRef = doc(db, "users", firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUser({
        ...data,
        scores: data.scores || {}
      });
        setIsUserLoaded(true);
        setActiveTab(data.activeTab || "dashboard");
        setActiveLesson(data.activeLesson || null);
        setCurrentPage(data.currentPage || "dashboard");
      } else {
        const newUser = {
          name: firebaseUser.email.split("@")[0],
          email: firebaseUser.email,
          level: 1,
          xp: 0,
          xpToNext: 200,
          badges: [],
          completedLessons: [],
          coins: 0,
          scores: {}
        };
      await setDoc(docRef, newUser);
        setUser(newUser);
        setIsUserLoaded(true);
      }
      setIsInitialized(true);
    } else {
      setIsLoggedIn(false);
      setCurrentPage("landing");
      setIsInitialized(false);
    }
      setLoading(false);
    });
      return () => unsubscribe();
    }, []);

  useEffect(() => {
    if (!auth.currentUser || !isUserLoaded) return;
    saveUserProgress({
      ...user,
      activeTab,
      activeLesson,
      currentPage
    });
  }, [user, activeTab, activeLesson, currentPage, isUserLoaded]);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "default"
  });

  const showPopup = (message, type = "default") => {
    setPopup({
      show: true,
      message,
      type
    });
  };

  let isPlaying = false;
    const playSoundSafe = () => {
      if (isPlaying) return;
      isPlaying = true;
      const audio = new Audio("/levelup.mp3");
      audio.volume = 0.5;
      audio.play();
      setTimeout(() => {
        isPlaying = false;
      }, 1500);
    };

  const saveUserToFirestore = async (userData) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    try {
      await setDoc(doc(db, "users", currentUser.uid), userData);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && isUserLoaded) {
      saveUserToFirestore(user);
    }
  }, [user, isUserLoaded]);

  const loadUserFromFirestore = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser({
        ...docSnap.data(),
        scores: docSnap.data().scores || {},
      });
    } else {
      console.log("User baru, tidak overwrite data lama");
    }
  };

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    saveUserProgress({
      activeTab: tab
    });
  };

  const openLesson = (lesson) => {
    setActiveLesson(lesson);
    saveUserProgress({
      activeLesson: lesson
    });
  };

  const clearActiveLesson = () => {
    setActiveLesson(null);
    saveUserProgress({
      activeLesson: null
    });
  };

  const handleGetStarted = () => {
    setCurrentPage('login');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const handleLogin = async (userData) => {
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
    await loadUserFromFirestore();
    setUser(prev => ({
      ...prev,
      name: userData.name || prev.name,
      email: userData.email || prev.email
    }));
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.clear();
      setIsLoggedIn(false);
      setCurrentPage('landing');
      setActiveTab('dashboard');
      setActiveLesson(null);
    });
  };

  const handleCompleteLesson = (lessonId, xpReward) => {
    const updatedCompleted = user.completedLessons.includes(lessonId)
    ? user.completedLessons
    : [...user.completedLessons, lessonId];
    const updatedXp = user.xp + xpReward;
    const updatedUser = {
      ...user,
      completedLessons: updatedCompleted,
      xp: updatedXp,
    };
    setUser(updatedUser);
    saveUserProgress({
      ...updatedUser,
      activeTab,
      activeLesson,
      currentPage
    });
  };

  const saveUserProgress = async (data) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    try {
      await setDoc(doc(db, "users", currentUser.uid), data, { merge: true });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const saveScore = async (uid, lessonId, scoreData) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        [`scores.${lessonId}`]: scoreData
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="animate-pulse text-lg">Loading...</p>
      </div>
    );
  }

  if (currentPage === 'landing') {
    return (
      <>
        <LandingPageInfo onGetStarted={handleGetStarted} />
        {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
          <div className={`
            relative w-80 p-6 rounded-2xl text-center
            backdrop-blur border
            transform transition-all duration-300 animate-popupIn bg-slate-900/95 border-cyan-500/20
          `}>
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setPopup({ show: false, message: "", type: "default" })}
                className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition"
              >
                ✕
              </button>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Notification
            </h2>
            <p className="text-sm text-slate-200 whitespace-pre-line">
              {popup.message}
            </p>
          </div>
        </div>
      )}
      </>
    );
  }

  if (currentPage === 'login') {
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          onBackToLanding={handleBackToLanding}
          showPopup={showPopup}
        />
        {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
          <div className={`
            relative w-80 p-6 rounded-2xl text-center
            backdrop-blur border
            transform transition-all duration-300 animate-popupIn bg-slate-900/95 border-cyan-500/20
          `}>
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setPopup({ show: false, message: "", type: "default" })}
                className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition"
              >
                ✕
              </button>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Notification
            </h2>
            <p className="text-sm text-slate-200 whitespace-pre-line">
              {popup.message}
            </p>
          </div>
        </div>
      )}
      </>
    );
  }

  if (currentPage === 'dashboard' && isLoggedIn) {
    const addRewards = (rewards) => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setUser(prev => {
        let newXp = prev.xp + (rewards.xp || 0);
        let newLevel = prev.level;
        let newXpToNext = prev.xpToNext;
        let newCoins = prev.coins + (rewards.coins || 0);
        if (newXp >= prev.xpToNext) {
          newLevel += 1;
          newXp -= prev.xpToNext;
          newXpToNext = Math.floor(newXpToNext * 1.5);
        }
        return { ...prev, xp: newXp, level: newLevel, xpToNext: newXpToNext, coins: newCoins };
      });
    };
    {currentPage === "login" && (
      <LoginPage
        onLogin={handleLogin}
        onBackToLanding={handleBack}
        showPopup={showPopup}
      />
    )}

    const spendCoins = (amount) => {
      setUser(prev => {
        if (prev.coins >= amount) {
          return { ...prev, coins: prev.coins - amount };
        }
        return prev;
      });
    };

    const completeLesson = (lessonId, xpReward) => {
      if (!user.completedLessons.includes(lessonId)) {
        setUser(prev => ({
          ...prev,
          completedLessons: [...prev.completedLessons, lessonId]
        }));
        addRewards({ xp: xpReward, coins: xpReward });
        checkBadges(lessonId);
      }
    };
    const fireConfetti = () => {
      const duration = 2000;
      const end = Date.now() + duration;
      const run = () => {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
        if (Date.now() < end) {
          requestAnimationFrame(run);
        }
      };
      run();
    };

    const saveScore = (lessonId, score) => {
      setUser(prev => ({
        ...prev,
        scores: {
          ...prev.scores,
          [lessonId]: score
        }
      }));
    };

    const checkBadges = (justCompletedId) => {
      const milestone = CURRICULUM.find(m => m.lessons.some(l => l.id === justCompletedId));
      if (!milestone) return;
      const allDone = milestone.lessons.every(l => 
        user.completedLessons.includes(l.id) || l.id === justCompletedId
      );
      if (allDone && !user.badges.includes(milestone.id)) {
        setTimeout(() => {
          const badge = BADGES[milestone.id];
          if (!badge) return;
          playSoundSafe();
          fireConfetti();
          showPopup(`🌟 Badge Unlocked!\n${badge.name}`);
          setUser(prev => ({
            ...prev,
            badges: [...prev.badges, milestone.id]
          }));
        }, 1000);
      }

      const completedMilestones = CURRICULUM
      .filter(milestone =>
        milestone.lessons.every(lesson =>
          user.completedLessons.includes(lesson.id)
        )
      )
      .map(m => m.id);
      if (
        completedMilestones.length === CURRICULUM.length &&
        !user.badges.includes('master')
      ) {
        setTimeout(() => {
          const badge = BADGES['master'];
          playSoundSafe();
          fireConfetti();
          showPopup(`🏆 MASTER BADGE UNLOCKED!\n${badge.name}`);
          setUser(prev => ({
            ...prev,
            badges: [...prev.badges, 'master']
          }));
        }, 2000);
      }
    };

    const getProgress = (milestoneId) => {
      const milestone = CURRICULUM.find(m => m.id === milestoneId);
      if (!milestone) return 0;
      const completedCount = milestone.lessons.filter(l => user.completedLessons.includes(l.id)).length;
      return Math.round((completedCount / milestone.lessons.length) * 100);
    };

    const getCompletedMilestones = () => {
      return CURRICULUM.filter(milestone => 
        milestone.lessons.every(l => user.completedLessons.includes(l.id))
      ).map(m => m.id);
    };

    const getCurrentRank = () => {
      return getRankBasedOnMilestones(getCompletedMilestones());
    };

    const getCharacterImage = () => {
      const { equipped } = character;
      if (equipped.beanie && equipped.jacket) return beanieJacket;
      if (equipped.headphone && equipped.jacket) return headphoneJacket;
      if (equipped.beanie) return beanie;
      if (equipped.headphone) return headphone;
      if (equipped.jacket) return jacket;
      return base;
    };

    const getNextLesson = () => {
      if (!activeLesson) return;
      const index = ALL_LESSONS.findIndex(
        l => l.id === activeLesson.id
      );
      if (index === -1) return;
      const nextLesson = ALL_LESSONS[index + 1];
      if (nextLesson) {
        setActiveLesson(nextLesson);
      }
    };
    
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} clearActiveLesson={() => setActiveLesson(null)} character={character} getCharacterImage={getCharacterImage} />
      <Confetti active={showConfetti} />
      <main className="flex-1 overflow-y-auto relative">
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-cyan-600/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto h-full flex flex-col">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {activeTab === 'dashboard' ? 'Dashboard' : 
                 activeTab === 'learn' ? 'Choose Your Mission' : 
                 activeTab === 'character' ? 'Customize Your Avatar' :
                 activeTab === 'guide' ? 'Tutorial Mission' :
                 'My Profile'}
              </h1>
              <p className="text-slate-400">Ready to practice speaking, {user?.name || 'Guest'}?</p>
            </div>
            <div className="hidden md:flex items-center gap-4 bg-slate-900/50 p-2 pr-6 rounded-full border border-slate-800 backdrop-blur-md">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                  <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-cyan-400 transition-all duration-1000" strokeDasharray={`${(user.xp / user.xpToNext) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
                <span className="absolute font-bold text-sm text-white">{user.level}</span>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Next Level</div>
                <div className="text-sm font-semibold text-white">{user.xp} / {user.xpToNext} XP</div>
              </div>
            </div>
          </header>

          {/* CONTENT AREA */}
          {activeLesson ? (
              <LessonView 
                key={activeLesson.id}   // ⭐ WAJIB
                milestone={CURRICULUM.find(m =>
                  m.lessons.some(l => l.id === activeLesson?.id)
                )}
                lesson={activeLesson}
                completedLessons={user.completedLessons}
                saveScore={saveScore}
                user={user}
                onBack={() => setActiveLesson(null)}
                onComplete={(lessonId, xp) => completeLesson(lessonId, xp)}
                onNext={getNextLesson}
                showPopup={showPopup}
              />
            ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-800 rounded-3xl p-6 text-white shadow-lg shadow-cyan-900/20 relative overflow-hidden group">
                      <div className="relative z-10">
                        <div className="text-white-200 text-sm font-medium mb-1">XP Collected</div>
                        <div className="text-4xl font-bold">{user.xp}</div>
                        <div className="mt-4 flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                          <Flame className="w-5 h-5 text-orange-300" /> Top 5% Learners
                        </div>
                      </div>
                      <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Bot size={110} />
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                      <div className="text-slate-400 text-sm font-medium mb-1">Missions Completed</div>
                      <div className="text-4xl font-bold text-white">{user.completedLessons.length} <span className="text-xl text-slate-500">/ {CURRICULUM.reduce((acc, m) => acc + m.lessons.length, 0)}</span></div>
                      <div className="w-full bg-slate-700 h-2 mt-4 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-500 transition-all duration-1000" 
                          style={{ width: `${(user.completedLessons.length / CURRICULUM.reduce((acc, m) => acc + m.lessons.length, 0)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-blue-500 to-cyan-500 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                        <div className="text-slate-400 text-sm font-medium mb-3">Current Rank</div>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <span className="text-3xl">⭐</span>
                        </div>
                        <div className={`text-3xl font-bold mb-2`} style={{color: getCurrentRank().color.includes('slate') ? '#cbd5e1' : getCurrentRank().color.includes('orange') ? '#fb923c' : getCurrentRank().color.includes('blue') ? '#60a5fa' : getCurrentRank().color.includes('yellow') ? '#facc15' : getCurrentRank().color.includes('white') ? '#e2e8f0' : getCurrentRank().color.includes('cyan') ? '#06b6d4' : '#c084fc'}} >
                          {getCurrentRank().name}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4">Continue Your Journey</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-11">
                      {CURRICULUM.map(milestone => {
                        const progress = getProgress(milestone.id);
                        return (
                          <div key={milestone.id} className="bg-slate-900/50 border border-slate-800 hover:border-cyan-400/50 p-5 rounded-2xl flex items-center gap-4 group transition-all cursor-pointer" onClick={() => setActiveTab('learn')}>
                            <div className={`w-14 h-14 rounded-2xl ${milestone.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <milestone.icon className={`w-7 h-7 ${milestone.color}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <h3 className="font-bold text-slate-200">{milestone.title}</h3>
                                <span className="text-xs font-bold text-slate-400">{progress}%</span>
                              </div>
                              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className={`h-full ${milestone.progressColor} transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
                              </div>
                            </div>
                            <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'learn' && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300 pb-11">
                  {CURRICULUM.map((milestone, idx) => (
                    <div key={milestone.id} className="relative">
                      {idx !== CURRICULUM.length - 1 && (
                        <div className="absolute left-8 top-16 bottom-[-32px] w-1 bg-slate-800 -z-10"></div>
                      )}
                      <div className="flex gap-6">
                        <div className={`w-16 h-16 shrink-0 rounded-2xl ${milestone.bgColor} border border-slate-700 flex items-center justify-center shadow-lg z-10`}>
                          <milestone.icon className={`w-8 h-8 ${milestone.color}`} />
                        </div>
                        <div className="flex-1">
                          <h2 className={`text-2xl font-bold ${milestone.color} mb-1`}>{milestone.title}</h2>
                          <p className="text-slate-400 mb-6 max-w-2xl">{milestone.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {milestone.lessons.map((lesson, lIdx) => {
                              const isCompleted = user.completedLessons.includes(lesson.id);
                              const isUnlocked =
                              lIdx === 0 ||
                              user.completedLessons.includes(milestone.lessons[lIdx - 1].id);
                              return (
                                <button
                                  key={lesson.id}
                                  disabled={!isUnlocked}
                                  onClick={() => setActiveLesson(lesson)}
                                  className={`relative p-5 rounded-2xl border text-left transition-all duration-300 group overflow-hidden ${
                                    isCompleted 
                                      ? 'bg-slate-900/40 border-cyan-500/30' 
                                      : isUnlocked 
                                        ? 'bg-slate-900 border-slate-700 hover:border-cyan-400 hover:bg-slate-800 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-900/10' 
                                        : 'bg-slate-950 border-slate-900 opacity-60 cursor-not-allowed grayscale'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <div className="absolute top-3 right-3 text-cyan-400">
                                      <CheckCircle className="w-5 h-5" />
                                    </div>
                                  ) : !isUnlocked ? (
                                    <div className="absolute top-3 right-3 text-slate-600">
                                      <Lock className="w-5 h-5" />
                                    </div>
                                  ) : null}
                                  <div className="mb-3 inline-flex p-2 rounded-lg bg-slate-800/50">
                                    <Play className={`w-4 h-4 ${isUnlocked ? 'text-white' : 'text-slate-600'}`} />
                                  </div>
                                  <h3 className="font-bold text-slate-200 mb-1">{lesson.title}</h3>
                                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
                                    <span>Task: {lesson.taskType}</span>
                                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                    <span className="text-cyan-400">+{lesson.xpReward} XP</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'character' && (
                <CharacterView
                  user={user}
                  character={character}
                  setCharacter={setCharacter}
                  spendCoins={spendCoins}
                  getCharacterImage={getCharacterImage}
                  showPopup={showPopup}
                />
              )}
              {activeTab === 'profile' && (
                <div className="animate-in slide-in-from-right-8 duration-500 pb-11">
                  <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 mb-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-1">
                        <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center overflow-hidden">
                          <img src={getCharacterImage()} alt="Character" className="w-32 h-32" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0 bg-emerald-500 w-8 h-8 rounded-full border-4 border-slate-900 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>    
                    <div className="text-center md:text-left flex-1">
                      <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
                      
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-violet-500/20 font-bold text-sm">Level {user.level}</span>
                        <span className="px-4 py-2 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold text-sm">{user.xp} Total XP</span>
                        <span className="rank-label px-4 py-2 rounded-full font-bold text-sm border border-orange-500/20" style={{backgroundColor: `${getCurrentRank().color}20`, borderColor: `${getCurrentRank().color}40`}}>🎖️ {getCurrentRank().name}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Award className="text-yellow-500" />
                    Koleksi Badge
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(BADGES).map(([key, badge]) => {
                      const isUnlocked = user.badges.includes(key);
                      return (
                        <div key={key} className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-4 text-center transition-all ${
                          isUnlocked 
                            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl shadow-black/20' 
                            : 'bg-slate-900/30 border border-slate-800/50 opacity-50 grayscale'
                        }`}>
                          <div className={`w-16 h-16 rounded-full mb-4 flex items-center justify-center ${isUnlocked ? 'bg-slate-800 shadow-inner' : 'bg-slate-900'}`}>
                            <badge.icon className={`w-8 h-8 ${isUnlocked ? badge.color : 'text-slate-600'}`} />
                          </div>
                          <h4 className={`font-bold ${isUnlocked ? 'text-white' : 'text-slate-600'}`}>{badge.name}</h4>
                          <p className="text-xs text-slate-500 mt-2">{isUnlocked ? 'Unlocked' : 'Locked'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {activeTab === 'guide' && (
                <div className="animate-in fade-in duration-500 space-y-8 pb-10">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setGuideLang(prev => prev === 'en' ? 'id' : 'en')}
                      className="px-4 py-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/30 transition"
                    >
                      🌐 Translate: {guideLang === 'en' ? 'EN' : 'ID'}
                    </button>
                  </div>
                  {/* LEARNING Outcomes*/}
                  <h6 className="text-2xl font-medium text-white flex items-center gap-2">
                    <ClipboardCheck className="w-8 h-8 text-yellow-500" /> {guideLang === 'en' ? 'Learning Outcomes' : 'Capaian Pembelajaran'}
                  </h6>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
                    <div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {guideLang === 'en'
                          ? `At the end of Phase F, students are able to use English orally to introduce themselves, describe situations based on images, and express, ask for, and respond to suggestions confidently using understandable language.`
                          : `Pada akhir fase F, peserta didik mampu menggunakan bahasa Inggris secara lisan untuk memperkenalkan diri, mendeskripsikan situasi melalui gambar, serta menyampaikan, meminta, dan merespons saran dengan percaya diri dan bahasa yang dapat dipahami.`}
                      </p>
                    </div>
                  </div>
                  {/* LEARNING Objectives*/}
                  <h6 className="text-2xl font-medium text-white flex items-center gap-2">
                    <ListCheck className="w-8 h-8 text-yellow-500" /> {guideLang === 'en' ? 'Learning Objectives' : 'Tujuan Pembelajaran'}
                  </h6>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
                    <div>
                      <ol className="list-decimal pl-5 text-slate-300 text-sm space-y-2 leading-relaxed">
                        <li>
                          {guideLang === 'en'
                            ? `Students are able to identify and use appropriate expressions for asking and giving suggestions through material exploration, speaking practice on the Speakai website, and role play accurately and contextually.`
                            : `Peserta didik mampu mengidentifikasi dan menggunakan ungkapan yang tepat dalam meminta dan memberikan saran melalui kegiatan eksplorasi materi, latihan speaking pada website Speakai, serta role play dengan benar dan sesuai konteks.`}
                        </li>
                        <li>
                          {guideLang === 'en'
                            ? `Students are able to respond to suggestions in simple conversational situations through gamified speaking practice on the Speakai website using appropriate and understandable expressions.`
                            : `Peserta didik mampu merespons saran dalam situasi percakapan sederhana melalui latihan speaking berbasis gamifikasi pada website Speakai dengan menggunakan ungkapan yang tepat dan dapat dipahami.`}
                        </li>
                        <li>
                          {guideLang === 'en'
                            ? `Students are able to express ideas or opinions related to a problem through AI-based speaking interaction on the Speakai website in a structured, confident, and understandable manner.`
                            : `Peserta didik mampu menyampaikan ide atau pendapat terkait suatu masalah melalui latihan speaking berbasis interaksi dengan AI pada website Speakai secara runtut, percaya diri, dan bahasa yang dapat dipahami.`}
                        </li>
                      </ol>
                    </div>
                  </div>
                  {/* NAVIGATION GUIDE GRID */}
                  <h6 className="text-2xl font-medium text-white flex items-center gap-2">
                    <Key className="w-8 h-8 text-yellow-500" /> Navigation Speakai
                  </h6>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[
                      {
                        id: 'dashboard',
                        icon: Bot,
                        label: 'Dashboard',
                        color: 'text-cyan-400',
                        bg: 'bg-cyan-600/10',
                        descEN: [
                          'View your total XP progress',
                          'Track completed missions',
                          'See your learning journey progress',
                          'Monitor each mission progress'
                        ],
                        descID: [
                          'Melihat total XP',
                          'Melihat misi yang sudah selesai',
                          'Melihat progress belajar',
                          'Memantau progress tiap misi'
                        ]
                      },
                      {
                        id: 'quests',
                        icon: Trophy,
                        label: 'Quests',
                        color: 'text-cyan-400',
                        bg: 'bg-cyan-600/10',
                        descEN: [
                          'Follow missions from Pre-test to Post-test',
                          'Complete lessons step by step',
                          'Earn XP and coins',
                          'Unlock badges after completing missions'
                        ],
                        descID: [
                          'Mengerjakan misi dari Pretest sampai Posttest',
                          'Selesaikan lesson secara berurutan',
                          'Dapatkan XP dan coins',
                          'Unlock badge setelah menyelesaikan misi'
                        ]
                      },
                      {
                        id: 'character',
                        icon: Shirt,
                        label: 'Character',
                        color: 'text-cyan-400',
                        bg: 'bg-cyan-600/10',
                        descEN: [
                          'Customize your avatar',
                          'Buy accessories from the shop',
                          'Use coins to purchase items',
                          'Equip items to your character'
                        ],
                        descID: [
                          'Mengatur avatar',
                          'Membeli aksesoris di shop',
                          'Menggunakan coins',
                          'Memakai item ke avatar'
                        ]
                      },
                      {
                        id: 'profile',
                        icon: User,
                        label: 'Profile',
                        color: 'text-cyan-400',
                        bg: 'bg-cyan-600/10',
                        descEN: [
                          'View your avatar',
                          'Check total XP and level',
                          'See your rank system',
                          'View collected badges'
                        ],
                        descID: [
                          'Melihat avatar',
                          'Melihat total XP dan level',
                          'Melihat rank system',
                          'Melihat badge yang dimiliki'
                        ]
                      },
                      {
                        id: 'guide',
                        icon: BookOpen,
                        label: 'Guide',
                        color: 'text-cyan-400',
                        bg: 'bg-cyan-600/10',
                        descEN: [
                          'Learn how to use Speakai',
                          'Understand each feature',
                          'Follow tutorial steps',
                          'Improve your learning experience'
                        ],
                        descID: [
                          'Panduan penggunaan Speakai',
                          'Memahami fitur',
                          'Mengikuti tutorial',
                          'Meningkatkan pengalaman belajar'
                        ]
                      },
                      {
                        id: 'logout',
                        icon: LogOut,
                        label: 'Logout',
                        color: 'text-red-400',
                        bg: 'bg-red-500/10',
                        descEN: [
                          'Log out from your account',
                          'Clear your session',
                          'Return to landing page'
                        ],
                        descID: [
                          'Keluar dari akun',
                          'Menghapus sesi login',
                          'Kembali ke halaman awal'
                        ]
                      }
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-400/40 transition group"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                          </div>
                          <span className={`font-medium ${item.color}`}>{item.label}</span>
                        </div>
                        <ul className="text-slate-300 text-sm space-y-1">
                          {(guideLang === 'en' ? item.descEN : item.descID).map((text, i) => (
                            <li key={i} className="flex gap-2">
                              <span className={`${item.color}`}>▸</span>
                              <span>{text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-6">
                    <h6 className="text-2xl font-medium text-white flex items-center gap-2">
                    <Gamepad2 className="w-8 h-8 text-yellow-500" /> Mission Speakai Guide
                    </h6>
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {/* SPEAKING */}
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-400/40 transition">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10">
                            <Mic className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span className="font-medium text-cyan-400">
                            Speaking Practice
                          </span>
                        </div>
                        {/* LIST */}
                        <ul className="list-disc marker:text-cyan-400 pl-5 text-slate-300 text-sm space-y-1">
                          {guideLang === 'en' ? (
                            <>
                              <li>Click <b className="text-emerald-600">Start Speaking</b> to begin</li>
                              <li>Speak clearly using your microphone</li>
                              <li>Click <b className="text-red-500">End</b> when finished</li>
                              <li>
                                Wait for{" "}
                                <span className="animate-pulse text-yellow-300 font-semibold">
                                  Speakai is analyzing your speaking...
                                </span>
                              </li>
                              <li>Get AI feedback and score</li>
                            </>
                          ) : (
                            <>
                              <li>Klik <b className="text-emerald-600">Start Speaking</b></li>
                              <li>Bicara dengan jelas</li>
                              <li>Klik <b className="text-red-500">End</b></li>
                              <li>
                                Tunggu{" "}
                                <span className="animate-pulse text-yellow-300 font-semibold">
                                  Speakai is analyzing your speaking...
                                </span>
                              </li>
                              <li>Dapatkan feedback AI</li>
                            </>
                          )}
                        </ul>
                        {/* BUTTON */}
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition text-white text-sm font-semibold shadow-md">
                            Start Speaking
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 transition text-white text-sm font-semibold shadow-md">
                            End
                          </button>
                        </div>
                      </div>
                      {/* PRONUNCIATION */}
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-blue-400/40 transition">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10">
                            <Volume2 className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span className="font-medium text-cyan-400">
                            Pronunciation Practice
                          </span>
                        </div>
                        <ul className="list-disc marker:text-cyan-400 pl-5 text-slate-300 text-sm space-y-1"></ul>
                        <ul className="list-disc marker:text-cyan-400 pl-5 text-slate-300 text-sm space-y-1">
                          {guideLang === 'en' ? (
                            <>
                              <li>Click <b className="text-emerald-600">Start Speaking</b> to begin</li>
                              <li>Use <b className="text-cyan-700">Listen Again</b> to replay audio</li>
                              <li>Speak clearly and follow the example</li>
                              <li>Click <b className="text-emerald-600">Next Word</b> to continue</li>
                              <li>Click <b className="text-emerald-600">Try Again</b> to repeat</li>
                              <li>Click <b className="text-red-500">End</b> to finish</li>
                            </>
                          ) : (
                            <>
                              <li>Klik <b className="text-emerald-600">Start Speaking</b> untuk mulai</li>
                              <li>Gunakan <b className="text-cyan-700">Listen Again</b> untuk mendengar ulang</li>
                              <li>Ucapkan dengan jelas</li>
                              <li>Klik <b className="text-emerald-600">Next Word</b> untuk lanjut</li>
                              <li>Klik <b className="text-emerald-600">Try Again</b> untuk mengulang</li>
                              <li>Klik <b className="text-red-500">End</b> untuk selesai</li>
                            </>
                          )}
                        </ul>
                        <div className="flex flex-wrap items-center gap-2 mt-4">
                          <div className="px-4 py-2 min-h-[36px] flex items-center rounded-xl bg-emerald-600 text-white text-sm font-medium">
                            Start Speaking
                          </div>
                          <div className="px-4 py-2 min-h-[36px] flex items-center justify-center gap-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 transition text-white text-sm font-medium"> 
                            <Volume2 className="w-4 h-4 text-white" /> Listen Again
                          </div>
                          <div className="px-4 py-2 min-h-[36px] flex items-center rounded-xl bg-emerald-600 text-white text-sm font-medium">
                            Next Word
                          </div>
                          <div className="px-4 py-2 min-h-[36px] flex items-center rounded-xl bg-emerald-600 text-white text-sm font-medium">
                            Try Again
                          </div>
                          <div className="px-4 py-2 min-h-[36px] flex items-center rounded-xl bg-red-500 text-white text-sm font-medium">
                            End
                          </div>
                        </div>
                      </div>
                      {/* LEARNING FLOW */}
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-400/40 transition">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10">
                            <Map className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span className="font-medium text-cyan-400">
                            Learning Journey
                          </span>
                        </div>
                        <ul className="list-disc marker:text-cyan-400 pl-5 text-slate-300 text-sm space-y-1">
                          {guideLang === 'en' ? (
                            <>
                              <li>Start with <b>Study Module</b></li>
                              <li>Read and understand material</li>
                              <li>Click{" "}
                              <b className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                Complete Study Session
                              </b></li>
                              <li>Continue to{" "}
                              <b className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                Next Lesson
                              </b></li>
                              <li>Then do Pronunciation & Speaking</li>
                            </>
                          ) : (
                            <>
                              <li>Mulai dari <b>Study</b></li>
                              <li>Baca materi</li>
                              <li>Klik{" "}
                                <b className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                Complete Study Session
                              </b></li>
                              <li>Klik{" "}
                                <b className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                Next Lesson
                              </b></li>
                              <li>Lanjut Pronunciation & Speaking</li>
                            </>
                          )}
                        </ul>
                        <div className="flex flex-wrap items-center gap-2 mt-4">
                          <div className="px-4 py-2 min-h-[36px] flex items-center rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium">
                            Complete Study Session
                          </div>
                          <div className="px-4 py-2 min-h-[36px] flex items-center rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium">
                            Next Lesson
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                  <h6 className="text-2xl font-medium text-white flex items-center gap-2">
                    <Rocket className="w-7 h-7 text-yellow-500" /> Start Learning with Speakai
                  </h6>
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {/* PRETEST */}
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-400/40 transition">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10">
                            <ClipboardCheck className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span className="font-medium text-cyan-400">
                            Pre-Test
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm">
                          {guideLang === 'en'
                            ? 'Pre-test is used to measure your initial speaking ability before starting the learning journey.'
                            : 'Pretest digunakan untuk mengukur kemampuan awal speaking sebelum belajar.'}
                        </p>
                      </div>
                      {/* JOURNEY */}
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-400/40 transition">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10">
                            <Flag className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span className="font-medium text-cyan-400">
                            Mission Journey
                          </span>
                        </div>
                        <ul className="list-disc marker:text-cyan-400 pl-5 text-slate-300 text-sm space-y-1">
                          {guideLang === 'en' ? (
                            <>
                              <li>Each level has structured missions</li>
                              <li>Module: learn the material</li>
                              <li>Pronunciation: practice speaking words</li>
                              <li>Speaking Practice: practice with AI</li>
                            </>
                          ) : (
                            <>
                              <li>Setiap level memiliki misi</li>
                              <li>Module: belajar materi</li>
                              <li>Pronunciation: latihan pengucapan</li>
                              <li>Speaking: latihan berbicara</li>
                            </>
                          )}
                        </ul>
                      </div>
                      {/* POSTTEST */}
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-400/40 transition">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10">
                            <Award className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span className="font-medium text-cyan-400">
                            Post-Test
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm">
                          {guideLang === 'en'
                            ? 'Post-test evaluates your final speaking ability after completing all missions.'
                            : 'Posttest digunakan untuk evaluasi akhir setelah menyelesaikan semua misi.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* EARN REWARDS */}
                  <h6 className="text-2xl font-medium text-white flex items-center gap-2">
                    <Trophy className="w-7 h-7 text-yellow-500" /> Earn Rewards
                  </h6>
                  <div className="mt-10 grid md:grid-cols-3 gap-6">
                    {/* XP & LEVEL */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-400/40 transition">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10">
                            <Zap className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span className="font-medium text-cyan-400">
                            XP & Level
                          </span>
                        </div>
                      <ul className="list-disc marker:text-cyan-400 pl-5 text-slate-300 text-sm space-y-1">
                        {guideLang === 'en' ? (
                          <>
                            <li>Earn XP from completing missions</li>
                            <li>Level up when XP is fulfilled</li>
                            <li>Unlock new content</li>
                          </>
                        ) : (
                          <>
                            <li>Dapatkan XP dari menyelesaikan misi</li>
                            <li>Naik level jika XP terpenuhi</li>
                            <li>Membuka konten baru</li>
                          </>
                        )}
                      </ul>
                    </div>
                    {/* BADGES */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-400/40 transition">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10">
                            <Star className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span className="font-medium text-cyan-400">
                            Badge & rank
                          </span>
                        </div>
                      <ul className="list-disc marker:text-cyan-400 pl-5 text-slate-300 text-sm space-y-1">
                        {guideLang === 'en' ? (
                          <>
                            <li>Earn badges from achievements</li>
                            <li>Increase your rank system</li>
                            <li>Show your learning progress</li>
                          </>
                        ) : (
                          <>
                            <li>Dapatkan badge dari pencapaian</li>
                            <li>Tingkatkan sistem rank</li>
                            <li>Tampilkan progres belajarmu</li>
                          </>
                        )}
                      </ul>
                    </div>
                    {/* COINS */}
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-400/40 transition">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/10">
                            <Theater className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span className="font-medium text-cyan-400">
                            Coins & Avatar
                          </span>
                        </div>
                      <ul className="list-disc marker:text-cyan-400 pl-5 text-slate-300 text-sm space-y-1">
                        {guideLang === 'en' ? (
                          <>
                            <li>XP can be converted into coins</li>
                            <li>Buy avatar accessories</li>
                            <li>Customize your character</li>
                          </>
                        ) : (
                          <>
                            <li>XP dikonversi menjadi koin</li>
                            <li>Beli aksesoris avatar</li>
                            <li>Kustomisasi karakter kamu</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                  {/* FINAL TIP */}
                  <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 p-6 rounded-2xl border border-cyan-500/30 text-center">
                    <h3 className="grid place-items-center text-lg font-medium text-white mb-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-6 h-6 text-yellow-500" />
                        {guideLang === 'en' ? 'Pro Tips' : 'Tips Penting'}
                      </div>
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {guideLang === 'en'
                        ? 'Use your microphone, practice daily, and stay consistent to improve your speaking skills faster!'
                        : 'Gunakan microphone, latihan rutin, dan konsisten agar kemampuan speaking meningkat!'}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
          <div className={`
            relative w-80 p-6 rounded-2xl text-center
            backdrop-blur border
            transform transition-all duration-300 animate-popupIn bg-slate-900/95 border-cyan-500/20
            ${popup.type === "master"
              ? "bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-yellow-400 shadow-yellow-500/30"
              : "bg-slate-900/95 border-cyan-500/20"}
          `}>
              <div className="flex justify-end mb-2">
              <button
                onClick={() => setPopup({ show: false, message: "", type: "default" })}
                className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition"
              >
                ✕
              </button>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {popup.type === "master" ? "MASTER ACHIEVEMENT!" : "Notification"}
            </h2>
            <p className="text-sm text-slate-200 whitespace-pre-line">
              {popup.message}
            </p>
          </div>
        </div>
      )}
    </div>
    );
  }

  return <LandingPageInfo onGetStarted={handleGetStarted} />;
}

export default App;