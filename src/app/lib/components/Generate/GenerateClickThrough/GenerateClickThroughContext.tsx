import { createContext, ReactNode, useEffect, useState } from "react";

export enum GenerateClickThroughStepID {
  INTRO = "INTRO",
  STEP_1 = "STEP_1",
  STEP_2 = "STEP_2",
  STEP_3 = "STEP_3",
  STEP_4 = "STEP_4",
}

interface Step {
  id: GenerateClickThroughStepID;
  title: string;
  content: string;
}

interface GenerateClickThroughContext {
  showClickThrough: boolean;
  isStep: (step: GenerateClickThroughStepID) => boolean;
  setStep: (step: GenerateClickThroughStepID) => void;
  step: Step;
  setShowClickThrough: (showClickThrough: boolean) => void;
}

const steps: Step[] = [
  {
    id: GenerateClickThroughStepID.INTRO,
    title: "Align your evaluation metric",
    content:
      "Now that you've created an evaluation metric, let's test how well it aligns with your judgements and refine it if necessary.",
  },
  {
    id: GenerateClickThroughStepID.STEP_1,
    title: "Add / save test cases",
    content:
      "Add another test case to input your own examples. Save your groupings of test cases in your Test set library to load across other metrics.",
  },
  {
    id: GenerateClickThroughStepID.STEP_2,
    title: "Run evaluations",
    content:
      "Run your evaluation metric against your test cases to receive Atla scores / critiques. Optionally, add the scores that you would have given as an evaluator.",
  },
  {
    id: GenerateClickThroughStepID.STEP_3,
    title: "Refine your evaluation metric",
    content:
      "Show eval prompt to review and revise your evaluation prompt if necessary. Describe how to edit the prompt to direct an LLM to do it for you.  Edit few-shot examples to give the evaluation metric examples to learn from. Don’t worry if you don’t have any ready - you’ll be able to add misaligned test cases as few shot-examples once you start running evals.",
  },
  {
    id: GenerateClickThroughStepID.STEP_4,
    title: "Get ready to deploy",
    content:
      "Track the level of agreement between your scores and Atla’s scores with the Cohen’s Kappa score. Once you are ready, hit Deploy to start using your evaluation metric via our API!",
  },
];

const GenerateClickThroughContext = createContext<GenerateClickThroughContext>({
  showClickThrough: false,
  isStep: () => false,
  setStep: () => {},
  step: steps[0],
  setShowClickThrough: () => {},
});

const GenerateClickThroughContextProvider = ({
  children,
  setShowPrompt,
}: {
  children: ReactNode;
  setShowPrompt: (showModal: boolean) => void;
}) => {
  const [showClickThrough, setShowClickThrough] = useState<boolean>(false);
  const [step, setStep] = useState<Step>(steps[0]);

  useEffect(() => {
    const viewedEvalClickThrough = localStorage.getItem(
      "viewed-eval-click-through"
    );

    setShowClickThrough(viewedEvalClickThrough === null);

    localStorage.setItem("viewed-eval-click-through", "true");
  }, []);

  const isStep = (value: GenerateClickThroughStepID) => {
    return step.id === value;
  };

  const handleSetStep = (stepId: GenerateClickThroughStepID) => {
    if (stepId === GenerateClickThroughStepID.STEP_3) {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }

    setStep(steps.find((step) => step.id === stepId)!);
  };

  const handleSetShowClickThrough = (value: boolean) => {
    if (!value) {
      setShowPrompt(false);
      setStep(steps[0]);
    }

    setShowClickThrough(value);
  };

  return (
    <GenerateClickThroughContext.Provider
      value={{
        setShowClickThrough: handleSetShowClickThrough,
        showClickThrough,
        isStep,
        setStep: handleSetStep,
        step,
      }}
    >
      {children}
    </GenerateClickThroughContext.Provider>
  );
};

export { GenerateClickThroughContextProvider, GenerateClickThroughContext };
