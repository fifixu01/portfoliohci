import { createContext, useContext } from "react";
import { useSpring } from "framer-motion";

// { engine, wu (motion value: px per world unit), viewU (motion value: window width in world units) }
export const TrainContext = createContext(null);
export const useTrain = () => useContext(TrainContext);

// How hard the train is pulling or braking, smoothed into a loose swing for anything that hangs.
export function useLean(stiffness = 60, damping = 5) {
  const { engine } = useTrain();
  return useSpring(engine.acc, { stiffness, damping, mass: 1 });
}
