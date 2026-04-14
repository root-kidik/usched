import { CODE, Layout, lines, makeScene2D, word } from '@motion-canvas/2d';
import { all, beginSlide, createRef, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { animationTime } from '../theme/Theme';
import { MyGrid } from '../components/My/MyGrid';
import { MyCode } from '../components/My/MyCode';
import { MyRect } from '../components/My/MyRect';

export default makeScene2D(function* (view) {
    const grid = createRef<MyGrid>();

    const cppcode = createRef<MyCode>();
    const cpplayout = createRef<Layout>();

    view.add(
        <MyGrid ref={grid}>
            <MyRect width={"80%"} height={"90%"} layout ref={cpplayout} opacity={0}>
                <MyCode ref={cppcode} />
            </MyRect>
        </MyGrid>
    );


    yield* all(
        slideTransition(Direction.Right),
        grid().show(0),
        cppcode().code(CODE`\
typedef struct
{
    void* sp;
} coroutine_t;
`, animationTime),
        cpplayout().opacity(1, animationTime)
    );

    yield* beginSlide("context_switch");

    yield* all(
        cppcode().code(CODE`\
typedef struct
{
    void* sp;
} coroutine_t;
 
extern void context_switch(coroutine_t* from, coroutine_t* to);`, animationTime),
        cppcode().selection(lines(5), animationTime),
    );

    yield* beginSlide("coro1");

    yield* all(
        cppcode().code(CODE`\
typedef struct
{
    void* sp;
} coroutine_t;
 
extern void context_switch(coroutine_t* from, coroutine_t* to);

coroutine_t coroutine_1_context;
uint8_t coroutine_1_stack[2048];`, animationTime),
        cppcode().selection(lines(7, 8), animationTime),
    );

    yield* beginSlide("coro2");

    yield* all(
        cppcode().code(CODE`\
typedef struct
{
    void* sp;
} coroutine_t;
 
extern void context_switch(coroutine_t* from, coroutine_t* to);

coroutine_t coroutine_1_context;
uint8_t coroutine_1_stack[2048];

coroutine_t coroutine_2_context;
uint8_t coroutine_2_stack[2048];`, animationTime),
        cppcode().selection(lines(10, 11), animationTime),
    );

    yield* beginSlide("coro1 fn");

    yield* all(
        cppcode().code(CODE`\
typedef struct
{
    void* sp;
} coroutine_t;
 
extern void context_switch(coroutine_t* from, coroutine_t* to);

coroutine_t coroutine_1_context;
uint8_t coroutine_1_stack[2048];

coroutine_t coroutine_2_context;
uint8_t coroutine_2_stack[2048];

void fn1()
{
    for (;;)
    {
        HAL_USART_Print(&husart0, "Hello from coroutine 1!\\r\\n", USART_TIMEOUT_DEFAULT);
        context_switch(&coroutine_1_context, &coroutine_2_context);
    }
}`, animationTime),
        cppcode().selection(lines(13, 20), animationTime),
    );

    yield* beginSlide("coro2 fn");

    yield* all(
        cppcode().code(CODE`\
typedef struct
{
    void* sp;
} coroutine_t;
 
extern void context_switch(coroutine_t* from, coroutine_t* to);

coroutine_t coroutine_1_context;
uint8_t coroutine_1_stack[2048];

coroutine_t coroutine_2_context;
uint8_t coroutine_2_stack[2048];

void fn1()
{
    for (;;)
    {
        HAL_USART_Print(&husart0, "Hello from coroutine 1!\\r\\n", USART_TIMEOUT_DEFAULT);
        context_switch(&coroutine_1_context, &coroutine_2_context);
    }
}
    
void fn2()
{
    for (;;)
    {
        HAL_USART_Print(&husart0, "Hello from coroutine 2!\\r\\n", USART_TIMEOUT_DEFAULT);
        context_switch(&coroutine_2_context, &coroutine_1_context);
    }
}`, animationTime),
        cppcode().selection(lines(22, 29), animationTime),
    );

    yield* beginSlide("run fn1");

    yield* cppcode().selection(lines(13, 14), animationTime);

    yield* beginSlide("show execution fn1");

    yield* cppcode().selection(lines(15), animationTime);
    yield* cppcode().selection(lines(16), animationTime);
    yield* cppcode().selection(lines(17), animationTime);
    yield* cppcode().selection(lines(18), animationTime);

    yield* beginSlide("switch");

    yield* cppcode().selection(lines(22, 23), animationTime);

    yield* beginSlide("show execution fn2");

    yield* cppcode().selection(lines(24), animationTime);
    yield* cppcode().selection(lines(25), animationTime);
    yield* cppcode().selection(lines(26), animationTime);
    yield* cppcode().selection(lines(27), animationTime);

    yield* beginSlide("fn2 switch 1");

    yield* cppcode().selection(lines(19), animationTime);
    yield* cppcode().selection(lines(15), animationTime);
    yield* cppcode().selection(lines(16), animationTime);
    yield* cppcode().selection(lines(17), animationTime);
    yield* cppcode().selection(lines(18), animationTime);

    yield* beginSlide("fn1 switch 1");

    yield* cppcode().selection(lines(28), animationTime);
    yield* cppcode().selection(lines(24), animationTime);
    yield* cppcode().selection(lines(25), animationTime);
    yield* cppcode().selection(lines(26), animationTime);
    yield* cppcode().selection(lines(27), animationTime);

    yield* beginSlide("fn2 switch 2");

    yield* cppcode().selection(lines(19), animationTime);
    yield* cppcode().selection(lines(15), animationTime);
    yield* cppcode().selection(lines(16), animationTime);
    yield* cppcode().selection(lines(17), animationTime);
    yield* cppcode().selection(lines(18), animationTime);

    yield* beginSlide("fn1 switch 2");

    yield* cppcode().selection(lines(28), animationTime);
    yield* cppcode().selection(lines(24), animationTime);
    yield* cppcode().selection(lines(25), animationTime);
    yield* cppcode().selection(lines(26), animationTime);
    yield* cppcode().selection(lines(27), animationTime);

    yield* beginSlide("End");
});
