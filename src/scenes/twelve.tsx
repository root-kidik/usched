import { Code, CODE, Layout, lines, makeScene2D, word } from '@motion-canvas/2d';
import { all, beginSlide, createRef, DEFAULT, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { animationTime } from '../theme/Theme';
import { MyGrid } from '../components/My/MyGrid';
import { MyCode } from '../components/My/MyCode';
import { MyRect } from '../components/My/MyRect';
import { createFile } from '../components/Utils';
import { Vscode } from '../components/Vscode';

export default makeScene2D(function* (view) {
    const include = createFile("include");
    const usched_inc = createFile("usched");
    const coroutine_h = createFile("task.h");

    const root = createFile("");

    root().add(include());

    const code_layout_ref = createRef<MyRect>();
    const code = createRef<Code>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    const filebar = createRef<MyRect>();

    yield* vscode().showFilebar(filebar, root),
    yield* include().addFile(usched_inc);
    yield* usched_inc().addFile(coroutine_h);

    yield* beginSlide("task.h");

    yield* all(
        root().highlight(coroutine_h()),
        code().code(CODE`\
#pragma once

typedef struct
{
    void* sp;
} usched_task_t;`, animationTime),
    );

    yield* beginSlide("context_switch.asm");

    const src = createFile("src");
    const usched_src = createFile("usched");
    const context_switch_asm = createFile("context_switch.S");

    yield* root().addFile(src);
    yield* src().addFile(usched_src);
    yield* usched_src().addFile(context_switch_asm); 

    yield* all(
        code().code(CODE`\
.section .text
.balign 4
.globl context_switch
.type context_switch, @function

context_switch:
    addi    sp, sp, -64             lw      sp, 0(a1)

    sw      ra,   0*4(sp)           lw      ra,   0*4(sp)
    sw      s0,   1*4(sp)           lw      s0,   1*4(sp)
    sw      s1,   2*4(sp)           lw      s1,   2*4(sp)
    sw      s2,   3*4(sp)           lw      s2,   3*4(sp)
    sw      s3,   4*4(sp)           lw      s3,   4*4(sp)
    sw      s4,   5*4(sp)           lw      s4,   5*4(sp)
    sw      s5,   6*4(sp)           lw      s5,   6*4(sp)
    sw      s6,   7*4(sp)           lw      s6,   7*4(sp)
    sw      s7,   8*4(sp)           lw      s7,   8*4(sp)
    sw      s8,   9*4(sp)           lw      s8,   9*4(sp)
    sw      s9,  10*4(sp)           lw      s9,  10*4(sp)
    sw      s10, 11*4(sp)           lw      s10, 11*4(sp)
    sw      s11, 12*4(sp)           lw      s11, 12*4(sp)

    sw      sp, 0(a0)               addi    sp, sp, 64

                                    ret

.size context_switch, .-context_switch`, animationTime),
    );

    yield* beginSlide("context_switch.h");
    
    const context_switch_h = createFile("context_switch.h");

    yield* usched_src().addFile(context_switch_h);
    yield* code().code(CODE``, animationTime);

    yield* all( 
        code().code(CODE`\
#pragma once

#include <usched/task.h>

void usched_context_switch(usched_task_t* to);

void usched_yield();

usched_task_t* usched_get_current_task();`, animationTime),

        root().highlight(context_switch_h()),
    );

    yield* beginSlide("context_switch.c");

    const context_switch_c = createFile("context_switch.c");

    yield* all(
        usched_src().addFile(context_switch_c),
        code().code(CODE``, animationTime),
    );

    yield* code().code(CODE`\
#include <usched/context_switch.h>
        `, animationTime);

    yield* beginSlide("extern asm");

    yield* all(
            code().code(CODE`\
#include <usched/context_switch.h>

extern void context_switch(usched_task_t* from, usched_task_t* to);`, animationTime),
        
            code().selection(lines(2), animationTime),
    );

    yield* beginSlide("main_context");

    yield* all(
            code().code(CODE`\
#include <usched/context_switch.h>

extern void context_switch(usched_task_t* from, usched_task_t* to);

static usched_task_t  main_task;`, animationTime),
        
            code().selection(lines(4), animationTime),
    );

    yield* beginSlide("current task");

    yield* all(
            code().code(CODE`\
#include <usched/context_switch.h>

extern void context_switch(usched_task_t* from, usched_task_t* to);

static usched_task_t  main_task;
static usched_task_t* current_task = &main_task;`, animationTime),
        
            code().selection(lines(5), animationTime),
    );

    yield* beginSlide("usched_context_switch");

    yield* all(
            code().code(CODE`\
#include <usched/context_switch.h>

extern void context_switch(usched_task_t* from, usched_task_t* to);

static usched_task_t  main_task;
static usched_task_t* current_task = &main_task;

void usched_context_switch(usched_task_t* to)
{
    usched_task_t* from = current_task;
    current_task = to;
    context_switch(from, to);
}`, animationTime),
        
            code().selection(lines(7, 12), animationTime),
    );

    yield* beginSlide("usched_context_switch");

    yield* all(
            code().code(CODE`\
#include <usched/context_switch.h>

extern void context_switch(usched_task_t* from, usched_task_t* to);

static usched_task_t  main_task;
static usched_task_t* current_task = &main_task;

void usched_context_switch(usched_task_t* to)
{
    usched_task_t* from = current_task;
    current_task = to;
    context_switch(from, to);
}

void usched_yield()
{
    usched_context_switch(&main_task);
}`, animationTime),
        
            code().selection(lines(14, 17), animationTime),
    );

    yield* beginSlide("usched_get_current_task");

    yield* all(
            code().code(CODE`\
#include <usched/context_switch.h>

extern void context_switch(usched_task_t* from, usched_task_t* to);

static usched_task_t  main_task;
static usched_task_t* current_task = &main_task;

void usched_context_switch(usched_task_t* to)
{
    usched_task_t* from = current_task;
    current_task = to;
    context_switch(from, to);
}

void usched_yield()
{
    usched_context_switch(&main_task);
}
    
usched_task_t* usched_get_current_task()
{
    return current_task;
}`, animationTime),
        
            code().selection(lines(19, 22), animationTime),
    );

    yield* beginSlide("usched.h");

    const usched_h = createFile("usched.h");

    yield* all(
        usched_inc().addFile(usched_h),
        code().code(CODE``, animationTime),
        root().highlight(usched_h()),
    );

    yield* all(
        code().code(CODE`\
#pragma once

#include <usched/task.h>

void usched_add_task(usched_task_t* task, 
                     void (*func)(), 
                     void* stack, 
                     uint16_t stack_size);

void usched_run();`, animationTime),

        code().selection(DEFAULT, animationTime),
    );

    yield* beginSlide("usched.c");

    const usched_c = createFile("usched.c");

    yield* all(
        usched_src().addFile(usched_c),
        code().code(CODE``, animationTime),
        root().highlight(usched_c()),
    );

    yield* beginSlide("includes");

    yield* all(
        code().code(CODE`\
#include <usched/usched.h>
#include <usched/context_switch.h>`, animationTime),
    );

    yield* beginSlide("tasks");

    yield* all(
        code().code(CODE`\
#include <usched/usched.h>
#include <usched/context_switch.h>

static usched_task_t* tasks[10];
static uint8_t tasks_count = 0;`, animationTime),

        code().selection(lines(3, 5), animationTime),
    );

    yield* beginSlide("usched_add_task");

    yield* all(
        code().code(CODE`\
#include <usched/usched.h>
#include <usched/context_switch.h>

static usched_task_t* tasks[10];
static uint8_t tasks_count = 0;

void usched_add_task(usched_task_t* task, 
                     void (*func)(), 
                     void* stack, 
                     uint16_t stack_size)
{
    uintptr_t* sp = (uintptr_t*)((uint8_t*)stack + stack_size);
    sp = (uintptr_t *)(((uintptr_t)sp) & ~0x0F);
    sp -= 16;
    sp[0] = (uintptr_t)function;
    task->sp = sp;

    tasks[tasks_count++] = task;
}`, animationTime),

        code().selection(lines(6, 18), animationTime),
    );

    yield* beginSlide("usched_run");

    yield* all(
        code().code(CODE`\
#include <usched/usched.h>
#include <usched/context_switch.h>

static usched_task_t* tasks[10];
static uint8_t tasks_count = 0;

void usched_add_task(usched_task_t* task, 
                     void (*func)(), 
                     void* stack, 
                     uint16_t stack_size)
{
    uintptr_t* sp = (uintptr_t*)((uint8_t*)stack + stack_size);
    sp = (uintptr_t *)(((uintptr_t)sp) & ~0x0F);
    sp -= 16;
    sp[0] = (uintptr_t)function;
    task->sp = sp;

    tasks[tasks_count++] = task;
}
    
void usched_run()
{
    for (;;)
    {
        for (int i = 0; i < tasks_count; i++)
        {
            usched_context_switch(tasks[i]);
        }
    }
}`, animationTime),

        code().selection(lines(20, 29), animationTime),
    );

    yield* beginSlide("End");
});
