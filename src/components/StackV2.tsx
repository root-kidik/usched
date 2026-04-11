import { Txt, Rect, RectProps, Layout } from '@motion-canvas/2d/lib/components';
import { range, all } from '@motion-canvas/core';
import { createRef } from '@motion-canvas/core/lib/utils';
import { animationTime, fontFamilyDefault } from '../theme/Theme';

export interface StackV2Props extends RectProps {
    title: string;
    amount: number;
    blockWidth: number;
    blockHeight: number;
    color: string;
    stroke_color: string;
    top_address: string;
    bot_address: string;
}

export class StackV2 extends Rect {
    private readonly blocks: Rect[] = [];
    private readonly texts: Txt[] = [];

    public constructor(props: StackV2Props) {
        super({
            ...props,
            layout: true,
            direction: 'column',
            alignItems: 'center',
            gap: 20,
        });

        this.add(
            <>
                <Txt
                    text={props.title}
                    fill={props.stroke_color}
                    fontSize={28}
                    fontWeight={800}
                    fontFamily={fontFamilyDefault}
                    textAlign={"center"}
                />

                <Rect direction={'column'} gap={20} alignItems={'center'}>
                    <Txt
                        text={props.top_address}
                        fill={'rgb(255, 255, 255)'}
                        fontSize={28}
                        fontWeight={800}
                        fontFamily={fontFamilyDefault}
                        textAlign={"center"}
                    />

                    <Layout gap={10} direction={'column'} alignItems={'center'}>
                        {range(props.amount).map(i => {
                            const blockRef = createRef<Rect>();
                            const textRef = createRef<Txt>();

                            const element = (
                                <Rect
                                    ref={blockRef}
                                    width={props.blockWidth}
                                    height={props.blockHeight}
                                    fill={props.color}
                                    radius={8}
                                    stroke={props.stroke_color}
                                    lineWidth={6}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                >
                                    <Txt
                                        ref={textRef}
                                        text={""}
                                        fill={'white'}
                                        fontSize={24}
                                        fontFamily={fontFamilyDefault}
                                    />
                                </Rect>
                            );

                            this.blocks[i] = blockRef();
                            this.texts[i] = textRef();

                            return element;
                        })}
                    </Layout>

                    <Txt
                        text={props.bot_address}
                        fill={'rgb(255, 255, 255)'}
                        fontSize={28}
                        fontWeight={800}
                        fontFamily={fontFamilyDefault}
                        textAlign={"center"}
                    />
                </Rect>
            </>
        );
    }

    public *hideAll(duration: number = animationTime) {
        yield* all(
            ...this.blocks.map(block => block.opacity(0.5, duration))
        );
    }

    public *hideOne(index: number, duration: number = animationTime) {
        if (this.blocks[index]) {
            yield* this.blocks[index].opacity(0.5, duration);
        }
    }

    public *showAll(duration: number = animationTime) {
        yield* all(
            ...this.blocks.map(block => block.opacity(1, duration))
        );
    }

    public *showOne(index: number, duration: number = animationTime) {
        yield* this.blocks[index].opacity(1, duration);
    }

    public *setText(index: number, text: string, duration: number = animationTime) {
        yield* this.texts[index].text(text, duration);
    }

    public *changeColor(index: number, color: string, duration: number = animationTime) {
        yield* this.blocks[index].fill(color, duration);
    }
}
