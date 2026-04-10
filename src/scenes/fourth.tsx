import { makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, createRef } from '@motion-canvas/core';
import { MyGrid } from '../components/My/MyGrid';
import { RegisterTable } from '../components/RegisterTable';
import { BlueFirst, BlueSecond, BrownFirst, BrownSecond } from '../theme/Colors';

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

    view.add(
        <MyGrid ref={grid}>
            <RegisterTable
                ref={regs}
                x={150}
                rowsData={rows}
                cellColor={BrownFirst}
                accentColor={BrownSecond}
            />
        </MyGrid>
    );

    yield* all(
        grid().show(0),
        regs().showAll(0),
        regs().changeColor(1, 0, { cell: BlueFirst, accent: BlueSecond }),
    );

    yield* beginSlide("End");
});
