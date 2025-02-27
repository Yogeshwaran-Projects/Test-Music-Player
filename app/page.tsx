import Player from "./components/Player";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
      <h1 className="text-2xl font-bold mb-8 text-white">
        Music Player
      </h1>
      <Player />
    </main>
  );
}