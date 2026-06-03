'use client';

import Link from 'next/link';

export default function AboutPage() {
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
            <Link href="/features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600">Features</Link>
            <Link href="/login" className="btn-ghost btn-sm">Sign In</Link>
            <Link href="/signup" className="btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
            Protecting Lives with <span className="gradient-text">AI-Powered</span> Emergency Response
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            SilentSiren is an advanced emergency detection platform that uses artificial intelligence to detect threats, validate incidents, and dispatch help — all in seconds.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white dark:bg-dark-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Every year, millions of emergencies go unreported because victims cannot reach their phones, are too afraid to make noise, or don&apos;t have time to call for help.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                SilentSiren changes that. Our AI listens for distress signals — screams, panic in voice, emergency keywords — and automatically triggers alerts to your trusted contacts, shares your GPS location, and can even call emergency services.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                We believe everyone deserves to feel safe. Our technology ensures that help is always just a voice command away.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '24/7', label: 'Monitoring' },
                { number: '<3s', label: 'Detection Time' },
                { number: '99%', label: 'Accuracy' },
                { number: '100%', label: 'Free to Use' },
              ].map((stat) => (
                <div key={stat.label} className="card text-center p-6">
                  <div className="text-3xl font-black gradient-text mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">How SilentSiren Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Voice Detection', desc: 'AI continuously monitors audio for emergency signals — screams, panic, distress keywords.' },
              { step: '02', title: 'Threat Analysis', desc: 'Gemini AI analyzes the audio context, emotional stress, and background noise to assess threat level.' },
              { step: '03', title: 'Community Validation', desc: 'Cross-validates incidents with nearby reports to reduce false alarms and confirm legitimacy.' },
              { step: '04', title: 'Instant Dispatch', desc: 'Sends alerts via WhatsApp, SMS, voice calls, and push notifications to your trusted contacts.' },
            ].map((item) => (
              <div key={item.step} className="card-hover p-6">
                <div className="text-4xl font-black text-primary-200 dark:text-primary-800 mb-3">{item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 bg-white dark:bg-dark-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Powered by Advanced Technology</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🤖', title: 'Google Gemini AI', desc: 'State-of-the-art audio analysis for threat detection with 99% accuracy.' },
              { icon: '🌍', title: 'Real-time GPS', desc: 'Precise location tracking and sharing with emergency contacts and services.' },
              { icon: '📊', title: 'Multi-Signal Fusion', desc: 'Combines voice, GPS, weather, and traffic data for accurate crisis assessment.' },
              { icon: '🛡️', title: 'Community Validation', desc: 'Cross-references incidents with nearby reports to eliminate false alarms.' },
              { icon: '📱', title: 'Multi-Channel Alerts', desc: 'WhatsApp, SMS, voice calls, and push notifications — redundancy ensures delivery.' },
              { icon: '🔒', title: 'End-to-End Security', desc: 'AES-256 encryption, JWT auth, and replay protection keep your data safe.' },
            ].map((item) => (
              <div key={item.title} className="card-hover p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Built for Safety</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            SilentSiren is built by a team passionate about leveraging AI for public safety. We combine expertise in machine learning, emergency response systems, and mobile technology to create a platform that can genuinely save lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary btn-lg">Get Started Free</Link>
            <Link href="/features" className="btn-outline btn-lg">View Features</Link>
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
