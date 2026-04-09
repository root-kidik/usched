import { Layout, RectProps, signal } from "@motion-canvas/2d";
import { all, createRef, Reference, SignalValue, SimpleSignal } from "@motion-canvas/core";
import { MyTxt } from "./My/MyTxt";
import { MyRect } from "./My/MyRect";
import { animationTime, colorWhiteBlue, fontSizeNormal } from "../theme/Theme";

export interface LibraryProps extends RectProps {
    name: SignalValue<string>;
}

export class Library extends MyRect {
    @signal()
    public declare readonly name: SimpleSignal<string, this>;

    private lib_name: Reference<MyTxt>;
    private includes: Reference<Layout>;
    private libraries: Reference<Layout>;

    public constructor(props: LibraryProps) {
        super({
            is_hidden: true,
            stroke: colorWhiteBlue,
            ...props,
        });

        this.lib_name = createRef<MyTxt>();
        this.includes = createRef<Layout>();
        this.libraries = createRef<Layout>();

        this.add(
            <>
                <Layout alignItems={"center"} justifyContent={"center"} layout>
                    <MyTxt fontSize={fontSizeNormal + 4} ref={this.lib_name} />
                </Layout>

                <Layout direction={"column"}>
                    <Layout direction={() => this.includes().children().length == 1 ? "column" : "row"}>
                        <MyTxt text={"includes: ["} />
                        <Layout ref={this.includes} />
                        <MyTxt text={"]"} />
                    </Layout>
                    <Layout direction={() => this.libraries().children().length == 1 ? "column" : "row"}>
                        <MyTxt text={"libraries: ["} />
                        <Layout ref={this.libraries} />
                        <MyTxt text={"]"} />
                    </Layout>
                </Layout>
            </>
        );
    }

    public *appear(duration: number = animationTime) {
        yield* all(
            super.appear(duration),
            this.lib_name().text(this.name, duration)
        );
    }

    public* addLibrary(name: string, duration: number = animationTime) {
        const newTxt = createRef<MyTxt>();
        this.libraries().add(<MyTxt ref={newTxt} />);
        yield* newTxt().text("ㅤ" + name, duration);
    }
}