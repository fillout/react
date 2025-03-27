import React, { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

// this is to avoid problems with server-side rendering

export const Portal = ({ children }: { children: ReactNode }) => {
  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(true);
  }, []);

  return render ? createPortal(children, document.body) : <></>;
};
