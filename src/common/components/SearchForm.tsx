import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Search } from 'lucide-react';
import cn from 'clsx';


interface SearchFormProps {
  className?: string;
}
const SearchForm: React.FC<SearchFormProps> = ({ className }) => {
  const navigate = useNavigate();
  const { city: paramCity } = useParams<{ city: string }>();

  // Decode city param for display, or empty string on home page
  const decodedParam = paramCity ? decodeURIComponent(paramCity) : '';

  // Local state: initialize from URL param if present
  const [city, setCity] = useState<string>(decodedParam);

  // Whenever the URL param changes, update the input value
  useEffect(() => {
    setCity(decodedParam);
  }, [decodedParam]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = city.trim();
    if (!name) return;
    navigate(`/${encodeURIComponent(name)}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md mx-auto p-4 space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <Input
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Wpisz miasto"
          className={cn(
            'pl-10 w-full',
            className
          )}
        />
      </div>
      <Button type="submit" className="whitespace-nowrap">
        Szukaj
      </Button>
    </form>
  );
};

export default SearchForm;
