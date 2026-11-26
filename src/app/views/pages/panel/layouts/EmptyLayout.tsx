import { PanelInterior } from '@/app/views/pages/panel/layouts/PanelInterior';
import EmptyScreenView from '@/app/views/components/EmptyScreenView/EmptyScreenView';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import Show from '@/app/views/components/Show/Show';
import type { EmptyFallbackData } from '@interfaces/util';
import { PureComponent, type ReactNode } from 'react';

interface EmptyLayoutProps {
  className: string;
  title: string;
  titleIcon?: ReactNode;
  children: ReactNode;
  isLoading: boolean;
  showScreen: boolean;
  dataAvailable: boolean;

  fallback: EmptyFallbackData;
  event: () => void;
}

class EmptyLayout extends PureComponent<EmptyLayoutProps> {
  override render() {
    const {
      children,
      className,
      title,
      titleIcon,
      showScreen,
      dataAvailable,
      isLoading,
      fallback,
      event,
    } = this.props;
    return (
      <PanelInterior
        title={title}
        titleIcon={titleIcon}
        className={className}
        ready={showScreen}
        contentReady={!isLoading}>
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
      </PanelInterior>
    );
  }
}

export default EmptyLayout;
