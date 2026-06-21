import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to send message: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-surface">
        {/* Hero Section */}
        <section className="relative h-[240px] sm:h-[320px] md:h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img className="w-full h-full object-cover" src="/hero-image.png" alt="Contact Hero" />
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
          <div className="relative z-10 text-center text-white">
            <h1 className="font-display-lg text-display-lg mb-4">Contact Us</h1>
            <p className="font-body-lg max-w-lg mx-auto">We are here to assist you with your heritage textile journey.</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="font-headline-md text-stone-900 mb-6">Get in Touch</h2>
              <p className="font-body-md text-stone-600 leading-relaxed">
                Whether you have a question about our collections, need assistance with an order, or want to learn more about our artisanal process, our team is ready to help.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
                <div>
                  <h4 className="font-label-caps text-xs text-stone-400 uppercase tracking-widest mb-2">Our Atelier</h4>
                  <p className="font-body-md text-stone-800">
                    House No 198, Motorway valley Sargodha Road, Faisalabad
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <span className="material-symbols-outlined text-primary text-3xl">mail</span>
                <div>
                  <h4 className="font-label-caps text-xs text-stone-400 uppercase tracking-widest mb-2">Email Us</h4>
                  <p className="font-body-md text-stone-800">rohmanicloth@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <span className="material-symbols-outlined text-primary text-3xl">call</span>
                <div>
                  <h4 className="font-label-caps text-xs text-stone-400 uppercase tracking-widest mb-2">Call Us</h4>
                  <p className="font-body-md text-stone-800">0300-8625051</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-stone-100">
              <h4 className="font-label-caps text-xs text-stone-400 uppercase tracking-widest mb-6">Follow Our Journey</h4>
              <div className="flex gap-6">
                <a href="https://www.instagram.com/rohmanitextile?igsh=MXV4b3d0dDM1aGJmbA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-primary transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  <span className="uppercase font-label-caps text-xs">Instagram</span>
                </a>
                <a href="https://www.facebook.com/share/17NwGbeB3R/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-primary transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  <span className="uppercase font-label-caps text-xs">Facebook</span>
                </a>
                <a href="https://www.tiktok.com/@rohmani.cloth?_r=1&_t=ZS-96f2Odqeofo" target="_blank" rel="noopener noreferrer" className="text-stone-600 hover:text-primary transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/><path d="M9 12v8"/></svg>
                  <span className="uppercase font-label-caps text-xs">TikTok</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 sm:p-12 border border-stone-100 shadow-sm">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12 animate-fade-in">
                <span className="material-symbols-outlined text-primary text-6xl">check_circle</span>
                <h3 className="font-headline-md text-stone-900">Message Received</h3>
                <p className="font-body-md text-stone-600">Thank you for reaching out. Our concierge team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Your Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border-b border-stone-200 py-3 focus:border-primary focus:ring-0 outline-none transition-colors font-body-md"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full border-b border-stone-200 py-3 focus:border-primary focus:ring-0 outline-none transition-colors font-body-md"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Subject</label>
                  <input
                    type="text"
                    required
                    className="w-full border-b border-stone-200 py-3 focus:border-primary focus:ring-0 outline-none transition-colors font-body-md"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Your Message</label>
                  <textarea
                    rows="4"
                    required
                    className="w-full border-b border-stone-200 py-3 focus:border-primary focus:ring-0 outline-none transition-colors font-body-md resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-5 font-label-caps text-label-caps uppercase tracking-[0.2em] hover:bg-stone-900 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
