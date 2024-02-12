import React, { useState } from "react";
import { Page } from "react-pdf";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import QuestionMarker from "./QuestionMarker";

type ClickPos = {
  x: number;
  y: number;
};

type TopLeftCornerPos = {
  top: number;
  left: number;
};

type CurrentPosState = {
  elementPos: ClickPos;
  cornerPos: TopLeftCornerPos;
};

type InteractablePageProps = {
  index: number;
  handleAddQuestion: (
    question: { question: string; yPos: number },
    index: number,
  ) => void;
  pdfQuestions: { question: string; yPos: number }[];
};

// TODO: Add markers to show where questions have been placed
// TODO: Auto move question markers below each other so they don't overlap
const InteractablePage = ({
  index,
  handleAddQuestion,
  pdfQuestions,
}: InteractablePageProps) => {
  const [currentPos, setCurrentPos] = useState<CurrentPosState | undefined>(
    undefined,
  );

  // TODO: Make markers draggable?
  // TODO: Add onhover to see question text, allow delete action
  const questionMarkers = pdfQuestions.map((question, idx) => (
    <QuestionMarker key={idx} question={question} idx={idx} />
  ));
  console.log(`InteractableDebug: ${questionMarkers.length}`);

  return (
    <div className="relative">
      <Popover
        open={currentPos !== undefined}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setCurrentPos(undefined);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Page
            className="border border-black border-solid"
            onClick={(event) => {
              const elementBounds = event.target.getBoundingClientRect();
              const pageClickX = event.clientX;
              const pageClickY = event.clientY;
              const x = pageClickX - elementBounds.left;
              const y = pageClickY - elementBounds.top;

              setCurrentPos({
                elementPos: { x, y },
                cornerPos: { top: pageClickY, left: pageClickX },
              });
            }}
            //! key={`base_ordering_${index}`} Replace with crypto hash at creation?
            pageNumber={index + 1}
          />
        </PopoverTrigger>
        <PopoverContent asChild>
          <div className="absolute p-4" style={currentPos?.cornerPos}>
            <form
              onSubmit={(event) => {
                event.preventDefault();

                handleAddQuestion(
                  {
                    question: question.value,
                    yPos: currentPos?.elementPos.y,
                  },
                  index,
                );
                setCurrentPos(undefined);
              }}
            >
              <label>
                Question
                <input
                  type="text"
                  id="question"
                  name="question"
                  autoComplete="off"
                  placeholder="What are the different states of matter?"
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
      {questionMarkers}
    </div>
  );
};

export default InteractablePage;
