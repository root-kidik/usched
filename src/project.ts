import { makeProject } from '@motion-canvas/core';

import { Code, LezerHighlighter } from "@motion-canvas/2d";
import { parser } from "@lezer/cpp";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";

import "./global.css";

Code.defaultHighlighter = new LezerHighlighter(
  parser,
  (tokyoNight as any)[1][2].value,
);

import first from './scenes/first?scene';
import second from './scenes/second?scene';
import third from './scenes/third?scene';

export default makeProject({
  scenes: [first, second, third],
});
