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
    const src = createFile("src");
    const usched_src = createFile("usched");
    const context_switch_asm = createFile("context_switch.S");
    const context_switch_h = createFile("context_switch.h");
    const context_switch_c = createFile("context_switch.c");
    const usched_h = createFile("usched.h");
    const usched_c = createFile("usched.c");
    const example_folder = createFile("example");
    const folder_yield = createFile("yield");
    const main_yield = createFile("main.c");

    const root = createFile("");

    root().add(include());

    const code_layout_ref = createRef<MyRect>();
    const code = createRef<Code>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    const filebar = createRef<MyRect>();

    yield* all(
        slideTransition(Direction.Right),
        vscode().showFilebar(filebar, root, 0),
        include().addFile(usched_inc, 0),
        usched_inc().addFile(coroutine_h, 0),
        root().addFile(src, 0),
        src().addFile(usched_src, 0),
        usched_src().addFile(context_switch_asm, 0),
        usched_inc().addFile(context_switch_h, 0),
        usched_src().addFile(context_switch_c),
        usched_inc().addFile(usched_h, 0),
        usched_src().addFile(usched_c, 0),
        root().addFile(example_folder, 0),
        example_folder().addFile(folder_yield, 0),
        folder_yield().addFile(main_yield, 0),
        root().highlight(coroutine_h()),

        code().code(CODE`\
#pragma once

#include <stdint.h>

typedef struct
{
    void* sp;
} usched_task_t;`, animationTime),
    );

    yield* beginSlide("Begin");

    yield* all(
        code().code(CODE`\
#pragma once

#include <stdint.h>

typedef enum : uint8_t
{
    USCHED_TASK_READY,
    USCHED_TASK_SLEEPING
} usched_task_state_t;

typedef struct
{
    void* sp;
} usched_task_t;`, animationTime),

        code().selection(lines(4, 8), animationTime),
    );

    yield* beginSlide("TASK UPDATE");

    yield* all(
        code().code(CODE`\
#pragma once

#include <stdint.h>

typedef enum : uint8_t
{
    USCHED_TASK_READY,
    USCHED_TASK_SLEEPING
} usched_task_state_t;

typedef struct
{
    void*               sp;
    usched_task_state_t state;
    uint32_t            wake_at;
} usched_task_t;`, animationTime),

        code().selection(lines(13, 14), animationTime),
    );

    yield* beginSlide("usched.h");

    yield* all(

        root().highlight(usched_h()),
        code().code(CODE`\
#pragma once

#include <usched/task.h>

void usched_add_task(usched_task_t* task, 
                     void (*function)(), 
                     void* stack, 
                     uint16_t stack_size);

void usched_run();`, animationTime),

        code().selection(DEFAULT, animationTime),
    );

    yield* beginSlide("usched.h");

    yield* all(

        root().highlight(usched_h()),
        code().code(CODE`\
#pragma once

#include <usched/task.h>

void usched_add_task(usched_task_t* task, 
                     void (*function)(), 
                     void* stack, 
                     uint16_t stack_size);

void usched_run();

void usched_sleep_ms(uint32_t ms);`, animationTime),

        code().selection(lines(11), animationTime),
    );

    yield* beginSlide("usched.c");

    yield* all(

        root().highlight(usched_c()),
        code().code(CODE`\
#include <usched/context_switch.h>
#include <usched/usched.h>

static usched_task_t* tasks[10];
static uint8_t        tasks_count = 0;

void usched_add_task(usched_task_t* task, 
                     void (*function)(), 
                     void* stack, 
                     uint16_t stack_size)
{
    uintptr_t* sp = (uintptr_t*)((uint8_t*)stack + stack_size);
    sp            = (uintptr_t*)(((uintptr_t)sp) & ~0x0F);
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

        code().selection(DEFAULT, animationTime),
    );


    yield* beginSlide("header");

    yield* all(
        code().code(CODE`\
#include <usched/context_switch.h>
#include <usched/usched.h>

#include "mik32_hal_scr1_timer.h"

static usched_task_t* tasks[10];
static uint8_t        tasks_count = 0;

void usched_add_task(usched_task_t* task, 
                     void (*function)(), 
                     void* stack, 
                     uint16_t stack_size)
{
    uintptr_t* sp = (uintptr_t*)((uint8_t*)stack + stack_size);
    sp            = (uintptr_t*)(((uintptr_t)sp) & ~0x0F);
    sp -= 16;

    sp[0] = (uintptr_t)function;

    task->sp = sp;

    tasks[tasks_count++] = task;
}

void usched_run();`, animationTime),

        code().selection(lines(3), animationTime),
    );

    yield* beginSlide("usched_add_task");

    yield* all(
        code().code(CODE`\
#include <usched/context_switch.h>
#include <usched/usched.h>

#include "mik32_hal_scr1_timer.h"

static usched_task_t* tasks[10];
static uint8_t        tasks_count = 0;

void usched_add_task(usched_task_t* task, 
                     void (*function)(), 
                     void* stack, 
                     uint16_t stack_size)
{
    uintptr_t* sp = (uintptr_t*)((uint8_t*)stack + stack_size);
    sp            = (uintptr_t*)(((uintptr_t)sp) & ~0x0F);
    sp -= 16;

    sp[0] = (uintptr_t)function;

    task->sp      = sp;
    task->state   = USCHED_TASK_READY;
    task->wake_at = 0;

    tasks[tasks_count++] = task;
}

void usched_run();`, animationTime),

        code().selection(lines(20, 21), animationTime),
    );

    yield* beginSlide("usched_run");

    yield* all(
        code().code(CODE`\
#include <usched/context_switch.h>
#include <usched/usched.h>

#include "mik32_hal_scr1_timer.h"

static usched_task_t* tasks[10];
static uint8_t        tasks_count = 0;

void usched_add_task(usched_task_t* task, 
                     void (*function)(), 
                     void* stack, 
                     uint16_t stack_size);

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

        code().selection(lines(13, 22), animationTime),
    );

    yield* beginSlide("current time");

    yield* all(
        code().code(CODE`\
#include <usched/context_switch.h>
#include <usched/usched.h>

#include "mik32_hal_scr1_timer.h"

static usched_task_t* tasks[10];
static uint8_t        tasks_count = 0;

void usched_add_task(usched_task_t* task, 
                     void (*function)(), 
                     void* stack, 
                     uint16_t stack_size);

void usched_run()
{
    for (;;)
    {
        uint32_t current_time = (uint32_t)__HAL_SCR1_TIMER_GET_TIME();

        for (int i = 0; i < tasks_count; i++)
        {
            usched_context_switch(tasks[i]);
        }
    }
}`, animationTime),

        code().selection(lines(17), animationTime),
    );

    yield* beginSlide("task time");

    yield* all(
        code().code(CODE`\
#include <usched/context_switch.h>
#include <usched/usched.h>

#include "mik32_hal_scr1_timer.h"

static usched_task_t* tasks[10];
static uint8_t        tasks_count = 0;

void usched_add_task(usched_task_t* task, 
                     void (*function)(), 
                     void* stack, 
                     uint16_t stack_size);

void usched_run()
{
    for (;;)
    {
        uint32_t current_time = (uint32_t)__HAL_SCR1_TIMER_GET_TIME();

        for (int i = 0; i < tasks_count; i++)
        {
            usched_task_t* task = tasks[i];
        }
    }
}`, animationTime),

        code().selection(lines(21), animationTime),
    );

    yield* beginSlide("task time check");

    yield* all(
        code().code(CODE`\
#include <usched/context_switch.h>
#include <usched/usched.h>

#include "mik32_hal_scr1_timer.h"

static usched_task_t* tasks[10];
static uint8_t        tasks_count = 0;

void usched_add_task(usched_task_t* task, 
                     void (*function)(), 
                     void* stack, 
                     uint16_t stack_size);

void usched_run()
{
    for (;;)
    {
        uint32_t current_time = (uint32_t)__HAL_SCR1_TIMER_GET_TIME();

        for (int i = 0; i < tasks_count; i++)
        {
            usched_task_t* task = tasks[i];

            if (task->state == USCHED_TASK_SLEEPING && current_time >= task->wake_at)
            {
                task->state = USCHED_TASK_READY;
            }
        }
    }
}`, animationTime),

        code().selection(lines(23, 26), animationTime),
    );

    yield* beginSlide("task context switch");

    yield* all(
        code().code(CODE`\
// ...

void usched_add_task(usched_task_t* task, 
                     void (*function)(), 
                     void* stack, 
                     uint16_t stack_size);

void usched_run()
{
    for (;;)
    {
        uint32_t current_time = (uint32_t)__HAL_SCR1_TIMER_GET_TIME();

        for (int i = 0; i < tasks_count; i++)
        {
            usched_task_t* task = tasks[i];

            if (task->state == USCHED_TASK_SLEEPING && current_time >= task->wake_at)
            {
                task->state = USCHED_TASK_READY;
            }

            if (task->state == USCHED_TASK_READY)
            {
                usched_context_switch(task);
            }
        }
    }
}`, animationTime),

        code().selection(lines(22, 25), animationTime),
    );

    yield* beginSlide("sleepms");

    yield* all(
        code().code(CODE`\
// ...

void usched_add_task(usched_task_t* task, 
                     void (*function)(), 
                     void* stack, 
                     uint16_t stack_size);

void usched_run();

void usched_sleep_ms(uint32_t ms)
{
    usched_task_t* current_task = usched_get_current_task();

    current_task->wake_at = (uint32_t)__HAL_SCR1_TIMER_GET_TIME() + ms * 32000;
    current_task->state   = USCHED_TASK_SLEEPING;

    usched_yield();
}`, animationTime),

        code().selection(lines(9, 17), animationTime),
    );

    yield* beginSlide("sleep example");

    const folder_sleep = createFile("sleep");
    const main_sleep = createFile("main.c");

    yield* all(
        code().code(CODE``, animationTime),
        example_folder().addFile(folder_sleep),
        folder_sleep().addFile(main_sleep),
        root().highlight(main_sleep()),
    );

    yield* beginSlide("code");

    yield* all(
        code().code(CODE`\
#include <usched/context_switch.h>
#include <usched/usched.h>

void task1_fn()
{
    for (;;)
    {
        xprintf("task 1\\r\\n");
        usched_sleep_ms(500);
    }
}

void task2_fn()
{
    for (;;)
    {
        xprintf("task 2\\r\\n");
        usched_sleep_ms(2000);
    }
}

int main()
{
    usched_task_t task1, task2;
    uint8_t       stack1[512], stack2[512];

    usched_add_task(&task1, task1_fn, stack1, sizeof(stack1));
    usched_add_task(&task2, task2_fn, stack2, sizeof(stack2));

    usched_run();
}`, animationTime),

    code().selection(DEFAULT, animationTime),
    );

    yield* code().selection(lines(8), animationTime);
    yield* waitFor(1);
    yield* code().selection(lines(17), animationTime);

    yield* beginSlide("console");

    const console = createRef<Console>();

    yield* all(
        code().code(CODE`\
void task1_fn()
{
    for (;;)
    {
        xprintf("task 1\\r\\n");
        usched_sleep_ms(500);
    }
}

void task2_fn()
{
    for (;;)
    {
        xprintf("task 2\\r\\n");
        usched_sleep_ms(2000);
    }
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
"Terminal ready"], "", animationTime, false);

    yield* console().terminal().line("task 1");
    yield* console().terminal().line("task 2");
    
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* console().terminal().line("task 2");
    
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* console().terminal().line("task 2");

    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* console().terminal().line("task 2");

    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* waitFor(0.5);
    yield* console().terminal().line("task 1");
    yield* console().terminal().line("task 2");

    yield* beginSlide("End");
});
