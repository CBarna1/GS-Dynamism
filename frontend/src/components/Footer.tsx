import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface FooterContent {
  [key: string]: string;
}

const Footer = () => {
  const [content, setContent] = useState<FooterContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/content')
      .then(res => {
        const contentMap = res.data?.data || {};
        setContent(contentMap);
      })
      .catch(err => console.error('Failed to load footer content:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return null; // Don't show footer until loaded
  }

  return (
    <footer className="bg-gray-900 text-white py-12 md:py-16">
      <div className="container mx-auto px-6">
        {/* Footer Grid */}
        <div className="grid md:grid-cols-5 gap-8 mb-8 md:mb-12">
          {/* About Section */}
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: '#FF9148' }}>
              About Us
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              {content.footer_about || 'Guiding Stars is a non-profit mentorship organization committed to nurturing the next generation of leaders through quality mentorship and professional development.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: '#FF9148' }}>
              Quick Links
            </h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <Link to="/" className="hover:text-orange-400 transition">
                  {content.footer_link_home || 'Home'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition">
                  {content.footer_link_about || 'About'}
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-orange-400 transition">
                  {content.footer_link_team || 'Team'}
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-orange-400 transition">
                  {content.footer_link_testimonials || 'Testimonials'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition">
                  {content.footer_link_contact || 'Contact'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: '#FF9148' }}>
              Programs
            </h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <a href="/apply" className="hover:text-orange-400 transition">
                  {content.footer_program_apply || 'Apply Now'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  {content.footer_program_mentorship || 'Mentorship'}
                </a>
              </li>
              <li>
                <a href="/graduation" className="hover:text-orange-400 transition">
                  {content.footer_program_graduation || 'Graduation'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  {content.footer_program_resources || 'Resources'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: '#FF9148' }}>
              Contact Us
            </h4>
            <div className="text-gray-400 text-sm space-y-3">
              {content.footer_address && (
                <p>
                  <span className="text-orange-400 font-semibold">Address:</span>
                  <br />
                  {content.footer_address}
                </p>
              )}
              {content.footer_email && (
                <p>
                  <span className="text-orange-400 font-semibold">Email:</span>
                  <br />
                  <a href={`mailto:${content.footer_email}`} className="hover:text-orange-400 transition">
                    {content.footer_email}
                  </a>
                </p>
              )}
              {content.footer_phone && (
                <p>
                  <span className="text-orange-400 font-semibold">Phone:</span>
                  <br />
                  <a href={`tel:${content.footer_phone}`} className="hover:text-orange-400 transition">
                    {content.footer_phone}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Portal Access */}
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: '#FF9148' }}>
              Portal Access
            </h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <Link to="/mentor/login" className="hover:text-orange-400 transition">
                  Mentor Login
                </Link>
              </li>
              <li>
                <Link to="/mentee/login" className="hover:text-orange-400 transition">
                  Mentee Login
                </Link>
              </li>
              <li>
                <Link to="/mentor-apply" className="hover:text-orange-400 transition">
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link to="/apply" className="hover:text-orange-400 transition">
                  Apply as Mentee
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Social Links (if added to CMS) */}
          {(content.footer_social_facebook || content.footer_social_twitter || content.footer_social_linkedin) && (
            <div className="flex gap-4 mb-6 justify-center md:justify-start">
              {content.footer_social_facebook && (
                <a 
                  href={content.footer_social_facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-400 transition"
                  title="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {content.footer_social_twitter && (
                <a 
                  href={content.footer_social_twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-400 transition"
                  title="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 002.856-3.51 10.02 10.02 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}
              {content.footer_social_linkedin && (
                <a 
                  href={content.footer_social_linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-400 transition"
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.814 0-9.752h3.554v1.381c.43-.664 1.199-1.61 2.919-1.61 2.135 0 3.734 1.39 3.734 4.38v5.601zM5.337 8.855c-1.144 0-1.915-.759-1.915-1.71 0-.955.77-1.71 1.906-1.71.99 0 1.913.75 1.924 1.71 0 .951-.933 1.71-1.915 1.71zm1.946 11.597H3.392V9.7h3.891v10.752zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Bottom Info */}
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} {content.footer_company_name || 'Guiding Stars'}. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {content.footer_privacy_url && (
                <a href={content.footer_privacy_url} className="hover:text-orange-400 transition">
                  {content.footer_privacy_label || 'Privacy Policy'}
                </a>
              )}
              {content.footer_terms_url && (
                <a href={content.footer_terms_url} className="hover:text-orange-400 transition">
                  {content.footer_terms_label || 'Terms of Service'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
