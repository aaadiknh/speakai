import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Theater, Star, CheckCircle, Sparkles,Twitter, Linkedin, Gauge, Volume2, Brain, ClipboardCheck, User, BookOpen, MessageCircle, MessageSquare, Award, Mic, Bot, Github, } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  const [scrollY, setScrollY] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const skills = [
  { label: 'Fluency', gradient: 'from-pink-500 to-rose-500' },
  { label: 'Grammar', gradient: 'from-blue-500 to-cyan-500' },
  { label: 'Vocabulary', gradient: 'from-emerald-500 to-teal-500' },
  { label: 'Pronunciation', gradient: 'from-purple-500 to-indigo-500' },
  { label: 'Comprehension', gradient: 'from-yellow-400 to-orange-500' },
  ];

  const roadmap = [
    { title: 'Pre-Test', icon: ClipboardCheck, desc: 'Baseline Speaking Skill', gradient: "from-red-500 to-orange-400", },
    { title: 'Personal Introduction', icon: User, desc: 'Guided Speaking', gradient: "from-orange-500 to-yellow-400", },
    { title: 'Picture Description', icon: BookOpen, desc: 'Picture-based speaking', gradient: "from-yellow-400 to-green-500", },
    { title: 'Role Play', icon: Mic, desc: 'Controlled Conversation', gradient: "from-green-400 to-blue-500", },
    { title: 'Problem Solving', icon: MessageCircle, desc: 'Free Speaking', gradient: "from-blue-700 to-cyan-500", },
    { title: 'Post-Test', icon: Award, desc: 'Evaluation', gradient: "from-cyan-400 to-purple-600", },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden font-sans selection:bg-blue-500 selection:text-white relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/40 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/30 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-400 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-cyan-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-white"
              >
                <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z"/>
                <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11z"/>
                <rect x="7" y="3" width="10" height="8" rx="2" ry="2" opacity="0.25"/>
                <circle cx="10" cy="7" r="1"/>
                <circle cx="14" cy="7" r="1"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Speakai</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#roadmap" className="hover:text-white transition-colors">Learning Path</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#startLearning" className="hover:text-white transition-colors">Start Learning</a>
          </div>
          <button onClick={onGetStarted} className="relative group px-6 py-2.5 rounded-full font-bold text-sm overflow-hidden bg-white text-slate-900 transition-all hover:scale-105 hover:shadow-cyan-400/60 shadow-lg">
            <span className="relative z-10">Log In / Register</span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-cyan-100 to-blue-100 opacity-70 group-hover:opacity-70 transition-opacity"></div>
          </button>
        </div>
      </nav>
      <section className="relative pt-40 pb-20 px-11">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-cyan-500/30 text-blue-300 text-xs font-semibold mb-6 backdrop-blur-sm shadow-lg shadow-cyan-900/20">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>Practice English Speaking with Your AI Partner</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Level Up Your English Speaking Skills <br/>
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-800 via-green-400 to-blue-400 animate-color-shift bg-300%">
                  with an AI Voice Chatbot
                </span>
              </span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
              Learn English speaking step by step through guided learning materials, AI voice practice, and gamified levels. Starting with a pre-test and ending with a post-test to track your progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onGetStarted} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-cyan-200/20 ring-2 ring-blue-500/20 ring-offset-2 ring-offset-blue-950">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => document.getElementById("roadmap").scrollIntoView({ behavior: "smooth" })
                } className="px-8 py-4 bg-blue-900/10 hover:bg-blue-800/20 border border-blue-700/20 rounded-xl font-semibold transition-all hover:border-cyan-500/50">
                Explore Learning Levels
              </button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs text-white overflow-hidden shadow-lg">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+5}`} alt="user" />
                  </div>
                ))}
              </div>
              <p>Join 10.000+ Active Learners</p>
            </div>
          </div>
          <div className="relative group perspective-1000 hidden lg:block z-10">
            <div className="p-6 flex flex-col items-center justify-center gap-6 text-slate-200">
              <div className="relative">
                <div
                  className="w-28 h-28 rounded-full 
                  bg-gradient-to-br from-purple-500 to-blue-500 
                  flex items-center justify-center 
                  shadow-[0_0_45px_rgba(168,85,247,0.9)]"
                >
                  <span className="text-5xl">🤖</span>
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                  px-3 py-1 text-xs 
                  bg-green-500 text-black rounded-full">
                  AI SPEAKAI
                </span>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-6 py-4 text-center max-w-md">
                <p className="text-sm text-slate-400">AI Speaking Partner</p>
                <p className="mt-2 text-lg font-semibold">
                  “Hello! Let’s practice your English 🎧”
                </p>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="w-1 h-5 bg-slate-400 animate-wave"></span>
                <span className="w-1 h-3 bg-slate-400 animate-wave delay-100"></span>
                <span className="w-1 h-6 bg-slate-400 animate-wave delay-200"></span>
                <span className="w-1 h-4 bg-slate-400 animate-wave delay-300"></span>
                <span className="w-1 h-5 bg-slate-400 animate-wave delay-400"></span>
              </div>
              <div className="flex gap-4 mt-4">
                <button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 transition font-semibold">
                  🎙 Speak
                </button>
                <button className="px-6 py-3 rounded-full bg-slate-700 hover:bg-slate-600 transition">
                  🔊 Listen
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap" className="py-24 px-11 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Learning Journey to Confident English
          </h2>
          <p className="text-slate-400">
            Progress through levels and build speaking confidence with AI.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {roadmap.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="
                h-full p-6 rounded-2xl
                bg-blue-900/20 backdrop-blur
                border border-slate-700/50
                transition-all duration-300
                group-hover:-translate-y-2
                group-hover:border-cyan-400/40
                group-hover:shadow-xl
                group-hover:shadow-cyan-900/30
              ">
                <div className={`
                  w-12 h-12 mb-4 rounded-xl
                  bg-gradient-to-br ${item.gradient}
                  flex items-center justify-center
                  shadow-lg
                `}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="absolute top-5 right-5 text-white font-black text-4xl">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-300">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-24 bg-slate-900/30 px-11 relative border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <span className="text-cyan-400 font-semibold tracking-wider text-sm uppercase">Key Features</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">Learn Faster & More Effectively</h2>
              <p className="text-slate-400 mb-6">Our method is designed to keep learning engaging and help you retain what you practice.</p>
            </div>
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
              {[
                { icon: Zap, title: "XP System", desc: "Earn XP from every activity, challenge, and speaking practice you complete." },
                { icon: Star, title: "Level Progression", desc: "Advance through levels step by step, unlocking new lessons and challenges as you grow." },
                { icon: Bot, title: "AI Speaking Feedback", desc: "Get instant AI feedback on your pronunciation, grammar, vocabulary, fluency, and comprehension to help you speak English more confidently." },
                { icon: Theater, title: "Avatar Customization", desc: "Customize your avatar as you level up and unlock new rewards." },
              ].map((f, i) => (
                <div key={i} className="group bg-slate-950/80 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-900 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/10">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <f.icon className="w-6 h-6 text-white
                    group-hover:text-yellow-400 transition-colors" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 group-hover:text-white transition-colors">{f.title}</h4>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          How Your Speaking Is Assessed
        </h2>
        <p className="text-slate-400 max-w-3xl mx-auto mb-16">
          Your speaking performance is automatically evaluated by AI during the
          pre-test and post-test to measure your improvement in each speaking aspect.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-gradient-to-b from-[#0f172a] to-[#020617]
            border border-slate-800 rounded-2xl
            p-6 flex flex-col items-center
            transition-all duration-300
            hover:-translate-y-2
            hover:border-cyan-400/40
            hover:shadow-xl
            hover:shadow-cyan-900/30">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4
              bg-gradient-to-b from-cyan-400 to-purple-600">
              <Gauge className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-white mb-1">Fluency</h4>
            <p className="text-sm text-slate-400">Speech flow & pace</p>
          </div>
          <div className="bg-gradient-to-b from-[#0f172a] to-[#020617]
            border border-slate-800 rounded-2xl
            p-6 flex flex-col items-center
            transition-all duration-300
            hover:-translate-y-2
            hover:border-cyan-400/40
            hover:shadow-xl
            hover:shadow-cyan-900/30">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4
              bg-gradient-to-br from-blue-700 to-cyan-500">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-white mb-1">Grammar</h4>
            <p className="text-sm text-slate-400">Sentence structure</p>
          </div>
          <div className="bg-gradient-to-b from-[#0f172a] to-[#020617]
            border border-slate-800 rounded-2xl
            p-6 flex flex-col items-center
            transition-all duration-300
            hover:-translate-y-2
            hover:border-cyan-400/40
            hover:shadow-xl
            hover:shadow-cyan-900/30">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4
              bg-gradient-to-br from-green-400 to-blue-500">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-white mb-1">Vocabulary</h4>
            <p className="text-sm text-slate-400">Word choice & range</p>
          </div>
          <div className="bg-gradient-to-b from-[#0f172a] to-[#020617]
            border border-slate-800 rounded-2xl
            p-6 flex flex-col items-center
            transition-all duration-300
            hover:-translate-y-2
            hover:border-cyan-400/40
            hover:shadow-xl
            hover:shadow-cyan-900/30">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4
              bg-gradient-to-br from-yellow-400 to-green-500">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-white mb-1">Pronunciation</h4>
            <p className="text-sm text-slate-400">Clarity & accent</p>
          </div>
          <div className="bg-gradient-to-b from-[#0f172a] to-[#020617]
            border border-slate-800 rounded-2xl
            p-6 flex flex-col items-center
            transition-all duration-300
            hover:-translate-y-2
            hover:border-cyan-400/40
            hover:shadow-xl
            hover:shadow-cyan-900/30">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4
              bg-gradient-to-br from-orange-500 to-yellow-400">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-white mb-1">Comprehension</h4>
            <p className="text-sm text-slate-400">Understanding</p>
          </div>
        </div>
      </section>

      <section id="startLearning" className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-purple-600 to-blue-700 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden group shadow-2xl shadow-purple-900/50">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-white/10 rotate-45 animate-pulse-slow pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to see how much your English speaking skills can improve?</h2>
            <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">Start your journey today and unlock your full speaking potential with AI-powered learning.</p>
            <button onClick={onGetStarted} className="px-10 py-4 bg-white text-slate-900 hover:bg-slate-50 rounded-[30px] font-bold text-lg shadow-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-cyan-400/20 mx-auto ">
              <span className="text-xl">🚀</span>
              Take the Pre-Test Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-11 text-sm relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg bg-gradient-to-br from-purple-600 to-cyan-400 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z"/>
                  <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11z"/>
                </svg>
              </div>
              <span className="text-lg font-bold">Speakai</span>
            </div>
            <p className="text-slate-500 max-w-xs">An AI-powered English speaking platform that helps you build confidence through interactive voice conversations and gamified practice.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-slate-200">Learn</h4>
            <ul className="space-y-2 text-slate-500">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Personal Introduction</a></li>
              <li><a href="#" className="hover:text-cyan-500 transition-colors">Picture Description</a></li>
              <li><a href="#" className="hover:text-cyan-500 transition-colors">Role Play</a></li>
              <li><a href="#" className="hover:text-cyan-500 transition-colors">Problem Solving</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-slate-200">Company</h4>
            <ul className="space-y-2 text-slate-500">
              <li><a href="#" className="hover:text-cyan-500 transition-colors">About Speakai</a></li>
              <li><a href="#" className="hover:text-cyan-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-cyan-500 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-slate-600">
          <p>&copy; 2026 Speakai. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Github className="w-5 h-5 hover:text-cyan-500 cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 hover:text-cyan-500 cursor-pointer transition-colors" />
            <Linkedin className="w-5 h-5 hover:text-cyan-500 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>

      <style>{`
        html {
          scroll-behavior: smooth;
        }
        
        .bg-300% {
          background-size: 300% auto;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      
        @keyframes wave {
          0%, 100% { height: 10px; }
          50% { height: 22px; }
        }

        .animate-wave {
          animation: wave 1s infinite ease-in-out;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes colorShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes shineSlow {
          0% {
            left: -100%;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-gradient-text {
          animation: gradientMove 6s ease infinite;
        }

        .animate-color-shift {
          background-size: 200% 200%;
          animation: colorShift 4s ease-in-out infinite;
        }

        .animate-shine-slow {
          animation: shineSlow 3.5s ease-in-out infinite;
        }

        .animate-cursor-blink {
          animation: blink 1s step-end infinite;
        }
      `}
      </style>
    </div>
  );
}