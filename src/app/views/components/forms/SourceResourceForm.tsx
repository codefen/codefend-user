import { type FC } from 'react';
import { GlobeWebIcon } from '@icons';
import { useAddSourceCode } from '@resourcesHooks/sourcecode/useAddSourceCode';
import { ModalInput } from '@defaults/ModalInput';
import type { ComponentEventWithChildren } from '@interfaces/util';

export const SourceResourceForm: FC<ComponentEventWithChildren> = ({ close, onDone, children }) => {
  const { isLoading, addSourceCode, repositoryName, repositoryUrl, sourceCode, visibility } =
    useAddSourceCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addSourceCode().then(() => {
      onDone?.();
      close?.();
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <ModalInput ref={repositoryName} placeholder="repository name" required />
      <ModalInput ref={repositoryUrl} placeholder="repository url" required />
      <ModalInput ref={sourceCode} placeholder="source code language" required />

      <div className="form-input">
        <span className="icon">
          <GlobeWebIcon />
        </span>

        <select ref={visibility} className="log-inputs modal_info" required>
          <option value="" disabled hidden>
            visibility
          </option>
          <option value="public">public</option>
          <option value="private">private</option>
        </select>
      </div>
      {children(isLoading)}
    </form>
  );
};
