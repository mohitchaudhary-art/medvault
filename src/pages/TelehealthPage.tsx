import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, 
  MessageSquare, FileText, ShieldCheck, Sparkles, Activity, Maximize2, RefreshCw, Stethoscope, User 
} from 'lucide-react';

interface TelehealthPageProps {
  appointmentId: string;
  onEndCall: () => void;
}

export const TelehealthPage: React.FC<TelehealthPageProps> = ({ appointmentId, onEndCall }) => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  const [callDuration, setCallDuration] = useState(0);

  const [chatMessages, setChatMessages] = useState([
    { sender: 'Dr. Ananya Sharma', text: 'Hello Rohan, I am reviewing your recent ECG and lipid report.', time: '10:31 AM' },
    { sender: 'Rohan Verma', text: 'Thank you doctor, I felt slight tightness after yesterday run.', time: '10:32 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg) return;
    setChatMessages([
      ...chatMessages,
      { sender: 'You', text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputMsg('');
  };

  return (
    <div className="min-h-[85vh] max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-4 animate-fade-in">
      
      {/* Top Header Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>HD WebRTC Telehealth Teleconferencing</span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-mono">
                {appointmentId}
              </span>
            </h2>
            <p className="text-[10px] text-slate-400">Encrypted P2P Media Stream • Latency: 18ms • 1080p HD</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold">
          <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
            REC {formatDuration(callDuration)}
          </span>
          <button
            onClick={onEndCall}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-sans font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </div>

      {/* Main Video & Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[65vh]">
        
        {/* Left: Main Video Stage */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-2xl bg-radial-gradient">
          
          {/* Doctor Stream Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-white">Dr. Rajesh Nair</span>
            <span className="text-[10px] text-cyan-400 font-mono font-semibold">1080p HD Live Stream</span>
          </div>

          {/* Doctor Video Stream Canvas (Stock Photos Removed) */}
          {cameraOn ? (
            <div className="text-center space-y-4 animate-fade-in p-6">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full gradient-bg p-1 mx-auto shadow-2xl shadow-cyan-500/30 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-extrabold text-3xl border border-cyan-500/40">
                  <Stethoscope className="w-12 h-12 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-base font-extrabold text-white">Dr. Rajesh Nair</p>
                <p className="text-xs text-cyan-400 font-medium">Senior Cardiologist & Internal Medicine</p>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>WebRTC Encrypted HD Video Feed Active</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <VideoOff className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-slate-300">Doctor Camera Video Paused</p>
              <p className="text-xs text-slate-500">Audio stream remains active</p>
            </div>
          )}

          {/* Self PiP Local Camera Preview (Stock Photos Removed) */}
          <div className="absolute bottom-4 right-4 w-44 h-32 rounded-2xl bg-slate-900/90 border-2 border-cyan-500/50 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-3 text-center backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-sm mb-1.5">
              <User className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-[11px] font-bold text-white">You (Patient)</span>
            <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Local Video Feed
            </span>
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3 rounded-full transition-colors cursor-pointer ${
                micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500 text-white'
              }`}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`p-3 rounded-full transition-colors cursor-pointer ${
                cameraOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500 text-white'
              }`}
            >
              {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setScreenSharing(!screenSharing)}
              className={`p-3 rounded-full transition-colors cursor-pointer ${
                screenSharing ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Monitor className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Side Chat & Notes Drawer */}
        <div className="lg:col-span-4 glass-card border border-slate-800 rounded-3xl flex flex-col overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-center cursor-pointer ${
                activeTab === 'chat' ? 'border-b-2 border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
              }`}
            >
              Live Telehealth Chat
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3 text-center cursor-pointer ${
                activeTab === 'notes' ? 'border-b-2 border-cyan-500 text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
              }`}
            >
              Doctor Notes & Rx
            </button>
          </div>

          {/* Chat Panel */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden space-y-4">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-cyan-400">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder=""
                  autoComplete="off"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl gradient-bg text-white font-semibold text-xs"
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {/* Notes Panel */}
          {activeTab === 'notes' && (
            <div className="p-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="font-bold text-cyan-400 uppercase text-[10px]">Real-time Clinical Observation</p>
                <p className="text-slate-300">Patient reports intermittent chest tightness during workouts. Advised lipid panel & resting ECG.</p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
