import { mdiCodeJson, mdiCog, mdiCube, mdiFileOutline, mdiFolder, mdiGit, mdiLanguageCpp, mdiMapMarkerDown, mdiTuneVariant,  mdiNotebook, mdiBookAlphabet, mdiNinja, mdiWrench, mdiLanguagePython, mdiDocker, mdiLanguageC } from "@mdi/js";

export const colorBlack = "rgb(10, 10, 10)";
export const colorSemiBlack = "rgb(20, 20, 20)";
export const colorSemiSemiBlack = "rgb(30, 30, 30)";

export const colorGrey = "rgb(100, 100, 100)";
export const colorSemiGrey = "rgb(150, 150, 150)";

export const colorWhite = "rgb(220, 220, 220)";
export const colorBlue = "rgb(0, 20, 200)";
export const colorRed = "rgb(170, 20, 20)";
export const colorWhiteBlue = "rgb(51,166,255)";
export const colorGreen = "rgb(50, 190, 20)";

export const paddingNormal = 20;
export const paddingBig = 40;

export const gapNormal = 5;
export const gapMedium = 10;
export const gapBig = paddingBig;

export const radiusSmall = 5;
export const radiusNormal = 20;

export const lineWidthNormal = 20;
export const lineWidthGrid = 5;
export const lineWidthBorderGrid = 10;

export const lineWidthStack = 5;

export const historamWidth = 250;

export const marginLeft = 10;

export const fontWeightBold = 800;
export const fontSizeSmall = 24;
export const fontSizeNormal = 28;
export const fontSizeBig = 36;

export const fontFamilyDefault = "Jetbrains Mono";

export const iconSize = 36;
export const entryTextSize = 24;

export const animationTime = 0.5;

export const opacitySemi = 0.5;


export const fileTypeMap: { [key: string]: { icon: string; color: string } } = {
    '.git': { icon: mdiGit, color: '#F06292' },
    'folder': { icon: mdiFolder, color: '#98BC34' },
    'default': { icon: mdiFileOutline, color: '#B0BEC5' },
    'cpp': { icon: mdiLanguageCpp, color: '#4FC3F7' },
    'c': { icon: mdiLanguageC, color: '#4FC3F7' },
    's': { icon: mdiLanguageC, color: '#cf0300' },
    'hpp': { icon: mdiLanguageCpp, color: '#4FC3F7' },
    'h': { icon: mdiLanguageC, color: '#cf6f00' },
    'md': { icon: mdiMapMarkerDown, color: '#E0E0E0' },
    'json': { icon: mdiCodeJson, color: '#FFB74D' },
    'a': {icon: mdiNotebook, color: '#64B5F6'},
    'o': {icon: mdiBookAlphabet, color: '#64B5F6'},
    'ninja': {icon: mdiNinja, color: '#64B5F6'},    
    'py': {icon: mdiLanguagePython, color: '#FFFF00'},
    'dockerfile': {icon: mdiDocker, color: '#4FC3F7'}
};

export const specialFiles: { [key: string]: { icon: string; color: string } } = {
    'gitignore': { icon: mdiGit, color: '#F06292' },
    'clang-format': { icon: mdiCog, color: '#26A69A' },
    'clang-tidy': { icon: mdiTuneVariant, color: '#26A69A' },
    'cmakelists.txt': { icon: mdiCube, color: '#64B5F6' },
    'makefile': { icon: mdiCog, color: '#FFB74D' },
    'jenkinsfile': { icon: mdiWrench, color: colorRed },
};
