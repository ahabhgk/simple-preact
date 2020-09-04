let ctxId = 0;

export function createContext(defaultValue) {
  ctxId += 1;
  const context = {
    id: ctxId,
    defaultValue,
    currentValue: defaultValue,
    Consumer({ children }) {
      return children(context.currentValue);
    },
    Provider({ value, children }) {
      return children;
    },
  };
}
