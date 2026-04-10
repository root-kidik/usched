import { makeScene2D, Rect } from '@motion-canvas/2d';
import { InstructionTable } from '../components/InstructionTable';
import { MyGrid } from '../components/My/MyGrid';
import { all, beginSlide, createRef } from '@motion-canvas/core';
import { animationTime } from '../theme/Theme';
import { BlueFirst, BlueSecond, BrownFirst, BrownSecond, GreenFirst, GreenSecond, RedFirst, RedSecond, VioletFirst, VioletSecond } from '../theme/Colors';

export default makeScene2D(function* (view) {
    const grid = createRef<MyGrid>();

    const rv32i = createRef<Rect>();
    const zicsr = createRef<Rect>();
    const zifenci = createRef<Rect>();
    const m = createRef<Rect>();
    const system = createRef<Rect>();
    const c = createRef<Rect>();

    const rv32i_data = [
        ["BEQ", "XOR", "LB", "SB", "SLL", "ADD"],
        ["BNE", "XORI", "LH", "SH", "SLLI", "ADDI"],
        ["BLT", "OR", "LBU", "SW", "SRL", "SUB"],
        ["BGE", "ORI", "LHU", "SLT", "SRLI", "LUI"],
        ["BLTU", "AND", "LW", "SLTI", "SRA", "AUIPC"],
        ["BGEU", "ANDI", "FENCE", "SLTU", "SRAI", "ECALL"],
        ["JAL", "JALR", "", "SLTIU", "", "EBREAK"],
    ];

    const zicsr_data = [
        ["CSRRW", "CSRRC", "CSRRSI"],
        ["CSRRS", "CSRRWI", "CSRRCI"],
    ];

    const zifenci_data = [
        ["FENCE.I"]
    ];

    const m_data = [
        ["MUL", "MULHSU"],
        ["MULH", "MULHU"],
        ["DIV", "REM"],
        ["DIVU", "REMU"]
    ];

    const system_data = [
        ["WFI"],
        ["MRET"]
    ];

    const c_data = [
        ["C.MV", "C.LW", "C.JAL", "C.SUB"],
        ["C.LI", "C.SW", "C.JALR", "C.NOP"],
        ["C.LUI", "C.BEQZ", "C.ADD", "C.AND"],
        ["C.SLLI", "C.BNEZ", "C.ADDI", "C.ANDI"],
        ["C.SRAI", "C.J", "C.ADDI16SP", "C.OR"],
        ["C.SRLI", "C.JR", "C.ADDI4SPN", "C.XOR"],
    ];

    view.add(
        <MyGrid ref={grid}>
            <InstructionTable
                ref={rv32i}
                x={-300}
                opacity={0}
                title="rv32i"
                rows={rv32i_data}
                strokeColor={GreenFirst}
                color={GreenSecond}
            />

            <InstructionTable
                ref={zicsr}
                x={-300}
                opacity={0}
                title="zicsr"
                rows={zicsr_data}
                strokeColor={BlueSecond}
                color={BlueFirst}
            />

            <InstructionTable
                ref={zifenci}
                x={-300}
                opacity={0}
                title="zifenci"
                rows={zifenci_data}
                strokeColor={BrownFirst}
                color={BrownSecond}
            />

            <InstructionTable
                ref={m}
                x={-300}
                opacity={0}
                title="m"
                rows={m_data}
                strokeColor={VioletSecond}
                color={VioletFirst}
            />

            <InstructionTable
                ref={system}
                x={-300}
                opacity={0}
                title="system"
                rows={system_data}
                strokeColor={RedFirst}
                color={RedSecond}
            />

            <InstructionTable
                ref={c}
                x={-300}
                opacity={0}
                title="c"
                rows={c_data}
                strokeColor={"rgb(220, 70, 20)"}
                color={"rgb(150, 0, 0)"}
            />
        </MyGrid>
    );


    yield* all(
        grid().show(0),
        rv32i().opacity(1, animationTime),
        rv32i().x(0, animationTime)
    );

    yield* beginSlide("zicsr");

    yield* all(
        rv32i().opacity(0.5, animationTime),
        rv32i().scale(0.75, animationTime),
        rv32i().x(-500, animationTime),
        rv32i().y(-250, animationTime),
        zicsr().opacity(1, animationTime),
        zicsr().x(0, animationTime),
        zicsr().y(100, animationTime)
    );

    yield* beginSlide("zifenci");

    yield* all(
        zicsr().opacity(0.5, animationTime),
        zicsr().scale(0.75, animationTime),
        zicsr().x(200, animationTime),
        zicsr().y(-300, animationTime),
        zifenci().opacity(1, animationTime),
        zifenci().x(0, animationTime)
    );

    yield* beginSlide("m");

    yield* all(
        zifenci().opacity(0.5, animationTime),
        zifenci().scale(0.75, animationTime),
        zifenci().x(600, animationTime),
        zifenci().y(-300, animationTime),
        m().opacity(1, animationTime),
        m().x(0, animationTime),
        m().y(150, animationTime)
    );

    yield* beginSlide("system");

    yield* all(
        m().opacity(0.5, animationTime),
        m().scale(0.75, animationTime),
        m().x(-650, animationTime),
        m().y(200, animationTime),
        system().opacity(1, animationTime),
        system().x(0, animationTime)
    );

    yield* beginSlide("c");

    yield* all(
        system().opacity(0.5, animationTime),
        system().scale(0.75, animationTime),
        system().x(-250, animationTime),
        system().y(200, animationTime),
        c().opacity(1, animationTime),
        c().x(400, animationTime),
        c().y(150, animationTime)
    );

    yield* beginSlide("ALL");

    yield* all(
        rv32i().opacity(1, animationTime),
        zicsr().opacity(1, animationTime),
        zifenci().opacity(1, animationTime),
        m().opacity(1, animationTime),
        system().opacity(1, animationTime),
        c().opacity(1, animationTime),
        c().scale(0.75, animationTime),
    );

    yield* beginSlide("END");
});
