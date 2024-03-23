import { type FC, useMemo } from 'react';

interface ShowProps {
	when: boolean;
	fallback?: JSX.Element;
	children: JSX.Element | JSX.Element[];
}

const Show: FC<ShowProps> = ({ when, fallback, children }) => {
	const content = useMemo(
		() => (when ? children : fallback || null),
		[when, fallback],
	);
	return content;
};

export default Show;
