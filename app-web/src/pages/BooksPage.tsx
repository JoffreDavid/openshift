import { useEffect, useState } from 'react';
import type { Book, Author } from '../types';
import { apiBooks, apiAuthors } from '../services/api';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isEditing, setIsEditing] = useState<Book | null>(null);
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<number[]>([]);

  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const fetchBooks = async () => {
    try {
      const res = await apiBooks.get<Book[]>('/books');
      setBooks(res.data);
    } catch (e) {}
  };

  const fetchAuthors = async () => {
    try {
      const res = await apiAuthors.get<Author[]>('/authors');
      setAllAuthors(res.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { isbn, title, price: parseFloat(price) };
    try {
      if (isEditing) {
        await apiBooks.put(`/books/${isEditing.isbn}`, payload);
        toast.success('Libro actualizado con éxito');

        const oldAuthors = isEditing.authors?.map(a => a.id) || [];
        const toAdd = selectedAuthors.filter(id => !oldAuthors.includes(id));
        const toRemove = oldAuthors.filter(id => !selectedAuthors.includes(id));

        await Promise.all(toAdd.map(id => apiAuthors.post(`/authors/${id}/books/${isbn}`)));
        await Promise.all(toRemove.map(id => apiAuthors.delete(`/authors/${id}/books/${isbn}`)));
      } else {
        await apiBooks.post('/books', payload);
        toast.success('Libro creado con éxito');

        await Promise.all(selectedAuthors.map(id => apiAuthors.post(`/authors/${id}/books/${isbn}`)));
      }
      resetForm();
      fetchBooks();
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este libro?')) {
      try {
        await apiBooks.delete(`/books/${id}`);
        toast.success('Libro eliminado con éxito');
        fetchBooks();
      } catch (e) {}
    }
  };

  const handleTestCircuitBreaker = async (isbnTarget: string) => {
    try {
      await apiBooks.get(`/books/${isbnTarget}`);
      toast.success('Consulta exitosa. Revisa la consola o interfaz para ver autores.');
    } catch(e) {}
  }

  const resetForm = () => {
    setIsEditing(null);
    setIsbn('');
    setTitle('');
    setPrice('');
    setSelectedAuthors([]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Libros</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {isEditing ? 'Editar Libro' : 'Nuevo Libro'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input
                  type="text"
                  required
                  disabled={!!isEditing}
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Ej. 9780132350884"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Ej. Manual de Titulacion"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Ej. 29.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autores</label>
                <select
                  multiple
                  value={selectedAuthors.map(String)}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                    setSelectedAuthors(values);
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24"
                >
                  {allAuthors.map(author => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>

              </div>
              
              <div className="flex gap-3 pt-2">
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
                    onClick={resetForm}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ISBN</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Autores</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {books.map((book) => (
                    <tr key={book.isbn} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{book.isbn}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{book.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">${book.price?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {book.authors?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {book.authors.map(a => (
                              <span key={a.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {a.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Sin autores</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-right space-x-1">
                         <button
                          onClick={() => setViewingBook(book)}
                          className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                         <button
                          onClick={() => handleTestCircuitBreaker(book.isbn)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Probar Circuit Breaker (Consultar por ISBN)"
                        >
                          <Search size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(book);
                            setIsbn(book.isbn);
                            setTitle(book.title);
                            setPrice(book.price.toString());
                            setSelectedAuthors(book.authors?.map(a => a.id) || []);
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(book.isbn)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {books.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No hay libros registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {viewingBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detalle del Libro</h2>
            <div className="space-y-3 text-sm">
              <p><strong className="text-gray-700">ISBN:</strong> {viewingBook.isbn}</p>
              <p><strong className="text-gray-700">Título:</strong> {viewingBook.title}</p>
              <p><strong className="text-gray-700">Precio:</strong> ${viewingBook.price?.toFixed(2)}</p>
              <p><strong className="text-gray-700">Autores:</strong> {viewingBook.authors?.map(a => a.name).join(', ') || 'Ninguno'}</p>
              <p><strong className="text-gray-700">Inventario Vendido:</strong> {viewingBook.inventorySold ?? 'N/A'}</p>
              <p><strong className="text-gray-700">Inventario Suministrado:</strong> {viewingBook.inventorySupplied ?? 'N/A'}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingBook(null)}
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
