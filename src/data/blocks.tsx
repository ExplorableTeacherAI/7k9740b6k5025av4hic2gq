import { type ReactElement } from "react";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors } from "@/stores";
import { getDefaultValues, variableDefinitions } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// Import section blocks
import { meshingGearsBlocks } from "./sections/MeshingGears";

/**
 * ------------------------------------------------------------------
 * GEARS LESSON
 * ------------------------------------------------------------------
 * A comprehensive interactive lesson on the mathematics of gears.
 *
 * Sections:
 * 1. Meshing Gears - How gears interact, direction reversal
 * 2. Gear Ratio - Speed relationships between gears
 * 3. Torque Tradeoff - Power conservation principle
 * 4. Gear Trains - Multiple gears in sequence
 * 5. Compound Gears - Same-shaft configurations
 */

export const blocks: ReactElement[] = [
    // Section 1: Meshing Gears
    ...meshingGearsBlocks,
];
