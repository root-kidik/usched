import { makeScene2D, Rect, RectProps, Txt } from '@motion-canvas/2d';
import { all, beginSlide, createRef, Direction, slideTransition } from '@motion-canvas/core';
import { Img } from '@motion-canvas/2d/lib/components';
import logoImg from '../images/mk.png';
import { animationTime, fontFamilyDefault } from '../theme/Theme';
import { Stack } from '../components/Stack';
import { MyGrid } from '../components/My/MyGrid';
import { BlueFirst, BrownFirst, GreenFirst, OrangeFirst, OrangeSecond, VioletFirst, VioletSecond, WhiteFirst } from '../theme/Colors';

function ColoredISA({ parts, ...props }: { parts: { text: string, color: string }[] } & RectProps) {
    return (
        <Rect layout {...props}>
            {parts.map((p, index) => (
                <>
                    <Txt
                        text={p.text}
                        fill={p.color}
                        fontSize={28}
                        fontWeight={800}
                        fontFamily={fontFamilyDefault}
                    />
                    {index < parts.length - 1 && (
                        <Txt
                            text="_"
                            fill={WhiteFirst}
                            fontSize={28}
                            fontWeight={800}
                            fontFamily={fontFamilyDefault}
                        />
                    )}
                </>
            ))}
        </Rect>
    );
}

export default makeScene2D(function* (view) {
    const grid = createRef<MyGrid>();
    const mk = createRef<Img>();
    const eeprom = createRef<Rect>();
    const sram = createRef<Rect>();
    const rv32i = createRef<Rect>();

    view.add(
        <MyGrid ref={grid}>
            <ColoredISA
                ref={rv32i}
                opacity={0}
                y={-600}
                parts={[
                    { text: "rv32i", color: GreenFirst },
                    { text: "m", color: VioletSecond },
                    { text: "c", color: OrangeFirst },
                    { text: "zicsr", color: BlueFirst },
                    { text: "zifencei", color: BrownFirst }
                ]}
            />

            <Img
                ref={mk}
                src={logoImg}
                width={450}
                x={0}
                opacity={0}
                scale={0.8}
            />

            <Stack
                ref={eeprom}
                title="EEPROM"
                capacity="8 KB"
                amount={4}
                blockWidth={200}
                blockHeight={50}
                stroke_color={VioletSecond}
                color={VioletFirst}
                top_address={"0x01002000"}
                bot_address={"0x01000000"}
                x={-600}
                opacity={0}
            />

            <Stack
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
                x={600}
                opacity={0}
            />
        </MyGrid>
    );

    yield* beginSlide("MK");

    yield* all(
        grid().show(),
        mk().opacity(1, animationTime),
        mk().scale(1, animationTime)
    );

    yield* beginSlide("EEPROM");

    yield* all(
        mk().opacity(0.25, animationTime),
        eeprom().opacity(1, animationTime),
        eeprom().x(-500, animationTime),
    );

    yield* beginSlide("SRAM");

    yield* all(
        eeprom().opacity(0.25, animationTime),
        sram().opacity(1, animationTime),
        sram().x(500, animationTime),
    );

    yield* beginSlide("RV32I");

    yield* all(
        sram().opacity(0.25, animationTime),
        rv32i().opacity(1, animationTime),
        rv32i().y(-300, animationTime)
    );

    yield* beginSlide("ALL");

    yield* all(
        sram().opacity(1, animationTime),
        eeprom().opacity(1, animationTime),
        mk().opacity(1, animationTime),
    );

    yield* beginSlide("End");
});
