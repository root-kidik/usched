import { Txt, TxtProps } from "@motion-canvas/2d";
import { colorWhite, fontFamilyDefault, fontSizeNormal, fontWeightBold } from "../../theme/Theme";

export class MyTxt extends Txt {
    public constructor(props: TxtProps) {
        super({
            fontFamily: fontFamilyDefault,
            fontWeight: fontWeightBold,
            fontSize: fontSizeNormal,
            fill: colorWhite,
            ...props,
        });
    }
}
