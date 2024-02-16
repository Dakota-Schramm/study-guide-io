"use client";
import React from "react";

export const ButtonContent = ({ title, description }) => (
  <>
    <span className="font-bold">{title}</span>
    <ul className="opacity-50">
      <li className="text-white text-sm text-muted-foreground">
        {description}
      </li>
    </ul>
  </>
);
