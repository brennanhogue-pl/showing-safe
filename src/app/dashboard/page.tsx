import CoverageStatusCard from '@/components/CoverageStatusCard';
import FileClaimCard from '@/components/FileClaimCard';
import RecentClaimsSection from '@/components/RecentClaimsSection';

export default function Dashboard() {
  // Mock user data - replace with real data from Supabase
  const userName = 'Agent Name';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userName}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-8">
          {/* Coverage Status - 60% width on desktop */}
          <div className="lg:col-span-3">
            <CoverageStatusCard
              status="active"
              policyType="Annual Coverage"
              coverageAmount="$1,000,000"
              validUntil="2025-12-31"
              showingsRemaining="Unlimited"
            />
          </div>

          {/* Quick Actions - 40% width on desktop */}
          <div className="lg:col-span-2">
            <FileClaimCard />
          </div>
        </div>

        {/* Recent Claims */}
        <section>
          <RecentClaimsSection />
        </section>
      </div>
    </main>
  );
}
