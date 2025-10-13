import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex flex-col h-screen bg-muted px-4 py-8">
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="mb-12">
            <img
              src="./logo.png"
              alt="Logo LOL Match"
              className="h-54 animate-fade-in animate-duration-[3000ms] drop-shadow-[0_0_8px_#c8aa6e]"
            />
          </div>

          <h1 className="text-6xl font-bold mb-12 text-center">LOL MATCH</h1>
          <p className="text-2xl mb-16 text-gray-300">LOADING...</p>

          <div className="w-64">
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        <p className="text-xl font-medium text-gray-300 text-center pb-4">
          Don&apos;t fight alone.
        </p>
      </div>
    </>
  );
}
