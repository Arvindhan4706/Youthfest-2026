import { NextResponse } from 'next/server';
import { db, EventItem } from '@/lib/database';

const STATIC_EVENTS: Omit<EventItem, 'created_at'>[] = [
  { id: 'main-1', track_id: 'main-events', title: 'Squid Game', description: 'Survive the ultimate challenge. Do you have what it takes?', team_size: '1', fee: '₹150', difficulty: 'Hard', image_url: '/events/squid_game.png', event_date: 'August 12 - 10:00 AM', venue: 'Main Arena', rules: ["All participants must carry their valid college ID cards.", "Decisions made by the judges will be final and binding.", "Any form of indiscipline or rule violation will lead to immediate disqualification."] },
  { id: 'main-2', track_id: 'main-events', title: 'Case Closed', description: 'A murder mystery where you act as the detective to find the culprit.', team_size: '2-4', fee: '₹200', difficulty: 'Medium', image_url: '/events/case_closed.png', event_date: 'August 12 - 02:00 PM', venue: 'Seminar Hall 1', rules: ["All participants must carry their valid college ID cards.", "Decisions made by the judges will be final and binding."] },
  { id: 'main-3', track_id: 'main-events', title: '7 Keys', description: 'An escape room style treasure hunt. Find the 7 glowing magical keys.', team_size: '3-5', fee: '₹250', difficulty: 'Hard', image_url: '/events/seven_keys.png', event_date: 'August 12 - 01:00 PM', venue: 'Campus Ground', rules: ["All participants must carry their valid college ID cards.", "Decisions made by the judges will be final and binding."] },
  { id: 'main-4', track_id: 'main-events', title: 'Cypher', description: 'The ultimate 24-hour hackathon. Code your way to victory.', team_size: '2-4', fee: '₹300', difficulty: 'Hard', image_url: '/events/cypher.png', event_date: 'August 12 - 09:00 AM', venue: 'Tech Lab 4', rules: ["All participants must carry their valid college ID cards.", "Decisions made by the judges will be final and binding."] },
  { id: 'pre-1', track_id: 'pre-events', title: 'Mock Parliament', description: 'Debate on national issues in this intense mock parliament.', team_size: '1', fee: '₹100', difficulty: 'Medium', image_url: 'https://images.unsplash.com/photo-1577563908411-5079b6a66019?auto=format&fit=crop&w=800&q=80', event_date: 'August 12 - 10:00 AM', venue: 'Auditorium', rules: ["All participants must carry their valid college ID cards."] },
  { id: 'pre-2', track_id: 'pre-events', title: 'Charity Match', description: 'A football match for a good cause. Show your sportsmanship!', team_size: '11', fee: '₹500', difficulty: 'Medium', image_url: 'https://images.unsplash.com/photo-1574629810360-7efbb1b379e0?auto=format&fit=crop&w=800&q=80', event_date: 'August 12 - 04:00 PM', venue: 'Football Ground', rules: ["All participants must carry their valid college ID cards."] },
  { id: 'pre-3', track_id: 'pre-events', title: 'Chess', description: 'Intense chess tournament. Outsmart your opponents.', team_size: '1', fee: '₹100', difficulty: 'Hard', image_url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80', event_date: 'August 12 - 09:00 AM', venue: 'Indoor Stadium', rules: ["All participants must carry their valid college ID cards."] },
  { id: 'pre-4', track_id: 'pre-events', title: 'Pickle Ball', description: 'Fast-paced pickleball action. Grab your paddles!', team_size: '2', fee: '₹150', difficulty: 'Medium', image_url: 'https://images.unsplash.com/photo-1622279457486-69d73ad5e4d2?auto=format&fit=crop&w=800&q=80', event_date: 'August 12 - 02:00 PM', venue: 'Tennis Court', rules: ["All participants must carry their valid college ID cards."] },
  // Workshops
  { id: 'ws-1', track_id: 'workshops', title: 'Calistro', description: 'Hands-on workshop on Calistro creative design, UI/UX aesthetics & digital arts.', team_size: '1', fee: '₹250', difficulty: 'Medium', image_url: 'https://images.unsplash.com/photo-1542744094-3a3172720189?auto=format&fit=crop&w=800&q=80', event_date: 'August 12 - 10:00 AM', venue: 'Seminar Hall A', rules: ["All participants must carry their valid college ID cards."] },
  { id: 'ws-2', track_id: 'workshops', title: 'AIDS', description: 'Artificial Intelligence & Data Science hands-on masterclass on machine learning models.', team_size: '1-2', fee: '₹300', difficulty: 'Hard', image_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80', event_date: 'August 12 - 02:00 PM', venue: 'AI Super Lab', rules: ["All participants must carry their valid college ID cards."] },
  { id: 'ws-3', track_id: 'workshops', title: 'Resolution', description: 'Mastering high-resolution media processing, 3D visualization, and digital content creation.', team_size: '1', fee: '₹200', difficulty: 'Medium', image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', event_date: 'August 12 - 11:30 AM', venue: 'Media Studio', rules: ["All participants must carry their valid college ID cards."] },
  { id: 'ws-4', track_id: 'workshops', title: 'Asymmetric', description: 'Advanced cybersecurity, asymmetric cryptography, and ethical hacking intensive workshop.', team_size: '1-2', fee: '₹300', difficulty: 'Hard', image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', event_date: 'August 12 - 01:30 PM', venue: 'Cyber Security Lab', rules: ["All participants must carry their valid college ID cards."] },
  { id: 'ws-5', track_id: 'workshops', title: 'Celestius', description: 'Interactive astronomy, space technology, and satellite systems engineering workshop.', team_size: '1', fee: '₹250', difficulty: 'Medium', image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', event_date: 'August 12 - 03:30 PM', venue: 'Space Research Centre', rules: ["All participants must carry their valid college ID cards."] },
];

export async function GET() {
  const results = [];
  for (const ev of STATIC_EVENTS) {
    try {
      await db.addEvent(ev);
      results.push(`Added ${ev.title}`);
    } catch (e: any) {
      results.push(`Failed to add ${ev.title}: ${e.message}`);
    }
  }
  return NextResponse.json({ success: true, results });
}
