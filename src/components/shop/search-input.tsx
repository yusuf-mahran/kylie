'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BrandButton } from '@/components/shared/brand-button';

type SearchInputProps = {
  initialQuery?: string;
  onSearch: (query: string) => void;
};

export default function SearchInput({ initialQuery = '', onSearch }: SearchInputProps) {
  const t = useTranslations('Shop');
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="flex-1 border rounded-md px-4 py-2"
        dir="auto"
      />
      <BrandButton type="submit">{t('search')}</BrandButton>
    </form>
  );
}
