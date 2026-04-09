import { createSignal, SimpleSignal } from "@motion-canvas/core";
import { File } from "./File";

export function createFile(name: string): SimpleSignal<File> {
    return createSignal(
        <File name={name} /> as File
    );
}
