'use client';

import Link from 'next/link';

export default function FeaturesPage() {
  const features = [
    {
      icon: '🎤',
      title: 'Voice Threat Detection',
      description: 'AI-powered audio analysis detects screams, panic, distress keywords, and emergency sounds in real-time using Google Gemini AI.',
      details: ['Continuous 10-second audio monitoring', 'Wake phrase detection', 'Emotional stress analysis', 'Background noise classification'],
    },
    {
      icon: '🚨',
      title: 'Automatic Emergency Dispatch',
      description: 'When a threat is detected, SilentSiren automatically alerts your trusted contacts through multiple channels simultaneously.',
      details: ['WhatsApp alerts with GPS location', 'SMS fallback messaging', 'Voice call escalation', 'Push notifications via FCM'],
    },
    {
      icon: '📍',
      title: 'Real-time GPS Tracking',
      description: 'Shares your precise location with emergency contacts and can reverse-geocode coordinates to human-readable addresses.',
      details: ['Live location streaming', 'Address resolution', 'Location history', 'Map visualization'],
    },
    {
      icon: '🛡️',
      title: 'Community Validation',
      description: 'Cross-validates emergencies with nearby incidents using geospatial data to reduce false alarms and confirm threats.',
      details: ['500m radius cross-check', '5-minute time window', 'Consensus scoring', 'False alarm filtering'],
    },
    {
      icon: '🤖',
      title: 'Multi-Agent AI Workflow',
      description: 'Orchestrated AI agents handle analysis, verification, validation, and dispatch in a coordinated pipeline.',
      details: ['AudioAnalysisAgent (Gemini)', 'VerificationAgent (10s countdown)', 'CommunityValidationAgent', 'DispatchAgent (alerts)'],
    },
    {
      icon: '📊',
      title: 'Crisis Management Dashboard',
      description: 'Real-time crisis monitoring with severity assessment, resource allocation, and recovery planning.',
      details: ['Signal fusion (voice + GPS + weather)', 'Severity prediction', 'Resource allocation', 'Impact simulation'],
    },
    {
      icon: '👥',
      title: 'Trusted Contacts System',
      description: 'Manage emergency contacts with priority levels and per-contact notification preferences.',
      details: ['Priority-based alerting', 'WhatsApp / SMS / Call per contact', 'Carrier selection for free SMS', 'Easy CRUD management'],
    },
    {
      icon: '🔔',
      title: '2-Minute Countdown',
      description: 'After threat detection, a countdown gives you time to cancel if it\'s a false alarm. If not cancelled, full emergency protocol activates.',
      details: ['Visual countdown timer', 'Siren audio playback', 'One-tap "I am Safe" cancel', 'Auto-escalation on expiry'],
    },
    {
      icon: '📱',
      title: 'Free SMS System',
      description: 'Send emergency SMS via email-to-SMS gateways — no Twilio or paid service required. Supports carriers worldwide.',
      details: ['Pakistan (Jazz, Telenor, Zong)', 'USA (Verizon, AT&T, T-Mobile)', 'India (Airtel, Vodafone, Jio)', 'UK (O2, Three, Vodafone)'],
    },
    {
      icon: '📈',
      title: 'Abuse Detection & Analytics',
      description: 'Tracks user reputation, detects coordinated attacks, and prevents false alarm abuse with rate limiting.',
      details: ['User reputation scoring', 'Device fingerprinting', 'Rate limiting (3/hr, 10/day)', 'Coordinated attack detection'],
    },
    {
      icon: '🔐',
      title: 'Enterprise Security',
      description: 'Production-grade security with encryption, replay protection, RBAC, and comprehensive audit logging.',
      details: ['AES-256-GCM encryption', 'JWT with refresh tokens', 'Role-based access control', 'Request replay protection'],
    },
    {
      icon: '🌊',
      title: 'Crisis Scenarios',
      description: 'Pre-built crisis simulation scenarios for fire, flood, and false-alarm testing with full agent orchestration.',
      details: ['Fire scenario (smoke + panic)', 'Flood scenario (weather + reports)', 'False alarm testing', 'Full trace logging'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800">
      {/* Header */}
      <nav className="glass border-b border-gray-200/50 dark:border-dark-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">🚨</span>
            </div>
            <span className="text-xl font-bold gradient-text">SilentSiren</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600">About</Link>
            <Link href="/login" className="btn-ghost btn-sm">Sign In</Link>
            <Link href="/signup" className="btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
            Everything You Need to <span className="gradient-text">Stay Safe</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From AI-powered voice detection to multi-channel emergency dispatch — SilentSiren is a complete safety platform built to protect you when every second counts.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card-hover p-6 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-1.5">
                  {feature.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-500">
                      <svg className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-white dark:bg-dark-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Built with Modern Technology</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              'Next.js 14', 'TypeScript', 'Tailwind CSS', 'Google Gemini', 'PostgreSQL', 'Redis',
              'Firebase', 'Express.js', 'Zustand', 'Framer Motion', 'Neon DB', 'Docker',
            ].map((tech) => (
              <div key={tech} className="card text-center p-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Ready to feel safer?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Join SilentSiren today and get AI-powered emergency protection — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary btn-lg">Get Started Free</Link>
            <Link href="/about" className="btn-outline btn-lg">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 dark:bg-dark-950 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">🚨</span>
            </div>
            <span className="text-lg font-bold text-white">SilentSiren</span>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} SilentSiren AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
