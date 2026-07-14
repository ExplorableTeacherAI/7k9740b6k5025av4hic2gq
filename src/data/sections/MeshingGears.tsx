import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH1,
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineSpotColor,
    InlineTooltip,
    InlineClozeChoice,
    InlineFeedback,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { InteractionHintSequence } from "@/components/atoms/visual/InteractionHint";
import { useVar, useSetVar } from "@/stores";
import {
    getVariableInfo,
    numberPropsFromDefinition,
    choicePropsFromDefinition,
} from "../variables";
import { drivenRotation, pitchRadius, centerDistance } from "../model";

// ─────────────────────────────────────────────────────────────────────────────
// GEAR VISUALIZATION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const DRIVER_COLOR = "#62D0AD";
const DRIVEN_COLOR = "#8E90F5";
const TOOTH_ACTIVE_COLOR = "#F7B23B";

interface GearProps {
    cx: number;
    cy: number;
    teeth: number;
    rotation: number; // in degrees
    color: string;
    moduleSize?: number;
    highlightToothIndex?: number;
    label?: string;
}

function Gear({ cx, cy, teeth, rotation, color, moduleSize = 8, highlightToothIndex, label }: GearProps) {
    const radius = pitchRadius(teeth, moduleSize);
    const toothHeight = moduleSize * 1.2;
    const toothWidth = (2 * Math.PI * radius) / teeth * 0.4;

    // Generate tooth paths
    const toothPaths: JSX.Element[] = [];
    for (let i = 0; i < teeth; i++) {
        const angle = (360 / teeth) * i + rotation;
        const rad = (angle * Math.PI) / 180;

        const innerX = cx + (radius - toothHeight * 0.3) * Math.cos(rad);
        const innerY = cy + (radius - toothHeight * 0.3) * Math.sin(rad);
        const outerX = cx + (radius + toothHeight * 0.7) * Math.cos(rad);
        const outerY = cy + (radius + toothHeight * 0.7) * Math.sin(rad);

        const perpRad = rad + Math.PI / 2;
        const halfWidth = toothWidth / 2;

        const isHighlighted = highlightToothIndex !== undefined && i === highlightToothIndex % teeth;

        toothPaths.push(
            <polygon
                key={i}
                points={`
                    ${innerX - halfWidth * Math.cos(perpRad)},${innerY - halfWidth * Math.sin(perpRad)}
                    ${outerX - halfWidth * 0.6 * Math.cos(perpRad)},${outerY - halfWidth * 0.6 * Math.sin(perpRad)}
                    ${outerX + halfWidth * 0.6 * Math.cos(perpRad)},${outerY + halfWidth * 0.6 * Math.sin(perpRad)}
                    ${innerX + halfWidth * Math.cos(perpRad)},${innerY + halfWidth * Math.sin(perpRad)}
                `}
                fill={isHighlighted ? TOOTH_ACTIVE_COLOR : color}
                stroke={isHighlighted ? "#D97706" : "rgba(0,0,0,0.2)"}
                strokeWidth={isHighlighted ? 2 : 1}
            />
        );
    }

    return (
        <g data-concept={label}>
            {/* Main gear body */}
            <circle
                cx={cx}
                cy={cy}
                r={radius - toothHeight * 0.3}
                fill={`${color}33`}
                stroke={color}
                strokeWidth={2}
            />
            {/* Teeth */}
            {toothPaths}
            {/* Center hub */}
            <circle
                cx={cx}
                cy={cy}
                r={moduleSize * 1.5}
                fill={color}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth={1}
            />
            {/* Center axle hole */}
            <circle
                cx={cx}
                cy={cy}
                r={moduleSize * 0.5}
                fill="#f8fafc"
                stroke="rgba(0,0,0,0.2)"
                strokeWidth={1}
            />
            {/* Label */}
            {label && (
                <text
                    x={cx}
                    y={cy + radius + toothHeight + 20}
                    textAnchor="middle"
                    fill={color}
                    fontSize={14}
                    fontWeight={600}
                >
                    {label}
                </text>
            )}
        </g>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERACTIVE MESHING GEARS VISUALIZATION
// ─────────────────────────────────────────────────────────────────────────────

function MeshingGearsVisualization() {
    const driverRotationVal = useVar("driverRotation", 0) as number;
    const driverTeethVal = useVar("driverTeeth", 12) as number;
    const drivenTeethVal = useVar("drivenTeeth", 18) as number;
    const setVar = useSetVar();

    const moduleSize = 8;
    const viewWidth = 500;
    const viewHeight = 350;

    // Calculate gear positions
    const driverRadius = pitchRadius(driverTeethVal, moduleSize);
    const drivenRadius = pitchRadius(drivenTeethVal, moduleSize);
    const distance = centerDistance(driverTeethVal, drivenTeethVal, moduleSize);

    const driverCx = viewWidth / 2 - distance / 2;
    const driverCy = viewHeight / 2;
    const drivenCx = viewWidth / 2 + distance / 2;
    const drivenCy = viewHeight / 2;

    // Calculate driven gear rotation (opposite direction)
    const drivenRotationVal = drivenRotation(driverRotationVal, driverTeethVal, drivenTeethVal);

    // Calculate which tooth is currently at the mesh point
    const toothAngle = 360 / driverTeethVal;
    const driverMeshTooth = Math.floor(((driverRotationVal % 360) + 360) % 360 / toothAngle);
    const drivenMeshTooth = Math.floor((((-drivenRotationVal) % 360) + 360) % 360 / (360 / drivenTeethVal));

    // Count teeth that have passed the mesh point
    const teethPassed = Math.floor(driverRotationVal / toothAngle);

    // Handle drag interaction on driver gear
    const handleMouseDown = (e: React.MouseEvent<SVGElement>) => {
        e.preventDefault();
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const x = moveEvent.clientX - rect.left - driverCx;
            const y = moveEvent.clientY - rect.top - driverCy;
            const angle = Math.atan2(y, x) * (180 / Math.PI);
            setVar("driverRotation", ((angle % 360) + 360) % 360);
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div className="relative">
            <svg
                width="100%"
                viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                className="bg-white rounded-lg cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
            >
                {/* Mesh point indicator */}
                <line
                    x1={driverCx + driverRadius}
                    y1={driverCy - 30}
                    x2={driverCx + driverRadius}
                    y2={driverCy + 30}
                    stroke={TOOTH_ACTIVE_COLOR}
                    strokeWidth={2}
                    strokeDasharray="4,4"
                    opacity={0.6}
                />
                <text
                    x={driverCx + driverRadius}
                    y={driverCy - 40}
                    textAnchor="middle"
                    fill={TOOTH_ACTIVE_COLOR}
                    fontSize={12}
                    fontWeight={500}
                >
                    mesh point
                </text>

                {/* Driver gear */}
                <Gear
                    cx={driverCx}
                    cy={driverCy}
                    teeth={driverTeethVal}
                    rotation={driverRotationVal}
                    color={DRIVER_COLOR}
                    moduleSize={moduleSize}
                    highlightToothIndex={driverMeshTooth}
                    label={`Driver (${driverTeethVal}T)`}
                />

                {/* Driven gear */}
                <Gear
                    cx={drivenCx}
                    cy={drivenCy}
                    teeth={drivenTeethVal}
                    rotation={drivenRotationVal}
                    color={DRIVEN_COLOR}
                    moduleSize={moduleSize}
                    highlightToothIndex={drivenMeshTooth}
                    label={`Driven (${drivenTeethVal}T)`}
                />

                {/* Direction arrows */}
                <g transform={`translate(${driverCx}, ${driverCy - driverRadius - 30})`}>
                    <path
                        d="M -15 0 A 15 15 0 0 1 15 0"
                        fill="none"
                        stroke={DRIVER_COLOR}
                        strokeWidth={2}
                        markerEnd="url(#arrowDriver)"
                    />
                </g>
                <g transform={`translate(${drivenCx}, ${drivenCy - drivenRadius - 30})`}>
                    <path
                        d="M 15 0 A 15 15 0 0 1 -15 0"
                        fill="none"
                        stroke={DRIVEN_COLOR}
                        strokeWidth={2}
                        markerEnd="url(#arrowDriven)"
                    />
                </g>

                {/* Arrow markers */}
                <defs>
                    <marker id="arrowDriver" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 Z" fill={DRIVER_COLOR} />
                    </marker>
                    <marker id="arrowDriven" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 Z" fill={DRIVEN_COLOR} />
                    </marker>
                </defs>

                {/* Teeth counter display */}
                <g transform={`translate(${viewWidth / 2}, ${viewHeight - 30})`}>
                    <rect
                        x={-120}
                        y={-20}
                        width={240}
                        height={40}
                        rx={8}
                        fill="#f8fafc"
                        stroke="#e2e8f0"
                        strokeWidth={1}
                    />
                    <text x={-100} y={5} fontSize={14} fill={DRIVER_COLOR} fontWeight={500}>
                        Driver: {teethPassed} teeth
                    </text>
                    <text x={20} y={5} fontSize={14} fill={DRIVEN_COLOR} fontWeight={500}>
                        Driven: {teethPassed} teeth
                    </text>
                </g>
            </svg>
            <InteractionHintSequence
                hintKey="meshing-gears-drag"
                steps={[
                    {
                        gesture: "drag-circular",
                        label: "Drag anywhere to rotate the driver gear",
                        position: { x: "30%", y: "50%" },
                        dragPath: { type: "arc", startAngle: 0, endAngle: 90, radius: 40 },
                    },
                ]}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION BLOCKS
// ─────────────────────────────────────────────────────────────────────────────

export const meshingGearsBlocks: ReactElement[] = [
    // Title
    <StackLayout key="layout-gears-title" maxWidth="xl">
        <Block id="gears-title" padding="lg">
            <EditableH1 id="h1-gears-title" blockId="gears-title">
                The Mathematics of Gears
            </EditableH1>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-gears-intro" maxWidth="xl">
        <Block id="gears-intro" padding="sm">
            <EditableParagraph id="para-gears-intro" blockId="gears-intro">
                When two gears mesh together, something curious happens: they rotate in{" "}
                <InlineTooltip
                    id="tooltip-opposite"
                    tooltip="Like two hands pushing against each other — when one moves forward, the other moves backward."
                >
                    opposite directions
                </InlineTooltip>
                . Yet at the point where their teeth meet, both teeth are moving at exactly the same speed.
                This seemingly simple constraint is the foundation of all gear mathematics.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Section heading
    <StackLayout key="layout-meshing-heading" maxWidth="xl">
        <Block id="meshing-heading" padding="md">
            <EditableH2 id="h2-meshing-heading" blockId="meshing-heading">
                How Gears Mesh
            </EditableH2>
        </Block>
    </StackLayout>,

    // Explanation
    <StackLayout key="layout-meshing-explanation" maxWidth="xl">
        <Block id="meshing-explanation" padding="sm">
            <EditableParagraph id="para-meshing-explanation" blockId="meshing-explanation">
                Consider a{" "}
                <InlineSpotColor varName="driverTeeth" color={DRIVER_COLOR}>
                    driver gear
                </InlineSpotColor>
                {" "}with{" "}
                <InlineScrubbleNumber
                    varName="driverTeeth"
                    {...numberPropsFromDefinition(getVariableInfo("driverTeeth"))}
                />{" "}
                teeth meshed with a{" "}
                <InlineSpotColor varName="drivenTeeth" color={DRIVEN_COLOR}>
                    driven gear
                </InlineSpotColor>
                {" "}with{" "}
                <InlineScrubbleNumber
                    varName="drivenTeeth"
                    {...numberPropsFromDefinition(getVariableInfo("drivenTeeth"))}
                />{" "}
                teeth. Drag the driver gear below and watch each tooth engage one by one.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Visualization
    <StackLayout key="layout-meshing-visualization" maxWidth="xl">
        <Block id="meshing-visualization" padding="md" hasVisualization>
            <MeshingGearsVisualization />
        </Block>
    </StackLayout>,

    // Key insight
    <StackLayout key="layout-meshing-insight" maxWidth="xl">
        <Block id="meshing-insight" padding="sm">
            <EditableParagraph id="para-meshing-insight" blockId="meshing-insight">
                Notice the{" "}
                <InlineSpotColor varName="toothHighlight" color={TOOTH_ACTIVE_COLOR}>
                    highlighted teeth
                </InlineSpotColor>
                {" "}at the mesh point. For every tooth the driver advances, the driven gear advances exactly one tooth too.
                The counter at the bottom confirms this: both gears always show the same number of teeth passed.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Formula
    <StackLayout key="layout-meshing-formula" maxWidth="xl">
        <Block id="meshing-formula" padding="md">
            <FormulaBlock
                latex="\theta_{\text{driven}} = -\theta_{\text{driver}} \times \frac{N_{\text{driver}}}{N_{\text{driven}}}"
                caption="The driven gear rotates in the opposite direction (negative sign) at a rate determined by the teeth ratio."
            />
        </Block>
    </StackLayout>,

    // Assessment question
    <StackLayout key="layout-meshing-question" maxWidth="xl">
        <Block id="meshing-question" padding="sm">
            <EditableParagraph id="para-meshing-question" blockId="meshing-question">
                When two gears are meshed together, they rotate in{" "}
                <InlineFeedback
                    varName="answerMeshDirection"
                    correctValue="opposite"
                    position="terminal"
                    successMessage="— exactly right! The teeth push against each other, causing opposite rotation"
                    failureMessage="— not quite."
                    hint="Think about what happens at the mesh point: if one tooth moves up, the other must move..."
                    visualizationHint={{
                        blockId: "meshing-visualization",
                        hintKey: "feedback-meshing-direction",
                        steps: [
                            {
                                gesture: "drag-circular",
                                label: "Drag the driver clockwise — watch which way the driven gear rotates",
                                position: { x: "30%", y: "50%" },
                                completionVar: "driverRotation",
                                completionValue: 90,
                                completionTolerance: 30,
                            },
                        ],
                        label: "See it in action",
                        resetVars: { driverRotation: 0 },
                    }}
                >
                    <InlineClozeChoice
                        varName="answerMeshDirection"
                        correctAnswer="opposite"
                        options={["same", "opposite", "random"]}
                        {...choicePropsFromDefinition(getVariableInfo("answerMeshDirection"))}
                    />
                </InlineFeedback>{" "}
                directions.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
