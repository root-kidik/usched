import { Layout, Rect, RectProps } from "@motion-canvas/2d";
import { animationTime, colorSemiBlack, colorSemiSemiBlack, gapBig, lineWidthNormal, paddingBig, radiusNormal } from "../../theme/Theme";
import { all, DEFAULT } from "@motion-canvas/core";

export interface MyRectProps extends RectProps {
    is_hidden?: boolean;
}

export class MyRect extends Rect {
    public constructor(props: MyRectProps) {
        super({
            layout: true,
            direction: "column",
            gap: props.is_hidden ? 0 : gapBig,
            stroke: colorSemiSemiBlack,
            lineWidth: props.is_hidden ? 0 : lineWidthNormal,
            fill: colorSemiBlack,
            radius: radiusNormal,
            padding: props.is_hidden ? 0 : paddingBig,
            ...props,
        });
    }

    public* appear(duration: number = animationTime) {
        yield* all(
            this.padding(paddingBig, duration),
            this.lineWidth(lineWidthNormal, duration),
            this.gap(gapBig, duration),
            this.opacity(1, duration),
        );
    }

    public* disappear(duration: number = animationTime) {
        yield* all(
            this.opacity(0, duration / 2),
            this.padding(0, duration),
            this.lineWidth(0, duration),
            this.gap(0, duration),
            this.width(0, duration),
        );
    }
}
