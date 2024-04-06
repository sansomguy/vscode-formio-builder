import React from "react";

type VSCodeApi = {
  postMessage: (message: any) => void;
  setState: (state: any) => void;
  getState: (state: any) => void;
};

export const VSCodeProvider = React.createContext<VSCodeApi | null>(null);
