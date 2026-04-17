import { Code, CODE, Layout, lines, makeScene2D, word } from '@motion-canvas/2d';
import { all, beginSlide, createRef, DEFAULT, Direction, slideTransition, waitFor } from '@motion-canvas/core';
import { animationTime } from '../theme/Theme';
import { MyGrid } from '../components/My/MyGrid';
import { MyCode } from '../components/My/MyCode';
import { MyRect } from '../components/My/MyRect';
import { createFile } from '../components/Utils';
import { Vscode } from '../components/Vscode';
import { Console } from '../components/Console';

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
.section .text.epilog
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

    yield* usched_inc().addFile(context_switch_h);
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
        root().highlight(context_switch_c()),
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

    yield* beginSlide("example");

    const example_folder = createFile("example");
    const folder_yield = createFile("yield");
    const main_yield = createFile("main.c");

    yield* code().code(CODE``, animationTime);
    yield* root().addFile(example_folder);
    yield* example_folder().addFile(folder_yield);
    yield* folder_yield().addFile(main_yield);

    yield* all(
        code().code(CODE`\
#include <usched/usched.h>
#include <usched/context_switch.h>
`, animationTime),
        code().selection(DEFAULT, animationTime),

        root().highlight(main_yield()),
    );

    yield* beginSlide("task1, task2");

    yield* all(
        code().code(CODE`\
#include <usched/usched.h>
#include <usched/context_switch.h>

void task1_fn()
{
    for (;;)
    {
        xprintf("task 1\\r\\n");
        usched_yield();
    }
}
    
void task2_fn()
{
    for (;;)
    {
        xprintf("task 2\\r\\n");
        usched_yield();
    }
}`, animationTime),

        code().selection(lines(3, 19), animationTime),
    );

    yield* beginSlide("main t1, t2");

    yield* all(
        code().code(CODE`\
#include <usched/usched.h>
#include <usched/context_switch.h>

void task1_fn()
{
    for (;;)
    {
        xprintf("task 1\\r\\n");
        usched_yield();
    }
}
    
void task2_fn()
{
    for (;;)
    {
        xprintf("task 2\\r\\n");
        usched_yield();
    }
}
    
int main()
{
    usched_task_t task1, task2;
}`, animationTime),

        code().selection(lines(20, 24), animationTime),
    );

    yield* beginSlide("main st1, st2");

    yield* all(
        code().code(CODE`\
#include <usched/usched.h>
#include <usched/context_switch.h>

void task1_fn()
{
    for (;;)
    {
        xprintf("task 1\\r\\n");
        usched_yield();
    }
}
    
void task2_fn()
{
    for (;;)
    {
        xprintf("task 2\\r\\n");
        usched_yield();
    }
}
    
int main()
{
    usched_task_t task1, task2;
    uint8_t stack1[512], stack2[512];
}`, animationTime),

        code().selection(lines(24), animationTime),
    );

    yield* beginSlide("usched_add_task");

    yield* all(
        code().code(CODE`\
#include <usched/usched.h>
#include <usched/context_switch.h>

void task1_fn()
{
    for (;;)
    {
        xprintf("task 1\\r\\n");
        usched_yield();
    }
}
    
void task2_fn()
{
    for (;;)
    {
        xprintf("task 2\\r\\n");
        usched_yield();
    }
}
    
int main()
{
    usched_task_t task1, task2;
    uint8_t stack1[512], stack2[512];

    usched_add_task(&task1, task1_fn, stack1, sizeof(stack1));
    usched_add_task(&task2, task2_fn, stack2, sizeof(stack2));
}`, animationTime),

        code().selection(lines(26, 27), animationTime),
    );

    yield* beginSlide("run");

    yield* all(
        code().code(CODE`\
#include <usched/usched.h>
#include <usched/context_switch.h>

void task1_fn()
{
    for (;;)
    {
        xprintf("task 1\\r\\n");
        usched_yield();
    }
}
    
void task2_fn()
{
    for (;;)
    {
        xprintf("task 2\\r\\n");
        usched_yield();
    }
}
    
int main()
{
    usched_task_t task1, task2;
    uint8_t stack1[512], stack2[512];

    usched_add_task(&task1, task1_fn, stack1, sizeof(stack1));
    usched_add_task(&task2, task2_fn, stack2, sizeof(stack2));

    usched_run();
}`, animationTime),

        code().selection(lines(29), animationTime),
    );

    yield* beginSlide("console");

    const console = createRef<Console>();

    yield* all(
        code().code(CODE`\
#include <usched/usched.h>
#include <usched/context_switch.h>

void task1_fn() { /* ... */ };
void task2_fn() { /* ... */ };
    
int main()
{
    usched_task_t task1, task2;
    uint8_t stack1[512], stack2[512];

    usched_add_task(&task1, task1_fn, stack1, sizeof(stack1));
    usched_add_task(&task2, task2_fn, stack2, sizeof(stack2));

    usched_run();
}`, animationTime),
        code().selection(DEFAULT, animationTime),

        vscode().showConsole(console),
    );

    yield* console().terminal().prompt();

    yield* console().terminal().type("make build_app flash");

    yield* beginSlide("build_app flash");

    yield* console().terminal().output(["cmake -B build -G Ninja -S .",
"The C compiler identification is GNU 14.2.0",
"The ASM compiler identification is GNU",
"Found assembler: /mik32_utils/xpack-riscv-none-elf-gcc-14.2.0-3/bin/riscv-none-elf-gcc",
"Detecting C compiler ABI info",
"Detecting C compiler ABI info - done",
"Check for working C compiler: /mik32_utils/xpack-riscv-none-elf-gcc-14.2.0-3/bin/riscv-none-elf-gcc - skipped",
"Detecting C compile features",
"Detecting C compile features - done",
"The CXX compiler identification is GNU 14.2.0",
"Detecting CXX compiler ABI info",
"Detecting CXX compiler ABI info - done",
"Check for working CXX compiler: /mik32_utils/xpack-riscv-none-elf-gcc-14.2.0-3/bin/riscv-none-elf-c++ - skipped",
"Detecting CXX compile features",
"Detecting CXX compile features - done",
"Configuring done (0.3s)",
"Generating done (0.0s)",
"Build files have been written to: /workspaces/lesson1/build",
"cmake --build build",
"[1/33] Building ASM object hardware/CMakeFiles/mik32_shared.dir/mik32v2-shared/runtime/crt0.S.o",
"[2/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/core/Source/mik32_hal_scr1_timer.c.o",
"[3/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_dac.c.o",
"[4/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_spifi.c.o",
"[5/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_adc.c.o",
"[6/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_irq.c.o",
"[7/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_crc32.c.o",
"[8/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_crypto.c.o",
"[9/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_eeprom.c.o",
"[10/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_otp.c.o",
"[11/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_pcc.c.o",
"[12/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_rtc.c.o",
"[13/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_spi.c.o",
"[14/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_gpio.c.o",
"[15/33] Building ASM object src/usched/CMakeFiles/usched.dir/context_switch.S.o",
"[16/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_dma.c.o",
"[17/33] Building C object hardware/CMakeFiles/mik32_shared.dir/mik32v2-shared/libs/xprintf.c.o",
"[18/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal.c.o",
"[19/33] Linking C static library lib/libmik32_shared.a",
"[20/33] Building C object src/usched/CMakeFiles/usched.dir/usched.c.o",
"[21/33] Building C object src/usched/CMakeFiles/usched.dir/context_switch.c.o",
"[22/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_tsens.c.o",
"[23/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_timer32.c.o",
"[24/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_wdt.c.o",
"[25/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/utilities/Source/mik32_hal_ssd1306.c.o",
"[26/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_timer16.c.o",
"[27/33] Building C object example/yield/CMakeFiles/yield.dir/main.c.o",
"[28/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/utilities/Source/mik32_hal_spifi_w25.c.o",
"[29/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_usart.c.o",
"[30/33] Building C object hardware/CMakeFiles/mik32_hal.dir/mik32-hal/peripherals/Source/mik32_hal_i2c.c.o",
"[31/33] Linking C static library lib/libmik32_hal.a",
"[32/33] Linking C static library lib/libusched.a",
"[33/33] Linking C executable bin/yield",
"python3 /mik32_utils/mik32-uploader/mik32_upload.py build/bin/yield.hex --run-openocd \\",
"--openocd-exec /usr/bin/openocd 											     		  \\",
"--openocd-target /mik32_utils/mik32-uploader/openocd-scripts/target/mik32.cfg 	     		  \\",
"--openocd-interface /mik32_utils/mik32-uploader/openocd-scripts/interface/ftdi/mikron-link.cfg  \\",
"--adapter-speed 500 --mcu-type MIK32V2",
"Open On-Chip Debugger 0.12.0",
"Licensed under GNU GPL v2",
"For bug reports, read",
"	http://openocd.org/doc/doxygen/bugs.html",
"Info : set servers polling period to 200ms",
"Info : clock speed 500 kHz",
"Info : JTAG tap: riscv.cpu tap/device found: 0xdeb11001 (mfg: 0x000 (<invalid>), part: 0xeb11, ver: 0xd)",
"Info : JTAG tap: riscv.sys tap/device found: 0xfffffffe (mfg: 0x7ff (<invalid>), part: 0xffff, ver: 0xf)",
"Info : datacount=2 progbufsize=6",
"Info : Examined RISC-V core; found 1 harts",
"Info :  hart 0: XLEN=32, misa=0x40001104",
"Info : starting gdb server for riscv.cpu on 3333",
"Info : Listening on port 3333 for gdb connections",
"Info : Listening on port 6666 for tcl connections",
"Info : Listening on port 4444 for telnet connections",
"Info : accepting 'tcl' connection on tcp/6666",
"mik32-uploader-v0.3.3",
"Using MIK32V2",
"Clock init... OK!",
"MCU clock init...",
"Uploading driver... OK!",
"Uploading data...   OK!",
"Run driver...",
"EEPROM writing successfully completed!",
"[12:49:18] Wrote 3840 bytes in 0.61 seconds (effective 6.2 kbyte/s)",
""]),

    yield* beginSlide("picom");

    yield* console().terminal().type("make monitor");

    yield* beginSlide("output");

    yield* console().terminal().output(["picocom /dev/ttyUSB0 -b 115200 --omap crcrlf --echo",
"picocom v3.1",
"",
"port is        : /dev/ttyUSB0",
"flowcontrol    : none",
"baudrate is    : 115200",
"parity is      : none",
"databits are   : 8",
"stopbits are   : 1",
"escape is      : C-a",
"local echo is  : yes",
"noinit is      : no",
"noreset is     : no",
"hangup is      : no",
"nolock is      : no",
"send_cmd is    : sz -vv",
"receive_cmd is : rz -vv -E",
"imap is        : ",
"omap is        : crcrlf,",
"emap is        : crcrlf,delbs,",
"logfile is     : none",
"initstring     : none",
"exit_after is  : not set",
"exit is        : no",
"",
"Type [C-a] [C-h] to see available commands",
"Terminal ready",
"task 1",
"task 2",
"task 1",
"task 2",
"task 1",
"task 2",
"task 1",
"task 2",
"task 1",
"task 2",
"task 1",
"task 2",
"task 1",
"task 2",
"task 1",
"task 2",
"task 1",
"task 2",
"task 1",
"task 2",
"task 1",
"task 2"], "", animationTime * 5, false);

    yield* beginSlide("End");
});
