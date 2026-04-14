import { Txt, Rect, RectProps, Layout } from '@motion-canvas/2d/lib/components';
import { range, all } from '@motion-canvas/core';
import { createRef } from '@motion-canvas/core/lib/utils';
import { animationTime, fontFamilyDefault } from '../theme/Theme';

export interface StackV5Props extends RectProps {
    amount: number;
    blockWidth: number;
    blockHeight: number;
    color: string;
    stroke_color: string;
    top_address: string;
    bot_address: string;
}

export class StackV5 extends Rect {
    private readonly blocks: Rect[] = [];
    private readonly texts: Txt[] = [];
    private readonly listRef = createRef<Layout>();
    
    // Ссылки для управления адресами
    private readonly topAddressRef = createRef<Txt>();
    private readonly botAddressRef = createRef<Txt>();

    private readonly blockConfig: {
        width: number,
        height: number,
        color: string,
        stroke: string
    };

    public constructor(props: StackV5Props) {
        super({
            ...props,
            layout: true,
            direction: 'row',
            alignItems: 'center',
            gap: 20,
        });

        this.blockConfig = {
            width: props.blockWidth,
            height: props.blockHeight,
            color: props.color,
            stroke: props.stroke_color,
        };

        this.add(
            <Rect direction={'row'} gap={20} alignItems={'center'}>
                <Txt
                    ref={this.topAddressRef} // Добавили реф
                    text={props.top_address}
                    fill={'rgb(255, 255, 255)'}
                    fontSize={28}
                    fontWeight={800}
                    fontFamily={fontFamilyDefault}
                    textAlign={"center"}
                />

                <Layout
                    ref={this.listRef}
                    gap={10}
                    direction={'row'}
                    alignItems={'center'}
                >
                    {range(props.amount).map(i => {
                        const blockRef = createRef<Rect>();
                        const textRef = createRef<Txt>();

                        const element = (
                            <Rect
                                ref={blockRef}
                                width={this.blockConfig.width}
                                height={this.blockConfig.height}
                                fill={this.blockConfig.color}
                                radius={8}
                                stroke={this.blockConfig.stroke}
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
                                    fontWeight={800}
                                />
                            </Rect>
                        );

                        this.blocks[i] = blockRef();
                        this.texts[i] = textRef();

                        return element;
                    })}
                </Layout>

                <Txt
                    ref={this.botAddressRef} // Добавили реф
                    text={props.bot_address}
                    fill={'rgb(255, 255, 255)'}
                    fontSize={28}
                    fontWeight={800}
                    fontFamily={fontFamilyDefault}
                    textAlign={"center"}
                />
            </Rect>
        );
    }

    // --- Новые методы для изменения адресов ---

    /** Анимация изменения верхнего адреса */
    public *setTopAddress(text: string, duration: number = animationTime) {
        yield* this.topAddressRef().text(text, duration);
    }

    /** Анимация изменения нижнего адреса */
    public *setBotAddress(text: string, duration: number = animationTime) {
        yield* this.botAddressRef().text(text, duration);
    }

    /** Одновременное изменение обоих адресов */
    public *setAddresses(top: string, bot: string, duration: number = animationTime) {
        yield* all(
            this.topAddressRef().text(top, duration),
            this.botAddressRef().text(bot, duration)
        );
    }

    // --- Существующие методы без изменений ---

    public *setAmount(newAmount: number, duration: number = animationTime) {
        const currentAmount = this.blocks.length;

        if (newAmount > currentAmount) {
            const animations = [];
            for (let i = currentAmount; i < newAmount; i++) {
                const blockRef = createRef<Rect>();
                const textRef = createRef<Txt>();

                this.listRef().add(
                    <Rect
                        ref={blockRef}
                        width={this.blockConfig.width}
                        height={this.blockConfig.height}
                        fill={this.blockConfig.color}
                        radius={8}
                        stroke={this.blockConfig.stroke}
                        lineWidth={6}
                        alignItems={'center'}
                        justifyContent={'center'}
                        opacity={0}
                    >
                        <Txt
                            ref={textRef}
                            text={""}
                            fill={'white'}
                            fontSize={24}
                            fontFamily={fontFamilyDefault}
                            fontWeight={800}
                        />
                    </Rect>
                );

                this.blocks[i] = blockRef();
                this.texts[i] = textRef();
                animations.push(this.blocks[i].opacity(1, duration));
            }
            yield* all(...animations);

        } else if (newAmount < currentAmount) {
            const animations = [];
            for (let i = currentAmount - 1; i >= newAmount; i--) {
                animations.push(this.blocks[i].opacity(0, duration));
            }

            yield* all(...animations);

            for (let i = currentAmount - 1; i >= newAmount; i--) {
                this.blocks[i].remove();
                this.blocks.pop();
                this.texts.pop();
            }
        }
    }

    public *hideAll(duration: number = animationTime) {
        yield* all(...this.blocks.map(block => block.opacity(0.5, duration)));
    }

    public *hideOne(index: number, duration: number = animationTime) {
        if (this.blocks[index]) {
            yield* this.blocks[index].opacity(0.5, duration);
        }
    }

    public *showAll(duration: number = animationTime) {
        yield* all(...this.blocks.map(block => block.opacity(1, duration)));
    }

    public *showOne(index: number, duration: number = animationTime) {
        if (this.blocks[index]) {
            yield* this.blocks[index].opacity(1, duration);
        }
    }

    public *setText(index: number, text: string, duration: number = animationTime) {
        if (this.texts[index]) {
            yield* this.texts[index].text(text, duration);
        }
    }

    public *changeColor(index: number, first_color: string, second_color: string, duration: number = animationTime) {
        if (this.blocks[index]) {
            yield* all(
                this.blocks[index].fill(first_color, duration),
                this.blocks[index].stroke(second_color, duration),
            );
        }
    }

    public *changeAllColors(fillColor: string, strokeColor: string, duration: number = animationTime) {
        this.blockConfig.color = fillColor;
        this.blockConfig.stroke = strokeColor;

        yield* all(
            ...this.blocks.map(block => 
                all(
                    block.fill(fillColor, duration),
                    block.stroke(strokeColor, duration)
                )
            )
        );
    }

    public *setBlockSize(newWidth: number, newHeight: number, duration: number = animationTime) {
        this.blockConfig.width = newWidth;
        this.blockConfig.height = newHeight;
        yield* all(
            ...this.blocks.map(block => block.width(newWidth, duration)),
            ...this.blocks.map(block => block.height(newHeight, duration))
        );
    }
}