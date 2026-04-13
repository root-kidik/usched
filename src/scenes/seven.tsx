import { makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, createRef, Direction, slideTransition } from '@motion-canvas/core';
import { animationTime } from '../theme/Theme';
import { MyGrid } from '../components/My/MyGrid';
import { GreenFirst, GreenSecond, OrangeFirst, OrangeSecond, VioletFirst, VioletSecond } from '../theme/Colors';
import { StackV3 } from '../components/StackV3';
import { RegisterTableV2 } from '../components/RegisterTableV2';
import { StackV4 } from '../components/StackV4';

export default makeScene2D(function* (view) {
    const grid = createRef<MyGrid>();
    const sram = createRef<StackV3>();

    const t1 = createRef<StackV3>();
    const sp1 = createRef<RegisterTableV2>();
    const t1i1 = createRef<StackV4>();
    const t1i2 = createRef<StackV4>();

    const t2 = createRef<StackV3>();
    const sp2 = createRef<RegisterTableV2>();
    const t2i1 = createRef<StackV4>();
    const t2i2 = createRef<StackV4>();

    view.add(
        <MyGrid ref={grid}>
            <StackV3
                ref={sram}
                title="SRAM"
                capacity="16 KB"
                amount={8}
                blockWidth={160}
                blockHeight={40}
                stroke_color={OrangeFirst}
                color={OrangeSecond}
                top_address={"0x02004000"}
                bot_address={"0x02000000"}
                y={600}
                opacity={0}
            />

            <StackV3
                ref={t1}
                title="Thread 1"
                capacity="2 KB"
                amount={4}
                blockWidth={160}
                blockHeight={40}
                stroke_color={GreenFirst}
                color={GreenSecond}
                top_address={"0x02004000"}
                bot_address={"0x02003800"}
                y={600}
                x={-400}
                opacity={0}
            />

            <StackV3
                ref={t2}
                title="Thread 2"
                capacity="2 KB"
                amount={4}
                blockWidth={160}
                blockHeight={40}
                stroke_color={VioletSecond}
                color={VioletFirst}
                top_address={"0x02003800"}
                bot_address={"0x02003000"}
                y={600}
                x={400}
                opacity={0}
            />

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
                ref={t1i1}
                amount={4}
                blockWidth={160}
                blockHeight={40}
                stroke_color={GreenFirst}
                color={GreenSecond}
                top_address={"0x02004000"}
                bot_address={"0x02003F00"}
                y={600}
                x={-400}
                opacity={0}
            />

            <StackV4 
                ref={t1i2}
                amount={16}
                blockWidth={160}
                blockHeight={40}
                stroke_color={GreenFirst}
                color={GreenSecond}
                top_address={"0x02004000"}
                bot_address={"0x02003FC0"}
                y={600}
                x={-125}
                opacity={0}
            />

            <StackV4 
                ref={t2i1}
                amount={4}
                blockWidth={160}
                blockHeight={40}
                stroke_color={VioletSecond}
                color={VioletFirst}
                top_address={"0x02003800"}
                bot_address={"0x02003700"}
                y={600}
                x={400}
                opacity={0}
            />

            <StackV4 
                ref={t2i2}
                amount={16}
                blockWidth={160}
                blockHeight={40}
                stroke_color={VioletSecond}
                color={VioletFirst}
                top_address={"0x02003800"}
                bot_address={"0x020037C0"}
                y={600}
                x={125}
                opacity={0}
            />
        </MyGrid>
    );

    yield* all(
        slideTransition(Direction.Right),
        grid().show(0),
        sram().opacity(1, animationTime),
        sram().y(0, animationTime),
    );

    yield* beginSlide("t1");

    yield* all(
        sram().changeColor(0, GreenSecond, GreenFirst),
        sram().setText(0, "thread 1"),
        sram().hideOne(1),
        sram().hideOne(2),
        sram().hideOne(3),
        sram().hideOne(4),
        sram().hideOne(5),
        sram().hideOne(6),
        sram().hideOne(7),
        t1().opacity(1, animationTime),
        t1().y(120, animationTime),
    );

    yield* beginSlide("t2");

    yield* all(
        t1().opacity(0.5, animationTime),
        sram().hideOne(0),
        sram().showOne(1),
        sram().changeColor(1, VioletFirst, VioletSecond),
        sram().setText(1, "thread 2"),
        t2().opacity(1, animationTime),
        t2().y(120, animationTime),
    );

    yield* beginSlide("sp1, sp2");

    yield* all(
        sram().hideOne(1),
        sram().showOne(2),
        t2().opacity(0.5, animationTime),
        sp1().opacity(1, animationTime),
        sp1().showAll(),
        sp2().opacity(1, animationTime),
        sp2().showAll(),
        sp2().changeValue(0, 0, "0x020037C0")
    );

    yield* beginSlide("hide sram");

    yield* all(
        sram().y(1080, animationTime),

        t2().opacity(1, animationTime),
        t2().x(725, animationTime),
        t2().y(-100, animationTime),
        sp2().x(725, animationTime),
        sp2().y(-425, animationTime),

        t1().opacity(1, animationTime),
        t1().x(-725, animationTime),
        t1().y(-100, animationTime),
        sp1().x(-725, animationTime),
        sp1().y(-425, animationTime),
    );

    yield* beginSlide("extend");

    yield* all(
        sp1().hideCell(0, 0),
        t1().setAmount(8),
        t1().y(0, animationTime),
        
        sp2().hideCell(0, 0),
        t2().setAmount(8),
        t2().y(0, animationTime),
    );

    yield* beginSlide("inc1");

    yield* all(
        t1().hideOne(1),
        t1().hideOne(2),
        t1().hideOne(3),
        t1().hideOne(4),
        t1().hideOne(5),
        t1().hideOne(6),
        t1().hideOne(7),
        t1i1().opacity(1, animationTime),
        t1i1().y(0, animationTime),

        t2().hideOne(1),
        t2().hideOne(2),
        t2().hideOne(3),
        t2().hideOne(4),
        t2().hideOne(5),
        t2().hideOne(6),
        t2().hideOne(7),
        t2i1().opacity(1, animationTime),
        t2i1().y(0, animationTime),
    );

    yield* beginSlide("inc2");

    yield* all(
        t1().hideOne(0),
        t1i1().hideOne(1),
        t1i1().hideOne(2),
        t1i1().hideOne(3),
        t1i2().opacity(1, animationTime),
        t1i2().y(0, animationTime),

        t2().hideOne(0),
        t2i1().hideOne(1),
        t2i1().hideOne(2),
        t2i1().hideOne(3),
        t2i2().opacity(1, animationTime),
        t2i2().y(0, animationTime),
    );

    yield* beginSlide("hide others");

    yield* all(
        t1().x(-1500, animationTime),
        t1i1().x(-1500, animationTime),
        t1i2().x(-700, animationTime),
        t1i2().y(50, animationTime),
        sp1().showCell(0, 0),
        sp1().y(-475, animationTime),
        sp1().x(-700, animationTime),
        
        t2().x(1500, animationTime),
        t2i1().x(1500, animationTime),
        t2i2().x(700, animationTime),
        t2i2().y(50, animationTime),
        sp2().showCell(0, 0),
        sp2().y(-475, animationTime),
        sp2().x(700, animationTime),
    );

    yield* beginSlide("End");
});
