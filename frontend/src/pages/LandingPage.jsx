import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Compass, HeartHandshake, Sparkles, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { io as ioClient } from 'socket.io-client';

const features = [
  {
    title: 'Trustworthy reviews',
    description: 'Read authentic feedback from real shoppers and make smarter choices for every visit.',
  },
  {
    title: 'Business insights',
    description: 'Store owners can respond to feedback, improve service, and build stronger customer relationships.',
  },
  {
    title: 'Community-driven discovery',
    description: 'Explore curated stores, browse highlights, and find the best local experiences around you.',
  },
];

const stats = [
  { value: '10k+', label: 'Customer reviews' },
  { value: '500+', label: 'Trusted stores' },
  { value: '4.9/5', label: 'Average satisfaction' },
];

export default function LandingPage() {
  const { user } = useAuth();

  const getDashboardRoute = () => {
    if (user?.role === 'System Administrator') return '/admin/dashboard';
    if (user?.role === 'Store Owner') return '/owner/dashboard';
    if (user?.role === 'Normal User') return '/explore';
    return '/login';
  };

  const [topStores, setTopStores] = useState([]);

  useEffect(() => {
    let socket;
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const base = import.meta.env.VITE_BACKEND_URL || (isLocal ? 'http://localhost:5000' : 'https://store-rating-application-udwi.onrender.com');

    const fetchTop = async () => {
      try {
        const res = await fetch(`${base}/api/stores/top`);
        if (!res.ok) return;
        const body = await res.json();
        setTopStores(body.data?.stores || []);
      } catch (e) {
        console.error('Failed to fetch top stores', e);
      }
    };

    fetchTop();

    try {
      socket = ioClient(base);
      socket.on('connect', () => {
        console.log('Connected to live feed!');
      });
      socket.on('storesUpdate', (payload) => {
        setTopStores(payload || []);
      });
    } catch (e) {
      console.error('Socket connection failed', e);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <div id="top" className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] text-slate-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white shadow-lg shadow-slate-300">
            ★
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">StoreRating</p>
            <p className="text-sm text-slate-600">Discover. Review. Grow.</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <a href="#top" className="transition hover:text-blue-600">Home</a>
          <a href="#features" className="transition hover:text-blue-600">Features</a>
          <a href="#about" className="transition hover:text-blue-600">About</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to={getDashboardRoute()}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-blue-600"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-blue-600"
              >
                Join now
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <section className="grid items-center gap-8 rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.3)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <Sparkles className="mr-2 h-4 w-4" /> Trusted local ratings, beautifully presented
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Make every store visit feel confident and informed.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                StoreRating brings shoppers and store owners together in one polished experience—where honest feedback shapes better choices and stronger businesses.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Get started for free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
              >
                Explore the platform <Compass className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center">
                  <p className="text-xl font-semibold text-slate-900">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300 lg:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Today’s highlights</p>
                <h2 className="mt-1 text-2xl font-semibold">Top-rated stores</h2>
              </div>
              <div className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-300">
                Live feed
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {/* BUG FIX 2: Removed fake placeholder data. Now it accurately reflects your DB! */}
              {topStores.length > 0 ? (
                topStores.map((s, idx) => (
                  <div key={s.id || idx} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{s.name}</p>
                        <p className="mt-1 text-sm text-slate-400">{s.meta || `${s.overallRating} • ${s.reviews || '0'} reviews`}</p>
                      </div>
                      <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-semibold text-emerald-300 flex items-center gap-2">
                        <Star className="h-4 w-4 text-emerald-300" /> {s.overallRating ?? '—'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-sm text-slate-400">Waiting for live store data...</p>
              )}
            </div>
          </div>
        </section>

        <section id="features" className="mt-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Why people love it</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to discover and grow with confidence.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm shadow-slate-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  {feature.title === 'Trustworthy reviews' ? (
                    <BadgeCheck className="h-6 w-6" />
                  ) : feature.title === 'Business insights' ? (
                    <HeartHandshake className="h-6 w-6" />
                  ) : (
                    <Star className="h-6 w-6" />
                  )}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="mt-20 rounded-[2rem] border border-slate-200 bg-slate-900 px-8 py-12 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">Built for modern discovery</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">A smarter way to explore the places you care about.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Whether you are a shopper looking for the best spot or a store owner eager to build trust, StoreRating helps everyone make better decisions together.
              </p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Create your account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-slate-950/95 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-lg text-white shadow-lg shadow-blue-900/30">
                  ★
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">StoreRating</p>
                  <p className="text-sm text-slate-400">Discover. Review. Grow.</p>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
                Helping shoppers find trusted spots and helping businesses build lasting trust through meaningful feedback.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-100">Explore</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><a href="#top" className="transition hover:text-blue-400">Home</a></li>
                <li><a href="#features" className="transition hover:text-blue-400">Features</a></li>
                <li><a href="#about" className="transition hover:text-blue-400">About</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-100">Get started</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link to="/register" className="transition hover:text-blue-400">Create account</Link></li>
                <li><Link to="/login" className="transition hover:text-blue-400">Sign in</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>© 2026 StoreRating. All rights reserved.</p>
            <p>Built for better choices and stronger communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}