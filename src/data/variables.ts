/**
 * Variables Configuration
 * =======================
 * 
 * CENTRAL PLACE TO DEFINE ALL SHARED VARIABLES
 * 
 * This file defines all variables that can be shared across sections.
 * AI agents should read this file to understand what variables are available.
 * 
 * USAGE:
 * 1. Define variables here with their default values and metadata
 * 2. Use them in any section with: const x = useVar('variableName', defaultValue)
 * 3. Update them with: setVar('variableName', newValue)
 */

import { type VarValue } from '@/stores';

/**
 * Variable definition with metadata
 */
export interface VariableDefinition {
    /** Default value */
    defaultValue: VarValue;
    /** Human-readable label */
    label?: string;
    /** Description for AI agents */
    description?: string;
    /** Variable type hint */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    /** Unit (e.g., 'Hz', '°', 'm/s') - for numbers */
    unit?: string;
    /** Minimum value (for number sliders) */
    min?: number;
    /** Maximum value (for number sliders) */
    max?: number;
    /** Step increment (for number sliders) */
    step?: number;
    /** Display color for InlineScrubbleNumber / InlineSpotColor (e.g. '#D81B60') */
    color?: string;
    /** Options for 'select' type variables */
    options?: string[];
    /** Placeholder text for text inputs */
    placeholder?: string;
    /** Correct answer for cloze input validation */
    correctAnswer?: string;
    /** Whether cloze matching is case sensitive */
    caseSensitive?: boolean;
    /** Background color for inline components */
    bgColor?: string;
    /** Schema hint for object types (for AI agents) */
    schema?: string;
}

/**
 * =====================================================
 * 🎯 DEFINE YOUR VARIABLES HERE
 * =====================================================
 * 
 * SUPPORTED TYPES:
 * 
 * 1. NUMBER (slider):
 *    { defaultValue: 5, type: 'number', min: 0, max: 10, step: 1 }
 * 
 * 2. TEXT (free text):
 *    { defaultValue: 'Hello', type: 'text', placeholder: 'Enter text...' }
 * 
 * 3. SELECT (dropdown):
 *    { defaultValue: 'sine', type: 'select', options: ['sine', 'cosine', 'tangent'] }
 * 
 * 4. BOOLEAN (toggle):
 *    { defaultValue: true, type: 'boolean' }
 * 
 * 5. ARRAY (list of numbers):
 *    { defaultValue: [1, 2, 3], type: 'array' }
 * 
 * 6. OBJECT (complex data):
 *    { defaultValue: { x: 5, y: 10 }, type: 'object', schema: '{ x: number, y: number }' }
 */
