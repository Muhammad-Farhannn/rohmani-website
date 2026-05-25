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
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj6_pdetWQoVxiPAvBC6H7KbfbBUwfSyiH9Kvi1zentD_NTT6svz2QX69R6yCnsNxIeuZiUEtmwJ95WaRYkYJvjPVT-K7PmJUIh59zB33JIiBK56WkIfmeKfQWmrWrn8p2DXUNdLe0ILy1lGnN8Yo3ZqqU3E2pERwagFFMaBda94iMQuB9tlh1qDzMRWbWmpx86ElQNAjhmybr93px1nbrsRrZfIf27Y0ejhoRriEGhsYSvbx-qqV_VjT2pFFkgyj_1ZI4euwna7gp" alt="Contact Hero" />
            <div className="absolute inset-0 bg-stone-900/40"></div>
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
                    45 Heritage Square, Gulberg III<br />
                    Lahore, Punjab 54000, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <span className="material-symbols-outlined text-primary text-3xl">mail</span>
                <div>
                  <h4 className="font-label-caps text-xs text-stone-400 uppercase tracking-widest mb-2">Email Us</h4>
                  <p className="font-body-md text-stone-800">concierge@rohmani.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <span className="material-symbols-outlined text-primary text-3xl">call</span>
                <div>
                  <h4 className="font-label-caps text-xs text-stone-400 uppercase tracking-widest mb-2">Call Us</h4>
                  <p className="font-body-md text-stone-800">+92 (042) 111-ROHMANI</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-stone-100">
              <h4 className="font-label-caps text-xs text-stone-400 uppercase tracking-widest mb-6">Follow Our Journey</h4>
              <div className="flex gap-6">
                <a href="#" className="text-stone-600 hover:text-primary transition-colors uppercase font-label-caps text-xs">Instagram</a>
                <a href="#" className="text-stone-600 hover:text-primary transition-colors uppercase font-label-caps text-xs">Facebook</a>
                <a href="#" className="text-stone-600 hover:text-primary transition-colors uppercase font-label-caps text-xs">Pinterest</a>
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
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full border-b border-stone-200 py-3 focus:border-primary focus:ring-0 outline-none transition-colors font-body-md"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Subject</label>
                  <input 
                    type="text" 
                    required
                    className="w-full border-b border-stone-200 py-3 focus:border-primary focus:ring-0 outline-none transition-colors font-body-md"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">Your Message</label>
                  <textarea 
                    rows="4"
                    required
                    className="w-full border-b border-stone-200 py-3 focus:border-primary focus:ring-0 outline-none transition-colors font-body-md resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
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
