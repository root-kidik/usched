import { makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, createRef } from '@motion-canvas/core';
import { animationTime } from '../theme/Theme';
import { MyGrid } from '../components/My/MyGrid';
import { GreenFirst, GreenSecond, OrangeFirst, OrangeSecond, VioletFirst, VioletSecond } from '../theme/Colors';
import { StackV3 } from '../components/StackV3';
import { RegisterTableV2 } from '../components/RegisterTableV2';

export default makeScene2D(function* (view) {
    const grid = createRef<MyGrid>();
    const sram = createRef<StackV3>();
    const t1 = createRef<StackV3>();
    const t2 = createRef<StackV3>();

    const sp1 = createRef<RegisterTableV2>();
    const sp2 = createRef<RegisterTableV2>();

    view.add(
        <MyGrid ref={grid}>
            <StackV3
                ref={sram}
                title="SRAM"
                capacity="16 KB"
                amount={8}
                blockWidth={200}
                blockHeight={50}
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
                blockWidth={200}
                blockHeight={50}
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
                blockWidth={200}
                blockHeight={50}
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
                blockWidth={200}
            />

            <RegisterTableV2
                ref={sp2}
                rowsData={[[{name: "sp"}]]}
                accentColor={VioletSecond}
                cellColor={VioletFirst}
                x={400}
                y={-200}
                blockWidth={200}
            />
        </MyGrid>
    );

    yield* all(
        grid().show(0),
    );

    yield* beginSlide("SRAM");

    yield* all(
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

    yield* beginSlide("End");
});
