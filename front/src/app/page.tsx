export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          Hello World!
        </h1>
        <p className="text-xl text-gray-600 mb-8 bg-green-200">
          Bienvenue sur CoachFlow - Next.js + Nest.js
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
          <p className="text-gray-700">
            ✅ Frontend: <span className="font-semibold text-green-600">Next.js 15</span>
          </p>
          <p className="text-gray-700">
            ✅ Backend: <span className="font-semibold text-green-600">Nest.js</span>
          </p>
          <p className="text-gray-700">
            ✅ Database: <span className="font-semibold text-green-600">Prisma</span>
          </p>
          <p className="text-gray-700">
            ✅ Auth: <span className="font-semibold text-green-600">JWT</span>
          </p>
        </div>
      </div>
    </div>
  );
}
