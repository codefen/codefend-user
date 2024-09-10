import { type FC, useEffect, useState } from 'react';
import addTinyMce, {
  setMode,
  setTinyEditorContent,
  getTinyEditorContent,
} from '../../../../../../../editor-lib';

interface AppEditorProps {
  initialValue: string;
  isEditable: boolean;
  isCreation?: boolean;
}

const AppEditor: FC<AppEditorProps> = ({ initialValue, isEditable, isCreation }) => {
  const [first, setFirst] = useState(true);
  const EMPTY_TEXT = '<p>Please add issues here...</p>';

  useEffect(() => {
    const defaultValue = !Boolean(initialValue.trim().length) ? EMPTY_TEXT : initialValue;
    addTinyMce(defaultValue);
    setFirst(false);
  }, [initialValue]);

  useEffect(() => {
    try {
      if (!first) {
        const editor = getTinyEditorContent ? getTinyEditorContent('issue') : '';
        setTinyEditorContent('issue', !editor || editor == '' ? initialValue : editor);
      }
    } catch (e: any) {
      console.error(e);
    }

    if (!isCreation) {
      setMode('issue', isEditable ? 'design' : 'readonly');
    } else {
      setMode('issue', 'design');
    }
  }, [isEditable]);

  return (
    <>
      <textarea name="name" id="issue" rows={4} cols={40}></textarea>
    </>
  );
};

export default AppEditor;
