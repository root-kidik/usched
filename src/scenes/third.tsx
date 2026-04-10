import { makeScene2D, Rect } from '@motion-canvas/2d';
import { all, beginSlide, createRef } from '@motion-canvas/core';
import { MyGrid } from '../components/My/MyGrid';
import { animationTime } from '../theme/Theme';
import { RegisterTable } from '../components/RegisterTable';

export default makeScene2D(function* (view) {
    const grid = createRef<MyGrid>();

    const regs = createRef<RegisterTable>();

    const rows = [
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
    ];

    view.add(
        <MyGrid ref={grid}>
            <RegisterTable
                ref={regs}
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

    yield* beginSlide("End");
});
