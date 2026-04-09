import { ShapeProps, signal, SVG } from "@motion-canvas/2d";
import { iconSize } from "../../theme/Theme";
import { SignalValue, SimpleSignal } from "@motion-canvas/core";

export interface MySVGProps extends ShapeProps {
    mdi: SignalValue<string>;
    color: SignalValue<string>;
}

export class MySVG extends SVG {
    @signal()
    public declare readonly mdi: SimpleSignal<string, this>;

    @signal()
    public declare readonly color: SimpleSignal<string, this>;

    public constructor(props: MySVGProps) {
        super({
            svg: () => `
                <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24">
                  <path d="${this.mdi()}" fill="${this.color()}"/>
                </svg>
              `,
            ...props,
        });
    }
}
