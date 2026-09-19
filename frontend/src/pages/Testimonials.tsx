import { useEffect, useMemo, useState } from 'react';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import ImageWithSkeleton from '../components/ImageWithSkeleton';
import ImageLightbox from '../components/ImageLightbox';
import ScrollProgress from '../components/ScrollProgress';
import HeroCarousel from '../components/HeroCarousel';
import Tag from '../components/Tag';
import { SEOHelmet } from '../hooks/useSEO';
import api from '../services/api';

interface TestimonialApi {
  id: number;
  cohort_label: string;
  name: string;
  role: string;
  content: string;
  image: string | null;
}

const Testimonials = () => {
  const [items, setItems] = useState<TestimonialApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    api.get('/testimonials')
      .then(res => {
        const data: TestimonialApi[] = res.data?.data || [];
        setItems(data);
        if (data.length > 0) setSelectedCohort(data[0].cohort_label);
      })
      .catch(err => console.error('Failed to load testimonials:', err))
      .finally(() => setLoading(false));
  }, []);

  const cohortLabels = useMemo(() => {
    const seen: string[] = [];
    for (const item of items) {
      if (!seen.includes(item.cohort_label)) seen.push(item.cohort_label);
    }
    return seen;
  }, [items]);

  const visibleItems = useMemo(
    () => items.filter((t) => t.cohort_label === selectedCohort),
    [items, selectedCohort]
  );

  return (
    <div className="bg-white overflow-x-hidden">
      {/* SEO Meta Tags */}
      <SEOHelmet pageName="testimonials" />

      <ScrollProgress />

      {/* Hero Section with Carousel */}
      <HeroCarousel>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight">
          STUDENT TESTIMONIALS
        </h1>
        <p className="text-base md:text-xl text-gray-100">Hear from our mentees about their transformational journey</p>
      </HeroCarousel>

      {!loading && cohortLabels.length > 0 && (
        <>
          {/* Cohort Tabs */}
          <section className="py-8 bg-white">
            <div className="container mx-auto px-6">
              <div className="flex flex-wrap justify-center gap-4">
                {cohortLabels.map((label) => (
                  <button
                    key={label}
                    onClick={() => setSelectedCohort(label)}
                    className={`btn-tactile px-6 py-3 rounded-lg font-semibold transition duration-300 ${
                      selectedCohort === label
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    style={{
                      background: selectedCohort === label ? 'linear-gradient(135deg, #FF9148 0%, #E8722E 100%)' : undefined,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="sr-only-live" aria-live="polite">{`Showing ${selectedCohort}`}</div>
            </div>
          </section>

          {/* Testimonials Grid */}
          <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  <span style={{ color: '#FF9148' }}>{selectedCohort}</span>
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Discover the impact Guiding Stars has made on our mentees' lives and careers.
                </p>
              </div>

              <div className="space-y-12">
                {visibleItems.map((testimonial, index) => (
                  <Reveal
                    key={testimonial.id}
                    delay={(index % 4) * 80}
                    className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 items-center`}
                  >
                    {/* Image */}
                    <div className="w-full lg:w-1/2 flex-shrink-0">
                      {testimonial.image && (
                        <ImageWithSkeleton
                          src={testimonial.image}
                          alt={testimonial.name}
                          wrapperClassName="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                          className="w-full h-64 lg:h-80 object-cover cursor-pointer hover:opacity-80 transition-opacity duration-300"
                          onClick={() => setSelectedImage(testimonial.image)}
                        />
                      )}
                    </div>

                    {/* Text Content */}
                    <div className="w-full lg:w-1/2">
                      <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-center">
                        <div className="mb-4 flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {testimonial.name}
                        </h3>
                        <Tag className="mb-4">{testimonial.role}</Tag>
                        <p className="text-gray-600 leading-relaxed text-base">
                          "{testimonial.content}"
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {!loading && cohortLabels.length === 0 && (
        <section className="py-16 md:py-24 bg-gray-50 text-center">
          <div className="container mx-auto px-6">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No testimonials yet</h2>
            <p className="text-gray-500">Check back soon to hear from our mentees.</p>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Be part of a transformative mentorship experience that will shape your future.
          </p>
          <a
            href="/apply"
            className="btn-tactile inline-block text-white px-9 py-4 rounded-lg font-semibold transition hover:brightness-110 text-lg bg-gradient-to-br from-[#FF9148] to-[#E8722E]"
          >
            Apply Now
          </a>
        </div>
      </section>

      <ImageLightbox src={selectedImage} onClose={() => setSelectedImage(null)} />

      <Footer />
    </div>
  );
};

export default Testimonials;
