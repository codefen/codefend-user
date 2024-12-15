declare namespace TinyMCE {
  interface Options {
    selector: string;
    promotion: boolean;
    plugins: string;
    toolbar: string;
    advlist_bullet_styles: string;
    table_use_colgroups: boolean;
    branding: boolean;
    placeholder: string;
    paste_data_images: boolean;
    readonly: boolean;
    skin: string;
    content_css: string;
    image_caption: boolean;
    automatic_uploads: boolean;
    height: string;
    templates: { title: string; description: string; url: string }[];
  }

  interface Editor {
    setContent(value: string): void;
    mode: { set(mode: string): void };
    getContent(): string;
  }

  interface InitFunction {
    (options: Options): void;
  }

  interface RemoveFunction {
    (): void;
  }

  interface GetFunction {
    (id: string): Editor;
  }
}

declare const tinyMCE: {
  init: TinyMCE.InitFunction;
  remove: TinyMCE.RemoveFunction;
  get: TinyMCE.GetFunction;
};

export const setTinyEditorContent: (id: string, value: string) => void;

export const safeInitTinyMCE: (
  defaultValue: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => void;

export const addTinyMce: (initialValue: string) => void;

export const getTinyEditorContent: (id: string) => string;

export const setMode: (id: string, mode: string) => void;

export default addTinyMce;