export const variableDefinitions: Record<string, VariableDefinition> = {
    // ========================================
    // GEAR LESSON VARIABLES
    // ========================================

    // ─────────────────────────────────────────
    // SECTION 1: Meshing Gears
    // ─────────────────────────────────────────
    driverRotation: {
        defaultValue: 0,
        type: 'number',
        label: 'Driver Rotation',
        description: 'Rotation angle of the driver gear in degrees',
        unit: '°',
        min: 0,
        max: 720,
        step: 1,
        color: '#62D0AD', // teal for driver
    },
    driverTeeth: {
        defaultValue: 12,
        type: 'number',
        label: 'Driver Teeth',
        description: 'Number of teeth on the driver gear',
        min: 8,
        max: 32,
        step: 1,
        color: '#62D0AD',
    },
    drivenTeeth: {
        defaultValue: 18,
        type: 'number',
        label: 'Driven Teeth',
        description: 'Number of teeth on the driven gear',
        min: 8,
        max: 32,
        step: 1,
        color: '#8E90F5', // indigo for driven
    },

    // ─────────────────────────────────────────
    // SECTION 2: Gear Ratio
    // ─────────────────────────────────────────
    driverRpm: {
        defaultValue: 60,
        type: 'number',
        label: 'Driver RPM',
        description: 'Rotational speed of the driver gear',
        unit: 'RPM',
        min: 10,
        max: 200,
        step: 10,
        color: '#62D0AD',
    },

    // ─────────────────────────────────────────
    // SECTION 3: Torque Tradeoff
    // ─────────────────────────────────────────
    inputTorque: {
        defaultValue: 10,
        type: 'number',
        label: 'Input Torque',
        description: 'Torque applied to the driver gear',
        unit: 'N·m',
        min: 1,
        max: 50,
        step: 1,
        color: '#F7B23B', // amber for torque
    },

    // ─────────────────────────────────────────
    // SECTION 4: Gear Trains
    // ─────────────────────────────────────────
    gear1Teeth: {
        defaultValue: 12,
        type: 'number',
        label: 'Gear 1 Teeth',
        description: 'Teeth on the first gear (input)',
        min: 8,
        max: 24,
        step: 1,
        color: '#62D0AD',
    },
    gear2Teeth: {
        defaultValue: 24,
        type: 'number',
        label: 'Gear 2 Teeth',
        description: 'Teeth on the second gear',
        min: 8,
        max: 36,
        step: 1,
        color: '#8E90F5',
    },
    gear3Teeth: {
        defaultValue: 16,
        type: 'number',
        label: 'Gear 3 Teeth',
        description: 'Teeth on the third gear (output)',
        min: 8,
        max: 36,
        step: 1,
        color: '#AC8BF9',
    },

    // ─────────────────────────────────────────
    // SECTION 5: Compound Gears
    // ─────────────────────────────────────────
    compoundSmallTeeth: {
        defaultValue: 12,
        type: 'number',
        label: 'Compound Small Teeth',
        description: 'Small gear on the compound shaft',
        min: 8,
        max: 20,
        step: 1,
        color: '#F8A0CD',
    },
    compoundLargeTeeth: {
        defaultValue: 36,
        type: 'number',
        label: 'Compound Large Teeth',
        description: 'Large gear on the compound shaft',
        min: 24,
        max: 48,
        step: 1,
        color: '#62CCF9',
    },

    // ─────────────────────────────────────────
    // ASSESSMENT VARIABLES
    // ─────────────────────────────────────────
    answerMeshDirection: {
        defaultValue: '',
        type: 'select',
        label: 'Mesh Direction Answer',
        description: 'Student answer for gear mesh direction',
        placeholder: '???',
        correctAnswer: 'opposite',
        options: ['same', 'opposite', 'random'],
        color: '#8E90F5',
    },
    answerGearRatio: {
        defaultValue: '',
        type: 'text',
        label: 'Gear Ratio Answer',
        description: 'Student answer for gear ratio calculation',
        placeholder: '???',
        correctAnswer: '1.5',
        color: '#62D0AD',
    },
    answerTorqueTradeoff: {
        defaultValue: '',
        type: 'select',
        label: 'Torque Tradeoff Answer',
        description: 'Student answer for torque tradeoff question',
        placeholder: '???',
        correctAnswer: 'increases',
        options: ['increases', 'decreases', 'stays the same'],
        color: '#F7B23B',
    },
    answerTrainDirection: {
        defaultValue: '',
        type: 'select',
        label: 'Gear Train Direction Answer',
        description: 'Student answer for 3-gear train direction',
        placeholder: '???',
        correctAnswer: 'same',
        options: ['same', 'opposite'],
        color: '#AC8BF9',
    },
};

/**
 * Get all variable names (for AI agents to discover)
 */
export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

/**
 * Get a variable's default value
 */
export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

/**
 * Get a variable's metadata
 */
export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

/**
 * Get all default values as a record (for initialization)
 */
export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

/**
 * Get number props for InlineScrubbleNumber from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

/**
 * Get cloze input props for InlineClozeInput from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
/**
 * Get cloze choice props for InlineClozeChoice from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Get toggle props for InlineToggle from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

/**
 * Get spot-color props for InlineSpotColor from a variable definition.
 * Extracts the `color` field.
 *
 * @example
 * <InlineSpotColor
 *     varName="radius"
 *     {...spotColorPropsFromDefinition(getVariableInfo('radius'))}
 * >
 *     radius
 * </InlineSpotColor>
 */
export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

/**
 * Get linked-highlight props for InlineLinkedHighlight from a variable definition.
 * Extracts the `color` and `bgColor` fields.
 *
 * @example
 * <InlineLinkedHighlight
 *     varName="activeHighlight"
 *     highlightId="radius"
 *     {...linkedHighlightPropsFromDefinition(getVariableInfo('activeHighlight'))}
 * >
 *     radius
 * </InlineLinkedHighlight>
 */
export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Build the `variables` prop for FormulaBlock from variable definitions.
 *
 * Takes an array of variable names and returns the config map expected by
 * `<FormulaBlock variables={...} />`.
 *
 * @example
 * import { scrubVarsFromDefinitions } from './variables';
 *
 * <FormulaBlock
 *     latex="\scrub{mass} \times \scrub{accel}"
 *     variables={scrubVarsFromDefinitions(['mass', 'accel'])}
 * />
 */
export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
