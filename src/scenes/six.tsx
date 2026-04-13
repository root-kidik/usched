import { Layout, makeScene2D, Rect, Txt } from '@motion-canvas/2d';
import { all, beginSlide, createRef, Direction, makeRef, slideTransition } from '@motion-canvas/core';
import { MyGrid } from '../components/My/MyGrid';
import { RegisterTable } from '../components/RegisterTable';
import { BlueFirst, BlueSecond, BrownFirst, BrownSecond, OrangeFirst, OrangeSecond, RedFirst, RedSecond } from '../theme/Colors';
import { animationTime, fontFamilyDefault } from '../theme/Theme';

export default makeScene2D(function* (view) {
    const grid = createRef<MyGrid>();

    const regs = createRef<RegisterTable>();

    const rows = [
        [
            { name: "zero", description: "hardwired zero" },
            { name: "a1", description: "func arg / result" },
            { name: "s6", description: "" }
        ],
        [
            { name: "ra", description: "return address" },
            { name: "a2", description: "func arg" },
            { name: "s7", description: "" }
        ],
        [
            { name: "sp", description: "stack pointer" },
            { name: "a3", description: "func arg" },
            { name: "s8", description: "" }
        ],
        [
            { name: "gp", description: "global pointer" },
            { name: "a4", description: "func arg" },
            { name: "s9", description: "" }
        ],
        [
            { name: "tp", description: "thread pointer" },
            { name: "a5", description: "func arg" },
            { name: "s10", description: "" }
        ],
        [
            { name: "t0", description: "" },
            { name: "a6", description: "func arg" },
            { name: "s11", description: "" }
        ],
        [
            { name: "t1", description: "" },
            { name: "a7", description: "func arg" },
            { name: "t3", description: "" }
        ],
        [
            { name: "t2", description: "" },
            { name: "s2", description: "" },
            { name: "t4", description: "" }
        ],
        [
            { name: "s0/fp", description: "frame pointer" },
            { name: "s3", description: "" },
            { name: "t5", description: "" }
        ],
        [
            { name: "s1", description: "" },
            { name: "s4", description: "" },
            { name: "t6", description: "" }
        ],
        [
            { name: "a0", description: "func arg / result" },
            { name: "s5", description: "" },
            { name: "pc", description: "program counter" }
        ],
    ];

    const callerSaved = createRef<Layout>();
    const calleeSaved = createRef<Layout>();
    const otherSaved = createRef<Layout>();

    view.add(
        <MyGrid ref={grid}>
            <Layout 
                x={-505}
                y={-450}
                ref={callerSaved} 
                opacity={0}
                layout
                direction={"column"}
                alignContent={"center"}
                alignItems={"center"}
                gap={20}
            >
                <Txt 
                    fill={"#ffffff"} 
                    text={"caller saved"} 
                    fontFamily={fontFamilyDefault} 
                    fontWeight={800} 
                    fontSize={20} 
                />

                <Rect
                    width={80}
                    height={50}
                    fill={BlueFirst}
                    stroke={BlueSecond}
                    lineWidth={6}
                    radius={8}
                    justifyContent={'center'}
                    alignItems={'center'}
                />
            </Layout>

            <Layout 
                x={-40}
                y={-450}
                ref={calleeSaved} 
                opacity={0}
                layout
                direction={"column"}
                alignContent={"center"}
                alignItems={"center"}
                gap={20}
            >
                <Txt 
                    fill={"#ffffff"} 
                    text={"callee saved"} 
                    fontFamily={fontFamilyDefault} 
                    fontWeight={800} 
                    fontSize={20} 
                />

                <Rect
                    width={80}
                    height={50}
                    fill={RedSecond}
                    stroke={RedFirst}
                    lineWidth={6}
                    radius={8}
                    justifyContent={'center'}
                    alignItems={'center'}
                />
            </Layout>

            <Layout 
                x={430}
                y={-450}
                ref={otherSaved} 
                opacity={0}
                layout
                direction={"column"}
                alignContent={"center"}
                alignItems={"center"}
                gap={20}
            >
                <Txt 
                    fill={"#ffffff"} 
                    text={"непременимо"} 
                    fontFamily={fontFamilyDefault} 
                    fontWeight={800} 
                    fontSize={20} 
                />

                <Rect
                    width={80}
                    height={50}
                    fill={BrownSecond}
                    stroke={BrownFirst}
                    lineWidth={6}
                    radius={8}
                    justifyContent={'center'}
                    alignItems={'center'}
                />
            </Layout>

            <RegisterTable
                ref={regs}
                x={150}
                rowsData={rows}
                cellColor={BrownSecond}
                accentColor={BrownFirst}
            />
        </MyGrid>
    );

    const otherCoords: [number, number][] = [
        [0, 0],
        [3, 0],
        [4, 0],
        [10, 2]
    ];

    const callerSavedCoords: [number, number][] = [
        [1, 0],
        [5, 0],
        [6, 0],
        [7, 0],
        [10, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 1],
        [6, 1],
        [6, 2],
        [7, 2],
        [8, 2],
        [9, 2],
    ];

    const calleeSavedCoords: [number, number][] = [
        [2, 0],
        [8, 0],
        [9, 0],
        [7, 1],
        [8, 1],
        [9, 1],
        [10, 1],
        [0, 2],
        [1, 2],
        [2, 2],
        [3, 2],
        [4, 2],
        [5, 2],
    ];

    yield* all(
        slideTransition(Direction.Right),
        grid().show(0),
        regs().showAll(0),
        regs().y(100, animationTime),
        regs().changeColor(callerSavedCoords, { cell: BlueFirst, accent: BlueSecond }),
        callerSaved().y(-400, animationTime),
        callerSaved().opacity(1, animationTime),
        regs().changeColor(calleeSavedCoords, { accent: RedFirst, cell: RedSecond }),
        calleeSaved().y(-400, animationTime),
        calleeSaved().opacity(1, animationTime),
        otherSaved().y(-400, animationTime),
        otherSaved().opacity(1, animationTime),
    );

    yield* beginSlide("OTHERS");

    yield* all(
        otherSaved().opacity(0.5, animationTime),
        regs().hideCells(otherCoords),
    );

    yield* beginSlide("CALLER");

    yield* all(
        callerSaved().opacity(0.5, animationTime),
        regs().hideCells(callerSavedCoords),
    );

    yield* beginSlide("X1");

    yield* all(
        regs().showCell(1, 0),
    );

    yield* beginSlide("End");
});
