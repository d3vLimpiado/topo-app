import React from "react";
import style from "./App.module.css";
import { Todo, Pomo } from "./components";

function createCtx<A extends {} | null>() {
  const ctx = React.createContext<A | undefined>(undefined);
  function useCtx() {
    const ct = React.useContext(ctx);
    if (ct === undefined) {
      throw new Error("useCtx must be inside a provider");
    }
    return ct;
  }
  return [useCtx, ctx.Provider] as const;
}

export const [usePomoState, PomoStateProvider] =
  createCtx<typeof initialState>();
export const [usePomoStateUpdate, PomoStateUpdateProvider] =
  createCtx<React.Dispatch<ACTIONTYPE>>();

const initialState: {
  status: "IN-SESSION" | "SHORT BREAK" | "LONG BREAK";
  sessionCount: number;
  sessionLength: number;
  breakLength: number;
  longBreakLength: number;
} = {
  status: "IN-SESSION",
  sessionCount: 0,
  sessionLength: 25,
  breakLength: 5,
  longBreakLength: 15,
};

type ACTIONTYPE =
  | { type: "update_session"; payload: number }
  | { type: "update_break"; payload: number }
  | { type: "update_longBreak"; payload: number }
  | { type: "update_sessionCount"; payload: number }
  | {
      type: "update_status";
      payload: "IN-SESSION" | "SHORT BREAK" | "LONG BREAK";
    };

const reducer = (state: typeof initialState, action: ACTIONTYPE) => {
  switch (action.type) {
    case "update_session":
      return {
        ...state,
        sessionLength: action.payload,
      };
    case "update_break":
      return {
        ...state,
        breakLength: action.payload,
      };
    case "update_longBreak":
      return {
        ...state,
        longBreakLength: action.payload,
      };
    case "update_status":
      return {
        ...state,
        status: action.payload,
      };
    case "update_sessionCount":
      return {
        ...state,
        sessionCount: action.payload,
      };
  }
};

function App() {
  const [pomoState, setPomoState] = React.useReducer(reducer, initialState);

  return (
    <PomoStateProvider value={pomoState}>
      <PomoStateUpdateProvider value={setPomoState}>
        <h1>TOPO App!</h1>
        <div className={style.app}>
          <Todo />
          <Pomo />
        </div>
      </PomoStateUpdateProvider>
    </PomoStateProvider>
  );
}

export default App;
