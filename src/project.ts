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
import fourth from './scenes/fourth?scene';
import five from './scenes/five?scene';
import six from './scenes/six?scene';

export default makeProject({
  scenes: [first, second, third, fourth, five, six],
});
