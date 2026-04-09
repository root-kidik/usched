import { Layout, Rect, RectProps } from "@motion-canvas/2d";
import { all, createRef, Reference } from "@motion-canvas/core";
import { MyGrid } from "./My/MyGrid";
import { animationTime, colorRed, colorSemiGrey, gapBig, historamWidth, lineWidthBorderGrid, paddingBig } from "../theme/Theme";
import { MyTxt } from "./My/MyTxt";
import { MyRect } from "./My/MyRect";

export interface HistogramaProps extends RectProps {
    upperBoundValue: number;
}

export class Histograma extends Rect {
    private upperBoundValue: number;

    private grid: Reference<MyGrid>;
    private leftBarLayout: Reference<Layout>;

    public constructor(props: HistogramaProps) {
        super({
            width: "100%",
            height: "100%",
            gap: gapBig,
            ...props,
        });

        this.upperBoundValue = props.upperBoundValue;
        this.grid = createRef<MyGrid>();
        this.leftBarLayout = createRef<Layout>();

        this.add(
            <>
                <Layout ref={this.leftBarLayout} width={0} direction={"column"} justifyContent={"space-between"} alignItems={"center"} height={"100%"}>
                    <MyTxt rotation={-90} />
                    <MyTxt rotation={-90} />
                    <MyTxt rotation={-90} />
                </Layout>

                <Rect padding={5} width={"100%"} height={"100%"} lineWidth={lineWidthBorderGrid} stroke={colorSemiGrey} >
                    <MyGrid ref={this.grid} />
                </Rect>
            </>
        );
    }

    public *show(duration: number = animationTime) {
        yield* all(
            this.grid().show(duration),
            ...this.leftBarLayout().childrenAs<MyTxt>().map((child, idx) =>
                child.text(this.calculateText(idx), duration)
            )
        )
    }

    public *showHistograms(histograms: {name: string, value: number}[], duration: number = animationTime) {
        this.grid().children(histograms.map(child =>
            <MyRect width={historamWidth} padding={0} height={0} stroke={colorRed} alignItems={"center"} justifyContent={"center"}>
                <MyTxt text={child.name} />
            </MyRect>
        ));

        yield* all(
            ...this.grid().childrenAs<MyRect>().map((child, idx) => all(
                child.height(this.calculateHeight(histograms[idx].value), duration),
                child.padding(paddingBig, duration),
            ))
        );
    }

    private calculateHeight(value: number): number {
        const percent = value / (this.upperBoundValue / 100);
        const height = (this.height() / 100) * percent;
        return height;
    }

    private calculateText(idx: number): string {
        const childLength = this.leftBarLayout().children().length;

        if (idx + 1 == childLength) return "0";
        if (idx == 0) return this.upperBoundValue.toString() + "ㅤ".repeat(this.upperBoundValue.toString().length / 2);

        return Math.round(this.upperBoundValue * (1 - idx / (childLength - 1))).toString();
    }
}
