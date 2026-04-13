import { CODE, Layout, lines, makeScene2D, word } from '@motion-canvas/2d';
import { all, beginSlide, createRef, Direction, slideTransition } from '@motion-canvas/core';
import { animationTime } from '../theme/Theme';
import { MyGrid } from '../components/My/MyGrid';
import { MyCode } from '../components/My/MyCode';
import { MyRect } from '../components/My/MyRect';
import { StackV2 } from '../components/StackV2';
import { BlueFirst, BlueSecond, BrownFirst, BrownSecond, OrangeFirst, OrangeSecond, RedFirst, RedSecond, VioletFirst, VioletSecond, WhiteFirst } from '../theme/Colors';
import { RegisterTableV2 } from '../components/RegisterTableV2';

export default makeScene2D(function* (view) {
    const grid = createRef<MyGrid>();

    const codelayout = createRef<Layout>();

    const cppcode = createRef<MyCode>();
    const cpplayout = createRef<Layout>();

    const asmcode = createRef<MyCode>();
    const asmlayout = createRef<Layout>();

    const sram = createRef<StackV2>();

    const eeprom = createRef<StackV2>();

    const regs = createRef<RegisterTableV2>();

    const rows = [
        [
            { name: "ra" },
            { name: "sp" },
            { name: "s0" },
            { name: "a0" },
            { name: "a1" },
        ],
    ];

    view.add(
        <MyGrid ref={grid}>
            <Layout ref={codelayout} direction={"column"} gap={40} layout>
                <MyRect layout ref={cpplayout} opacity={0}>
                    <MyCode ref={cppcode} />
                </MyRect>

                <MyRect layout ref={asmlayout} opacity={0}>
                    <MyCode ref={asmcode} />
                </MyRect>
            </Layout>

            <StackV2
                ref={sram}
                title="SRAM"
                amount={8}
                blockWidth={200}
                blockHeight={50}
                stroke_color={OrangeFirst}
                color={OrangeSecond}
                x={600}
                opacity={0}
            />

            <StackV2
                ref={eeprom}
                title="EEPROM"
                amount={4}
                blockWidth={200}
                blockHeight={50}
                stroke_color={VioletSecond}
                color={VioletFirst}
                x={1200}
                y={125}
                opacity={0}
            />

            <RegisterTableV2
                ref={regs}
                rowsData={rows}
                cellColor={BrownSecond}
                accentColor={BrownFirst}
            />
        </MyGrid>
    );


    yield* all(
        slideTransition(Direction.Right),
        grid().show(0),
        cppcode().code(CODE`\
#include <stdio.h>

int sum(int a, int b)
{
    int s = a + b;
    printf("%d", s);
    return s;
}`, animationTime),
        cpplayout().opacity(1, animationTime)
    );

    yield* beginSlide("ASM");

    yield* all(
        asmcode().code(CODE`\
sum(int, int):
    addi    sp, sp, -16
    sw      ra, 12(sp)
    sw      s0, 8(sp)
    add     s0, a1, a0

.Lpcrel_hi0:
    auipc   a0, %pcrel_hi(.L.str)
    addi    a0, a0, %pcrel_lo(.Lpcrel_hi0)
    mv      a1, s0
    call    printf
    mv      a0, s0
    lw      ra, 12(sp)
    lw      s0, 8(sp)
    addi    sp, sp, 16
    ret

.L.str:
        .asciz  "%d"`, animationTime),
        asmlayout().opacity(1, animationTime),
    );

    yield* beginSlide("SRAM");

    yield* all(
        codelayout().x(-500, animationTime),
        codelayout().opacity(0.5, animationTime),
        sram().opacity(1, animationTime),
        sram().x(150, animationTime)
    );

    yield* beginSlide("EEPROM");

    yield* all(
        sram().opacity(0.5, animationTime),
        eeprom().opacity(1, animationTime),
        eeprom().x(700, animationTime),
    );

    yield* beginSlide("EEPROM STR");

    yield* all(
        eeprom().setText(3, "%d")
    );

    yield* beginSlide("Registers");

    yield* all(
        eeprom().opacity(0.5, animationTime),
        eeprom().y(300, animationTime),
        sram().y(180, animationTime),
        regs().showAll(),
        regs().y(-290, animationTime),
        regs().x(425, animationTime),
    );

    yield* beginSlide("caller saved");

    yield* all(
        regs().changeColor([[0, 0], [0, 3], [0, 4]], { cell: BlueFirst, accent: BlueSecond }),
    );

    yield* beginSlide("callee saved");

    yield* all(
        regs().changeColor([[0, 1], [0, 2]], { accent: RedFirst, cell: RedSecond }),
    );

    yield* beginSlide("ALL");

    yield* all(
        eeprom().opacity(1, animationTime),
        sram().opacity(1, animationTime),
        codelayout().opacity(1, animationTime)
    );

    yield* beginSlide("STACK POINTER");

    yield* all(
        eeprom().opacity(0.5, animationTime),
        regs().hideCell(0, 0),
        regs().hideCell(0, 1),
        regs().hideCell(0, 2),
        regs().hideCell(0, 3),
        regs().hideCell(0, 4),
        cppcode().selection(lines(3), animationTime),
        asmcode().selection(lines(1), animationTime),
        sram().hideOne(4),
        sram().hideOne(5),
        sram().hideOne(6),
        sram().hideOne(7),
    );

    yield* beginSlide("SAVE RA");

    yield* all(
        asmcode().selection(lines(2), animationTime),
        regs().showCell(0, 0),
        sram().setText(0, "ra"),
        sram().changeColor(0, BlueFirst, BlueSecond),
    );

    yield* beginSlide("SAVE S0");

    yield* all(
        asmcode().selection(lines(3), animationTime),
        regs().hideCell(0, 0),
        regs().showCell(0, 2),
        sram().hideOne(0),
        sram().setText(1, "s0"),
        sram().changeColor(1, RedSecond, RedFirst),
    );

    yield* beginSlide("EMPTY TWO");

    yield* all(
        sram().hideAll()
    );

    yield* beginSlide("A0 + A1");

    yield* all(
        sram().hideOne(2),
        sram().hideOne(1),
        sram().hideOne(0),
        cppcode().selection(lines(4), animationTime),
        asmcode().selection(lines(4), animationTime),
        regs().hideCell(0, 2),
        regs().showCell(0, 3),
        regs().showCell(0, 4),
        sram().hideOne(3),
    );

    yield* all(
        regs().hideCell(0, 3),
        regs().hideCell(0, 4),
        regs().showCell(0, 2),
        regs().changeColor([[0, 2]], { cell: RedSecond, accent: WhiteFirst }),
        regs().changeValue(0, 2, "a0+a1")
    );

    yield* all(
        regs().changeColor([[0, 2]], { cell: RedSecond, accent: RedFirst }),
    )

    yield* beginSlide("auipc");

    yield* all(
        regs().hideCell(0, 2),
        eeprom().opacity(1, animationTime),
        eeprom().hideOne(0),
        eeprom().hideOne(1),
        eeprom().hideOne(2),
        cppcode().selection(word(5, 11, 4), animationTime),
        asmcode().selection(lines(7, 8), animationTime),
        regs().showCell(0, 3),
        regs().changeValue(0, 3, "&%d"),
    );

    yield* beginSlide("mv a1, s0");

    yield* all(
        cppcode().selection(word(5, 17, 1), animationTime),
        asmcode().selection(lines(9), animationTime),
        eeprom().hideOne(3),
        regs().hideCell(0, 3),
        regs().showCell(0, 2),
        regs().showCell(0, 4),
    );

    yield* all(
        regs().hideCell(0, 2),
        regs().changeColor([[0, 4]], { cell: BlueFirst, accent: WhiteFirst }),
        regs().changeValue(0, 4, "a0+a1")
    );

    yield* all(
        regs().changeColor([[0, 4]], { cell: BlueFirst, accent: BlueSecond }),
    );

    yield* beginSlide("printf");

    yield* all(
        cppcode().selection(lines(5), animationTime),
        asmcode().selection(lines(10), animationTime),
        regs().showCell(0, 3),
    );

    yield* beginSlide("printf ended");

    yield* all(
        cppcode().selection(lines(1), animationTime),
        asmcode().selection(lines(5), animationTime),
        regs().hideCell(0, 3),
        regs().hideCell(0, 4),
        regs().changeValue(0, 3, ""),
        regs().changeValue(0, 4, ""),
    );

    yield* beginSlide("mv a1, s0");

    yield* all(
        cppcode().selection(lines(6), animationTime),
        asmcode().selection(lines(11), animationTime),
        regs().showCell(0, 2),
        regs().showCell(0, 3),
    );

    yield* all(
        regs().hideCell(0, 2),
        regs().changeValue(0, 3, "a0+a1"),
        regs().changeColor([[0, 3]], { cell: BlueFirst, accent: WhiteFirst }),
    );

    yield* all(
        regs().changeColor([[0, 3]], { cell: BlueFirst, accent: BlueSecond }),
    );

    yield* beginSlide("lw ra, 12(sp)");

    yield* all(
        asmcode().selection(lines(12), animationTime),
        sram().showOne(0),
        regs().hideCell(0, 3),
        regs().showCell(0, 0),
    );

    yield* all(
        sram().changeColor(0, OrangeSecond, OrangeFirst),
    );

    yield* beginSlide("lw s0, 8(sp)");

    yield* all(
        asmcode().selection(lines(13), animationTime),
        sram().hideOne(0),
        regs().hideCell(0, 0),
        sram().showOne(1),
        regs().showCell(0, 2),
        regs().changeValue(0, 2, ""),
    );

    yield* all(
        sram().changeColor(1, OrangeSecond, OrangeFirst),
    );

    yield* beginSlide("restore sp");

    yield* all(
        sram().hideOne(1),
        asmcode().selection(lines(14), animationTime),
        regs().hideCell(0, 2),
    );

    yield* beginSlide("ret");

    yield* all(
        asmcode().selection(lines(15), animationTime),
        regs().showCell(0, 3)
    );

    yield* beginSlide("jalr zero, 0(ra)");

    yield* all(
        asmcode().code.replace(word(15, 4, 3), "jalr    zero, 0(ra)", animationTime),
        regs().showCell(0, 0)
    );

    yield* beginSlide("End");
});
