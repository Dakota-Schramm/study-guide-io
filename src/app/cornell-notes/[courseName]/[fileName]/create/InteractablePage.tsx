import React, { useState } from "react";
import { Page } from "react-pdf";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ClickPos = {
  x: number;
  y: number;
};

type TopLeftCornerPos = {
  top: number;
  left: number;
};

type InteractablePageProps = {
  elementPos: ClickPos;
  cornerPos: TopLeftCornerPos;
};

const InteractablePage = ({ index, handleAddQuestion }) => {
  const [currentPos, setCurrentPos] = useState<
    InteractablePageProps | undefined
  >(undefined);

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

                // calculate ypos from top of page

                console.log("hit");
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
                  placeholder="What are the different states of matter?"
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InteractablePage;
