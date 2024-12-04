import { useEffect, useState } from 'react';
import { ProviderCard } from './provider-card/ProviderCard.tsx';
import { useProviderIndex } from '@userHooks/providers/useProviderIndex.ts';

export const ProviderList = () => {
  const [getProviders, { providers }] = useProviderIndex();
  const [active, setActiveCard] = useState<string>('');
  const handleActive = (id: string) => setActiveCard(active !== id ? id : '');
  useEffect(() => {
    getProviders();
  }, []);
  return (
    <div className="providers-list">
      <h2>Providers</h2>
      {providers.current
        ? providers.current.map((provider, i) => (
            <ProviderCard
              key={`${provider.id}-${provider.fname}-${provider.pais_code}`}
              name={`${provider.fname} ${provider.lname}`}
              username={provider.username}
              desc={provider.headline}
              img={`data:image/png;base64,${provider.profile_media}`}
              score={provider.score}
              totalReviews={String(provider?.reviews_final || 0)}
              handleActivate={handleActive}
              id={provider.id}
              isSelected={active === provider.id}
            />
          ))
        : []}
    </div>
  );
};
