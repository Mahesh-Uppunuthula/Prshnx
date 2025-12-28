import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import {
  BarChart3,
  Layout,
  MousePointerClick,
  Sparkles,
  Zap,
  CloudUpload,
  Check,
  HelpCircle,
  X,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { usersApi } from "@/api/users";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["getUserDetails"],
        queryFn: usersApi.getUserDetails,
        staleTime: Infinity,
      });
      return response;
    } catch {
      // If error (e.g. 401), we just return null/undefined so we stay on landing page
      return null;
    }
  },
  component: HomePage,
});

function HomePage() {
  const context = Route.useRouteContext();
  const navigate = useNavigate();

  // If user is logged in, redirect to dashboard
  if (context?.user) {
    navigate({ to: "/dashboard" });
    return null; // Avoid flashing landing page
  }

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={18} fill="currentColor" />
            </div>
            Prashnio
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a
              href="#features"
              className="hover:text-indigo-600 transition-colors"
            >
              features
            </a>
            <a
              href="#solutions"
              className="hover:text-indigo-600 transition-colors"
            >
              solutions
            </a>
            <a
              href="#pricing"
              className="hover:text-indigo-600 transition-colors"
            >
              pricing
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="/sign-in"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 hidden sm:block"
            >
              Log in
            </a>
            <Button
              asChild
              className="rounded-full px-6 bg-slate-900 hover:bg-indigo-600 transition-colors duration-300"
            >
              <Link to="/sign-in">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-50/30 rounded-full blur-3xl -z-10" />

          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-wide uppercase mb-6 border border-indigo-100">
                  <Zap size={12} fill="currentColor" />
                  Forms Just Got a Glow Up ✨
                </span>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                  Forms that actually <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    pass the vibe check.
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                  Stop serving mid experiences. Build forms that your users
                  won't ghost. High-key loved by creators who care about
                  aesthetics.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-12 text-base w-full sm:w-auto bg-slate-900 hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link to="/sign-in" className="flex items-center gap-2">
                      Let's Cook <ChevronRight size={16} />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8 h-12 text-base w-full sm:w-auto bg-white hover:bg-slate-50 border-slate-200"
                  >
                    <a href="#demo" className="flex items-center gap-2">
                      View Demo
                    </a>
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Hero Visual/Interactive Demo */}
            <div className="relative mx-auto w-full max-w-6xl h-[600px] perspective-1000 hidden md:block">
              <HeroDemo />
            </div>
            {/* Mobile Alternative for Demo */}
            <div className="md:hidden relative mx-auto w-full h-[400px]">
              <HeroDemoMobile />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Why users are obsessed
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                No clutter. No dusty UX. Just straight fire forms that keep
                people engaged.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Layout className="text-indigo-600" size={24} />}
                title="Aesthetics on Point"
                description="Forms that look valid on any device. Give your brand the main character energy it deserves."
              />
              <FeatureCard
                icon={<BarChart3 className="text-purple-600" size={24} />}
                title="Analytics that Slap"
                description="Know exactly how users interact. Spot the drop-offs, check the receipts, and optimize."
              />
              <FeatureCard
                icon={<MousePointerClick className="text-blue-600" size={24} />}
                title="Low-Key Effortless"
                description="Drag, drop, done. Building complex forms has never been this satisfying."
              />
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to enter your best era?
            </h2>
            <p className="text-slate-300 mb-10 text-lg">
              Join the squad of creators building the future. Don't sleep on
              better data.
            </p>
            <Button
              size="lg"
              className="rounded-full px-10 h-14 text-lg bg-white text-slate-900 hover:bg-indigo-50 hover:text-indigo-900"
            >
              <Link to="/sign-in">Start Cooking Free</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

