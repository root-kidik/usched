import { Layout, LayoutProps } from "@motion-canvas/2d";
import { paddingBig } from "../../theme/Theme";
import { Histograma } from "../Histograma";
import { Reference } from "@motion-canvas/core";

export interface HistogramaLayoutProps extends LayoutProps {
    histograma: Reference<Histograma>;
    upperBoundValue: number;
}

export class HistogramaLayout extends Layout {
    public constructor(props: HistogramaLayoutProps) {
        super({
            padding: paddingBig,
            height: "100%",
            width: "100%",
            layout: true,
            ...props,
        })

        this.add(
            <Histograma ref={props.histograma} upperBoundValue={props.upperBoundValue} />
        );
    }
}