import { useState, useEffect } from 'react';

export default function UnderConstructionPage() {
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const targetProgress = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    const newStars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 3 + 1
    }));
    
    setStars(newStars);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= targetProgress) {
          clearInterval(progressInterval);
          return targetProgress;
        }
        return prev + 0.5;
      });
    }, 100);
    
    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${backendUrl}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Thank you! We\'ll notify you when the site is ready.');
        setEmail('');
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-sans relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, var(--primary-dark), var(--primary-navy), var(--primary-dark))' }}>
      {/* Animated stars */}
      {stars.map((star, index) => (
        <div 
          key={index}
          className="absolute rounded-full"
          style={{
            background: 'var(--accent-yellow)',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite alternate`
          }}
        />
      ))}
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full filter blur-3xl opacity-15" style={{ background: 'var(--primary-blue)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full filter blur-3xl opacity-10" style={{ background: 'var(--accent-yellow)' }} />
      
      {/* Main container */}
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-6 rounded-2xl overflow-hidden backdrop-filter backdrop-blur-lg" style={{ 
          background: 'rgba(45, 53, 71, 0.7)', 
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(74, 124, 158, 0.3)'
        }}>
          
          {/* Left side */}
          <div className="flex flex-col items-center justify-center p-8 relative border-r" style={{ 
            background: 'linear-gradient(135deg, var(--primary-navy), var(--primary-dark))',
            borderColor: 'rgba(74, 124, 158, 0.2)'
          }}>
            {/* Progress circle */}
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: 'var(--primary-blue)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--accent-yellow)' }} />
                  </linearGradient>
                </defs>
                <circle 
                  stroke="var(--text-light)" 
                  strokeWidth="4" 
                  cx="50" 
                  cy="50" 
                  r="44" 
                  fill="transparent"
                  opacity="0.2"
                />
                <circle 
                  stroke="url(#progressGradient)" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  cx="50" 
                  cy="50" 
                  r="44" 
                  fill="transparent" 
                  strokeDasharray={`${2.76 * progress}, 276`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              
              {/* Logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ 
                  background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-yellow))',
                  boxShadow: '0 4px 16px rgba(200, 217, 70, 0.3)'
                }}>
                  <span className="text-white text-3xl font-bold">W</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-3 text-center" style={{ color: 'var(--text-white)' }}>Whitehilll</h1>
            <div className="w-16 h-1 rounded-full mb-3" style={{ background: 'linear-gradient(to right, var(--primary-blue), var(--accent-yellow))' }}></div>
            <p className="text-center text-lg" style={{ color: 'var(--text-secondary)' }}>Launching Soon</p>
          </div>
          
          {/* Right side */}
          <div className="flex flex-col justify-center p-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-white)' }}>
              We're Building Something <span style={{ color: 'var(--accent-yellow)' }}>Amazing</span>
            </h2>
            <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Our team is working hard to bring you an exceptional experience. Stay tuned for updates!
            </p>
            
            {/* Progress bar */}
            <div className="w-full rounded-full h-2 mb-2 overflow-hidden" style={{ background: 'rgba(139, 146, 163, 0.2)' }}>
              <div 
                className="h-2 rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(to right, var(--primary-blue), var(--accent-yellow))'
                }}
              ></div>
            </div>
            
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Development progress: <span className="font-medium" style={{ color: 'var(--accent-yellow)' }}>{Math.round(progress)}%</span>
            </p>
            
            {/* Subscription form */}
            <div className="mb-6 w-full">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for updates"
                  className="w-full px-5 py-4 rounded-lg text-white placeholder-opacity-70 focus:outline-none focus:ring-2 transition-all"
                  style={{
                    background: 'rgba(30, 36, 50, 0.6)',
                    border: '1px solid rgba(74, 124, 158, 0.4)',
                    color: 'var(--text-white)'
                  }}
                  required
                  disabled={isSubmitting}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-blue)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(74, 124, 158, 0.4)'}
                />
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={`absolute right-2 top-2 px-6 py-2 rounded-md transition-all font-medium ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                  style={{
                    background: isSubmitting ? 'rgba(200, 217, 70, 0.5)' : 'linear-gradient(to right, var(--primary-blue), var(--accent-yellow))',
                    color: 'var(--text-white)',
                    boxShadow: '0 4px 12px rgba(200, 217, 70, 0.3)'
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Notify Me'}
                </button>
              </div>
              {message && (
                <p className={`mt-3 text-sm ${message.includes('Thank you') ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}
            </div>
            
            {/* Social media links */}
            <div className="flex space-x-4 mb-6">
              <a href="#" className="transition-colors hover:opacity-80" style={{ color: 'var(--primary-blue)' }}>
                <div className="p-3 rounded-full transition-all" style={{ background: 'rgba(74, 124, 158, 0.2)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0H1.325C0.593 0 0 0.593 0 1.325v21.351C0 23.407 0.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463 0.099 2.795 0.143v3.24l-1.918 0.001c-1.504 0-1.795 0.715-1.795 1.763v2.313h3.587l-0.467 3.622h-3.12V24h6.116c0.73 0 1.323-0.593 1.323-1.325V1.325C24 0.593 23.407 0 22.675 0z" />
                  </svg>
                </div>
              </a>
              <a href="#" className="transition-colors hover:opacity-80" style={{ color: 'var(--primary-blue)' }}>
                <div className="p-3 rounded-full transition-all" style={{ background: 'rgba(74, 124, 158, 0.2)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.952 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.9 10.124-5.864 10.124-11.853z" />
                  </svg>
                </div>
              </a>
              <a href="#" className="transition-colors hover:opacity-80" style={{ color: 'var(--primary-blue)' }}>
                <div className="p-3 rounded-full transition-all" style={{ background: 'rgba(74, 124, 158, 0.2)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" />
                  </svg>
                </div>
              </a>
              <a href="#" className="transition-colors hover:opacity-80" style={{ color: 'var(--primary-blue)' }}>
                <div className="p-3 rounded-full transition-all" style={{ background: 'rgba(74, 124, 158, 0.2)' }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
              </a>
            </div>
            
            {/* Contact section */}
            <div className="mt-auto">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Email: <a href="mailto:whitehilll.info@gmail.com" className="hover:opacity-80 transition-opacity" style={{ color: 'var(--primary-blue)' }}>whitehilll.info@gmail.com</a>
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Phone: 
                <a href="tel:+918474896216" className="hover:opacity-80 transition-opacity ml-1" style={{ color: 'var(--primary-blue)' }}>+91 8474896216</a> | 
                <a href="tel:+917662824778" className="hover:opacity-80 transition-opacity ml-1" style={{ color: 'var(--primary-blue)' }}>+91 7662824778</a>
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-light)' }}>
                © {new Date().getFullYear()} Whitehilll. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for twinkling animation */}
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}