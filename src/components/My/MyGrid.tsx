import { Grid, GridProps } from "@motion-canvas/2d";
import { all } from "@motion-canvas/core";

export class MyGrid extends Grid {
    public constructor(props: GridProps) {
        super({
            width: "100%",
            height: "100%",
            stroke: "rgba(100, 100, 100, 0.25)",
            start: 0,
            end: 0,
            justifyContent: "space-evenly",
            alignItems: "end",
            spacing: 75,
            lineWidth: 1,
            padding: 10,
            ...props,
        });
    }

    public *show(duration: number = 0.5) {
        yield* all(
            this.end(0.5, duration).to(1, duration),
            this.start(0.5, duration).to(0, duration),
        );
    }
}
