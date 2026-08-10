'use client';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/useStore';
import { db } from '../../lib/database';
import {
 Trophy, Users, Layers, BadgeAlert, ArrowRight,
 Code2, Palette, Gamepad2, Globe, Sparkles, BookOpen, Cpu, Search, Filter,
 X, Calendar, MapPin, ScrollText, Timer, Ticket
} from 'lucide-react';
interface EventItem {
 id: string;
 title: string;
 desc: string;
 team: string;
 fee: string;
 difficulty: 'Easy' | 'Medium' | 'Hard';
 image: string;
 date: string;
 venue: string;
 rules: string[];
 track_id?: string;
 gform_link?: string;
}
interface Track {
 id: string;
 name: string;
 icon: React.ReactNode;
 color: string;
 tagline: string;
 events: EventItem[];
}
const defaultRules = [
 "All participants must carry their valid college ID cards.",
 "Decisions made by the judges will be final and binding.",
 "Any form of indiscipline or rule violation will lead to immediate disqualification."
];
const pickleballRules = [
  "Each team member must have their own teammate (must register as a pair).",
  "The games will be played for 5 points, except for the finals, which will be a best of 3 (first to 2 points), where each game is also played for 5 points.",
  "ALL GAMES WILL BE PLAYED IN STANDARD PICKLEBALL RULES.",
  "The teams are expected to be on time to the venue. The games will start from 12 PM and the final game will be held at 3 PM.",
  "All teams are to abide by the ruling given by referees, which will be final.",
  "The teams that are given during registration are final; no changes in teams will be made once the registrations are closed.",
  "THE SERVE: Each team, while serving, must have both of their members behind the baseline.",
  "THE SERVE: The serve must land diagonally crosscourt, past the kitchen line.",
  "THE SERVE: The paddle head must stay below the server’s wrist and the serve must be hit with an UNDERHAND MOTION.",
  "THE SERVE: After the ball is served, the receiving team must let it bounce once before returning it. The serving team must also let the return bounce before hitting it.",
  "THE SERVE: After these two first bounces, the players can hit the ball in a volley manner.",
  "THE KITCHEN: Volleying is prohibited within the non-volley zone.",
  "THE KITCHEN: It is a fault if, when volleying a ball, the player steps on the non-volley zone, or if momentum carries them into it."
];

const sudokuRules = [
  "Each participant competes individually; no assistance or external devices are allowed.",
  "Standard 9x9 Sudoku grid rules apply.",
  "Participants have 20 minutes to complete the puzzle.",
  "The first participant to correctly complete the puzzle is declared the winner; the second to finish correctly is the runner-up.",
  "The organizer's decision on completion and correctness is final."
];

const chessRules = [
  "Standard FIDE chess rules apply.",
  "Each match is played under a 10-minute time limit (rapid format).",
  "The touch-move rule applies.",
  "Matches are decided by standard win, draw, or loss scoring.",
  "The organizer's/arbiter's decision is final."
];

const footballRules = [
  "1 player in goal, 6 players on the field.",
  "Referee's call is final – no arguments.",
  "Only one substitution allowed per half."
];

