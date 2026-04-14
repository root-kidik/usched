import { CODE, Layout, lines, makeScene2D, word } from '@motion-canvas/2d';
import { all, beginSlide, createRef, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { animationTime } from '../theme/Theme';
import { MyGrid } from '../components/My/MyGrid';
import { MyCode } from '../components/My/MyCode';
import { MyRect } from '../components/My/MyRect';
import { StackV5 } from '../components/StackV5';
import { BlueFirst, BlueSecond, GreenFirst, GreenSecond, VioletFirst, VioletSecond } from '../theme/Colors';

export default makeScene2D(function* (view) {
    const grid = createRef<MyGrid>();

    const cppcode = createRef<MyCode>();
    const cpplayout = createRef<Layout>();

    const stack = createRef<StackV5>();

    view.add(
        <MyGrid ref={grid}>
            <MyRect width={"60%"} height={"60%"} y={-100} layout ref={cpplayout} opacity={0}>
                <MyCode ref={cppcode} />
            </MyRect>

            <StackV5 
                ref={stack}
                amount={32}
                blockWidth={30}
                blockHeight={160}
                stroke_color={GreenFirst}
                color={GreenSecond}
                top_address={"0x02003800"}
                bot_address={"0x02004000"}
                y={800}
            />
        </MyGrid>
    );


    yield* all(
        slideTransition(Direction.Right),
        grid().show(0),
        cppcode().code(CODE`\
void coroutine_init(coroutine_t* coroutine,
                    void (*function)(),
                    void* stack,
                    size_t stack_size);`, animationTime),
        cpplayout().opacity(1, animationTime)
    );

    yield* beginSlide("stack pointer");

yield* all(
        cppcode().code(CODE`\
void coroutine_init(coroutine_t* coroutine,
                    void (*function)(),
                    void* stack,
                    size_t stack_size)
{
    uintptr_t* sp = (uintptr_t*)stack;
}`, animationTime),
        cppcode().selection(lines(5), animationTime),

        stack().hideAll(),
        stack().y(400, animationTime),
);

    yield* beginSlide("stack add");

    yield* all(
        cppcode().code(CODE`\
void coroutine_init(coroutine_t* coroutine,
                    void (*function)(),
                    void* stack,
                    size_t stack_size)
{
    uintptr_t* sp = (uintptr_t*)((uint8_t*)stack + stack_size);
}`, animationTime),
        cppcode().selection(word(5, 33, 28), animationTime),
        stack().showAll(),
    );

    yield* beginSlide("alignment");

    yield* all(
        cppcode().code(CODE`\
void coroutine_init(coroutine_t* coroutine,
                    void (*function)(),
                    void* stack,
                    size_t stack_size)
{
    uintptr_t* sp = (uintptr_t*)((uint8_t*)stack + stack_size);
    sp = (uintptr_t *)(((uintptr_t)sp) & ~0x0F);
}`, animationTime),
        cppcode().selection(lines(6), animationTime),
    );

    yield* beginSlide("reserve 64 bytes");

    yield* all(
        cppcode().code(CODE`\
void coroutine_init(coroutine_t* coroutine,
                    void (*function)(),
                    void* stack,
                    size_t stack_size)
{
    uintptr_t* sp = (uintptr_t*)((uint8_t*)stack + stack_size);
    sp = (uintptr_t *)(((uintptr_t)sp) & ~0x0F);
    sp -= 16;
}`, animationTime),
        cppcode().selection(lines(7), animationTime),

        stack().changeColor(31, VioletFirst, VioletSecond),
    );

    yield* all(
        stack().setAddresses("0x02003FC0", "0x02004000"),
        stack().setAmount(16),
        stack().setBlockSize(40, 160),
        stack().changeAllColors(VioletFirst, VioletSecond),
    );

    yield* beginSlide("save RA");

    yield* all(
        cppcode().code(CODE`\
void coroutine_init(coroutine_t* coroutine,
                    void (*function)(),
                    void* stack,
                    size_t stack_size)
{
    uintptr_t* sp = (uintptr_t*)((uint8_t*)stack + stack_size);
    sp = (uintptr_t *)(((uintptr_t)sp) & ~0x0F);
    sp -= 16;
    sp[0] = (uintptr_t)function;
}`, animationTime),
        cppcode().selection(lines(8), animationTime),

        stack().changeColor(15, BlueFirst, BlueSecond),
        stack().setText(15, "ra"),
    );

    yield* beginSlide("coroutine save new sp");

    yield* all(
        cppcode().code(CODE`\
void coroutine_init(coroutine_t* coroutine,
                    void (*function)(),
                    void* stack,
                    size_t stack_size)
{
    uintptr_t* sp = (uintptr_t*)((uint8_t*)stack + stack_size);
    sp = (uintptr_t *)(((uintptr_t)sp) & ~0x0F);
    sp -= 16;
    sp[0] = (uintptr_t)function;
    coroutine->sp = sp;
}`, animationTime),
        cppcode().selection(lines(9), animationTime),
    );

    yield* beginSlide("End");
});
