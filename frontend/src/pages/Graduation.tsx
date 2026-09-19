import { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import ImageLightbox from '../components/ImageLightbox';
import ScrollProgress from '../components/ScrollProgress';
import HeroCarousel from '../components/HeroCarousel';
import { renderRichText } from '../utils/richText';
import api from '../services/api';

interface Award {
  label: string;
  name: string;
  institution: string;
}

interface Photo {
  id: number;
  image_url: string;
  display_order: number;
}

interface CohortApi {
  id: number;
  title: string;
  cohort_date: string | null;
  press_statement: string | null;
  future_text: string | null;
  awards: Award[];
  photos: Photo[];
}

const Graduation = () => {
  const [cohorts, setCohorts] = useState<CohortApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCohortId, setSelectedCohortId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    api.get('/graduation')
      .then(res => {
        const data: CohortApi[] = res.data?.data || [];
        setCohorts(data);
        if (data.length > 0) setSelectedCohortId(data[0].id);
      })
      .catch(err => console.error('Failed to load graduation cohorts:', err))
      .finally(() => setLoading(false));
  }, []);

  const data = useMemo(
    () => cohorts.find((c) => c.id === selectedCohortId) || null,
    [cohorts, selectedCohortId]
  );

  return (
    <div className="bg-white overflow-x-hidden">
      <ScrollProgress />

      {/* Hero Section with Carousel */}
      <HeroCarousel>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight">
          EVENTS & CELEBRATIONS
        </h1>
        <p className="text-base md:text-xl text-gray-100">Celebrating milestones and transforming lives together</p>
      </HeroCarousel>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              <div className="h-10 w-64 mx-auto rounded skeleton-shimmer" />
              <div className="h-64 rounded-lg skeleton-shimmer" />
            </div>
          ) : !data ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎓</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No events published yet</h2>
              <p className="text-gray-500">Check back soon for graduation highlights.</p>
            </div>
          ) : (
            <>
              {/* Cohort Selector */}
              <div className="mb-8 flex justify-center px-2 md:px-0">
                <select
                  value={data.id}
                  onChange={(e) => setSelectedCohortId(Number(e.target.value))}
                  className="w-full md:w-auto px-4 md:px-6 py-3 border-2 border-orange-500 rounded-lg text-base md:text-lg font-semibold bg-white text-gray-800 hover:bg-orange-50 transition"
                >
                  {cohorts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}{c.cohort_date ? ` (${c.cohort_date})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sr-only-live" aria-live="polite">{`Showing ${data.title}`}</div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6">
                {data.title}
              </h2>

              {data.cohort_date && (
                <div className="text-gray-600 text-center mb-8 text-sm md:text-base">
                  <span className="mr-4"><i className="fas fa-calendar-alt mr-1"></i> {data.cohort_date}</span>
                </div>
              )}

              <div className="space-y-12 md:space-y-16">
                {/* Press Statement */}
                {data.press_statement && (
                  <div className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {renderRichText(data.press_statement, 'w-full rounded-lg shadow-lg my-6 object-cover max-h-96')}
                  </div>
                )}

                {/* Awards */}
                {data.awards && data.awards.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-5 md:p-6">
                    <h4 className="font-bold text-gray-800 mb-4 text-base md:text-lg">Excellence Awards</h4>
                    <ul className="space-y-2">
                      {data.awards.map((award, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 text-sm md:text-base">
                          <span className="mt-1 font-bold" style={{ color: '#FF9148' }}>•</span>
                          <span><span className="font-semibold">{award.label}:</span> {award.name} &ndash; {award.institution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Photo Gallery */}
                {data.photos && data.photos.length > 0 && (
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Event Highlights</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {data.photos.map((photo, index) => (
                        <Reveal key={photo.id} delay={(index % 3) * 80}>
                          <ImageWithSkeleton
                            src={photo.image_url}
                            alt={`${data.title} — photo ${index + 1}`}
                            wrapperClassName="rounded-lg shadow-lg"
                            className="w-full object-cover h-40 md:h-64 hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => setSelectedImage(photo.image_url)}
                          />
                        </Reveal>
                      ))}
                    </div>
                  </div>
                )}

                {/* Future Section */}
                {data.future_text && (
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 md:p-8 rounded-lg border-l-4" style={{ borderColor: '#FF9148' }}>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base italic font-semibold">
                      {data.future_text}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base mt-4">
                      Join us as we continue to rise, aiming higher and brighter, in the pursuit of excellence and growth.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <ImageLightbox src={selectedImage} onClose={() => setSelectedImage(null)} />

      <Footer />
    </div>
  );
};

export default Graduation;
