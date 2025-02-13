import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function Header({ children }) {
  return (
    <header className="border-b border-border">
      <div className="container-tight flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold text-foreground text-xl hover:text-foreground/90 transition-colors">
          <Flame className="inline-block mr-2 h-5 w-5" /> FeedLion
        </Link>
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </header>
  );
} 