const TRACKS_TEMPLATE: Omit<Track, 'events'>[] = [
 {
 id: 'pre-events',
 name: 'Pre-Events',
 icon: <Users className="w-5 h-5" />,
 color: '#00f0ff',
 tagline: 'The Warm Up.',
 },
 {
 id: 'main-events',
 name: 'Main Events',
 icon: <Sparkles className="w-5 h-5" />,
 color: '#ff006e',
 tagline: 'The Grand Showdown.',
 },
 {
 id: 'workshops',
 name: 'Workshops',
 icon: <BookOpen className="w-5 h-5" />,
 color: '#10b981',
 tagline: 'Learn. Apply. Master.',
 }
];
function EventCard({ event, trackColor, onClick }: { event: EventItem; trackColor: string; onClick: () => void }) {
 const cardRef = useRef<HTMLDivElement>(null);
 const [rotateX, setRotateX] = useState(0);
 const [rotateY, setRotateY] = useState(0);
 const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
 const card = cardRef.current;
 if (!card) return;
 const rect = card.getBoundingClientRect();
 const x = e.clientX - rect.left - rect.width / 2;
 const y = e.clientY - rect.top - rect.height / 2;
 setRotateX(-y / 20);
 setRotateY(x / 20);
 };
 const handleMouseLeave = () => { setRotateX(0); setRotateY(0); };
 const difficultyColors: Record<string, string> = {
 Easy: 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]',
 Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.3)]',
 Hard: 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]',
 };
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });

  useEffect(() => {
    // Parse "August 21 - 10:00 AM" into a real Date object
    // Assuming year is 2026 for Yuvenza
    let dateStr = event.date;
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      const datePart = parts[0].trim();
      const timePart = parts[1].trim();
      dateStr = `${datePart} 2026 ${timePart}`;
    } else {
      dateStr = `${dateStr} 2026 10:00 AM`;
    }

    const targetDate = new Date(dateStr).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      });
    };

    tick();
    const interval = setInterval(tick, 1000 * 60 * 60); // Update every hour
    return () => clearInterval(interval);
  }, [event.date]);

  const { days, hours } = timeLeft;
 return (
 <div
 ref={cardRef}
 onMouseMove={handleMouseMove}
 onMouseLeave={handleMouseLeave}
 onClick={onClick}
 className="relative w-full h-full rounded-[20px] border border-white/[0.08] bg-[#05001a]/40 overflow-hidden transition-all duration-300 ease-out flex flex-col group cursor-pointer hover:border-transparent hover:scale-[1.02] hover:z-10 shadow-[0_0_20px_rgba(255,255,255,0.02)] sm:shadow-2xl"
 style={{
 transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
 }}
 >
 {/* Animated Glowing Border via pseudo-element */}
 <div 
 className="absolute inset-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[20px]"
 style={{ 
 boxShadow: `0 0 20px ${trackColor}40, inset 0 0 20px ${trackColor}20`,
 border: `1px solid ${trackColor}50`
 }}
 />
 {/* Hover glow background */}
 <div
 className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
 />
  {/* Image */}
  <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/20">
  <Image src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'} alt={event.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-contain transition-transform duration-700 group-hover:scale-110" />
 <div className="absolute inset-0 bg-gradient-to-t from-[#010008] via-black/20 to-transparent" />
 </div>
 {/* Content */}
 <div className="p-6 flex-grow flex flex-col justify-between relative z-10">
 <div>
 <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--neon-cyan)] transition-colors duration-300">
 {event.title}
 </h3>
 <p className="text-xs text-gray-400 leading-relaxed mb-5 group-hover:text-gray-300 transition-colors duration-300 line-clamp-2">{event.desc}</p>
 </div>
 {/* Stats */}
 <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-white/5 pt-4 mb-5">
 <div className="flex items-center gap-1.5 text-xs text-gray-300">
 <Users className="w-3.5 h-3.5 text-[var(--neon-cyan)]" /> {event.team}
 </div>
 <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
 <Timer className="w-3.5 h-3.5 text-[var(--neon-lime)] animate-pulse" /> 
 <span className="text-white font-mono font-bold tracking-widest">{String(days).padStart(2, '0')}d {String(hours).padStart(2, '0')}h</span>
 </div>
 </div>
        {/* View Details Button */}
        <button
          className="w-full min-h-[44px] py-3 rounded-full font-semibold text-sm text-black bg-white hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </button>
 </div>
 </div>
 );
}
function EventDetailDrawer({ event, trackColor, onClose }: { event: EventItem; trackColor: string; onClose: () => void }) {
 const initiateRegistration = useStore((state) => state.initiateRegistration);
  const user = useStore((state) => state.user);
  const isRegistered = user?.registeredEvents?.includes(event.title);
 // Prevent scroll when drawer is open
 useEffect(() => {
 document.body.style.overflow = 'hidden';
 return () => { document.body.style.overflow = 'auto'; };
 }, []);
 return (
 <div className="fixed inset-0 z-[100] flex justify-end">
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="absolute inset-0 bg-black/60 cursor-pointer"
 />
 {/* Drawer */}
 <motion.div
 initial={{ x: '100%' }}
 animate={{ x: 0 }}
 exit={{ x: '100%' }}
 transition={{ type: 'spring', damping: 25, stiffness: 200 }}
 className="relative w-full max-w-lg h-full bg-[#030014] border-l border-white/10 shadow-2xl flex flex-col z-10 overflow-hidden"
 >
  {/* Header Image */}
  <div className="relative aspect-[4/5] max-h-[50vh] w-full shrink-0 bg-[#010008]">
  <Image src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'} alt={event.title} fill sizes="(max-width: 1024px) 100vw, 500px" className="object-contain" />
 <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/50 to-transparent" />
 <button 
 onClick={onClose}
 className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/40 border border-white/10 text-white hover:bg-white/10 transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
  <div className="absolute bottom-4 left-6 right-6">
    <h2 className="text-3xl font-[var(--font-heading-main)] font-black text-white">{event.title}</h2>
  </div>
 </div>
 {/* Scrollable Content */}
 <div className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" data-lenis-prevent="true">
 <p className="text-gray-300 text-sm leading-relaxed mb-8">{event.desc}</p>
 <div className="grid grid-cols-2 gap-4 mb-8">
 <div className="p-4 rounded-[20px] bg-white/[0.02] border border-white/5">
 <div className="flex items-center gap-2 text-[var(--neon-cyan)] mb-1">
 <Calendar className="w-4 h-4" />
 <span className="text-xs font-bold uppercase tracking-wider">Date & Time</span>
 </div>
 <div className="text-sm text-white font-medium">{event.date}</div>
 </div>
 <div className="p-4 rounded-[20px] bg-white/[0.02] border border-white/5">
 <div className="flex items-center gap-2 text-[var(--neon-magenta)] mb-1">
 <MapPin className="w-4 h-4" />
 <span className="text-xs font-bold uppercase tracking-wider">Venue</span>
 </div>
 <div className="text-sm text-white font-medium">{event.venue}</div>
 </div>
 <div className="p-4 rounded-[20px] bg-white/[0.02] border border-white/5">
 <div className="flex items-center gap-2 text-[var(--neon-lime)] mb-1">
 <Layers className="w-4 h-4" />
 <span className="text-xs font-bold uppercase tracking-wider">Registration Fee</span>
 </div>
 <div className="text-sm text-white font-medium">{event.fee}</div>
 </div>
 <div className="p-4 rounded-[20px] bg-white/[0.02] border border-white/5">
 <div className="flex items-center gap-2 text-[var(--neon-violet)] mb-1">
 <Users className="w-4 h-4" />
 <span className="text-xs font-bold uppercase tracking-wider">Team Size</span>
 </div>
 <div className="text-sm text-white font-medium">{event.team}</div>
 </div>
 </div>
  <div className="mb-6">
    <div className="flex items-center justify-between text-white mb-4">
      <div className="flex items-center gap-2">
        <ScrollText className="w-5 h-5 text-[var(--neon-cyan)]" />
        <h3 className="text-lg font-bold">Official Rules & Guidelines</h3>
      </div>
      <button
        onClick={() => {
          const ruleContent = `YUVENZA 2026 OFFICIAL EVENT RULEBOOK\nEvent: ${event.title}\nVenue: ${event.venue}\nDate & Time: ${event.date}\nTeam Size: ${event.team}\nRegistration Fee: ${event.fee}\n\nRULES:\n${event.rules.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n4. All participants must report at the venue 15 minutes before scheduled start time.\n5. Judging criteria includes originality, execution, and adherence to time limits.\n6. For event support or query, contact Event Lead: +91 98765 43210 (Yuvenza Core Team).`;
          const blob = new Blob([ruleContent], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Yuvenza2026_${event.title.replace(/\s+/g, '_')}_Rulebook.txt`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="flex items-center gap-1.5 text-xs font-mono font-bold text-teal-400 hover:text-white px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 transition-all hover:bg-teal-500/20"
      >
        <span>Download PDF/Text</span>
      </button>
    </div>
    <ul className="space-y-3 mb-6">
      {event.rules.map((rule, idx) => (
        <li key={idx} className="flex gap-3 text-sm text-gray-300 leading-relaxed bg-white/[0.02] p-3 rounded-[20px] border border-white/5">
          <span className="text-[var(--neon-cyan)] font-mono font-bold">{idx + 1}.</span>
          <span>{rule}</span>
        </li>
      ))}
      <li className="flex gap-3 text-sm text-gray-300 leading-relaxed bg-white/[0.02] p-3 rounded-[20px] border border-white/5">
        <span className="text-[var(--neon-cyan)] font-mono font-bold">4.</span>
        <span>Participants must strictly adhere to time limits. Extra time will result in point deduction.</span>
      </li>
      <li className="flex gap-3 text-sm text-gray-300 leading-relaxed bg-white/[0.02] p-3 rounded-[20px] border border-white/5">
        <span className="text-[var(--neon-cyan)] font-mono font-bold">5.</span>
        <span>Decisions by the panel of judges are final and non-negotiable.</span>
      </li>
    </ul>

    {/* Event Coordinator Contact */}
    <div className="p-4 rounded-[20px] bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/10 flex items-center justify-between">
      <div>
        <div className="text-[10px] uppercase font-bold tracking-widest text-purple-400">Student Event Coordinator</div>
        <div className="text-xs font-bold text-white">Yuvenza Event Desk</div>
      </div>
      <a href="tel:+919876543210" className="text-xs font-mono font-bold text-teal-300 hover:underline">
        +91 98765 43210
      </a>
    </div>
  </div>
</div>
 {/* Sticky Footer */}
 <div className="p-6 border-t border-white/10 bg-[#030014] shrink-0">
        <button
          onClick={() => {
            if (event.track_id?.trim().toLowerCase() === 'pre-events' || event.id?.toLowerCase().startsWith('pre-')) {
              const formLink = event.gform_link?.trim();
              if (formLink && (formLink.startsWith('http://') || formLink.startsWith('https://'))) {
                window.open(formLink, '_blank');
              } else {
                alert('Registration link for this event has not been configured yet. Please check back later.');
              }
              return;
            }
            onClose();
            initiateRegistration({
              id: event.id,
              title: event.title,
              category: event.id.split('-')[0],
              fee: event.fee,
              desc: event.desc,
            });
          }}
          className="w-full py-4 min-h-[44px] rounded-full font-semibold text-base text-black bg-white hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <span>Register Now</span>
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
 </div>
 </motion.div>
 </div>
 );
}const STATIC_EVENTS: EventItem[] = [
  // Main Events
  { id: 'main-1', track_id: 'main-events', title: 'Squid Game', desc: 'Survive the ultimate challenge. Do you have what it takes?', team: '1', fee: '₹150', difficulty: 'Hard', image: '/event-images/squid_game.png', date: 'August 21 - 10:00 AM', venue: 'Main Arena', rules: defaultRules },
  { id: 'main-2', track_id: 'main-events', title: 'Case Closed', desc: 'A murder mystery where you act as the detective to find the culprit.', team: '2-4', fee: '₹200', difficulty: 'Medium', image: '/event-images/case_closed.png', date: 'August 21 - 02:00 PM', venue: 'Seminar Hall 1', rules: defaultRules },
  { id: 'main-3', track_id: 'main-events', title: '7 Keys', desc: 'An escape room style treasure hunt. Find the 7 glowing magical keys.', team: '3-5', fee: '₹250', difficulty: 'Hard', image: '/event-images/seven_keys.png', date: 'August 21 - 01:00 PM', venue: 'Campus Ground', rules: defaultRules },
  { id: 'main-4', track_id: 'main-events', title: 'Cypher', desc: 'The ultimate 24-hour hackathon. Code your way to victory.', team: '2-4', fee: '₹300', difficulty: 'Hard', image: '/event-images/cypher.png', date: 'August 21 - 09:00 AM', venue: 'Tech Lab 4', rules: defaultRules },
  { id: 'main-5', track_id: 'main-events', title: 'Mock Parliament', desc: 'Got strong opinions? Step into the shoes of a parliamentarian and debate the real issues that actually matter.', team: '1', fee: '₹100', difficulty: 'Medium', image: '/event-images/mock_parliament.png', date: 'August 21 - 10:00 AM', venue: 'Auditorium', rules: defaultRules },
  // Pre Events
  { id: 'pre-1', track_id: 'pre-events', title: 'Sudoku', desc: 'Test your logic in this fast-paced 20-minute Sudoku challenge. Max 50 registrations.', team: '1', fee: 'Free', difficulty: 'Medium', image: '/event-images/sudoku.png', date: 'August 12 - 10:00 AM', venue: 'Classroom Block', rules: sudokuRules },
  { id: 'pre-2', track_id: 'pre-events', title: 'Charity Match', desc: 'A football match for a good cause. 7-a-side with 3 substitutes. Max 16 teams.', team: '10', fee: '₹200', difficulty: 'Medium', image: '/event-images/football.png', date: 'August 17-19 - 09:00 AM', venue: 'Football Ground', rules: footballRules },
  { id: 'pre-3', track_id: 'pre-events', title: 'Chess', desc: 'Intense rapid chess tournament (10 mins/game). Max 60 registrations.', team: '1', fee: 'Free', difficulty: 'Hard', image: '/event-images/chess.png', date: 'August 13 - 10:00 AM', venue: 'Indoor Stadium', rules: chessRules },
  { id: 'pre-4', track_id: 'pre-events', title: 'Pickle Ball', desc: 'Fast-paced pickleball action. Grab your paddles! 32 teams of doubles.', team: '2', fee: '₹50', difficulty: 'Medium', image: '/event-images/pickle_ball.png', date: 'August 18-19 - 12:00 PM', venue: 'Pickleball Court', rules: pickleballRules },
  // Workshops
  { id: 'ws-1', track_id: 'workshops', title: 'Calistro', desc: 'Hands-on workshop on Calistro creative design, UI/UX aesthetics & digital arts.', team: '1', fee: '₹250', difficulty: 'Medium', image: '/event-images/calistro.png', date: 'August 21 - 10:00 AM', venue: 'Seminar Hall A', rules: defaultRules },
  { id: 'ws-2', track_id: 'workshops', title: 'AIDS', desc: 'Artificial Intelligence & Data Science hands-on masterclass on machine learning models.', team: '1-2', fee: '₹300', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80', date: 'August 21 - 02:00 PM', venue: 'AI Super Lab', rules: defaultRules },
  { id: 'ws-3', track_id: 'workshops', title: 'Resolution', desc: 'Mastering high-resolution media processing, 3D visualization, and digital content creation.', team: '1', fee: '₹200', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', date: 'August 21 - 11:30 AM', venue: 'Media Studio', rules: defaultRules },
  { id: 'ws-4', track_id: 'workshops', title: 'Asymmetric', desc: 'Advanced cybersecurity, asymmetric cryptography, and ethical hacking intensive workshop.', team: '1-2', fee: '₹300', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', date: 'August 21 - 01:30 PM', venue: 'Cyber Security Lab', rules: defaultRules },
  { id: 'ws-5', track_id: 'workshops', title: 'Celestius', desc: 'Interactive astronomy, space technology, and satellite systems engineering workshop.', team: '1', fee: '₹250', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', date: 'August 21 - 03:30 PM', venue: 'Space Research Centre', rules: defaultRules },
];

export default function EventShowcaseScene() {
  const [activeTrack, setActiveTrack] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [teamSizeFilter, setTeamSizeFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [dbEvents, setDbEvents] = useState<EventItem[]>([]);
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [events, settings] = await Promise.all([
          db.getAllEvents(),
          db.getSiteSettings()
        ]);
        if (settings) {
          setSiteSettings(settings);
        }
        if (events && events.length > 0) {
          const mappedEvents: EventItem[] = events.map(e => ({
            id: e.id,
            title: e.title,
            desc: e.description,
            team: e.team_size,
            fee: e.fee,
            difficulty: e.difficulty,
            image: e.image_url,
            date: e.event_date,
            venue: e.venue,
            rules: e.rules,
            track_id: e.track_id,
            gform_link: e.gform_link
          }));
          setDbEvents(mappedEvents);
        } else {
          setDbEvents(STATIC_EVENTS);
        }
      } catch (err) {
        console.error('Failed to fetch events', err);
        setDbEvents(STATIC_EVENTS);
      } finally {
        setIsFetchingEvents(false);
      }
    };
    fetchData();
  }, []);

  const TRACKS = useMemo(() => {
    const eventsMap = new Map<string, EventItem>();
    STATIC_EVENTS.forEach(e => eventsMap.set(e.id, e));
    dbEvents.forEach(e => eventsMap.set(e.id, e));

    return TRACKS_TEMPLATE.map(t => {
      return {
        ...t,
        events: Array.from(eventsMap.values()).filter(e => e.track_id === t.id)
      };
    });
  }, [dbEvents]);
 const track = TRACKS[activeTrack];
 // Derive Team Sizes based on data
 const uniqueTeamSizes = useMemo(() => {
 const sizes = new Set<string>();
 TRACKS.forEach(t => t.events.forEach(e => sizes.add(e.team)));
 return ['All', ...Array.from(sizes)];
 }, []);
  const filteredEvents = useMemo(() => {
    return track.events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTeamSize = teamSizeFilter === 'All' || event.team === teamSizeFilter;
      return matchesSearch && matchesTeamSize;
    });
  }, [track, searchQuery, teamSizeFilter]);
 // Handle ESC key to close modal
 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if (e.key === 'Escape' && selectedEvent) {
 setSelectedEvent(null);
 }
 };
 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, [selectedEvent]);
 return (
 <section id="events" className="relative section-padding overflow-hidden" >
 {/* Background */}
 <div
 className="absolute top-0 left-0 w-full h-[1px] transition-colors duration-500"
 />
 <div className="relative z-10 container-responsive">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-xs text-[var(--neon-cyan)] font-semibold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            Discover the Experience
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-6xl font-[var(--font-heading-main)] font-black text-white uppercase tracking-wider mb-4"
          >
            Explore{' '}
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent">
              Yuvenza
            </span>
          </motion.h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            From coding challenges and hackathons to music, dance, photography, gaming, workshops, and fun activities, every event is carefully curated to inspire creativity, collaboration, and unforgettable memories.
          </p>
        </div>
 {/* Track tabs */}
 <div className="tab-strip justify-start sm:justify-center mb-8 px-1">
 {TRACKS.map((t, idx) => {
 const isActive = idx === activeTrack;
 return (
 <button
 key={t.id}
 onClick={() => {
 setActiveTrack(idx);
 }}
 className={`flex items-center gap-2 px-5 py-2.5 rounded-[20px] text-sm font-bold transition-all duration-300 border ${
 isActive
 ? 'text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105 z-10'
 : 'text-gray-400 border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:text-white hover:scale-105'
 }`}
 style={
 isActive
 ? {
 background: `linear-gradient(135deg, ${t.color}20, ${t.color}05)`,
 borderColor: `${t.color}60`,
 boxShadow: `0 0 25px ${t.color}20`,
 }
 : undefined
 }
 >
 <span style={isActive ? { color: t.color } : undefined}>{t.icon}</span>
 {t.name}
 </button>
 );
 })}
 </div>
 {/* Filters Bar */}
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white/[0.02] border border-white/10 rounded-[20px] p-3 sm:p-4 mb-10"
 >
 <div className="relative w-full md:w-96">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <input 
 type="text" 
 placeholder="Search events..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full bg-black/40 border border-white/10 rounded-[20px] py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[var(--neon-cyan)]/50 focus:ring-1 focus:ring-[var(--neon-cyan)]/50 transition-all min-h-[48px]"
 />
 </div>
 <div className="flex gap-3 w-full md:w-auto">
    <div className="relative w-full md:w-auto">
      <select 
        value={teamSizeFilter}
        onChange={(e) => setTeamSizeFilter(e.target.value)}
         className="w-full sm:w-48 bg-black/40 border border-white/10 rounded-[20px] py-3 px-4 text-sm text-gray-300 appearance-none focus:outline-none focus:border-[var(--neon-violet)]/50 transition-all cursor-pointer min-h-[48px]"
      >
        {uniqueTeamSizes.map(size => (
          <option key={size} value={size}>{size === 'All' ? 'All Team Sizes' : size}</option>
        ))}
      </select>
      <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
    </div>
  </div>
 </motion.div>
 {/* Track tagline */}
 <AnimatePresence mode="wait">
 <motion.div
 key={track.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.3 }}
 className="text-center mb-10"
 >
 <span
 className="text-lg sm:text-xl font-bold tracking-wide"
 style={{ color: track.color }}
 >
 {track.tagline}
 </span>
 </motion.div>
 </AnimatePresence>
 {/* Event cards grid */}
 <AnimatePresence mode="wait">
 {track.id === 'workshops' && siteSettings?.workshops_status === 'coming_soon' ? (
   <motion.div 
   key="coming-soon"
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   exit={{ opacity: 0 }}
   className="section-padding text-center flex flex-col items-center justify-center min-h-[300px]"
   >
   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
   <Sparkles className="w-6 h-6 text-[var(--neon-violet)]" />
   </div>
   <h3 className="text-2xl text-white font-bold mb-2">Workshops Coming Soon</h3>
   <p className="text-gray-400">Our expert-led workshops are currently being finalized. Stay tuned for announcements!</p>
   </motion.div>
   ) : track.id === 'main-events' && siteSettings?.events_status === 'coming_soon' ? (
   <motion.div
   key="events-coming-soon"
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   exit={{ opacity: 0 }}
   className="section-padding text-center flex flex-col items-center justify-center min-h-[300px]"
   >
   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
   <Sparkles className="w-6 h-6 text-[var(--neon-cyan)]" />
   </div>
   <h3 className="text-2xl text-white font-bold mb-2">Events Coming Soon</h3>
   <p className="text-gray-400">Our exciting events lineup is being finalized. Stay tuned for announcements!</p>
   </motion.div>
   ) : track.id === 'pre-events' && siteSettings?.pre_events_status === 'coming_soon' ? (
   <motion.div
   key="pre-events-coming-soon"
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   exit={{ opacity: 0 }}
   className="section-padding text-center flex flex-col items-center justify-center min-h-[300px]"
   >
   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
   <Sparkles className="w-6 h-6 text-[var(--neon-magenta)]" />
   </div>
   <h3 className="text-2xl text-white font-bold mb-2">Pre-Events Coming Soon</h3>
   <p className="text-gray-400">Our pre-events are currently being planned. Stay tuned for announcements!</p>
   </motion.div>
   ) : filteredEvents.length > 0 ? (
 <motion.div
 key={`${track.id}-grid`}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 transition={{ duration: 0.4 }}
 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
 >
 {filteredEvents.map((event) => (
 <EventCard 
 key={event.id} 
 event={event} 
 trackColor={track.color} 
 onClick={() => setSelectedEvent(event)}
 />
 ))}
 </motion.div>
 ) : (
 <motion.div 
 key="empty"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="section-padding text-center flex flex-col items-center"
 >
 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
 <Search className="w-6 h-6 text-gray-500" />
 </div>
 <h3 className="text-xl text-white font-bold mb-2">No events found</h3>
 <p className="text-gray-400">Try adjusting your filters or search query to find what you're looking for.</p>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 {/* Slide Drawer Modal */}
 <AnimatePresence>
 {selectedEvent && (
 <EventDetailDrawer 
 event={selectedEvent} 
 trackColor={TRACKS.find(t => t.events.some(e => e.id === selectedEvent.id))?.color || '#00f0ff'}
 onClose={() => setSelectedEvent(null)} 
 />
 )}
 </AnimatePresence>
 </section>
 );
}

