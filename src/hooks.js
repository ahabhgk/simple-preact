import { options } from './options';

let currentComponent;
let currentIndex;

const originalRender = options.render;
options.render = function renderWithHooks(vnode) {
  if (originalRender) originalRender(vnode);

  currentComponent = vnode.component;
  currentIndex = 0;

  const { hooks } = currentComponent;
  if (hooks) {
    hooks.pendingEffects.forEach(invokeCleanup);
    hooks.pendingEffects.forEach(invokeEffect);
    hooks.pendingEffects = [];
  }
};

const afterPaint = requestAnimationFrame;
const originalDiffed = options.diffed;
options.diffed = function invokeEffectOnDiffed(vnode) {
  if (originalDiffed) originalDiffed(vnode);

  const { component } = vnode;
  if (component && component.hooks && component.hooks.pendingEffects.length) {
    const { hooks } = component;
    afterPaint(() => {
      try {  
        hooks.pendingEffects.forEach(invokeCleanup);
        hooks.pendingEffects.forEach(invokeEffect);
        hooks.pendingEffects = [];
      } catch (e) {
        hooks.pendingEffects = [];
        options.catchError(e, vnode)
      }
    });
  }
};

const originalUnmount = options.unmount;
options.unmount = function invokeCleanupOnUnmount(vnode) {
  if (originalUnmount) originalUnmount(vnode);

  const { component } = vnode;
  if (component && component.hooks) {
    try {
      component.hooks.list.forEach(invokeCleanup);
    } catch (e) {
      options.catchError(e, vnode)
    }
  }
};

function getHookState(index) {
  const hooks = currentComponent.hooks || (currentComponent.hooks = {
    list: [],
    pendingEffects: [],
  });
  if (index >= hooks.list.length) {
    hooks.list.push({});
  }
  return hooks.list[index];
}

/**
 * type Dispatcher = <A>(action: A) => void
 * interface ReducerHookState<State, Action> {
 *   component: Component,
 *   value: [State, Dispatcher<Action>]
 * }
 */
export function useReducer(reducer, initialState, init) {
  const hookState = getHookState(currentIndex++);
  if (!hookState.component) {
    hookState.component = currentComponent;
    hookState.value = [
      init ? init(initialState) : initialState,
      (action) => {
        const nextState = reducer(hookState.value[0], action);
        if (hookState.value[0] !== nextState) {
          hookState.value = [nextState, hookState.value[1]];
          hookState.component.forceUpdate();
        }
      },
    ];
  }
  return hookState.value;
}

export function useState(initialState) {
  return useReducer(
    (state, action) => (typeof action === 'function' ? action(state) : action),
    typeof initialState === 'function' ? initialState() : initialState,
  );
}

/**
 * type Cleanup = () => void
 * interface EffectHookState {
 *   effect: () => (void | Cleanup),
 *   args: any[],
 * }
 */
export function useEffect(effect, args) {
  const hookState = getHookState(currentIndex++);
  if (argsChanged(hookState.args, args)) {
    hookState.effect = effect;
    hookState.args = args;
    currentComponent.hooks.pendingEffects.push(hookState);
  }
}

/**
 * interface MemoHookState {
 *   value: any,
 *   args: any[],
 * }
 */
export function useMemo(factory, args) {
  const hookState = getHookState(currentIndex++);
  if (argsChanged(hookState.args, args)) {
    hookState.args = args;
    hookState.value = factory();
  }
  return hookState.value;
}

export function useCallback(callback, args) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => callback, args);
}

export function useRef(initialValue) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => ({ current: initialValue }), []);
}

function invokeCleanup(effectState) {
  if (typeof effectState.cleanup === 'function') effectState.cleanup();
}

function invokeEffect(effectState) {
  effectState.cleanup = effectState.effect();
}

function argsChanged(oldArgs, newArgs) {
  return !oldArgs || newArgs.some((arg, index) => arg !== oldArgs[index]);
}

export function useContext(context) {
  return context.currentValue
}

export function useErrorBoundary(cb) {
  const [error, setError] = useState(null)
	if (!currentComponent.componentDidCatch) {
		currentComponent.componentDidCatch = err => {
			if (typeof cb === 'function') cb(err)
			setError(err)
		}
  }
  return [error, () => setError(null)]
}

// LayoutEffect 在所有的 DOM 变更之后同步调用
// 在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新
const originalCommit = options.commit
options.commit = function invokeLayoutEffect(commitQueue, vnode) {
  commitQueue.forEach(component => {
    try {  
      component.renderCallbacks.forEach(invokeCleanup)
      component.renderCallbacks = component.renderCallbacks.filter(cb =>
        cb.effect ? invokeEffect(cb) : true
      )
    } catch (e) {
      commitQueue.forEach(component => component.renderCallbacks = [])
      commitQueue = []
      options.catchError(e, component.vnode)
    }
  })

  if (originalCommit) originalCommit(commitQueue, vnode)
}

export function useLayoutEffect(cb, args) {
  const hookState = getHookState(currentIndex++)
  if (argsChanged(hookState.args, args)) {
    hookState.effect = cb
    hookState.args = args
    currentComponent.renderCallbacks.push(hookState)
  }
}

export function useImperativeHandle(ref, createHandle, args) {
  useLayoutEffect(
    () => {
			if (typeof ref == 'function') ref(createHandle());
			else if (ref) ref.current = createHandle();
    },
    args,
  )
}
