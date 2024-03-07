import { useCallback } from 'react';

export const useHighlightLinesWithUrl = () => {
	const highlightWithUrl = (inputText: string, urlToFilter: string, contextLines: number = 3) => {
		const textToSplit = inputText || '';
		return textToSplit
			.split('\t')
			.map((line, index, lines) =>
				line.includes(urlToFilter)
					? [
							...lines
								.slice(Math.max(0, index - contextLines), index)
								.map((l) => `${l}<br>`),
							`<b>${line}</b><br>`,
							...lines
								.slice(index + 1, index + 1 + contextLines)
								.map((l) => `${l}<br>`),
							`<hr class="w-24 h-1 bg-gray-100 border-0 rounded md:my-2 dark:bg-white">`,
						].join('')
					: line,
			)
			.join('\n');
	}

	return { highlightWithUrl };
};
