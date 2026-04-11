import { CODE, Layout, makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, createRef } from '@motion-canvas/core';
import { animationTime } from '../theme/Theme';
import { MyGrid } from '../components/My/MyGrid';
import { MyCode } from '../components/My/MyCode';
import { MyRect } from '../components/My/MyRect';
import { StackV2 } from '../components/StackV2';
import { BlueFirst, BlueSecond, BrownFirst, BrownSecond, OrangeFirst, OrangeSecond, RedFirst, RedSecond, VioletFirst, VioletSecond } from '../theme/Colors';
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
                cellColor={BrownFirst}
                accentColor={BrownSecond}
            />
        </MyGrid>
    );

    yield* grid().show(0);

    yield* beginSlide("C");

    yield* all(
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

    yield* beginSlide("SRAM");

    yield* all(
        sram().opacity(0.5, animationTime),
        eeprom().opacity(1, animationTime),
        eeprom().x(700, animationTime),
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
        regs().changeColor([[0, 1], [0, 2]], { cell: RedFirst, accent: RedSecond }),
    );

    yield* beginSlide("End");
});