function HeroDemo() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      {/* Background Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-0 bg-gradient-to-tr from-indigo-100/40 via-white/10 to-purple-100/40 rounded-full blur-3xl -z-10"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full h-full items-center">
        {/* Left Column Container */}
        <div className="flex flex-col gap-8 h-full justify-center">
          {/* Top Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="w-full max-w-sm ml-auto pointer-events-auto"
          >
            <DemoForm />
          </motion.div>

          {/* Bottom Left: Poll */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: -30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              type: "spring",
              bounce: 0.3,
            }}
            className="w-full max-w-sm ml-auto pointer-events-auto"
          >
            <DemoPoll />
          </motion.div>
        </div>

        {/* Right Column Container */}
        <div className="flex flex-col gap-8 h-full justify-center">
          {/* Top Right: Rating */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              type: "spring",
              bounce: 0.3,
            }}
            className="w-full max-w-sm mr-auto pointer-events-auto"
          >
            <DemoEmojiRating />
          </motion.div>

          {/* Bottom Right: Help Widget (The requested image match) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-sm mr-auto pointer-events-auto"
          >
            <DemoHelpWidget />
            {/* <DemoAnalyticsCard /> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Mobile simplified version just stacking them
function HeroDemoMobile() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 overflow-hidden py-4">
      <div className="scale-90 origin-center w-full px-4">
        <DemoForm />
      </div>
      <div className="scale-90 origin-center w-full px-4">
        <DemoHelpWidget />
      </div>
    </div>
  );
}

function DemoForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 md:p-8 overflow-hidden relative h-full flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-lg">Contact Us</h4>
              <p className="text-slate-500 text-xs">
                We typically reply in 2 mins
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400"
              />
              <input
                type="email"
                placeholder="email@example.com"
                required
                className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center h-10"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Send Message"
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-6 text-center"
          >
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Zap size={28} fill="currentColor" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg">Sent!</h4>
            <p className="text-sm text-slate-500 mt-1">We'll be in touch.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-xs text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-4"
            >
              Send another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DemoPoll() {
  const [selected, setSelected] = React.useState<string | null>(null);

  const options = ["Ease of use ⚡", "Design quality 🎨", "Analytics 📊"];

  return (
    <div className="bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl p-6 relative overflow-hidden h-full flex flex-col justify-center">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">
            Quick Poll
          </span>
        </div>
        <h4 className="font-bold text-slate-800 text-base mb-4">
          Top priority?
        </h4>
        <div className="space-y-3">
          {options.map((opt) => (
            <motion.button
              key={opt}
              onClick={() => setSelected(opt)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all relative overflow-hidden ${selected === opt
                ? "bg-indigo-50/50 border-indigo-500 text-indigo-900"
                : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <span>{opt}</span>
                {selected === opt && (
                  <motion.div
                    layoutId="check"
                    className="bg-indigo-500 text-white rounded-full p-0.5"
                  >
                    <Check size={12} />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoEmojiRating() {
  const [rating, setRating] = React.useState(0);
  const [hovered, setHovered] = React.useState(0);

  /**
   * 😖 Not it

😕 Meh

😐 Okay-ish

🙂 Pretty good

🤩 Loved it
   */
  const emojis = [
    {
      label: "Not it",
      icon: "😫",
      color: "bg-red-50 text-red-600 ring-red-100",
    },
    {
      label: "Meh",
      icon: "🙁",
      color: "bg-orange-50 text-orange-600 ring-orange-100",
    },
    {
      label: "Okay-ish",
      icon: "😐",
      color: "bg-yellow-50 text-yellow-600 ring-yellow-100",
    },
    {
      label: "Pretty good",
      icon: "🙂",
      color: "bg-lime-50 text-lime-600 ring-lime-100",
    },
    {
      label: "Loved it",
      icon: "🤩",
      color: "bg-green-50 text-green-600 ring-green-100",
    },
  ];

  const currentRating = hovered || rating;
  const activeEmoji = currentRating > 0 ? emojis[currentRating - 1] : null;

  return (
    <div className="w-full h-full bg-white/90 backdrop-blur-md border border-white/60 shadow-xl rounded-2xl p-6 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
      {/* Dynamic background gradient based on rating */}
      <motion.div
        className="absolute inset-0 opacity-20 transition-colors duration-500"
        style={{
          backgroundColor: activeEmoji
            ? activeEmoji.label === "Loved it"
              ? "#f0fdf4"
              : activeEmoji.label === "Not it"
                ? "#fef2f2"
                : "#ffffff"
            : "#ffffff",
        }}
      />

      <div className="text-lg font-bold text-slate-800 z-10">Rate the vibe</div>
      <div className="flex items-center justify-center gap-2 md:gap-4 z-10 w-full">
        {emojis.map((emoji, idx) => {
          const idxRating = idx + 1;
          const isActive = idxRating === currentRating;
          return (
            <motion.button
              key={idx}
              onClick={() => setRating(idxRating)}
              onMouseEnter={() => setHovered(idxRating)}
              onMouseLeave={() => setHovered(0)}
              whileHover={{ scale: 1.25, rotate: [0, -5, 5, 0] }}
              animate={{
                scale: isActive ? 1.35 : 1,
                opacity:
                  currentRating === 0 || currentRating >= idxRating ? 1 : 0.35,
                filter:
                  currentRating === 0 || currentRating >= idxRating
                    ? "grayscale(0%)"
                    : "grayscale(100%)",
              }}
              className="text-3xl md:text-4xl focus:outline-none transition-all p-2 relative"
            >
              {emoji.icon}
              {isActive && (
                <motion.div
                  layoutId="emoji-glow"
                  className="absolute inset-0 bg-white/20 rounded-full blur-lg -z-10"
                />
              )}
            </motion.button>
          );
        })}
      </div>
      <div className="h-8 z-10">
        <AnimatePresence mode="wait">
          {activeEmoji ? (
            <motion.span
              key={activeEmoji.label}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              className={`text-sm font-bold px-4 py-1.5 rounded-full shadow-sm ring-1 ${activeEmoji.color}`}
            >
              {activeEmoji.label}
            </motion.span>
          ) : (
            <span className="text-sm text-slate-400 font-medium">
              Select an emoji
            </span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function DemoHelpWidget() {
  return (
    <div className="bg-white border border-slate-100 shadow-xl rounded-2xl p-6 w-full h-full flex flex-col items-center justify-center relative overflow-hidden group min-w-[300px]">
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <HelpCircle size={18} />
          </div>
          <span className="font-bold text-slate-800 text-lg">Help</span>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>

      <div className="w-full space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group/item">
          <div className="flex items-center gap-3">
            <div className="text-slate-400 group-hover/item:text-indigo-500">
              <CloudUpload size={18} />
            </div>
            <span className="text-sm text-slate-600 font-medium">
              Browse help docs
            </span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group/item">
          <div className="flex items-center gap-3">
            <div className="text-slate-400 group-hover/item:text-indigo-500">
              <MessageSquare size={18} />
            </div>
            <span className="text-sm text-slate-600 font-medium">
              Contact support
            </span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </div>
        <div className="bg-indigo-600 p-4 rounded-xl text-white cursor-pointer shadow-lg shadow-indigo-200 mt-2 flex items-start gap-3">
          <div className="mt-1">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="text-sm font-medium leading-tight">
              What's the best way to analyze form responses?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
