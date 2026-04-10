import { makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, createRef } from '@motion-canvas/core';
import { MyGrid } from '../components/My/MyGrid';
import { RegisterTable } from '../components/RegisterTable';

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
                accentColor={"rgb(130, 100, 90)"}
                cellColor={"rgb(81, 56, 47)"}
            />
        </MyGrid>
    );

    yield* all(
        grid().show(0),
        regs().showCell(0, 0),
    );

    yield* beginSlide("X1");

    yield* all(
        regs().hideCell(0, 0),
        regs().showCell(1, 0),
    );

    yield* beginSlide("X2");

    yield* all(
        regs().hideCell(1, 0),
        regs().showCell(2, 0),
    );

    yield* beginSlide("X3");

    yield* all(
        regs().hideCell(2, 0),
        regs().showCell(3, 0)
    );

    yield* beginSlide("X4");

    yield* all(
        regs().hideCell(3, 0),
        regs().showCell(4, 0),
    );

    yield* beginSlide("X10-X17");

    yield* all(
        regs().hideCell(4, 0),
        regs().showCell(10, 0),
        regs().showCell(0, 1),
        regs().showCell(1, 1),
        regs().showCell(2, 1),
        regs().showCell(3, 1),
        regs().showCell(4, 1),
        regs().showCell(5, 1),
        regs().showCell(6, 1),
    );

    yield* beginSlide("PC");

    yield* all(
        regs().hideCell(10, 0),
        regs().hideCell(0, 1),
        regs().hideCell(1, 1),
        regs().hideCell(2, 1),
        regs().hideCell(3, 1),
        regs().hideCell(4, 1),
        regs().hideCell(5, 1),
        regs().hideCell(6, 1),
        regs().showCell(10, 2),
    );

    yield* beginSlide("OTHER");

    yield* all(
        regs().hideCell(10, 2),
        regs().showCell(5, 0),
        regs().showCell(6, 0),
        regs().showCell(7, 0),
        regs().showCell(8, 0),
        regs().showCell(9, 0),
        regs().showCell(7, 1),
        regs().showCell(8, 1),
        regs().showCell(9, 1),
        regs().showCell(10, 1),
        regs().showCell(0, 2),
        regs().showCell(1, 2),
        regs().showCell(2, 2),
        regs().showCell(3, 2),
        regs().showCell(4, 2),
        regs().showCell(5, 2),
        regs().showCell(6, 2),
        regs().showCell(7, 2),
        regs().showCell(8, 2),
        regs().showCell(9, 2),
    );

    yield* beginSlide("ALL");
    yield* regs().showAll();

    yield* beginSlide("ALTERNATIVE NAME");
    yield* regs().changeAllNames([
        ["x0", "x11", "x22"],
        ["x1", "x12", "x23"],
        ["x2", "x13", "x24"],
        ["x3", "x14", "x25"],
        ["x4", "x15", "x26"],
        ["x5", "x16", "x27"],
        ["x6", "x17", "x28"],
        ["x7", "x18", "x29"],
        ["x8", "x19", "x30"],
        ["x9", "x20", "x31"],
        ["x10", "x21", "pc"],
    ]);

    yield* beginSlide("ABI NAMES BACK");
    yield* regs().changeAllNames([
        ["zero", "a1", "s6"],
        ["ra", "a2", "s7"],
        ["sp", "a3", "s8"],
        ["gp", "a4", "s9"],
        ["tp", "a5", "s10"],
        ["t0", "a6", "s11"],
        ["t1", "a7", "t3"],
        ["t2", "s2", "t4"],
        ["s0/fp", "s3", "t5"],
        ["s1", "s4", "t6"],
        ["a0", "s5", "pc"],
    ]);

    yield* beginSlide("End");
});
