import { useEffect, useState } from 'react';
import type { Author } from '../types';
import { apiAuthors } from '../services/api';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isEditing, setIsEditing] = useState<Author | null>(null);
  const [name, setName] = useState('');

  const [viewingAuthor, setViewingAuthor] = useState<Author | null>(null);

  const fetchAuthors = async () => {
    try {
      const res = await apiAuthors.get<Author[]>('/authors');
      setAuthors(res.data);
    } catch (e) {
      // Error handled by interceptor
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiAuthors.put(`/authors/${isEditing.id}`, { name });
        toast.success('Autor actualizado con éxito');
      } else {
        await apiAuthors.post('/authors', { name });
        toast.success('Autor creado con éxito');
      }
      setName('');
      setIsEditing(null);
      fetchAuthors();
    } catch (e) {
      // Error handled by interceptor
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este autor?')) {
      try {
        await apiAuthors.delete(`/authors/${id}`);
        toast.success('Autor eliminado con éxito');
        fetchAuthors();
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Autores</h1>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {isEditing ? 'Editar Autor' : 'Nuevo Autor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Ej. J.K. Rowling"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isEditing ? <Pencil size={18} /> : <Plus size={18} />}
                  {isEditing ? 'Actualizar' : 'Crear'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => { setIsEditing(null); setName(''); }}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {authors.map((author) => (
                  <tr key={author.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{author.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{author.name}</td>
                    <td className="px-6 py-4 text-sm text-right space-x-2">
                       <button
                        onClick={() => setViewingAuthor(author)}
                        className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button
                        onClick={() => { setIsEditing(author); setName(author.name); }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(author.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {authors.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      No hay autores registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewingAuthor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detalle del Autor</h2>
            <div className="space-y-3 text-sm">
              <p><strong className="text-gray-700">ID:</strong> {viewingAuthor.id}</p>
              <p><strong className="text-gray-700">Nombre:</strong> {viewingAuthor.name}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingAuthor(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
