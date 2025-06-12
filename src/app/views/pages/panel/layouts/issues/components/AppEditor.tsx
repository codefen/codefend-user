import { type FC, useEffect, useState } from 'react';
import { setMode, safeInitTinyMCE } from '../../../../../../../editor-lib';
import { PrimaryButton } from '@buttons/index';
import { useTheme } from '@/app/views/context/ThemeContext';

interface AppEditorProps {
  initialValue: string;
  isEditable: boolean;
  isCreation?: boolean;
  isLoaded?: boolean;
}
const EMPTY_TEXT = '<p>Please add issues here...</p>';

const AppEditor: FC<AppEditorProps> = ({ initialValue, isEditable, isCreation, isLoaded }) => {
  const [editorError, setEditorError] = useState<string | null>(null);
  const [editorInitialized, setEditorInitialized] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const defaultValue = !Boolean(initialValue) ? EMPTY_TEXT : initialValue;

    safeInitTinyMCE(
      defaultValue,
      () => {
        setEditorInitialized(true);
        setEditorError(null);
      },
      error => {
        console.error('TinyMCE initialization failed:', error);
        setEditorError('Could not load text editor');
        setEditorInitialized(false);
      },
      theme === 'dark'
    );
  }, [initialValue, isLoaded]);

  // Mode update effect
  useEffect(() => {
    if (!editorInitialized) return;

    try {
      // Only attempt to change mode if editor is initialized
      if (!isCreation) {
        setMode('issue', isEditable ? 'design' : 'readonly');
      } else {
        setMode('issue', 'design');
      }
    } catch (error) {
      console.error('Error updating editor mode:', error);
      setEditorError('Failed to update editor settings');
    }
  }, [editorInitialized, isEditable, isCreation]);

  if (editorError) {
    return (
      <div className="error-container">
        <p>{editorError}</p>
        <PrimaryButton
          buttonStyle="gray"
          text="Reload Editor"
          click={() => window.location.reload()}
        />
      </div>
    );
  }

  return <textarea name="name" id="issue" rows={4} cols={40}></textarea>;
};

export default AppEditor;
