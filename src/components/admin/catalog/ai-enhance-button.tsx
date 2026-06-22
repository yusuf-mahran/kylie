'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { enhanceCatalogContent, type EnhanceType, type EnhanceResult } from '@/lib/ai/enhance';
import { BrandButton } from '@/components/shared/brand-button';

type AiEnhanceButtonProps = {
  type: EnhanceType;
  currentValue?: string;
  productContext?: {
    name_ar?: string;
    name_en?: string;
    categoryName?: string;
  };
  onSuggestion: (result: EnhanceResult) => void;
};

export default function AiEnhanceButton({
  type,
  currentValue,
  productContext,
  onSuggestion,
}: AiEnhanceButtonProps) {
  const t = useTranslations('Catalog');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await enhanceCatalogContent({ type, currentValue, productContext });
      onSuggestion(result);
    } catch {
      setError(t('aiSuggestionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <BrandButton type="button" variant="secondary" size="sm" onClick={handleClick} disabled={loading}>
        {loading ? t('enhancing') : t('aiEnhance')}
      </BrandButton>
      {error && <p className="text-rose text-xs">{error}</p>}
    </div>
  );
}
