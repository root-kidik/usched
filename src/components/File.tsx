import { Layout, LayoutProps, signal } from "@motion-canvas/2d";
import { all, DEFAULT, SignalValue, SimpleSignal, ThreadGenerator } from "@motion-canvas/core";
import { animationTime, fileTypeMap, gapMedium, gapNormal, iconSize, marginLeft, opacitySemi, specialFiles } from "../theme/Theme";
import { MyTxt } from "./My/MyTxt";
import { MySVG } from "./My/MySvg";

export interface FileProps extends LayoutProps {
    name: SignalValue<string>;
}

export class File extends Layout {
    @signal()
    public declare readonly name: SimpleSignal<string, this>;

    public constructor(props: FileProps) {
        super({
            direction: "column",
            layout: true,
            clip: true,
            gap: gapNormal,
            marginLeft: () => this.getDepth() == 0 ? 0 : (this.getDepth() - 1) * marginLeft,
            ...props,
        });

        if (this.name().length <= 0) return;

        this.insert(
            <Layout layout gap={gapMedium} alignItems={"center"} >
                <MySVG mdi={() => this.getEntryIconAndColor().icon} color={() => this.getEntryIconAndColor().color} />

                <MyTxt text={this.name} />
            </Layout>
        );
    }

    public *openFolder(duration: number = animationTime) {
        yield* this.height(DEFAULT, duration);
    }

    public *closeFolder(duration: number = animationTime) {
        const layout = this.children()[0] as Layout;
        yield* this.height(layout.height(), duration);
    }

    public *highlight(file: File, duration: number = animationTime): ThreadGenerator {
        yield* all(
            ...this.getFileChildrens().filter(child => child != file).map(child => all(
                child.children()[0].opacity(opacitySemi, duration),
                child.highlight(file, duration)
            )),
            file.children()[0].opacity(1, duration)
        );
    }

    public *unhighlight(duration: number = animationTime): ThreadGenerator {
        yield* all(
            ...this.getFileChildrens().map(child => all(
                child.children()[0].opacity(1, duration),
                child.unhighlight(duration)
            ))
        );
    }

    private getFileChildrens(): File[] {
        return this.children().filter(child => child instanceof File);
    }

    private getEntryIconAndColor(): { icon: string, color: string } {
        if (this.isFolder()) {
            return this.name() === '.git'
                ? fileTypeMap['.git']
                : fileTypeMap['folder'];
        }
        const fileName = this.name().toLowerCase();
        if (fileName in specialFiles) {
            return specialFiles[fileName];
        }
        if (fileName.startsWith('.')) {
            const cleanName = fileName.slice(1);
            if (cleanName in specialFiles) {
                return specialFiles[cleanName];
            }
        }
        const fileExt = fileName.split('.').pop() || '';
        return fileTypeMap[fileExt] || fileTypeMap['default'];
    }

    private getDepth(): number {
        let depth = 0;
        let current = this.parent();
        while (current instanceof File) {
            depth++;
            current = current.parent();
        }
        return depth;
    }

    private isFolder(): boolean {
        return this.children().length > 1;
    }

    public *addFile(file: SimpleSignal<File>, duration: number = animationTime) {
        const fileText = file().name();
        yield* file().name("", 0);

        this.add(file());
        yield* all(
            this.highlight(file()),
            file().name(fileText, duration)
        );
    }
}