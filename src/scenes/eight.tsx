import { CODE, lines, makeScene2D, word } from '@motion-canvas/2d';
import { all, beginSlide, createRef, Direction, slideTransition } from '@motion-canvas/core';
import { animationTime } from '../theme/Theme';
import { MyGrid } from '../components/My/MyGrid';
import { BlueFirst, BlueSecond, GreenFirst, GreenSecond, OrangeFirst, OrangeSecond, RedFirst, RedSecond, VioletFirst, VioletSecond } from '../theme/Colors';
import { StackV3 } from '../components/StackV3';
import { RegisterTableV2 } from '../components/RegisterTableV2';
import { StackV4 } from '../components/StackV4';
import { RegisterTable } from '../components/RegisterTable';
import { RegisterTableV3 } from '../components/RegisterTableV3';
import { MyCode } from '../components/My/MyCode';
import { MyRect } from '../components/My/MyRect';

export default makeScene2D(function* (view) {
    const grid = createRef<MyGrid>();

    const sp1 = createRef<RegisterTableV2>();
    const t1 = createRef<StackV4>();

    const sp2 = createRef<RegisterTableV2>();
    const t2 = createRef<StackV4>();

    const regs = createRef<RegisterTableV3>();

    const rows = [
        [ { name: "a0" }, { name: "s0" }, { name: "s1" }, { name: "s2" }, { name: "s3" }, { name: "s4"  }, { name: "s5"  }, { name: "a1" }, ],
        [ { name: ""   }, { name: "s6" }, { name: "s7" }, { name: "s8" }, { name: "s9" }, { name: "s10" }, { name: "s11" }, { name: ""   }, ],
        [ { name: ""   }, { name: ""   }, { name: ""   }, { name: "sp" }, { name: "ra" }, { name: ""    }, { name: ""    }, { name: ""   }, ],
    ];

    const asm = createRef<MyCode>();
    const asmlayout = createRef<MyRect>();

    const asm2 = createRef<MyCode>();

    view.add(
        <MyGrid ref={grid}>
            <RegisterTableV2
                ref={sp1}
                rowsData={[[{name: "sp"}]]}
                accentColor={GreenFirst}
                cellColor={GreenSecond}
                x={-400}
                y={-200}
                blockWidth={160}
            />

            <RegisterTableV2
                ref={sp2}
                rowsData={[[{name: "sp"}]]}
                accentColor={VioletSecond}
                cellColor={VioletFirst}
                x={400}
                y={-200}
                blockWidth={160}
            />

            <StackV4 
                ref={t1}
                amount={16}
                blockWidth={160}
                blockHeight={40}
                stroke_color={GreenFirst}
                color={GreenSecond}
                top_address={"0x02004000"}
                bot_address={"0x02003FC0"}
                y={600}
                x={-125}
            />

            <StackV4 
                ref={t2}
                amount={16}
                blockWidth={160}
                blockHeight={40}
                stroke_color={VioletSecond}
                color={VioletFirst}
                top_address={"0x02003800"}
                bot_address={"0x020037C0"}
                y={600}
                x={125}
            />

            <RegisterTableV3 
                ref={regs}
                rowsData={rows}
                accentColor={VioletSecond}
                cellColor={VioletFirst}
            />

            <MyRect width={1000} height={700} y={1000} layout ref={asmlayout} opacity={0}>
                <MyCode ref={asm} />
                <MyCode ref={asm2} />
            </MyRect>
        </MyGrid>
    );

    yield* all(
        grid().show(0),

        t2().changeColor(3, RedSecond, RedFirst, 0),
        t2().setText(3, "s11", 0),

        t2().changeColor(4, RedSecond, RedFirst, 0),
        t2().setText(4, "s10", 0),

        t2().changeColor(5, RedSecond, RedFirst, 0),
        t2().setText(5, "s9", 0),

        t2().changeColor(6, RedSecond, RedFirst, 0),
        t2().setText(6, "s8", 0),

        t2().changeColor(7, RedSecond, RedFirst, 0),
        t2().setText(7, "s7", 0),

        t2().changeColor(8, RedSecond, RedFirst, 0),
        t2().setText(8, "s6", 0),

        t2().changeColor(9, RedSecond, RedFirst, 0),
        t2().setText(9, "s5", 0),

        t2().changeColor(10, RedSecond, RedFirst, 0),
        t2().setText(10, "s4", 0),

        t2().changeColor(11, RedSecond, RedFirst, 0),
        t2().setText(11, "s3", 0),

        t2().changeColor(12, RedSecond, RedFirst, 0),
        t2().setText(12, "s2", 0),
        
        t2().changeColor(13, RedSecond, RedFirst, 0),
        t2().setText(13, "s1", 0),
        
        t2().changeColor(14, RedSecond, RedFirst, 0),
        t2().setText(14, "s0", 0),

        t2().changeColor(15, BlueFirst, BlueSecond, 0),
        t2().setText(15, "ra", 0),

        t1().x(-1500, 0),
        t1().x(-700, 0),
        t1().y(50, 0),
        sp1().showCell(0, 0, 0),
        sp1().y(-475, 0),
        sp1().x(-700, 0),
        
        t2().x(1500, 0),
        t2().x(700, 0),
        t2().y(50, 0),
        sp2().showCell(0, 0, 0),
        sp2().y(-475, 0),
        sp2().x(700, 0),
        sp2().changeValue(0, 0, "0x020037C0", 0),

        regs().changeColor([[0, 0], [0, 7], [2, 4]], { cell: BlueFirst, accent: BlueSecond}),
        regs().changeColor([[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 3]], { accent: RedFirst, cell: RedSecond}),

        regs().showAll(),
        regs().y(-400, animationTime),
    );

    yield* beginSlide("asm");

    yield* all(
        asmlayout().opacity(1, animationTime),
        asmlayout().y(100, animationTime),
        asm().code(CODE`context_switch:`, animationTime),
    );

    yield* beginSlide("asm");

    yield* all(
        t1().hideAll(),
        sp1().opacity(0.5, animationTime),

        t2().hideAll(),
        sp2().opacity(0.5, animationTime),
    );

    yield* beginSlide("addi sp, sp, -64");

    yield* all(
        asm().code.insert([1, 4], CODE`addi sp, sp, -64`, animationTime),
        asm().selection(lines(1), animationTime),

        regs().hideCells([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 4], ]),

        t1().showAll(),
    );

    yield* beginSlide("save");

    yield* all(
        asm().code(CODE`\
context_switch:
    addi sp, sp, -64

    sw  ra,   0*4(sp)
    sw  s0,   1*4(sp)
    sw  s1,   2*4(sp)
    sw  s2,   3*4(sp)
    sw  s3,   4*4(sp)
    sw  s4,   5*4(sp)
    sw  s5,   6*4(sp)
    sw  s6,   7*4(sp)
    sw  s7,   8*4(sp)
    sw  s8,   9*4(sp)
    sw  s9,  10*4(sp)
    sw  s10, 11*4(sp)
    sw  s11, 12*4(sp)`, animationTime),
        asm().selection(lines(3, 15), animationTime),

        t1().setText(15, "ra"),
        t1().changeColor(15, BlueFirst, BlueSecond),

        t1().setText(14, "s0"),
        t1().changeColor(14, RedSecond, RedFirst),

        t1().setText(13, "s1"),
        t1().changeColor(13, RedSecond, RedFirst),

        t1().setText(12, "s2"),
        t1().changeColor(12, RedSecond, RedFirst),

        t1().setText(11, "s3"),
        t1().changeColor(11, RedSecond, RedFirst),

        t1().setText(10, "s4"),
        t1().changeColor(10, RedSecond, RedFirst),

        t1().setText(9, "s5"),
        t1().changeColor(9, RedSecond, RedFirst),

        t1().setText(8, "s6"),
        t1().changeColor(8, RedSecond, RedFirst),

        t1().setText(7, "s7"),
        t1().changeColor(7, RedSecond, RedFirst),

        t1().setText(6, "s8"),
        t1().changeColor(6, RedSecond, RedFirst),

        t1().setText(5, "s9"),
        t1().changeColor(5, RedSecond, RedFirst),

        t1().setText(4, "s10"),
        t1().changeColor(4, RedSecond, RedFirst),

        t1().setText(3, "s11"),
        t1().changeColor(3, RedSecond, RedFirst),

        regs().hideCell(2, 3),

        regs().showCells([[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 4], ]),
    );

    yield* beginSlide("sw sp, 0(a0)");

    yield* all(
        asm().code(CODE`\
context_switch:
    addi sp, sp, -64

    sw  ra,   0*4(sp)
    sw  s0,   1*4(sp)
    sw  s1,   2*4(sp)
    sw  s2,   3*4(sp)
    sw  s3,   4*4(sp)
    sw  s4,   5*4(sp)
    sw  s5,   6*4(sp)
    sw  s6,   7*4(sp)
    sw  s7,   8*4(sp)
    sw  s8,   9*4(sp)
    sw  s9,  10*4(sp)
    sw  s10, 11*4(sp)
    sw  s11, 12*4(sp)
    
    sw  sp,  0(a0)`, animationTime),
        asm().selection(lines(17), animationTime),

        regs().hideCells([[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 4], ]),
        regs().showCell(0, 0),

        t1().hideAll(),

        sp1().opacity(1, animationTime),
        sp1().changeValue(0, 0, "0x02003FC0", animationTime),
    );

    yield* beginSlide("load sp");

    yield* all(
        asm().selection(lines(2), animationTime),

        asm2().code(CODE`
lw sp, 0(a1)`, animationTime),
        asm2().selection(lines(1), animationTime),

        regs().hideCell(0, 0),
        regs().showCell(0, 7),
        regs().showCell(2, 3),

        sp2().opacity(1, animationTime),

        sp1().opacity(0.5, animationTime),

        t2().showAll(),
    );

    yield* beginSlide("load regs");

    yield* all(
        asm2().code(CODE`
lw sp, 0(a1)

lw ra,   0*4(sp)
lw s0,   1*4(sp)
lw s1,   2*4(sp)
lw s2,   3*4(sp)
lw s3,   4*4(sp)
lw s4,   5*4(sp)
lw s5,   6*4(sp)
lw s6,   7*4(sp)
lw s7,   8*4(sp)
lw s8,   9*4(sp)
lw s9,  10*4(sp)
lw s10, 11*4(sp)
lw s11, 12*4(sp)`, animationTime),
        asm2().selection(lines(3, 15), animationTime),

        regs().hideCells([[0, 7], [2, 3]]),
        regs().showCells([[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 4], ]),

        sp2().changeValue(0, 0, ""),
        sp2().opacity(0.5, animationTime),

        t2().changeColor(3, VioletFirst, VioletSecond),
        t2().changeColor(4, VioletFirst, VioletSecond),
        t2().changeColor(5, VioletFirst, VioletSecond),
        t2().changeColor(6, VioletFirst, VioletSecond),
        t2().changeColor(7, VioletFirst, VioletSecond),
        t2().changeColor(8, VioletFirst, VioletSecond),
        t2().changeColor(9, VioletFirst, VioletSecond),
        t2().changeColor(10, VioletFirst, VioletSecond),
        t2().changeColor(11, VioletFirst, VioletSecond),
        t2().changeColor(12, VioletFirst, VioletSecond),
        t2().changeColor(13, VioletFirst, VioletSecond),
        t2().changeColor(14, VioletFirst, VioletSecond),
        t2().changeColor(15, VioletFirst, VioletSecond),
    );

    yield* beginSlide("2. addi sp, sp, 64");

    yield* all(
        asm2().code(CODE`
lw sp, 0(a1)

lw ra,   0*4(sp)
lw s0,   1*4(sp)
lw s1,   2*4(sp)
lw s2,   3*4(sp)
lw s3,   4*4(sp)
lw s4,   5*4(sp)
lw s5,   6*4(sp)
lw s6,   7*4(sp)
lw s7,   8*4(sp)
lw s8,   9*4(sp)
lw s9,  10*4(sp)
lw s10, 11*4(sp)
lw s11, 12*4(sp)

addi sp, sp, 64`, animationTime),
        asm2().selection(lines(17), animationTime),

        t2().hideAll(),
    );

    yield* beginSlide("ret");

    yield* all(
        asm2().code(CODE`
lw sp, 0(a1)

lw ra,   0*4(sp)
lw s0,   1*4(sp)
lw s1,   2*4(sp)
lw s2,   3*4(sp)
lw s3,   4*4(sp)
lw s4,   5*4(sp)
lw s5,   6*4(sp)
lw s6,   7*4(sp)
lw s7,   8*4(sp)
lw s8,   9*4(sp)
lw s9,  10*4(sp)
lw s10, 11*4(sp)
lw s11, 12*4(sp)

addi sp, sp, 64

ret`, animationTime),
        asm2().selection(lines(19), animationTime),
    );

    yield* beginSlide("hide all");

    yield* all(
        regs().y(1000, animationTime),
        asmlayout().y(2000, animationTime),

        // t1().showAll(),
        t2().showAll(),

        // sp1().opacity(1, animationTime),
        sp2().opacity(1, animationTime),

        t2().setText(3, ""),
        t2().setText(4, ""),
        t2().setText(5, ""),
        t2().setText(6, ""),
        t2().setText(7, ""),
        t2().setText(8, ""),
        t2().setText(9, ""),
        t2().setText(10, ""),
        t2().setText(11, ""),
        t2().setText(12, ""),
        t2().setText(13, ""),
        t2().setText(14, ""),
        t2().setText(15, ""),
    );

    yield* beginSlide("switch");

    yield* all(
        t2().hideAll(),
        sp2().opacity(0.5, animationTime),
        sp2().changeValue(0, 0, "0x020037C0"),
        t2().changeColor(3, RedSecond, RedFirst),
        t2().setText(3, "s11"),
        t2().changeColor(4, RedSecond, RedFirst),
        t2().setText(4, "s10"),
        t2().changeColor(5, RedSecond, RedFirst),
        t2().setText(5, "s9"),
        t2().changeColor(6, RedSecond, RedFirst),
        t2().setText(6, "s8"),
        t2().changeColor(7, RedSecond, RedFirst),
        t2().setText(7, "s7"),
        t2().changeColor(8, RedSecond, RedFirst),
        t2().setText(8, "s6"),
        t2().changeColor(9, RedSecond, RedFirst),
        t2().setText(9, "s5"),
        t2().changeColor(10, RedSecond, RedFirst),
        t2().setText(10, "s4"),
        t2().changeColor(11, RedSecond, RedFirst),
        t2().setText(11, "s3"),
        t2().changeColor(12, RedSecond, RedFirst),
        t2().setText(12, "s2"),
        t2().changeColor(13, RedSecond, RedFirst),
        t2().setText(13, "s1"),
        t2().changeColor(14, RedSecond, RedFirst),
        t2().setText(14, "s0"),
        t2().changeColor(15, BlueFirst, BlueSecond),
        t2().setText(15, "ra"),

        t1().showAll(),
        sp1().opacity(1, animationTime),
        sp1().changeValue(0, 0, ""),
        t1().changeColor(3, GreenSecond, GreenFirst),
        t1().setText(3, ""),
        t1().changeColor(4, GreenSecond, GreenFirst),
        t1().setText(4, ""),
        t1().changeColor(5, GreenSecond, GreenFirst),
        t1().setText(5, ""),
        t1().changeColor(6, GreenSecond, GreenFirst),
        t1().setText(6, ""),
        t1().changeColor(7, GreenSecond, GreenFirst),
        t1().setText(7, ""),
        t1().changeColor(8, GreenSecond, GreenFirst),
        t1().setText(8, ""),
        t1().changeColor(9, GreenSecond, GreenFirst),
        t1().setText(9, ""),
        t1().changeColor(10, GreenSecond, GreenFirst),
        t1().setText(10, ""),
        t1().changeColor(11, GreenSecond, GreenFirst),
        t1().setText(11, ""),
        t1().changeColor(12, GreenSecond, GreenFirst),
        t1().setText(12, ""),
        t1().changeColor(13, GreenSecond, GreenFirst),
        t1().setText(13, ""),
        t1().changeColor(14, GreenSecond, GreenFirst),
        t1().setText(14, ""),
        t1().changeColor(15, GreenSecond, GreenFirst),
        t1().setText(15, ""),
    );

    yield* beginSlide("another switch");

    yield* all(
        t1().hideAll(),
        sp1().opacity(0.5, animationTime),
        sp1().changeValue(0, 0, "0x02003FC0"),
        t1().changeColor(3, RedSecond, RedFirst),
        t1().setText(3, "s11"),
        t1().changeColor(4, RedSecond, RedFirst),
        t1().setText(4, "s10"),
        t1().changeColor(5, RedSecond, RedFirst),
        t1().setText(5, "s9"),
        t1().changeColor(6, RedSecond, RedFirst),
        t1().setText(6, "s8"),
        t1().changeColor(7, RedSecond, RedFirst),
        t1().setText(7, "s7"),
        t1().changeColor(8, RedSecond, RedFirst),
        t1().setText(8, "s6"),
        t1().changeColor(9, RedSecond, RedFirst),
        t1().setText(9, "s5"),
        t1().changeColor(10, RedSecond, RedFirst),
        t1().setText(10, "s4"),
        t1().changeColor(11, RedSecond, RedFirst),
        t1().setText(11, "s3"),
        t1().changeColor(12, RedSecond, RedFirst),
        t1().setText(12, "s2"),
        t1().changeColor(13, RedSecond, RedFirst),
        t1().setText(13, "s1"),
        t1().changeColor(14, RedSecond, RedFirst),
        t1().setText(14, "s0"),
        t1().changeColor(15, BlueFirst, BlueSecond),
        t1().setText(15, "ra"),

        t2().showAll(),
        sp2().opacity(1, animationTime),
        sp2().changeValue(0, 0, ""),
        t2().changeColor(3, VioletFirst, VioletSecond),
        t2().setText(3, ""),
        t2().changeColor(4, VioletFirst, VioletSecond),
        t2().setText(4, ""),
        t2().changeColor(5, VioletFirst, VioletSecond),
        t2().setText(5, ""),
        t2().changeColor(6, VioletFirst, VioletSecond),
        t2().setText(6, ""),
        t2().changeColor(7, VioletFirst, VioletSecond),
        t2().setText(7, ""),
        t2().changeColor(8, VioletFirst, VioletSecond),
        t2().setText(8, ""),
        t2().changeColor(9, VioletFirst, VioletSecond),
        t2().setText(9, ""),
        t2().changeColor(10, VioletFirst, VioletSecond),
        t2().setText(10, ""),
        t2().changeColor(11, VioletFirst, VioletSecond),
        t2().setText(11, ""),
        t2().changeColor(12, VioletFirst, VioletSecond),
        t2().setText(12, ""),
        t2().changeColor(13, VioletFirst, VioletSecond),
        t2().setText(13, ""),
        t2().changeColor(14, VioletFirst, VioletSecond),
        t2().setText(14, ""),
        t2().changeColor(15, VioletFirst, VioletSecond),
        t2().setText(15, ""),
    );

    yield* beginSlide("End");
});
