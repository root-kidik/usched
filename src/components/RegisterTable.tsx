import { Layout, Rect, RectProps, Txt } from "@motion-canvas/2d";
import { all, createRef, Reference } from "@motion-canvas/core";
import { animationTime, fontFamilyDefault } from '../theme/Theme';

export interface RegisterData {
    name: string;
    description?: string;
}

export interface RegisterTableProps extends RectProps {
    rowsData: RegisterData[][];
    blockWidth?: number;
    blockHeight?: number;
    cellColor?: string;
    accentColor?: string;
    fontSize?: number;
    descriptionGap?: number;
    columnWidth?: number;
}

export class RegisterTable extends Rect {
    private cells: Reference<Layout>[][] = [];
    private nameRefs: Reference<Txt>[][] = [];

    public constructor(props: RegisterTableProps) {
        super({
            layout: true,
            direction: 'column',
            alignItems: 'start',
            gap: 20,
            ...props,
        });

        const blockWidth = props.blockWidth ?? 80;
        const blockHeight = props.blockHeight ?? 50;
        const columnWidth = props.columnWidth ?? 450;
        const accentColor = props.accentColor ?? '#4e9e4e';
        const cellColor = props.cellColor ?? '#0b1a0b';
        const fontSize = props.fontSize ?? 24;
        const descriptionGap = props.descriptionGap ?? 20;

        this.add(
            <Layout layout direction={'column'} gap={15} alignItems={'start'}>
                {props.rowsData.map((row, rowIndex) => {
                    this.cells[rowIndex] = [];
                    this.nameRefs[rowIndex] = [];

                    return (
                        <Layout direction={'row'} gap={20}> 
                            {row.map((reg, colIndex) => {
                                const containerRef = createRef<Layout>();
                                const nameRef = createRef<Txt>();
                                
                                this.cells[rowIndex][colIndex] = containerRef;
                                this.nameRefs[rowIndex][colIndex] = nameRef;

                                return (
                                    <Layout
                                        ref={containerRef}
                                        layout
                                        direction={'row'}
                                        alignItems={'center'}
                                        opacity={0}
                                        gap={descriptionGap}
                                        width={columnWidth}
                                    >
                                        <Rect
                                            width={blockWidth}
                                            height={blockHeight}
                                            fill={cellColor}
                                            stroke={accentColor}
                                            lineWidth={6}
                                            radius={8}
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                        >
                                            <Txt
                                                ref={nameRef} // Привязываем ссылку
                                                text={reg.name}
                                                fill={"#ffffff"}
                                                fontSize={fontSize}
                                                fontFamily={fontFamilyDefault}
                                                fontWeight={800}
                                            />
                                        </Rect>

                                        {reg.description && (
                                            <Txt
                                                text={reg.description}
                                                fill={"rgb(255, 255, 255)"}
                                                fontSize={fontSize - 4}
                                                fontFamily={fontFamilyDefault}
                                                fontWeight={800}
                                            />
                                        )}
                                    </Layout>
                                );
                            })}
                        </Layout>
                    );
                })}
            </Layout>
        );
    }

    public *changeName(row: number, col: number, newName: string, duration: number = animationTime) {
        const nameTxt = this.nameRefs[row][col]();
        if (nameTxt) {
            yield* nameTxt.text(newName, duration);
        }
    }

    public *showCell(row: number, col: number, duration: number = animationTime) {
        const cell = this.cells[row][col]();
        if (cell) yield* cell.opacity(1, duration);
    }

    public *hideCell(row: number, col: number, duration: number = animationTime) {
        const cell = this.cells[row][col]();
        if (cell) yield* cell.opacity(0.3, duration);
    }

    public *showAll(duration: number = animationTime) {
        const allCells = this.cells.flat().map(ref => ref());
        yield* all(...allCells.map(cell => cell.opacity(1, duration)));
    }

    public *changeAllNames(newNames: string[][], duration: number = animationTime) {
        const animations = [];

        for (let r = 0; r < newNames.length; r++) {
            for (let c = 0; c < newNames[r].length; c++) {
                const nameTxt = this.nameRefs[r]?.[c]?.();
                if (nameTxt && newNames[r][c] !== undefined) {
                    animations.push(nameTxt.text(newNames[r][c], duration));
                }
            }
        }

        yield* all(...animations);
    }
}
