import { Link } from 'react-router-dom';
import type { HeaderProps } from './types';

export default function Header({ title, actionLabel, actionIcon, actionTo, children }: HeaderProps) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-6 rounded-lg border border-gray-300">
      <h4 className="text-lg font-semibold">{title}</h4>
      {children}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          {actionIcon}
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
