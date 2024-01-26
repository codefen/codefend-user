import React, { useEffect, useMemo } from 'react';
import addTinyMce, {
	getTinyEditorContent,
	setMode,
} from '../../../../../../../editor-lib/';
import { CompleteIssue, Issues } from '../../../../../../data';

interface AppEditorProps {
	onUpdateIssue?: any;
	initialValue: string;
	isEditable: boolean;
	isIssueCreation?: any;
}
export const AppEditor: React.FC<AppEditorProps> = ({
	initialValue,
	onUpdateIssue,
	isEditable,
}) => {
	const emptyUpdateIssueText = () => '<p>Please add issues here...</p>';

	const setEditorMode = () => {
		if (isEditable) {
			setMode('issue', 'design');
		} else {
			setMode('issue', 'readonly');
		}
	};

	useEffect(() => {
		const defaultValue = !Boolean(initialValue.trim().length)
			? emptyUpdateIssueText()
			: initialValue;

		addTinyMce(defaultValue);
	}, []);

	useEffect(() => {
		setEditorMode();
	}, [isEditable]);

	return (
		<>
			<textarea name="name" id="issue" rows={4} cols={40}></textarea>
		</>
	);
};
