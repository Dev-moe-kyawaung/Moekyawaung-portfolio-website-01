import { useState, useEffect, useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { useInView } from 'react-intersection-observer';
import { 
  FiGithub, FiLinkedin, FiYoutube, 
  FiMail, FiPhone, FiMapPin, FiExternalLink, FiDownload,
  FiSun, FiMoon, FiArrowUp, FiMenu, FiX, FiCheck, FiCode,
  FiSmartphone, FiShield, FiCloud, FiCpu, FiLayers,
  FiZap, FiTarget, FiAward, FiGlobe, FiLock, FiSettings, FiPackage, FiGitBranch
} from 'react-icons/fi';
import { 
  FaSlack, FaRedditAlien, FaTumblr, FaGithub
} from 'react-icons/fa';

// Particle background component
const ParticlesBackground = ({ isDark }: { isDark: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let particles: Array<{
      x: number; y: number; vx: number; vy: number; size: number; opacity: number;
    }> = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const createParticles = () => {
      particles = [];
      const count = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    };
    
    const animate = () => {
      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.1)' : 'rgba(248, 250, 252, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark 
          ? `rgba(59, 130, 246, ${p.opacity})` 
          : `rgba(37, 99, 235, ${p.opacity})`;
        ctx.fill();
        
        particles.forEach((p2, j) => {
          if (i === j) return;
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark 
              ? `rgba(59, 130, 246, ${0.1 * (1 - dist/100)})` 
              : `rgba(37, 99, 235, ${0.1 * (1 - dist/100)})`;
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    resize();
    createParticles();
    animate();
    
    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
    
    return () => cancelAnimationFrame(animationId);
  }, [isDark]);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Custom cursor component
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const hoverStart = () => setIsHovering(true);
    const hoverEnd = () => setIsHovering(false);
    
    document.addEventListener('mousemove', move);
    
    const interactiveElements = document.querySelectorAll('a, button, .hover-target');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', hoverStart);
      el.addEventListener('mouseleave', hoverEnd);
    });
    
    return () => {
      document.removeEventListener('mousemove', move);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', hoverStart);
        el.removeEventListener('mouseleave', hoverEnd);
      });
    };
  }, []);
  
  return (
    <>
      <div 
        className="fixed w-5 h-5 bg-blue-500 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
        style={{
          left: position.x - 10,
          top: position.y - 10,
          transform: isHovering ? 'scale(2)' : 'scale(1)',
          transition: 'transform 0.15s ease'
        }}
      />
      <div 
        className="fixed w-8 h-8 border-2 border-blue-400 rounded-full pointer-events-none z-[9998] mix-blend-difference hidden lg:block"
        style={{
          left: position.x - 16,
          top: position.y - 16,
          transform: isHovering ? 'scale(0)' : 'scale(1)',
          transition: 'transform 0.15s ease'
        }}
      />
    </>
  );
};

