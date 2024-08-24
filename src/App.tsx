import React, { useEffect, useRef } from "react";

import "./styles/main.css";
import ViewerScene from "./Scene";

export const App = () => {
  const viewerRef = useRef<HTMLDivElement>();

  return (
    <div ref={viewerRef}>
      <ViewerScene />
    </div>
  );
};
