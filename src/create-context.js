import { memo } from "./component";

export function createContext(initialValue) {
  const context = {
    currentValue: initialValue,
    Consumer({ children }) {
      return children(context.currentValue);
    },
    Provider: memo(function Provider({ value, children }) {
      if (value !== context.currentValue) {
        context.currentValue = value
      }
      return children
    }),
  };
  return context
}
