import { BookOpen, Users, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const cards = [
    { title: 'Autores',  icon: <UserCircle className="w-10 h-10 text-blue-500" />, path: '/authors', color: 'bg-blue-50 text-blue-700' },
    { title: 'Libros',  icon: <BookOpen className="w-10 h-10 text-indigo-500" />, path: '/books', color: 'bg-indigo-50 text-indigo-700' },
    { title: 'Clientes', icon: <Users className="w-10 h-10 text-emerald-500" />, path: '/customers', color: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Bienvenido a BooksApp</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link to={card.path} key={card.title} className="group block">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl ${card.color}`}>
                  {card.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{card.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
