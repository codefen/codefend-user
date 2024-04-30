import { type FC, useEffect, useState } from 'react';
import addTinyMce, {
	setMode,
	setTinyEditorContent,
	getTinyEditorContent,
} from '../../../../../../../editor-lib';

interface AppEditorProps {
	onUpdateIssue?: any;
	initialValue: string;
	isEditable: boolean;
	isIssueCreation?: any;
}

const EMPTY_TEXT = '<p>Please add issues here...</p>';

const AppEditor: FC<AppEditorProps> = ({ initialValue, isEditable }) => {
	const [first, setFirst] = useState(true);

	useEffect(() => {
		const defaultValue = !Boolean(initialValue.trim().length)
			? EMPTY_TEXT
			: initialValue;
		addTinyMce(defaultValue);
		setFirst(false);
	}, [initialValue]);

	useEffect(() => {
		if (!first) {
			const _editorContent = getTinyEditorContent('issue');
			setTinyEditorContent(
				'issue',
				_editorContent ? _editorContent : initialValue || EMPTY_TEXT,
			);
		}
		if (isEditable) {
			setMode('issue', 'design');
		} else {
			setMode('issue', 'readonly');
		}
	}, [isEditable]);

	return (
		<>
			<textarea
				name="name"
				id="issue"
				rows={4}
				cols={40}
				defaultValue=""></textarea>
		</>
	);
};

export default AppEditor;
