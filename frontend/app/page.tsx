import Link from "next/link";
import { cookies } from "next/headers";
import { Timer, Shield, BarChart3, Zap, LayoutDashboard, User } from "lucide-react";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const isLoggedIn = !!token;

  if (isLoggedIn) {
    return <HomeLoggedIn />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Focus smarter.
              <br />
              <span className="text-indigo-200">Work better.</span>
            </h1>
            <p className="text-xl text-indigo-100 mb-10 max-w-lg">
              The Pomodoro technique, simplified. Track your sessions, build
              lasting focus, and achieve more with structured breaks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:bg-indigo-50 transition-colors"
              >
                Get started free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/20 font-semibold hover:bg-white/20 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
            Everything you need to stay focused
          </h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-16">
            A complete productivity toolkit designed around the Pomodoro
            method.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Timer className="w-8 h-8" />}
              title="Pomodoro timer"
              description="25-minute focus sessions with 5 and 15 minute breaks to maintain peak productivity."
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Session history"
              description="Review your completed pomodoros and track your progress over time."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure auth"
              description="2FA support, social login, and secure JWT-based authentication."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Simple & fast"
              description="Clean interface that gets out of your way so you can focus on work."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to build better focus habits?
          </h2>
          <p className="text-slate-600 mb-8">
            Join and start your first Pomodoro session in seconds.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Create free account
          </Link>
        </div>
      </section>
    </div>
  );
}

function HomeLoggedIn() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Welcome back.
              <br />
              <span className="text-indigo-200">Ready to focus?</span>
            </h1>
            <p className="text-xl text-indigo-100 mb-10 max-w-lg">
              Pick up where you left off. Start a Pomodoro session or view your
              progress on the dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:bg-indigo-50 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                Go to Dashboard
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/20 font-semibold hover:bg-white/20 transition-colors"
              >
                <User className="w-5 h-5" />
                Profile
              </Link>
            </div>
          </div>
        </div>
      </section>
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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all">
      <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
}
