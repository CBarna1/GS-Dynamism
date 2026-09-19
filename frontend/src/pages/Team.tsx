// src/pages/Team.tsx
import { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import ScrollProgress from '../components/ScrollProgress';
import HeroCarousel from '../components/HeroCarousel';
import Tag from '../components/Tag';
import { SEOHelmet } from '../hooks/useSEO';
import api from '../services/api';

interface TeamMemberApi {
  id: number;
  name: string;
  role: string;
  photo: string | null;
  description: string | null;
}

const Team = () => {
  const [flipped, setFlipped] = useState<number | null>(null);
  const [content, setContent] = useState<Record<string, string>>({});
  const [members, setMembers] = useState<TeamMemberApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/content')
      .then(res => setContent(res.data?.data || {}))
      .catch(err => console.error('Failed to load content:', err));
    api.get('/team')
      .then(res => setMembers(res.data?.data || []))
      .catch(err => console.error('Failed to load team:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredTeam = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
    );
  }, [search, members]);

  const toggleFlip = (id: number) => {
    setFlipped(flipped === id ? null : id);
  };

  const onCardKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip(id);
    }
  };

  return (
    <div className="bg-white overflow-x-hidden">
      {/* SEO Meta Tags */}
      <SEOHelmet pageName="team" />

      <ScrollProgress />

      {/* Hero Section with Carousel */}
      <HeroCarousel>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight">
          {content.team_hero_title || 'MEET OUR TEAM'}
        </h1>
        <p className="text-base md:text-xl text-gray-100">{content.team_section_subtitle || 'Dedicated professionals committed to transforming lives through mentorship'}</p>
      </HeroCarousel>

      {/* Team Members Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Search / filter */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or role..."
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-[#FF9148] focus:ring-2 focus:ring-[#FF9148]/20 outline-none transition"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 rounded-xl skeleton-shimmer" />
              ))}
            </div>
          ) : filteredTeam.length === 0 ? (
            <p className="text-center text-gray-500">
              {members.length === 0 ? 'Team information is coming soon.' : `No team members match "${search}".`}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeam.map((member, index) => (
                <Reveal key={member.id} delay={index * 80} className="h-96">
                  <div
                    className="group h-96 cursor-pointer perspective hover:-translate-y-1 transition-transform duration-300"
                    onClick={() => toggleFlip(member.id)}
                    onKeyDown={(e) => onCardKeyDown(e, member.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={flipped === member.id}
                    aria-label={`${member.name}, ${member.role}. Press to ${flipped === member.id ? 'hide' : 'show'} details.`}
                  >
                  <div
                    className="relative w-full h-full transition-transform duration-500 transform"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: flipped === member.id ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* Front of card - Image & Name */}
                    <div
                      className="absolute w-full h-full bg-white rounded-xl shadow-lg overflow-hidden"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="p-6 h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-orange-50 to-gray-50">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-40 h-48 object-cover rounded-lg mx-auto mb-4 border-4 shadow-md"
                            style={{ borderColor: '#FF9148' }}
                          />
                        ) : (
                          <div
                            className="w-40 h-48 rounded-lg mx-auto mb-4 border-4 shadow-md flex items-center justify-center text-5xl bg-gray-100"
                            style={{ borderColor: '#FF9148' }}
                          >
                            👤
                          </div>
                        )}
                        <h4 className="text-lg font-bold text-gray-800">{member.name}</h4>
                        <Tag className="mt-2" variant="outline">{member.role}</Tag>
                        <p className="text-xs text-gray-500 mt-3">Click to learn more</p>
                      </div>
                    </div>

                    {/* Back of card - Description */}
                    <div
                      className="absolute w-full h-full bg-gradient-to-br rounded-xl shadow-lg overflow-hidden p-6 flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: 'linear-gradient(135deg, #FF9148 0%, #E8722E 100%)',
                      }}
                    >
                      <div className="text-white text-center">
                        <h4 className="text-lg font-bold mb-3">{member.role}</h4>
                        <p className="text-sm leading-relaxed opacity-95">{member.description}</p>
                        <p className="text-xs mt-4 opacity-75">Click to go back</p>
                      </div>
                    </div>
                  </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Team;