import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import { Key } from 'react'; // Import Key type

async function getPoems() {
  const poems = await prisma.poem.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return poems;
}

export default async function Home() {
  const poems = await getPoems();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-center">Poems from the Portal</h1>
        <Link href="/admin" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold transition-colors">
          Admin Panel
        </Link>
      </header>

      {poems.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">No poems have been written yet. Be the first!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {poems.map((poem: { id: Key | null | undefined; title: string; content: string; createdAt: Date }) => (
            <div key={poem.id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold mb-3 text-blue-400">{poem.title}</h2>
              <p className="text-gray-300 whitespace-pre-line mb-4">{poem.content}</p>
              <p className="text-xs text-gray-500 text-right">Written on: {new Date(poem.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
