import { Code, CodeProps } from "@motion-canvas/2d";
import { fontFamilyDefault, fontSizeNormal, fontWeightBold } from "../../theme/Theme";

export class MyCode extends Code {
    public constructor(props: CodeProps) {
        super({
            fontFamily: fontFamilyDefault,
            fontWeight: fontWeightBold,
            fontSize: fontSizeNormal,
            ...props,
        });
    }
}
