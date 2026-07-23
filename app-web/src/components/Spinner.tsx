import { useStore } from '../store/store';
import { Loader2 } from 'lucide-react';

export default function Spinner() {
  const isLoading = useStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-2" />
        <p className="text-gray-700 font-medium">Cargando...</p>
      </div>
    </div>
  );
}