// Animated section component
const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  return (
    <div 
      ref={ref}
      className={`transition-all duration-1000 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Navigation component
const Navigation = ({ isDark, setIsDark, activeSection }: { isDark: boolean; setIsDark: (v: boolean) => void; activeSection: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#architecture', label: 'Architecture' },
    { href: '#apps', label: 'Apps' },
    { href: '#startup', label: 'Startup' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ];
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#hero" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-blue-500">&lt;</span>
            <span>MKA</span>
            <span className="text-blue-500">/&gt;</span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  activeSection === link.href.slice(1) ? 'text-blue-500' : isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t dark:border-gray-700">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

// Main App component
function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      
      // Update active section
      const sections = ['hero', 'about', 'skills', 'architecture', 'apps', 'startup', 'projects', 'contact'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <ParticlesBackground isDark={isDark} />
      <CustomCursor />
      <Navigation isDark={isDark} setIsDark={setIsDark} activeSection={activeSection} />
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <img
              src="https://res.cloudinary.com/dye5qpwii/image/upload/v1778763535/MKA_25_lbx6fb.webp"
              alt="Moe Kyaw Aung"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto border-4 border-blue-500 shadow-2xl shadow-blue-500/30 object-cover"
            />
          </div>
          
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-blue-500">{"<"}</span>
              မိုးကျော်အောင် · Moe Kyaw Aung
              <span className="text-blue-500">{" />"}</span>
            </h1>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="text-xl md:text-2xl mb-6">
              <TypeAnimation
                sequence={[
                  'Senior Mobile Architect 🚀',
                  2000,
                  'Android Expert ☕',
                  2000,
                  'Startup Founder 💡',
                  2000,
                  'App Builder for Millions 📱',
                  2000,
                  'Clean Architecture Advocate 🏗️',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-blue-400"
              />
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <p className="text-lg md:text-xl mb-8 text-gray-400">
              Tachileik, Myanmar 🇲🇲 ↔ Bangkok, Thailand 🇹🇭
            </p>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-medium">
                Burmese 🇲🇲
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full text-sm font-medium">
                English 🌐
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-sm font-medium">
                Kotlin ☕
              </span>
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <FiSmartphone className="text-2xl text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-medium">Mobile</p>
                <p className="text-xs text-gray-400">Kotlin · Compose · MVVM</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <FiCloud className="text-2xl text-green-400 mx-auto mb-2" />
                <p className="text-sm font-medium">Backend</p>
                <p className="text-xs text-gray-400">Firebase · REST APIs</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <FiShield className="text-2xl text-red-400 mx-auto mb-2" />
                <p className="text-sm font-medium">Security</p>
                <p className="text-xs text-gray-400">Ethical Hacking</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <FiCpu className="text-2xl text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-medium">AI / ML</p>
                <p className="text-xs text-gray-400">Claude API · TFLite</p>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <a href="#apps" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-all hover:scale-105 flex items-center justify-center gap-2">
                <FiSmartphone /> View My Apps
              </a>
              <a href="#contact" className="px-8 py-3 border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-full font-medium transition-all hover:scale-105 flex items-center justify-center gap-2">
                <FiMail /> Contact Me
              </a>
              <a href="#" className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-full font-medium transition-all hover:scale-105 flex items-center justify-center gap-2">
                <FiDownload /> Resume
              </a>
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="flex justify-center gap-4">
              <a href="https://github.com/Dev-moe-kyawaung/" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-400 transition-colors"><FiGithub /></a>
              <a href="https://www.linkedin.com/in/moe-kyaw-aung-2653093a1" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-400 transition-colors"><FiLinkedin /></a>
              <a href="https://www.youtube.com/channel/UCuTXUguZb4xjeL2nX8WJG" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-red-400 transition-colors"><FiYoutube /></a>
              <a href="https://www.tumblr.com/moekyawaung" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-500 transition-colors"><FaTumblr /></a>
              <a href="https://bsky.app/profile/moekyawaung96.bsky.social" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-blue-400 transition-colors"><FaRedditAlien /></a>
            </div>
          </AnimatedSection>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#about" className="text-gray-400 hover:text-blue-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-blue-500 font-medium">About Me</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                Code with culture. Build with purpose.
              </h2>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dye5qpwii/image/upload/v1778763531/MKA_12_iv8kpm.webp"
                  alt="Moe Kyaw Aung Working"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
                  <span className="text-2xl font-bold">82+</span>
                  <span className="text-sm block">Certificates</span>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <h3 className="text-2xl font-bold mb-6">Senior Mobile Architect & Startup Builder</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Passionate and self-motivated developer focused on building responsive, modern, and user-friendly mobile experiences. 
                With expertise spanning from web development to mobile apps, databases to AI, I consistently expand my skill set across 
                the full technology spectrum.
              </p>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Currently building apps used by millions. From clean architecture decisions to modularization strategies, 
                I design systems that scale. Whether it's setting up CI/CD pipelines or implementing security best practices, 
                I ensure every app is production-ready.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-blue-400">40+</p>
                  <p className="text-sm text-gray-400">Projects Completed</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-green-400">1M+</p>
                  <p className="text-sm text-gray-400">App Downloads</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-purple-400">3+</p>
                  <p className="text-sm text-gray-400">Years Experience</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-orange-400">16+</p>
                  <p className="text-sm text-gray-400">Active Apps</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiCheck className="text-green-400" />
                  <span>Currently Building: MoekyawTranslator — AI Translation App</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheck className="text-green-400" />
                  <span>Certifications: 40+ certs · Google Developers Launchpad</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheck className="text-green-400" />
                  <span>Open to Opportunities 🟢</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-blue-500 font-medium">Tech Stack</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Skills & Technologies</h2>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection>
              <div className="p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiSmartphone className="text-blue-400" /> Android / Mobile
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Kotlin', 'Jetpack Compose', 'Android', 'MVVM', 'Clean Architecture', 'Coroutines', 'Flow', 'Room'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiCloud className="text-green-400" /> Backend & Cloud
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Firebase', 'REST APIs', 'Retrofit', 'Python', 'Node.js', 'GraphQL'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiCpu className="text-purple-400" /> AI / ML
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Claude API', 'TensorFlow Lite', 'On-Device ML', 'Python ML', 'OpenAI'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiShield className="text-red-400" /> Security
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Ethical Hacking', 'Cybersecurity', 'Kali Linux', 'Pen Testing', 'Network Security'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiGitBranch className="text-orange-400" /> DevOps & CI/CD
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['GitHub Actions', 'Azure DevOps', 'Jenkins', 'Fastlane', 'Docker', 'Git'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FiCode className="text-cyan-400" /> Web & Frontend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'HTML5/CSS3'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
          
          <AnimatedSection>
            <div className="mt-12 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl">
              <h3 className="text-xl font-bold mb-6 text-center">Architecture & Design Patterns</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  'Clean Architecture', 'MVVM', 'MVI', 'Multi-module', 'Repository Pattern',
                  'Dependency Injection', 'SOLID Principles', 'Domain-Driven Design',
                  'Event-Driven Architecture', 'Offline-First'
                ].map(pattern => (
                  <span key={pattern} className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-all">
                    {pattern}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-blue-500 font-medium">Architecture</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                This Engineer Builds Apps Used by Millions
              </h2>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <FiLayers className="text-3xl" />,
                title: 'Modularization Strategy',
                desc: 'Feature-based module separation with clean boundaries. Domain, data, and presentation layers properly isolated.',
                color: 'blue'
              },
              {
                icon: <FiPackage className="text-3xl" />,
                title: 'Multi-Module Projects',
                desc: 'Scalable project structure with shared core modules, feature modules, and test modules for maximum reusability.',
                color: 'purple'
              },
              {
                icon: <FiSettings className="text-3xl" />,
                title: 'Dependency Injection',
                desc: 'Hilt/Dagger implementation with proper scoping, component hierarchy, and module organization.',
                color: 'green'
              },
              {
                icon: <FiGitBranch className="text-3xl" />,
                title: 'CI/CD Pipelines',
                desc: 'Automated build, test, and deployment pipelines with GitHub Actions and Azure DevOps.',
                color: 'orange'
              },
              {
                icon: <FiTarget className="text-3xl" />,
                title: 'Testing Strategy',
                desc: 'Comprehensive testing with unit, integration, and UI tests. 90%+ coverage with MockK and Espresso.',
                color: 'red'
              },
              {
                icon: <FiZap className="text-3xl" />,
                title: 'App Scalability',
                desc: 'Performance optimization, memory management, and architecture patterns for apps serving millions.',
                color: 'yellow'
              },
            ].map((item, index) => (
              <AnimatedSection key={index}>
                <div className={`p-6 bg-${item.color}-500/10 border border-${item.color}-500/20 rounded-2xl hover:scale-105 transition-all`}>
                  <div className={`text-${item.color}-400 mb-4`}>{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection>
            <div className="mt-12 p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700">
              <h3 className="text-2xl font-bold mb-6 text-center">Security Implementation</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <FiShield className="text-4xl text-green-400 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Data Encryption</h4>
                  <p className="text-sm text-gray-400">AES-256 encryption for sensitive data, secure key storage with Android Keystore</p>
                </div>
                <div className="text-center">
                  <FiLock className="text-4xl text-blue-400 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Network Security</h4>
                  <p className="text-sm text-gray-400">Certificate pinning, TLS 1.3, network security config for all API calls</p>
                </div>
                <div className="text-center">
                  <FiCheck className="text-4xl text-purple-400 mx-auto mb-3" />
                  <h4 className="font-bold mb-2">Authentication</h4>
                  <p className="text-sm text-gray-400">Biometric auth, OAuth 2.0, Firebase Auth with proper session management</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* App Collection Section */}
      <section id="apps" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-blue-500 font-medium">My Apps</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">App Collection</h2>
              <p className="text-gray-400 mt-4">16+ Production Apps • Used by Thousands</p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: 1, name: 'Social Dashboard', icon: '📱', color: 'from-blue-500 to-cyan-500', url: 'https://github.com/moekyawaung-tech/social-dashboard' },
              { num: 2, name: 'PWA App', icon: '🌐', color: 'from-purple-500 to-pink-500', url: 'https://github.com/moekyawaung-tech/pwa-app' },
              { num: 3, name: 'Game Collection', icon: '🎮', color: 'from-green-500 to-emerald-500', url: 'https://github.com/moekyawaung-tech/game-collection' },
              { num: 4, name: 'Video Player', icon: '🎯', color: 'from-red-500 to-orange-500', url: 'https://github.com/moekyawaung-tech/video-player' },
              { num: 5, name: 'E-commerce', icon: '🛒', color: 'from-yellow-500 to-orange-500', url: '#' },
              { num: 6, name: 'Weather App', icon: '🌤️', color: 'from-sky-500 to-blue-500', url: 'https://github.com/moekyawaung-tech/Weather-app' },
              { num: 7, name: 'Todo App', icon: '📝', color: 'from-indigo-500 to-purple-500', url: 'https://github.com/moekyawaung-tech/javascript-todo' },
              { num: 8, name: 'Job Portal', icon: '💼', color: 'from-teal-500 to-cyan-500', url: 'https://github.com/moekyawaung-tech/Job-Portal-App' },
              { num: 9, name: 'POS Full Version', icon: '💰', color: 'from-green-500 to-teal-500', url: 'https://github.com/moekyawaung-tech/POS-Full-Version' },
              { num: 10, name: 'Advance POS', icon: '📊', color: 'from-violet-500 to-purple-500', url: 'https://github.com/moekyawaung-tech/Advance-POS-Version' },
              { num: 11, name: 'POS Ultimate', icon: '🚀', color: 'from-pink-500 to-rose-500', url: 'https://github.com/moekyawaung-tech/POS-Ultimate-Version' },
              { num: 12, name: 'POS Pro Max', icon: '👑', color: 'from-amber-500 to-yellow-500', url: 'https://github.com/moekyawaung-tech/POS-Ultimate-Pro-Max' },
              { num: 13, name: 'Snake Game', icon: '🐍', color: 'from-lime-500 to-green-500', url: 'https://github.com/moekyawaung-tech/Snake-Game-App' },
              { num: 14, name: 'Casino App', icon: '🎰', color: 'from-red-500 to-pink-500', url: 'https://github.com/moekyawaung-tech/casino-app' },
              { num: 15, name: 'Daily Planner', icon: '📋', color: 'from-cyan-500 to-blue-500', url: 'https://github.com/moekyawaung-tech/Daily-planner-app' },
              { num: 16, name: 'Lens Lite', icon: '📷', color: 'from-fuchsia-500 to-pink-500', url: 'https://github.com/moekyawaung-tech/Lens-lite' },
            ].map((app) => (
              <AnimatedSection key={app.num}>
                <a 
                  href={app.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all hover:scale-105"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${app.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    {app.icon}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{app.name}</h3>
                      <p className="text-sm text-gray-400">App #{app.num}</p>
                    </div>
                    <FiExternalLink className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection>
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl">
                <span className="text-4xl">🎯</span>
                <div className="text-left">
                  <p className="font-bold text-xl">LEGEND! 🔥</p>
                  <p className="text-gray-400">Building apps that make a difference</p>
                </div>
                <span className="text-4xl">🚀</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Startup Section */}
      <section id="startup" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-blue-500 font-medium">Startup Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Technical Founder</h2>
              <p className="text-gray-400 mt-4">From MVP to Scale</p>
            </div>
          </AnimatedSection>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <AnimatedSection>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Products Launched</h3>
                {[
                  { name: 'MoekyawTranslator', desc: 'AI Translation App with on-device ML', status: 'Active', color: 'green' },
                  { name: 'POS System Suite', desc: 'Complete retail management solution', status: 'Active', color: 'green' },
                  { name: 'Job Portal', desc: 'Job matching platform with smart filters', status: 'Active', color: 'green' },
                  { name: 'Video Player Pro', desc: 'Advanced media player with gestures', status: 'Active', color: 'green' },
                  { name: 'Social Dashboard', desc: 'Unified social media analytics', status: 'Beta', color: 'yellow' },
                ].map((product, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{product.name}</h4>
                      <p className="text-sm text-gray-400">{product.desc}</p>
                    </div>
                    <span className={`px-3 py-1 bg-${product.color}-500/20 text-${product.color}-400 rounded-full text-sm`}>
                      {product.status}
                    </span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Growth Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl text-center">
                    <p className="text-4xl font-bold text-blue-400">1M+</p>
                    <p className="text-gray-400">Total Downloads</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl text-center">
                    <p className="text-4xl font-bold text-green-400">50K+</p>
                    <p className="text-gray-400">Monthly Active</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl text-center">
                    <p className="text-4xl font-bold text-purple-400">4.5★</p>
                    <p className="text-gray-400">Average Rating</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl text-center">
                    <p className="text-4xl font-bold text-orange-400">99.9%</p>
                    <p className="text-gray-400">Uptime</p>
                  </div>
                </div>
                
                <div className="p-6 bg-white/5 rounded-2xl">
                  <h4 className="font-bold mb-4">Product Decisions</h4>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-start gap-2">
                      <FiCheck className="text-green-400 mt-1 flex-shrink-0" />
                      <span>Offline-first architecture for reliability in Myanmar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheck className="text-green-400 mt-1 flex-shrink-0" />
                      <span>On-device AI for privacy and speed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheck className="text-green-400 mt-1 flex-shrink-0" />
                      <span>Multi-language support (Burmese, English, Thai)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FiCheck className="text-green-400 mt-1 flex-shrink-0" />
                      <span>Progressive enhancement for low-end devices</span>
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-blue-500 font-medium">Featured Projects</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">GitHub Repositories</h2>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'social-dashboard',
                desc: 'Real-time social media analytics dashboard',
                stars: '⭐ 42',
                lang: 'JavaScript',
                color: 'yellow'
              },
              {
                name: 'video-player',
                desc: 'Advanced video player with gesture controls',
                stars: '⭐ 38',
                lang: 'HTML',
                color: 'red'
              },
              {
                name: 'pwa-app',
                desc: 'Progressive Web App with offline support',
                stars: '⭐ 35',
                lang: 'JavaScript',
                color: 'purple'
              },
              {
                name: 'game-collection',
                desc: 'Collection of browser-based games',
                stars: '⭐ 28',
                lang: 'JavaScript',
                color: 'green'
              },
              {
                name: 'Job-Portal-App',
                desc: 'Job matching platform with smart filters',
                stars: '⭐ 45',
                lang: 'JavaScript',
                color: 'blue'
              },
              {
                name: 'POS-Full-Version',
                desc: 'Complete point of sale system',
                stars: '⭐ 52',
                lang: 'JavaScript',
                color: 'cyan'
              },
            ].map((project, i) => (
              <AnimatedSection key={i}>
                <a
                  href={`https://github.com/moekyawaung-tech/${project.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all hover:scale-105 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <FiGithub className="text-2xl text-gray-500 group-hover:text-white transition-colors" />
                    <FiExternalLink className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{project.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 bg-${project.color}-500/20 text-${project.color}-400 rounded-full text-xs`}>
                      {project.lang}
                    </span>
                    <span className="text-sm text-gray-400">{project.stars}</span>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Accounts */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-blue-500 font-medium">GitHub Presence</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">43 GitHub Accounts</h2>
              <p className="text-gray-400 mt-4">Multiple developer profiles across different domains</p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Dev-moe-kyawaung',
              'moekyawaung-tech',
              'moekyawaung-china',
              'moekyawaung-developer',
              'moekyaw-aung-mm',
              'moekyawaung-mk',
              'moekyawaung-microsoft',
              'moekyawaung-cyber',
              'moekyawaung-bangkok',
              'moekyawaung-micro',
              'moekyawaung-dev-mm',
              'moekyaw-developer',
              'moekyawaung.github.io',
              'Moekyawaung-mm',
              'moekyawaung-hack',
              'moekyawaung-graduate',
              'Moekyawaung-Linux',
              'Moekyawaung-coder',
              'moekyawaung-designer',
              'Moekyawaung2026',
              'moekyawaung-web',
              'MoeKyawAung-code',
              'moekyawaung-creator',
              'moekyawaung-webdeveloper',
              'Moekyawaung-co',
              'moekyawaung-edu',
              'moekyawaung-senior',
              'Moekyawaung-Development',
              'moekyawaung-google',
              'Moe-KyawAung',
              'moekyawaungmka2032-boop',
              'moekyawaungvivov30pro-design',
            ].map((account, i) => (
              <AnimatedSection key={i}>
                <a
                  href={`https://github.com/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-center group"
                >
                  <FaGithub className="text-2xl text-gray-500 group-hover:text-white mx-auto mb-2 transition-colors" />
                  <p className="text-xs font-medium truncate text-gray-400 group-hover:text-white">{account}</p>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Lovable Apps */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-blue-500 font-medium">Lovable Apps</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Live Web Applications</h2>
              <p className="text-gray-400 mt-4">38+ Deployed Applications</p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'CV Creator', url: 'https://happy-cv-creator.lovable.app' },
              { name: 'My Profile', url: 'https://moekyawaung.lovable.app' },
              { name: 'CV Palette', url: 'https://the-cv-palette.lovable.app' },
              { name: 'URL Shortener', url: 'https://moekyaw-url.lovable.app' },
              { name: 'Dev Profile', url: 'https://moekyawaung-dev.lovable.app' },
              { name: 'My Bio', url: 'https://moekyawaungmybio.lovable.app/' },
              { name: 'CV Beacon', url: 'https://cv-beacon.lovable.app/' },
              { name: 'Profile Hub', url: 'https://profile-persuasion-hub.lovable.app' },
              { name: 'Skill Gallery', url: 'https://app-skill-gallery.lovable.app' },
              { name: 'Code Life', url: 'https://joy-codify-life.lovable.app/' },
              { name: 'GitHub Profile', url: 'https://moekyawaung-github.lovable.app' },
              { name: 'Spark Coach', url: 'https://spark-coach-create.lovable.app' },
            ].map((app, i) => (
              <AnimatedSection key={i}>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl hover:from-pink-500/20 hover:to-purple-500/20 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{app.name}</span>
                    <FiExternalLink className="text-gray-500 group-hover:text-pink-400 transition-colors" />
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Email Collection */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-blue-500 font-medium">Get In Touch</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Email Addresses</h2>
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'moekyawaung@programmer.net',
                  'moekyawaung@technologist.com',
                  'moekyawaung@engineer.com',
                  'moekyawaung@techie.com',
                  'moekyawaung@linuxmail.org',
                  'moekyawaung@mail.com',
                ].map((email, i) => (
                  <a
                    key={i}
                    href={`mailto:${email}`}
                    className="flex items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-sm"
                  >
                    <FiMail className="text-blue-400" />
                    <span className="truncate">{email.split('@')[0]}</span>
                  </a>
                ))}
              </div>
              <div className="mt-6 text-center">
                <a
                  href="mailto:moekyawaung@programmer.net"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-all"
                >
                  <FiMail /> Send Me an Email
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-blue-500 font-medium">Connect</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Social Media</h2>
              <p className="text-gray-400 mt-4">Find me across the internet</p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {[
                { name: 'GitHub', icon: <FaGithub />, url: 'https://github.com/Dev-moe-kyawaung/', color: 'gray' },
                { name: 'LinkedIn', icon: <FiLinkedin />, url: 'https://www.linkedin.com/in/moe-kyaw-aung-2653093a1', color: 'blue' },
                { name: 'YouTube', icon: <FiYoutube />, url: 'https://www.youtube.com/channel/UCuTXUguZb4xjeL2nX8WJG', color: 'red' },
                { name: 'Tumblr', icon: <FaTumblr />, url: 'https://www.tumblr.com/moekyawaung', color: 'indigo' },
                { name: 'Bluesky', icon: <FiGlobe />, url: 'https://bsky.app/profile/moekyawaung96.bsky.social', color: 'sky' },
                { name: 'Flickr', icon: <FiGlobe />, url: 'https://www.flickr.com/people/204037451@N06', color: 'pink' },
                { name: 'Vimeo', icon: <FiYoutube />, url: 'https://vimeo.com/user252414232', color: 'cyan' },
                { name: 'Gravatar', icon: <FiGlobe />, url: 'https://gravatar.com/moekyawaung13721', color: 'green' },
                { name: 'Slack', icon: <FaSlack />, url: 'https://moekyawaung.slack.com/', color: 'purple' },
                { name: 'Strikingly', icon: <FiGlobe />, url: 'http://moekyawaung2026.strikingly.com', color: 'orange' },
                { name: 'YouTube', icon: <FiYoutube />, url: 'https://www.youtube.com/channel/UCuTXUguZb4xjeL2nX8WJG', color: 'red' },
                { name: 'GitHub', icon: <FaGithub />, url: 'https://github.com/moekyawaung-tech', color: 'gray' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center gap-2 p-4 bg-${social.color}-500/10 rounded-xl hover:bg-${social.color}-500/20 transition-all group`}
                >
                  <span className={`text-3xl text-${social.color}-400 group-hover:scale-110 transition-transform`}>
                    {social.icon}
                  </span>
                  <span className="text-sm font-medium">{social.name}</span>
                </a>
              ))}
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <FiPhone className="text-blue-400" />
                <span>+95 9 889 000 889</span>
                <span className="text-gray-500">|</span>
                <span>+959 666 000 050</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-blue-500 font-medium">Certifications</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">82+ Certificates</h2>
              <p className="text-gray-400 mt-4">Programming Hub Certified Developer</p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'C Programming', 'Python', 'Java', 'JavaScript',
              'React', 'Node.js', 'Angular', 'Vue.js',
              'Flutter', 'Kotlin', 'Swift', 'TypeScript',
              'MongoDB', 'PostgreSQL', 'Firebase', 'AWS',
              'Machine Learning', 'Deep Learning', 'NLP', 'TensorFlow',
              'Blockchain', 'Ethereum', 'Cyber Security', 'Ethical Hacking',
              'Docker', 'Kubernetes', 'CI/CD', 'Git',
              'HTML5', 'CSS3', 'SASS', 'jQuery',
              'SQL', 'NoSQL', 'Redis', 'GraphQL',
              'Data Structures', 'Algorithms', 'OOP', 'Design Patterns',
              'Flutter Advanced', 'Kotlin Coroutines', 'Jetpack', 'Compose',
            ].map((cert, i) => (
              <AnimatedSection key={i}>
                <div className="p-4 bg-white/5 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-all">
                  <FiAward className="text-yellow-400 flex-shrink-0" />
                  <span className="text-sm">{cert}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-blue-500 font-medium">Gallery</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Behind The Scenes</h2>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795799/2024119_20_b94fen.jpg',
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795800/2024119_18_syk2ou.jpg',
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795800/2024119_12_sqhcat.jpg',
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795801/MKA_22_felevo.webp',
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763532/MKA_11_jbijtv.webp',
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763532/MKA_13_i4bao3.webp',
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763536/preview_ls5ptn.webp',
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1779031816/Content_65_oayzj3.jpg',
            ].map((img, i) => (
              <AnimatedSection key={i}>
                <a href={img} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl hover:scale-105 transition-transform">
                  <img 
                    src={img} 
                    alt={`Gallery ${i + 1}`} 
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </a>
              </AnimatedSection>
            ))}
          </div>
          
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795825/cloud-icon-poster-1_2_opl7sy.png',
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795856/copilot_image_1778795675037_heh9xk.png',
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795856/copilot_image_1778794626112_ega7kk.png',
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795859/copilot_image_1778794430377_n7xlmz.png',
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795856/copilot_image_1778795000722_eo96gj.png',
              'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795829/copilot_image_1778795000722_okryxj.png',
            ].map((img, i) => (
              <AnimatedSection key={i}>
                <a href={img} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl hover:scale-105 transition-transform">
                  <img 
                    src={img} 
                    alt={`Artwork ${i + 1}`} 
                    className="w-full h-40 object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-blue-500 font-medium">Contact</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Let's Build Something Amazing</h2>
            </div>
          </AnimatedSection>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <AnimatedSection>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Get in touch</h3>
                <p className="text-gray-400">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <FiMail className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <a href="mailto:moekyawaung@programmer.net" className="font-medium hover:text-blue-400 transition-colors">
                        moekyawaung@programmer.net
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <FiPhone className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="font-medium">+95 9 889 000 889</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <FiMapPin className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="font-medium">Tachileik ↔ Bangkok</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent! (Demo)'); }}>
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <FiMail /> Send Message
                </button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold mb-2">
                <span className="text-blue-500">&lt;</span>Moe Kyaw Aung<span className="text-blue-500">/&gt;</span>
              </p>
              <p className="text-gray-400">Senior Mobile Architect & Startup Founder</p>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="https://github.com/Dev-moe-kyawaung/" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-blue-400 transition-colors">
                <FiGithub />
              </a>
              <a href="https://www.linkedin.com/in/moe-kyaw-aung-2653093a1" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-blue-400 transition-colors">
                <FiLinkedin />
              </a>
              <a href="https://www.youtube.com/channel/UCuTXUguZb4xjeL2nX8WJG" target="_blank" rel="noopener noreferrer" className="text-xl hover:text-red-400 transition-colors">
                <FiYoutube />
              </a>
              <a href="mailto:moekyawaung@programmer.net" className="text-xl hover:text-blue-400 transition-colors">
                <FiMail />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© 2026 Moe Kyaw Aung. All rights reserved.</p>
            <p className="mt-2">Code with culture. Build with purpose. 🇲🇲</p>
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all hover:scale-110 z-50"
        >
          <FiArrowUp />
        </button>
      )}
    </div>
  );
}

export default App;
