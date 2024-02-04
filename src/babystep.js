class Timer {
    constructor() {
        this.BackgroundColorNeutral = "#ffffff";
        this.BackgroundColorFailed = "#ffcccc";
        this.BackgroundColorPassed = "#ccffcc";
        this.SecondsInCycle = 120;
        this._timerRunning = false;
        this._currentCycleStartTime = 0;
        this._lastRemainingTime = "00:00";
        this._bodyBackgroundColor = this.BackgroundColorNeutral;
        this._threadTimer = 0;
        this.generateTimer();
    }
    generateTimer() {
        document.body.innerHTML = this.CreateTimerHtml(this.getRemainingTimeCaption(0), this.BackgroundColorNeutral, false);
    }
    startTimer() {
        document.body.innerHTML = this.CreateTimerHtml(this.getRemainingTimeCaption(0), this.BackgroundColorNeutral, true);
        this._timerRunning = true;
        this._currentCycleStartTime = Date.now();
        this._threadTimer = setInterval(() => {
            if (this._timerRunning) {
                let elapsedTime = Date.now() - this._currentCycleStartTime;
                if (elapsedTime >= this.SecondsInCycle * 1000 + 980) {
                    this._currentCycleStartTime = Date.now();
                    elapsedTime = Date.now() - this._currentCycleStartTime;
                }
                if (elapsedTime >= 5000 &&
                    elapsedTime < 6000 &&
                    this._bodyBackgroundColor != this.BackgroundColorNeutral) {
                    this._bodyBackgroundColor = this.BackgroundColorNeutral;
                }
                let remainingTime = this.getRemainingTimeCaption(elapsedTime);
                if (this._lastRemainingTime !== remainingTime) {
                    if (remainingTime == "00:10") {
                        this.playSound("2166__suburban-grilla__bowl-struck.wav");
                    }
                    else if (remainingTime == "00:00") {
                        this.playSound("32304__acclivity__shipsbell.wav");
                        this._bodyBackgroundColor = this.BackgroundColorFailed;
                    }
                    document.body.innerHTML = this.CreateTimerHtml(remainingTime, this._bodyBackgroundColor, true);
                    this._lastRemainingTime = remainingTime;
                }
            }
        }, 10);
    }
    stopTimer() {
        this._timerRunning = false;
        clearInterval(this._threadTimer);
        document.body.innerHTML = this.CreateTimerHtml(this.getRemainingTimeCaption(0), this.BackgroundColorNeutral, false);
    }
    resetTimer() {
        this._currentCycleStartTime = Date.now();
        this._bodyBackgroundColor = this.BackgroundColorPassed;
    }
    quitTimer() {
        document.body.innerHTML = "";
        clearInterval(this._threadTimer);
    }
    command(arg) {
        switch (arg) {
            case "start":
                this.startTimer();
                break;
            case "stop":
                this.stopTimer();
                break;
            case "reset":
                this.resetTimer();
                break;
            case "quit":
                this.quitTimer();
                break;
            default:
                break;
        }
    }
    getRemainingTimeCaption(elapsedTime) {
        const remainingTime = new Date(this.SecondsInCycle * 1000 - elapsedTime);
        var minute = remainingTime.getMinutes();
        var second = remainingTime.getSeconds();
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }
        return "" + minute + ":" + second;
    }
    CreateTimerHtml(timerText, bodyColor, running) {
        let timerHtml = '<div style="border: 3px solid #555555; background: ' +
            bodyColor +
            '; margin: 0; padding: 0;">' +
            '<h1 style="text-align: center; font-size: 30px; color: #333333;">' +
            timerText +
            "</h1>" +
            '<div style="text-align: center">';
        if (running) {
            timerHtml +=
                '<a style="color: #555555;" href="javascript:command(\'stop\');">Stop</a> ' +
                    '<a style="color: #555555;" href="javascript:command(\'reset\');">Reset</a> ';
        }
        else {
            timerHtml +=
                '<a style="color: #555555;" href="javascript:command(\'start\');">Start</a> ';
        }
        timerHtml +=
            '<a style="color: #555555;" href="javascript:command(\'quit\');">Quit</a> ';
        timerHtml += "</div></div>";
        return timerHtml;
    }
    playSound(url) {
        let audio = new Audio();
        audio.src = `./src/sounds/${url}`;
        console.log(audio.src);
        audio.load();
        audio.play();
    }
}
const timer = new Timer();
export { timer };
