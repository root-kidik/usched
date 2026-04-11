import { Layout, Rect, RectProps, Txt } from "@motion-canvas/2d";
import { all, createRef, Reference } from "@motion-canvas/core";
import { animationTime, fontFamilyDefault } from '../theme/Theme';

export interface RegisterData {
    name: string; // Это будет заголовок СВЕРХУ
    value?: string; // Это будет значение ВНУТРИ
}

export interface RegisterTableV2Props extends RectProps {
    rowsData: RegisterData[][];
    blockWidth?: number;
    blockHeight?: number;
    cellColor?: string;
    accentColor?: string;
    fontSize?: number;
    titleFontSize?: number;
    columnWidth?: number;
}

export class RegisterTableV2 extends Rect {
    private cells: Reference<Layout>[][] = [];
    private titleRefs: Reference<Txt>[][] = []; // Рефы для заголовков сверху
    private valueRefs: Reference<Txt>[][] = []; // Рефы для значений внутри
    private rectRefs: Reference<Rect>[][] = [];

    public constructor(props: RegisterTableV2Props) {
        super({
            layout: true,
            direction: 'column',
            alignItems: 'start',
            gap: 20,
            ...props,
        });

        const blockWidth = props.blockWidth ?? 80;
        const blockHeight = props.blockHeight ?? 50;
        const columnWidth = props.columnWidth ?? 100;
        const accentColor = props.accentColor ?? '#4e9e4e';
        const cellColor = props.cellColor ?? '#0b1a0b';
        const fontSize = props.fontSize ?? 24;
        const titleFontSize = props.titleFontSize ?? 24;

        this.add(
            <Layout layout direction={'column'} gap={30} alignItems={'start'}>
                {props.rowsData.map((row, rowIndex) => {
                    this.cells[rowIndex] = [];
                    this.titleRefs[rowIndex] = [];
                    this.valueRefs[rowIndex] = [];
                    this.rectRefs[rowIndex] = [];

                    return (
                        <Layout direction={'row'} gap={20}>
                            {row.map((reg, colIndex) => {
                                const containerRef = createRef<Layout>();
                                const titleRef = createRef<Txt>();
                                const valueRef = createRef<Txt>();
                                const rectRef = createRef<Rect>();

                                this.cells[rowIndex][colIndex] = containerRef;
                                this.titleRefs[rowIndex][colIndex] = titleRef;
                                this.valueRefs[rowIndex][colIndex] = valueRef;
                                this.rectRefs[rowIndex][colIndex] = rectRef;

                                return (
                                    <Layout
                                        ref={containerRef}
                                        direction={'column'}
                                        alignItems={'center'}
                                        opacity={0}
                                        gap={8} // Отступ между заголовком и блоком
                                        width={columnWidth}
                                    >
                                        {/* Название регистра СВЕРХУ */}
                                        <Txt
                                            ref={titleRef}
                                            text={reg.name}
                                            fill={accentColor} // Цвет заголовка в тон акценту
                                            fontSize={titleFontSize}
                                            fontFamily={fontFamilyDefault}
                                            fontWeight={800}
                                        />

                                        {/* Прямоугольник со значением ВНУТРИ */}
                                        <Rect
                                            ref={rectRef}
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
                                                ref={valueRef}
                                                text={reg.value ?? ""}
                                                fill={"#ffffff"}
                                                fontSize={fontSize}
                                                fontFamily={fontFamilyDefault}
                                                fontWeight={800}
                                            />
                                        </Rect>
                                    </Layout>
                                );
                            })}
                        </Layout>
                    );
                })}
            </Layout>
        );
    }

    // Изменяет значение ВНУТРИ блока
    public *changeValue(row: number, col: number, newValue: string, duration: number = animationTime) {
        const valueTxt = this.valueRefs[row][col]();
        if (valueTxt) {
            yield* valueTxt.text(newValue, duration);
        }
    }

    // Изменяет заголовок НАД блоком
    public *changeTitle(row: number, col: number, newTitle: string, duration: number = animationTime) {
        const titleTxt = this.titleRefs[row][col]();
        if (titleTxt) {
            yield* titleTxt.text(newTitle, duration);
        }
    }

    // Переименовал старый метод для совместимости, теперь он меняет значение внутри
    public *changeName(row: number, col: number, newName: string, duration: number = animationTime) {
        yield* this.changeValue(row, col, newName, duration);
    }

    public *changeColor(
        coords: [number, number][],
        colors: { cell?: string; accent?: string },
        duration: number = animationTime
    ) {
        const animations = [];

        for (const [row, col] of coords) {
            const rect = this.rectRefs[row]?.[col]?.();
            const title = this.titleRefs[row]?.[col]?.();

            if (rect) {
                // Меняем цвет заливки прямоугольника
                if (colors.cell) {
                    animations.push(rect.fill(colors.cell, duration));
                }

                // Меняем цвет обводки (accent)
                if (colors.accent) {
                    animations.push(rect.stroke(colors.accent, duration));

                    // Если есть accent, автоматически красим имя регистра сверху в этот же цвет
                    if (title) {
                        animations.push(title.fill(colors.accent, duration));
                    }
                }
            }
        }

        yield* all(...animations);
    }

    public *showCell(row: number, col: number, duration: number = animationTime) {
        const cell = this.cells[row][col]();
        if (cell) yield* cell.opacity(1, duration);
    }

    public *showCells(coords: [number, number][], duration: number = animationTime) {
        const animations = coords.map(([r, c]) => this.cells[r]?.[c]?.()?.opacity(1, duration)).filter(Boolean);
        yield* all(...animations as any);
    }

    public *hideCell(row: number, col: number, duration: number = animationTime) {
        const cell = this.cells[row][col]();
        if (cell) yield* cell.opacity(0.3, duration);
    }

    public *showAll(duration: number = animationTime) {
        const animations = this.cells.flat().map(ref => ref()?.opacity(1, duration)).filter(Boolean);
        yield* all(...animations as any);
    }

    public *changeAllValues(newValues: string[][], duration: number = animationTime) {
        const animations = [];
        for (let r = 0; r < newValues.length; r++) {
            for (let c = 0; c < newValues[r].length; c++) {
                const valTxt = this.valueRefs[r]?.[c]?.();
                if (valTxt && newValues[r][c] !== undefined) {
                    animations.push(valTxt.text(newValues[r][c], duration));
                }
            }
        }
        yield* all(...animations);
    }
}