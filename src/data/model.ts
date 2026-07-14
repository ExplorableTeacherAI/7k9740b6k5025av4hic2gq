/**
 * Gear Domain Model
 * =================
 *
 * Mathematical foundation for the gears lesson.
 * All sections compute from these functions — never re-implement the math locally.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CORE GEAR RELATIONSHIPS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gear ratio between two meshing gears.
 * Defined as teeth of driven gear / teeth of driver gear.
 * Also equals: (angular velocity of driver) / (angular velocity of driven)
 */
export const gearRatio = (teethDriver: number, teethDriven: number): number => {
    return teethDriven / teethDriver;
};

/**
 * Angular velocity of driven gear given driver's angular velocity.
 * ω_driven = ω_driver × (N_driver / N_driven)
 */
export const drivenAngularVelocity = (
    driverAngularVelocity: number,
    teethDriver: number,
    teethDriven: number
): number => {
    return driverAngularVelocity * (teethDriver / teethDriven);
};

/**
 * Linear velocity at the pitch circle (contact point).
 * v = ω × r, where r is proportional to teeth count
 * At the mesh point, both gears have the same linear velocity.
 */
export const pitchLineVelocity = (
    angularVelocity: number,
    teeth: number,
    moduleSize: number = 1
): number => {
    const pitchRadius = (teeth * moduleSize) / 2;
    return angularVelocity * pitchRadius;
};

/**
 * Pitch radius of a gear (distance from center to pitch circle).
 * r = (N × m) / 2, where N = teeth, m = module
 */
export const pitchRadius = (teeth: number, moduleSize: number = 1): number => {
    return (teeth * moduleSize) / 2;
};

// ─────────────────────────────────────────────────────────────────────────────
// TORQUE AND POWER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mechanical power: P = τ × ω
 * Power is conserved in an ideal gear system.
 */
export const power = (torque: number, angularVelocity: number): number => {
    return torque * angularVelocity;
};

/**
 * Torque multiplication through gears.
 * τ_driven = τ_driver × (N_driven / N_driver)
 * Torque increases when speed decreases (and vice versa).
 */
export const drivenTorque = (
    driverTorque: number,
    teethDriver: number,
    teethDriven: number
): number => {
    return driverTorque * (teethDriven / teethDriver);
};

/**
 * Mechanical advantage of a gear pair.
 * MA = N_driven / N_driver = τ_driven / τ_driver = ω_driver / ω_driven
 */
export const mechanicalAdvantage = (teethDriver: number, teethDriven: number): number => {
    return teethDriven / teethDriver;
};

// ─────────────────────────────────────────────────────────────────────────────
// GEAR TRAINS (MULTIPLE GEARS)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Overall gear ratio of a simple gear train.
 * For gears in series: ratio = product of individual ratios
 * = (N2/N1) × (N4/N3) × ... for each mesh pair
 */
export const gearTrainRatio = (teethCounts: number[]): number => {
    if (teethCounts.length < 2) return 1;

    let ratio = 1;
    for (let i = 0; i < teethCounts.length - 1; i++) {
        ratio *= teethCounts[i + 1] / teethCounts[i];
    }
    return ratio;
};

/**
 * Direction of rotation after passing through n gears.
 * Each mesh reverses direction.
 * Returns 1 for same direction as input, -1 for opposite.
 */
export const rotationDirection = (numberOfGears: number): 1 | -1 => {
    // First gear is +1, each subsequent gear alternates
    return numberOfGears % 2 === 1 ? 1 : -1;
};

/**
 * Angular velocity of the final gear in a train.
 */
export const finalAngularVelocity = (
    inputAngularVelocity: number,
    teethCounts: number[]
): number => {
    if (teethCounts.length < 2) return inputAngularVelocity;

    let omega = inputAngularVelocity;
    for (let i = 0; i < teethCounts.length - 1; i++) {
        omega = omega * (teethCounts[i] / teethCounts[i + 1]);
    }
    return omega;
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPOUND GEARS (SAME SHAFT)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Overall ratio of a compound gear train.
 * Compound pairs: two gears on the same shaft (same angular velocity).
 *
 * Example: [20, 40, 15, 60] means:
 * - Gear 1 (20 teeth) meshes with Gear 2 (40 teeth)
 * - Gear 3 (15 teeth) on same shaft as Gear 2
 * - Gear 3 meshes with Gear 4 (60 teeth)
 *
 * Overall ratio = (40/20) × (60/15) = 2 × 4 = 8
 */
export const compoundGearRatio = (stages: Array<[number, number]>): number => {
    return stages.reduce((ratio, [driver, driven]) => {
        return ratio * (driven / driver);
    }, 1);
};

// ─────────────────────────────────────────────────────────────────────────────
// VISUALIZATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate gear tooth positions for SVG rendering.
 * Returns array of angles (in radians) for tooth centers.
 */
export const gearToothAngles = (teeth: number): number[] => {
    const angles: number[] = [];
    for (let i = 0; i < teeth; i++) {
        angles.push((2 * Math.PI * i) / teeth);
    }
    return angles;
};

/**
 * Calculate center distance between two meshing gears.
 * d = r1 + r2 = (N1 + N2) × m / 2
 */
export const centerDistance = (
    teeth1: number,
    teeth2: number,
    moduleSize: number = 1
): number => {
    return ((teeth1 + teeth2) * moduleSize) / 2;
};

/**
 * Given driver rotation angle, calculate driven gear rotation angle.
 * θ_driven = -θ_driver × (N_driver / N_driven)
 * Negative because meshing gears rotate in opposite directions.
 */
export const drivenRotation = (
    driverAngle: number,
    teethDriver: number,
    teethDriven: number
): number => {
    return -driverAngle * (teethDriver / teethDriven);
};

/**
 * Convert RPM to radians per second.
 */
export const rpmToRadPerSec = (rpm: number): number => {
    return (rpm * 2 * Math.PI) / 60;
};

/**
 * Convert radians per second to RPM.
 */
export const radPerSecToRpm = (radPerSec: number): number => {
    return (radPerSec * 60) / (2 * Math.PI);
};
