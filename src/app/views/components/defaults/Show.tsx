import React, { useMemo } from 'react';

interface ShowProps {
	when: boolean;
	fallback?: JSX.Element;
	children: JSX.Element;
}

const Show: React.FC<ShowProps> = ({ when, fallback, children }) => {
	const content = useMemo(
		() => (when ? children : fallback ?? ''),
		[when, fallback],
	);
	return content;
};

export default Show;
