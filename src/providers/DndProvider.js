"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

// Wrapper component to handle Strict Mode in Next.js
export function StrictModeDroppable({ children, ...props }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
}