import React from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const QuestionMarker = ({ question, idx }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className="w-2 h-2 rounded absolute bg-blue-500 z-10"
          style={{ top: question.yPos, left: 16 }}
        />
      </HoverCardTrigger>
      <HoverCardContent>
        <p>{question.question}</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default QuestionMarker;
