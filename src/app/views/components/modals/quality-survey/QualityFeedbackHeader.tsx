import type { FC } from 'react';

interface ModalGradientHeaderProps {
	header: string;
}

export const ModalGradientHeader: FC<ModalGradientHeaderProps> = ({
	header,
}) => (
	<div className="quality-header">
		<img src="/codefend/codefend-logo-b.png" alt="codefend logo" />
		<h2>{header}</h2>
	</div>
);
