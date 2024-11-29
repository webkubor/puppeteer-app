const Color = {
    Info: "\x1b[36m",      // Cyan (Info)
    Success: "\x1b[32m",   // Green (Success)
    Warning: "\x1b[33m",   // Yellow (Warning)
    Error: "\x1b[31m",     // Red (Error)
    Reset: "\x1b[0m",      // Reset to default
};

export class ColoredLog {
    static info(...messages) {
        this._log(Color.Info, ...messages);
    }

    static success(...messages) {
        this._log(Color.Success, ...messages);
    }

    static warning(...messages) {
        this._log(Color.Warning, ...messages);
    }

    static error(...messages) {
        this._log(Color.Error, ...messages);
    }

    // 私有方法，实际执行打印操作
    static _log(colorCode, ...messages) {
        messages.forEach(message => {
            console.log(colorCode + message + Color.Reset);
        });
    }
}


