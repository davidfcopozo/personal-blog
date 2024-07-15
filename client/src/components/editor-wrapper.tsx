import { useState, useEffect } from "react";

import { ReactNode } from "react";

const EditorWrapper = ({
  children,
  isReady,
}: {
  children: ReactNode;
  isReady: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isReady) {
      // Delay showing the editor slightly to ensure styles are applied
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  return (
    <div style={{ visibility: isVisible ? "visible" : "hidden" }}>
      {children}
    </div>
  );
};

export default EditorWrapper;
