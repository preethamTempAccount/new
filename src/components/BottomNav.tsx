import { Home, User, Plus } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  onCreatePost: () => void;
}

export default function BottomNav({ currentScreen, onScreenChange, onCreatePost }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 safe-area-bottom z-40">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-around h-20 relative">
          <button
            onClick={() => onScreenChange('feed')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'feed'
                ? 'text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Feed</span>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 -top-6">
            <button
              onClick={onCreatePost}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 transition-all duration-300 hover:scale-110"
            >
              <Plus className="w-8 h-8 text-white" />
            </button>
          </div>

          <button
            onClick={() => onScreenChange('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'profile'
                ? 'text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
