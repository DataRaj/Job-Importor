// Temporary Tailwind test page — validates Tailwind/PostCSS config

export default function TailwindTest() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 text-white">
      <h1 className="animate-pulse text-center text-4xl font-bold md:text-5xl">
        Tailwind Test Page
      </h1>
      <p className="mt-4 max-w-md text-center text-base md:text-lg">
        If you can see this styled text, your Tailwind/PostCSS config is working
        🎉
      </p>
    </main>
  );
}
