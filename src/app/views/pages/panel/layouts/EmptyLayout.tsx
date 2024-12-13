import Show from '@defaults/Show';
import { EmptyScreenView, PageLoader } from '@defaults/index';
import type { EmptyFallbackData } from '@interfaces/util';
import { PureComponent, type ReactNode } from 'react';

interface EmptyLayoutProps {
  className: string;
  children: ReactNode;
  isLoading: boolean;
  showScreen: boolean;
  dataAvalaible: boolean;

  fallback: EmptyFallbackData;
  event: () => void;
}

class EmptyLayout extends PureComponent<EmptyLayoutProps> {
  override render() {
    const { children, className, showScreen, dataAvalaible, isLoading, fallback, event } =
      this.props;
    return (
      <main className={`${className} ${showScreen ? 'actived' : ''}`}>
        <Show when={!isLoading && dataAvalaible}>{children}</Show>
        <Show when={isLoading}>
          <PageLoader />
        </Show>
        <Show when={!isLoading && !dataAvalaible}>
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
