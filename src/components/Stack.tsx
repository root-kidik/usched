import { Txt, Rect, RectProps, Layout } from '@motion-canvas/2d/lib/components';
import { range } from '@motion-canvas/core';
import { fontFamilyDefault } from '../theme/Theme';

export interface StackProps extends RectProps {
    title: string;
    capacity: string;
    amount: number;
    blockWidth: number;
    blockHeight: number;
    color: string;
    stroke_color: string;
    top_address: string;
    bot_address: string;
}

export function Stack({ title, amount, blockWidth, blockHeight, color, stroke_color, top_address, bot_address, capacity, ...props }: StackProps) {
    return (
        <Rect {...props} layout direction={'column'} alignItems={'center'} gap={20}>
            <Txt text={title} fill={stroke_color} fontSize={28} fontWeight={800} fontFamily={fontFamilyDefault} textAlign={"center"} />
            <Txt text={capacity} fill={'rgb(255, 255, 255)'} fontSize={28} fontWeight={800} fontFamily={fontFamilyDefault} textAlign={"center"} />

            <Rect direction={'column'} gap={20} alignItems={'center'}>
                <Txt
                    text={top_address}
                    fill={'rgb(255, 255, 255)'}
                    fontSize={28}
                    fontWeight={800}
                    fontFamily={fontFamilyDefault}
                    textAlign={"center"}
                />

                <Layout gap={10} direction={'column'} alignItems={'center'}>
                    {range(amount).map(i => (
                        <Rect
                            width={blockWidth}
                            height={blockHeight}
                            fill={color}
                            radius={8}
                            stroke={stroke_color}
                            lineWidth={6}
                        />
                    ))}
                </Layout>

                <Txt
                    text={bot_address}
                    fill={'rgb(255, 255, 255)'}
                    fontSize={28}
                    fontWeight={800}
                    fontFamily={fontFamilyDefault}
                    textAlign={"center"}
                />
            </Rect>
        </Rect>
    );
}
