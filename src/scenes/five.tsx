import { CODE, Layout, makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, createRef } from '@motion-canvas/core';
import { animationTime } from '../theme/Theme';
import { MyGrid } from '../components/My/MyGrid';
import { MyCode } from '../components/My/MyCode';
import { MyRect } from '../components/My/MyRect';
import { StackV2 } from '../components/StackV2';
import { BlueFirst, BlueSecond, OrangeFirst, OrangeSecond } from '../theme/Colors';

export default makeScene2D(function* (view) {
    const grid = createRef<MyGrid>();

    const cppcode = createRef<MyCode>();
    const cpplayout = createRef<Layout>();

    const asmcode = createRef<MyCode>();
    const asmlayout = createRef<Layout>();

    const sram = createRef<StackV2>();

    view.add(
        <MyGrid ref={grid}>
            <Layout direction={"column"} gap={40} layout>
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
                top_address={"0xFF"}
                bot_address={"0x00"}
                x={600}
                opacity={0}
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
        sram().opacity(1, animationTime)
    );

    yield* beginSlide("OTHER");

    yield* all(
        sram().setText(0, "..."),
        sram().changeColor(0, BlueFirst)
    );

    yield* beginSlide("End");
});
