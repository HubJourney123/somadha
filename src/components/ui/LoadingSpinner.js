'use client';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`spinner ${sizes[size]}`}></div>
      {text && (
        <p className="text-gray-600 dark:text-gray-400 text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}