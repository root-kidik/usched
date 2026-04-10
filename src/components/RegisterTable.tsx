import { Layout, Rect, RectProps, Txt } from "@motion-canvas/2d";
import { all, createRef, delay, Reference } from "@motion-canvas/core";
import { animationTime, fontFamilyDefault } from '../theme/Theme';

export interface RegisterTableProps extends RectProps {
    rowsData: string[][];
    blockWidth?: number;
    blockHeight?: number;
    cellColor?: string;
    accentColor?: string;
    fontSize?: number;
}

export class RegisterTable extends Rect {
    private cells: Reference<Rect>[][] = [];

    public constructor(props: RegisterTableProps) {
        super({
            layout: true,
            direction: 'column',
            alignItems: 'center',
            gap: 20,
            ...props,
        });

        const blockWidth = props.blockWidth ?? 160;
        const blockHeight = props.blockHeight ?? 50;
        const accentColor = props.accentColor ?? '#4e9e4e';
        const cellColor = props.cellColor ?? '#0b1a0b';
        const fontSize = props.fontSize ?? 24;

        this.add(
            <>
                <Layout layout direction={'column'} gap={15}>
                    {props.rowsData.map((row, rowIndex) => {
                        this.cells[rowIndex] = [];

                        return (
                            <Layout direction={'row'} gap={15}>
                                {row.map((cellText, colIndex) => {
                                    const cellRef = createRef<Rect>();
                                    this.cells[rowIndex][colIndex] = cellRef;

                                    return (
                                        <Rect
                                            ref={cellRef}
                                            width={blockWidth}
                                            height={blockHeight}
                                            fill={cellColor}
                                            stroke={accentColor}
                                            lineWidth={6}
                                            radius={6}
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                            opacity={0}
                                        >
                                            <Txt
                                                text={cellText}
                                                fill={"#ffffff"}
                                                fontSize={fontSize}
                                                fontFamily={fontFamilyDefault}
                                                fontWeight={800}
                                            />
                                        </Rect>
                                    );
                                })}
                            </Layout>
                        );
                    })}
                </Layout>
            </>
        );
    }

    public *showCell(row: number, col: number, duration: number = animationTime) {
        const cell = this.cells[row][col]();
        if (cell) {
            yield* cell.opacity(1, duration);
        }
    }

    public *hideCell(row: number, col: number, duration: number = animationTime) {
        const cell = this.cells[row][col]();
        if (cell) {
            yield* cell.opacity(0.5, duration);
        }
    }

    public *showAll(duration: number = animationTime) {
        const allCells = this.cells.flat().map(ref => ref());

        yield* all(
            ...allCells.map(cell => cell.opacity(1, duration))
        );
    }
}