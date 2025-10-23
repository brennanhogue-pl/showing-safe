import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. No charges were made.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </Link>
        </div>
      </div>
    </main>
  );
}
