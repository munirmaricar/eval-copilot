import { createContext, ReactNode, useState } from "react";

type CodeModalValues = {
  inputVariables: string[];
  metricName: string;
};

type CodeModalContext = {
  openCodeModal: (input: CodeModalValues) => void;
  closeCodeModal: () => void;
  codeModalValues: CodeModalValues | null;
};

const codeModalContext = createContext<CodeModalContext>({
  openCodeModal: () => {
    throw new Error("CodeModalContext not initialized");
  },
  closeCodeModal: () => {
    throw new Error("CodeModalContext not initialized");
  },
  codeModalValues: null,
});

const CodeModalContextProvider = ({ children }: { children: ReactNode }) => {
  const [values, setValues] = useState<CodeModalValues | null>(null);

  return (
    <codeModalContext.Provider
      value={{
        openCodeModal: setValues,
        closeCodeModal: () => setValues(null),
        codeModalValues: values,
      }}
    >
      {children}
    </codeModalContext.Provider>
  );
};

export { codeModalContext, CodeModalContextProvider };
