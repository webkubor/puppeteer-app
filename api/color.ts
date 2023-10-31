

export enum Color {
    BrightRed = "\x1b[31m",
    DarkRed = "\x1b[91m",
    RedBackground = "\x1b[41m",
    BrightGreen = "\x1b[32m",
    DarkGreen = "\x1b[92m",
    GreenBackground = "\x1b[42m",
    BrightYellow = "\x1b[33m",
    DarkYellow = "\x1b[93m",
    YellowBackground = "\x1b[43m",
    BrightBlue = "\x1b[34m",
    DarkBlue = "\x1b[94m",
    BlueBackground = "\x1b[44m",
    BrightPurple = "\x1b[35m",
    DarkPurple = "\x1b[95m",
    PurpleBackground = "\x1b[45m",
    BrightCyan = "\x1b[36m",
    DarkCyan = "\x1b[96m",
    CyanBackground = "\x1b[46m",
    BrightWhite = "\x1b[37m",
    DarkWhite = "\x1b[97m",
    WhiteBackground = "\x1b[47m",
    Reset = "\x1b[0m",
    BrightMagenta = "\x1b[95m", // 亮品红色
    DarkMagenta = "\x1b[35m", // 深品红色
    MagentaBackground = "\x1b[45m", // 品红色背景
    BrightYellowGreen = "\x1b[93m", // 亮黄绿色
    DarkYellowGreen = "\x1b[33m", // 深黄绿色
    YellowGreenBackground = "\x1b[43m" // 黄绿色背景
}

export function coloredLog(message: string, color: string = Color.BrightGreen): void {
    const colorCode = color;
    if (colorCode) {
        console.log(colorCode + message + Color.Reset);
    } else {
        console.error("Unsupported color:", color);
    }
}

