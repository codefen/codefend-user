import {
  type ChangeEvent,
  Fragment,
  useCallback,
  type FC,
  type KeyboardEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import { generateIDArray } from '../../../data';
import Show from '@/app/views/components/Show/Show';
import { PrimaryButton } from '@buttons/index';

interface SearchBarSelect {
  options: any;
  placeHolder: string;
  value: string;
  defaultSelectOption?: any;
  change: (e: ChangeEvent<HTMLSelectElement>) => void;
}

interface SearchBarProps {
  placeHolder: string;
  inputValue: string;
  handleSubmit: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  searchIcon?: ReactNode;
  searchText?: string;

  isActiveSelect?: boolean;
  selectOptions?: SearchBarSelect;
  isDisabled?: boolean;
  inputAnimationStep?: number;
}

export const SearchBar: FC<SearchBarProps> = props => {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        props.handleSubmit();
      }
    },
    [props.handleSubmit]
  );

  const options = !props.isActiveSelect || !props.selectOptions ? [] : props.selectOptions.options;

  const optionsKeys = Object.keys(options);

  const optionUUID = optionsKeys.length !== 0 ? generateIDArray(optionsKeys.length) : [];

  const inputClass = !props.isActiveSelect ? 'only-btn' : 'with-select';
  const animClass =
    props.inputAnimationStep === 1
      ? 'input-anim-protocol'
      : props.inputAnimationStep === 2
        ? 'input-anim-path'
        : props.inputAnimationStep === 3
          ? 'input-anim-flash'
          : '';

  return (
    <div className="search-bar">
      <div className="search-bar-wrapper">
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            props.handleSubmit();
          }}
          className="search-bar-wrapper-form">
          <input
            type="text"
            value={props.inputValue}
            onChange={e => {
              console.log('📝 SearchBar input onChange:', {
                value: e.target.value,
                hasSpaces: e.target.value.includes(' '),
                charCodes: e.target.value.split('').map(c => c.charCodeAt(0)),
              });
              props.handleChange(e);
            }}
            onKeyDown={handleKeyPress}
            placeholder={props.placeHolder}
            className={`text search-input ${inputClass} ${animClass}`}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            required
          />
          <Show when={props.isActiveSelect === true && props.selectOptions !== undefined}>
            <select
              className="search-select log-inputs"
              onChange={props?.selectOptions?.change}
              value={props.selectOptions?.value}>
              {optionsKeys.map((keyOption, i: number) => (
                <Fragment key={optionUUID[i]}>
                  <option value={String(keyOption)}>
                    {String(options[keyOption as keyof typeof options])}
                  </option>
                </Fragment>
              ))}
            </select>
          </Show>
          <PrimaryButton
            text={props?.searchIcon ? props?.searchIcon : props?.searchText || 'Search'}
            click={() => {}}
            type="submit"
            className="search-button no-border-height"
            isDisabled={props?.isDisabled}
            disabledLoader
          />
        </form>
      </div>
    </div>
  );
};
