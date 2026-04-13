import { makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, createRef, Direction, slideTransition } from '@motion-canvas/core';
import { animationTime } from '../theme/Theme';
import { MyGrid } from '../components/My/MyGrid';
import { BlueFirst, BlueSecond, GreenFirst, GreenSecond, OrangeFirst, OrangeSecond, RedFirst, RedSecond, VioletFirst, VioletSecond } from '../theme/Colors';
import { StackV3 } from '../components/StackV3';
import { RegisterTableV2 } from '../components/RegisterTableV2';
import { StackV4 } from '../components/StackV4';
import { RegisterTable } from '../components/RegisterTable';
import { RegisterTableV3 } from '../components/RegisterTableV3';

export default makeScene2D(function* (view) {
    const grid = createRef<MyGrid>();

    const sp1 = createRef<RegisterTableV2>();
    const t1 = createRef<StackV4>();

    const sp2 = createRef<RegisterTableV2>();
    const t2 = createRef<StackV4>();

    const regs = createRef<RegisterTableV3>();

    const rows = [
        [ { name: "a0" }, { name: "s0" }, { name: "s1" }, { name: "s2" }, { name: "s3" }, { name: "s4"  }, { name: "s5"  }, { name: "a1" }, ],
        [ { name: ""   }, { name: "s6" }, { name: "s7" }, { name: "s8" }, { name: "s9" }, { name: "s10" }, { name: "s11" }, { name: ""   }, ],
        [ { name: ""   }, { name: ""   }, { name: ""   }, { name: "sp" }, { name: "ra" }, { name: ""    }, { name: ""    }, { name: ""   }, ],
    ];

    view.add(
        <MyGrid ref={grid}>
            <RegisterTableV2
                ref={sp1}
                rowsData={[[{name: "sp"}]]}
                accentColor={GreenFirst}
                cellColor={GreenSecond}
                x={-400}
                y={-200}
                blockWidth={160}
            />

            <RegisterTableV2
                ref={sp2}
                rowsData={[[{name: "sp"}]]}
                accentColor={VioletSecond}
                cellColor={VioletFirst}
                x={400}
                y={-200}
                blockWidth={160}
            />

            <StackV4 
                ref={t1}
                amount={16}
                blockWidth={160}
                blockHeight={40}
                stroke_color={GreenFirst}
                color={GreenSecond}
                top_address={"0x02004000"}
                bot_address={"0x02003FC0"}
                y={600}
                x={-125}
            />

            <StackV4 
                ref={t2}
                amount={16}
                blockWidth={160}
                blockHeight={40}
                stroke_color={VioletSecond}
                color={VioletFirst}
                top_address={"0x02003800"}
                bot_address={"0x020037C0"}
                y={600}
                x={125}
            />

            <RegisterTableV3 
                ref={regs}
                rowsData={rows}
                accentColor={VioletSecond}
                cellColor={VioletFirst}
            />
        </MyGrid>
    );

    yield* all(
        grid().show(0),

        t2().changeColor(3, RedSecond, RedFirst, 0),
        t2().setText(3, "s11", 0),

        t2().changeColor(4, RedSecond, RedFirst, 0),
        t2().setText(4, "s10", 0),

        t2().changeColor(5, RedSecond, RedFirst, 0),
        t2().setText(5, "s9", 0),

        t2().changeColor(6, RedSecond, RedFirst, 0),
        t2().setText(6, "s8", 0),

        t2().changeColor(7, RedSecond, RedFirst, 0),
        t2().setText(7, "s7", 0),

        t2().changeColor(8, RedSecond, RedFirst, 0),
        t2().setText(8, "s6", 0),

        t2().changeColor(9, RedSecond, RedFirst, 0),
        t2().setText(9, "s5", 0),

        t2().changeColor(10, RedSecond, RedFirst, 0),
        t2().setText(10, "s4", 0),

        t2().changeColor(11, RedSecond, RedFirst, 0),
        t2().setText(11, "s3", 0),

        t2().changeColor(12, RedSecond, RedFirst, 0),
        t2().setText(12, "s2", 0),
        
        t2().changeColor(13, RedSecond, RedFirst, 0),
        t2().setText(13, "s1", 0),
        
        t2().changeColor(14, RedSecond, RedFirst, 0),
        t2().setText(14, "s0", 0),

        t2().changeColor(15, BlueFirst, BlueSecond, 0),
        t2().setText(15, "ra", 0),

        t1().x(-1500, 0),
        t1().x(-700, 0),
        t1().y(50, 0),
        sp1().showCell(0, 0, 0),
        sp1().y(-475, 0),
        sp1().x(-700, 0),
        
        t2().x(1500, 0),
        t2().x(700, 0),
        t2().y(50, 0),
        sp2().showCell(0, 0, 0),
        sp2().y(-475, 0),
        sp2().x(700, 0),
        sp2().changeValue(0, 0, "0x020037C0", 0),

        regs().changeColor([[0, 0], [0, 7], [2, 4]], { cell: BlueFirst, accent: BlueSecond}),
        regs().changeColor([[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [2, 3]], { accent: RedFirst, cell: RedSecond}),
    );

    yield* all(
        regs().showAll(),
        regs().y(-400, animationTime),
    );

    yield* beginSlide("End");
});
