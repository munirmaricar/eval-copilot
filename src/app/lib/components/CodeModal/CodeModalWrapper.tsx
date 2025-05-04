import { ReactNode, useContext } from "react";
import { CodeModal } from "@/app/lib/components/CodeModal/CodeModal";
import { codeModalContext } from "@/app/lib/components/CodeModal/CodeModalContext";

function CodeModalWrapper({ children }: { children: ReactNode }) {
  const { closeCodeModal, codeModalValues } = useContext(codeModalContext);

  return (
    <>
      {codeModalValues !== null && (
        <CodeModal
          inputVariables={codeModalValues.inputVariables}
          metricName={codeModalValues.metricName}
          onClose={closeCodeModal}
        />
      )}
      {children}
    </>
  );
}

export { CodeModalWrapper };
