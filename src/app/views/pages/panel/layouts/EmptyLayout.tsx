import Show from '@defaults/Show';
import { EmptyScreenView, PageLoader } from '@defaults/index';
import type { EmptyFallbackData } from '@interfaces/util';
import { PureComponent } from 'react';

interface EmptyLayoutProps {
	className: string;
	children: React.ReactNode;
	isLoading: boolean;
	showScreen: boolean;
	dataAvalaible: boolean;

	fallback: EmptyFallbackData;
}

class EmptyLayout extends PureComponent<EmptyLayoutProps> {
	override render() {
		const {
			children,
			className,
			showScreen,
			dataAvalaible,
			isLoading,
			fallback,
		} = this.props;
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
						event={fallback.event}
					/>
				</Show>
			</main>
		);
	}
}

export default EmptyLayout;
