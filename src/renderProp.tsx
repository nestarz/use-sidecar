import * as React from 'react';
import { useState, useCallback, useEffect, useLayoutEffect } from 'react';

type CombinedProps<T extends any[], K> = { children: (...prop: T) => any } & K;
type RenderPropComponent<T extends any[], K> = React.ComponentType<CombinedProps<T, K>>;

interface Options {
  pure?: boolean;
}

type Callback = (state: any) => void;

type ChildrenProps<T extends any[], K> = {
  stateRef: React.MutableRefObject<Callback>;
  defaultState: React.RefObject<T>;
  children: (...prop: T) => any;
};

export function renderCar<T extends any[], K>(
  WrappedComponent: RenderPropComponent<T, K>,
  defaults: (props: K) => T,
  options: Options = {}
) {
  function State({ stateRef, props }: { stateRef: React.RefObject<Callback>; props: CombinedProps<T, K> }) {
    const renderTarget = useCallback(function SideTarget(...args: T) {
      useLayoutEffect(() => {
        stateRef.current(args);
      });

      return null;
    }, []);

    return <WrappedComponent {...props} children={renderTarget} />;
  }

  const Children = React.memo(
    ({ stateRef, defaultState, children }: ChildrenProps<T, K>) => {
      const [state, setState] = useState<T>(defaultState.current);

      useEffect(() => {
        stateRef.current = setState;
      }, []);

      return children(...state);
    },
    () => true
  );

  return function Combiner(props: CombinedProps<T, K>) {
    const defaultState = React.useRef<T>(defaults(props));
    const ref = React.useRef((state: T) => (defaultState.current = state));

    return (
      <React.Fragment>
        <State stateRef={ref} props={props} />
        <Children stateRef={ref} defaultState={defaultState} children={props.children} />
      </React.Fragment>
    );
  };
}
