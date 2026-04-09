import { Code, Layout, Rect, RectProps } from "@motion-canvas/2d";
import { animationTime, colorBlack, gapBig } from "../theme/Theme";
import { File } from "./File";
import { all, createRef, DEFAULT, Reference, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { MyRect } from "./My/MyRect";
import { MyCode } from "./My/MyCode";
import { Console } from "./Console";

export interface VscodeProps extends RectProps {
    code_layout?: Reference<MyRect>;
    code: Reference<Code>;
}

export class Vscode extends MyRect {
    private middle_layout: Reference<Layout>;

    public constructor(props?: VscodeProps) {
        super({
            layout: true,
            height: "100%",
            width: "100%",
            fill: colorBlack,
            lineWidth: 0,
            direction: "row",
            ...props,
        });

        this.middle_layout = createRef<Layout>();

        this.add(
            <Layout width={"100%"} ref={this.middle_layout} direction={"column"}>
                <MyRect ref={props.code_layout} height={"100%"} width={"100%"} >
                    <MyCode ref={props.code} />
                </MyRect>
            </Layout>
        );
    }

    public *showFilebar(filebar: Reference<MyRect>, root: SimpleSignal<File>, duration: number = animationTime) {
        yield* all(
            ...root().childrenAs<Layout>().map(child => all(
                child.width(0, 0)
            ))
        );

        this.insert(<MyRect is_hidden ref={filebar} children={root} />);

        yield* all(
            filebar().appear(duration),
            ...root().childrenAs<Layout>().map(child => all(
                child.width(DEFAULT, duration)
            ))
        );
    }

    public addAnimationLayout(): Reference<MyRect> {
        const animation_layout = createRef<MyRect>();

        this.add(<MyRect alignItems={"center"} is_hidden ref={animation_layout} />);

        return animation_layout;
    }

    public *showConsole(console: Reference<Console>, duration: number = animationTime) {
        this.middle_layout().add(<Console ref={console} />);

        yield* all(
            console().appear(duration),
            this.middle_layout().gap(gapBig, duration)
        );
    }
}
