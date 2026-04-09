import { MyRect, MyRectProps } from "./My/MyRect";
import { animationTime } from "../theme/Theme";
import { all, createRef, Reference } from "@motion-canvas/core";
import { Terminal } from "./Terminal";

export class Console extends MyRect {
    public terminal: Reference<Terminal>;

    public constructor(props: MyRectProps) {
        super({
            is_hidden: true,
                ...props,
        });

        this.terminal = createRef<Terminal>();
        this.add(<Terminal clip={true} maxChilds={8} ref={this.terminal} />);
    }

    public *appear(duration: number = animationTime) {
        yield* super.appear(duration);
    }

}