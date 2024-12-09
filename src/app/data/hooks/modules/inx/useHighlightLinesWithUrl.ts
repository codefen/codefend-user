export const useHighlightLinesWithUrl = () => {
  const highlightWithUrl = (inputText: string, urlToFilter: string, contextLines: number = 3) => {
    const textToSplit = inputText || '';
    return textToSplit
      .split('\r\n')
      .map(line => {
        const columns = line.split('\t');
        const formattedColumns = columns.map(col => `<span>${col}</span>`).join(' | ');
        if (line.includes(urlToFilter)) {
          return `<div><b>${formattedColumns}</b></div><hr class="w-24 h-1 bg-gray-100 border-0 rounded md:my-2 dark:bg-white">`;
        } else {
          return `<div>${formattedColumns}</div>`;
        }
      })
      .join('');
  };

  return { highlightWithUrl };
};
