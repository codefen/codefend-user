import EmptyScreenView from '@/app/views/components/EmptyScreenView/EmptyScreenView';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import Show from '@/app/views/components/Show/Show';
import type { EmptyFallbackData } from '@interfaces/util';
import { PureComponent, type ReactNode } from 'react';

interface EmptyLayoutProps {
  className: string;
  children: ReactNode;
  isLoading: boolean;
  showScreen: boolean;
  dataAvailable: boolean;

  fallback: EmptyFallbackData;
  event: () => void;
}

class EmptyLayout extends PureComponent<EmptyLayoutProps> {
  override render() {
    const { children, className, showScreen, dataAvailable, isLoading, fallback, event } =
      this.props;
    return (
      <main className={`${className} ${showScreen ? 'actived' : ''}`}>
        <Show when={!isLoading && dataAvailable}>{children}</Show>
        <Show when={isLoading}>
          <PageLoader />
        </Show>
        <Show when={!isLoading && !dataAvailable}>
          <EmptyScreenView
            type={fallback.type}
            title={fallback.title}
            info={fallback.subtitle}
            buttonText={fallback.btnText}
            event={event}
          />
        </Show>
      </main>
    );
  }
}

export default EmptyLayout;
