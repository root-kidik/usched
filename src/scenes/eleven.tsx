import { CODE, Layout, lines, makeScene2D, word } from '@motion-canvas/2d';
import { all, beginSlide, createRef, DEFAULT, Direction, slideTransition, waitFor } from '@motion-canvas/core';
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
 
extern void context_switch(coroutine_t* from, coroutine_t* to);

coroutine_t coroutine_1_context;
uint8_t coroutine_1_stack[2048];

coroutine_t coroutine_2_context;
uint8_t coroutine_2_stack[2048];

void fn1();
void fn2();

int main()
{
    coroutine_t coroutine_main;
    context_switch(&coroutine_main, &coroutine_1_context);
}`, animationTime),
        cpplayout().opacity(1, animationTime)
    );

    yield* beginSlide("coro init decl");

yield* all(
        cppcode().code(CODE`\
typedef struct
{
    void* sp;
} coroutine_t;
 
extern void context_switch(coroutine_t* from, coroutine_t* to);

void coroutine_init(coroutine_t* coroutine,
                    void (*function)(),
                    void* stack,
                    size_t stack_size);

coroutine_t coroutine_1_context;
uint8_t coroutine_1_stack[2048];

coroutine_t coroutine_2_context;
uint8_t coroutine_2_stack[2048];

void fn1();
void fn2();

int main()
{
    coroutine_t coroutine_main;
    context_switch(&coroutine_main, &coroutine_1_context);
}`, animationTime),
    cppcode().selection(lines(7, 10), animationTime),
);

    yield* beginSlide("coro init use");

yield* all(
        cppcode().code(CODE`\
typedef struct
{
    void* sp;
} coroutine_t;
 
extern void context_switch(coroutine_t* from, coroutine_t* to);

void coroutine_init(coroutine_t* coroutine,
                    void (*function)(),
                    void* stack,
                    size_t stack_size);

coroutine_t coroutine_1_context;
uint8_t coroutine_1_stack[2048];

coroutine_t coroutine_2_context;
uint8_t coroutine_2_stack[2048];

void fn1();
void fn2();

int main()
{
    coroutine_init(&coroutine_1_context, fn1, coroutine_1_stack, sizeof(coroutine_1_stack));
    coroutine_init(&coroutine_2_context, fn2, coroutine_2_stack, sizeof(coroutine_2_stack));

    coroutine_t coroutine_main;
    context_switch(&coroutine_main, &coroutine_1_context);
}`, animationTime),
    cppcode().selection(lines(23, 25), animationTime),
);
    
    yield* beginSlide("finish");

    yield* all(
        cppcode().selection(DEFAULT, animationTime),
    );


    yield* beginSlide("End");
});
