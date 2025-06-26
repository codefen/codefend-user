import {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
  useMemo,
} from 'react';

export default function createFastContext<FastContext>(initialState: FastContext) {
  function useFastContextData(): {
    get: () => Readonly<FastContext>;
    set: (value: Partial<FastContext>) => void;
    subscribe: (callback: () => void) => () => void;
    reset: () => void;
  } {
    const store = useRef(initialState);

    const get = useCallback((): Readonly<FastContext> => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback((value: Partial<FastContext>) => {
      store.current = { ...store.current, ...value };
      subscribers.current.forEach(callback => callback());
    }, []);

    const reset = useCallback(() => {
      store.current = { ...initialState };
      subscribers.current.forEach(callback => callback());
    }, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
      reset,
    };
  }

  type UseFastContextDataReturnType = ReturnType<typeof useFastContextData>;

  const FastContext = createContext<UseFastContextDataReturnType | null>(null);

  function FastContextProvider({ children }: Readonly<{ children: ReactNode }>) {
    return <FastContext.Provider value={useFastContextData()}>{children}</FastContext.Provider>;
  }

  function useFastContext<SelectorOutput>(
    selector: (store: FastContext) => SelectorOutput
  ): [SelectorOutput, (value: Partial<FastContext>) => void] {
    const fastContext = useContext(FastContext);
    if (!fastContext) {
      throw new Error('Store not found');
    }

    const state = useSyncExternalStore(
      fastContext.subscribe,
      () => selector(fastContext.get()),
      () => selector(initialState)
    );

    return [state, fastContext.set];
  }

  function useFastContextFields<K extends keyof FastContext>(
    fieldNames: K[]
  ): {
    [Key in K]: {
      get: FastContext[Key];
      set: (value: FastContext[Key]) => void;
    };
  } {
    // Creamos un array para almacenar los resultados de forma segura
    const result = {} as {
      [Key in K]: {
        get: FastContext[Key];
        set: (value: FastContext[Key]) => void;
      };
    };

    for (const fieldName of fieldNames) {
      const [getter, setter] = useFastContext(fc => fc[fieldName]);

      result[fieldName] = {
        get: getter,
        set: (value: FastContext[typeof fieldName]) => {
          const isPrimitive =
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean' ||
            value === null ||
            value === undefined;
          if ((isPrimitive && value != getter) || !isPrimitive) {
            // console.log(
            //   `setting from useFastContextFields for ${fieldName.toString()} to ${value}`
            // );
            const update = { [fieldName]: value } as unknown as Partial<FastContext>;
            setter(update);
          }
        },
      };
    }

    return result;
  }

  function useFastField<K extends keyof FastContext>(
    key: K
  ): {
    get: FastContext[K];
    set: (value: FastContext[K]) => void;
  } {
    const [getter, setter] = useFastContext(fc => fc[key]);
    return {
      get: getter,
      set: (value: FastContext[K]) => {
        const isPrimitive =
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          value === null ||
          value === undefined;
        if ((isPrimitive && value != getter) || !isPrimitive) {
          // console.log(`setting from useFastField for ${key.toString()} to ${value}`);
          const update = { [key]: value } as unknown as Partial<FastContext>;
          setter(update);
        }
      },
    };
  }

  function useResetStore() {
    const fastContext = useContext(FastContext);
    if (!fastContext) {
      throw new Error('Store not found');
    }
    return fastContext.reset;
  }

  return {
    FastContextProvider,
    useFastContextFields,
    useFastField,
    useResetStore,
  };
}
