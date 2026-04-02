import { useEffect, useState } from 'react';

/**
 * A simple component to protect contact information from basic scrapers.
 * It stores the data reversed and flips it only on the client side.
 */
export function ObfuscatedContact({ 
  reversedValue, 
  isEmail = false,
  className = "" 
}: { 
  reversedValue: string, 
  isEmail?: boolean,
  className?: string
}) {
  const [value, setValue] = useState('');

  useEffect(() => {
    // Reverse the string back on mount
    setValue(reversedValue.split('').reverse().join(''));
  }, [reversedValue]);

  if (!value) return <span className="animate-pulse bg-gray-200 rounded w-24 h-4 inline-block" />;

  if (isEmail) {
    return (
      <a 
        href={`mailto:${value}`} 
        className={`hover:underline ${className}`}
      >
        {value}
      </a>
    );
  }

  return <span className={className}>{value}</span>;
}
