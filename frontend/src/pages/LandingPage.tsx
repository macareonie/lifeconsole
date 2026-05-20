const LandingPage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <span className="text-cyan-600">life</span>console
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your all-in-one life management dashboard
        </p>
        <a
          href="/login"
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
        >
          Get Started
        </a>
      </div>
    </>
  );
};

export default LandingPage;
