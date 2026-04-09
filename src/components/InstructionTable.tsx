import { Txt, Rect, RectProps, Layout } from '@motion-canvas/2d/lib/components';
import { fontFamilyDefault } from '../theme/Theme';

export interface InstructionTableProps extends RectProps {
    title?: string;
    rows: string[][];
    blockWidth?: number;
    blockHeight?: number;
    color?: string;
    strokeColor?: string;
    fontSize?: number;
}

export function InstructionTable({
    title,
    rows,
    blockWidth = 160,
    blockHeight = 50,
    color = '#0b1a0b',
    strokeColor = '#4e9e4e',
    fontSize = 24,
    ...props
}: InstructionTableProps) {
    return (
        <Rect {...props} layout direction={'column'} alignItems={'center'} gap={20}>
            {title && (
                <Txt
                    text={title}
                    fill={strokeColor}
                    fontSize={fontSize + 8}
                    fontFamily={fontFamilyDefault}
                    marginBottom={15}
                    fontWeight={800}
                />
            )}

            <Rect
                padding={20}
                radius={20}
                stroke={strokeColor}
                lineWidth={6}
                layout
                direction={'column'}
                gap={15}
            >
                {rows.map((row) => (
                    <Layout direction={'row'} gap={15}>
                        {row.map((cell) => (
                            <Rect
                                width={blockWidth}
                                height={blockHeight}
                                fill={color}
                                stroke={strokeColor}
                                lineWidth={6}
                                radius={6}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <Txt
                                    text={cell}
                                    fill={"rgb(255,255,255)"}
                                    fontSize={fontSize}
                                    fontFamily={fontFamilyDefault}
                                    fontWeight={800}
                                />
                            </Rect>
                        ))}
                    </Layout>
                ))}
            </Rect>
        </Rect>
    );
}