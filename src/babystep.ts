class Timer {
  BackgroundColorNeutral: string = "#ffffff";
  BackgroundColorFailed: string = "#ffcccc";
  BackgroundColorPassed: string = "#ccffcc";
  SecondsInCycle: number = 120;

  _timerRunning: boolean = false;
  _currentCycleStartTime: number = 0;
  _lastRemainingTime: string = "00:00";
  _bodyBackgroundColor: string = this.BackgroundColorNeutral;
  _threadTimer: NodeJS.Timeout | number = 0;
  constructor() {
    this.generateTimer();
  }
  protected generateTimer() {
    document.body.innerHTML = this.CreateTimerHtml(
      this.getRemainingTimeCaption(0),
      this.BackgroundColorNeutral,
      false
    );
  }

  protected startTimer(): void {
    document.body.innerHTML = this.CreateTimerHtml(
      this.getRemainingTimeCaption(0),
      this.BackgroundColorNeutral,
      true
    );

    this._timerRunning = true;
    this._currentCycleStartTime = Date.now();

    this._threadTimer = setInterval(() => {
      if (this._timerRunning) {
        let elapsedTime: number = Date.now() - this._currentCycleStartTime;

        if (elapsedTime >= this.SecondsInCycle * 1000 + 980) {
          this._currentCycleStartTime = Date.now();
          elapsedTime = Date.now() - this._currentCycleStartTime;
        }
        if (
          elapsedTime >= 5000 &&
          elapsedTime < 6000 &&
          this._bodyBackgroundColor != this.BackgroundColorNeutral
        ) {
          this._bodyBackgroundColor = this.BackgroundColorNeutral;
        }

        let remainingTime: string = this.getRemainingTimeCaption(elapsedTime);

        if (this._lastRemainingTime !== remainingTime) {
          if (remainingTime == "00:10") {
            this.playSound("2166__suburban-grilla__bowl-struck.wav");
          } else if (remainingTime == "00:00") {
            this.playSound("32304__acclivity__shipsbell.wav");
            this._bodyBackgroundColor = this.BackgroundColorFailed;
          }

          document.body.innerHTML = this.CreateTimerHtml(
            remainingTime,
            this._bodyBackgroundColor,
            true
          );
          this._lastRemainingTime = remainingTime;
        }
      }
    }, 10);
  }
  protected stopTimer(): void {
    this._timerRunning = false;
    clearInterval(this._threadTimer);
    document.body.innerHTML = this.CreateTimerHtml(
      this.getRemainingTimeCaption(0),
      this.BackgroundColorNeutral,
      false
    );
  }

  protected resetTimer(): void {
    this._currentCycleStartTime = Date.now();
    this._bodyBackgroundColor = this.BackgroundColorPassed;
  }

  protected quitTimer(): void {
    document.body.innerHTML = "";
    clearInterval(this._threadTimer);
  }
  public command(arg: string): void {
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
  protected getRemainingTimeCaption(elapsedTime: number): string {
    const remainingTime: Date = new Date(
      this.SecondsInCycle * 1000 - elapsedTime
    );
    const remainingMinutes: string | number = remainingTime.getMinutes();
    const remainingSeconds: string | number = remainingTime.getSeconds();
    const formattedMinutes =
      remainingMinutes < 10 ? "0" + remainingMinutes : remainingMinutes;

    const formattedSeconds =
      remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  public CreateTimerHtml(
    timerText: string,
    bodyColor: string,
    running: boolean
  ): string {
    const timerHtml: string =
      `<div style="border: 3px solid #555555; background: ${bodyColor}; margin: 0; padding: 0;">` +
      `<h1 style="text-align: center; font-size: 30px; color: #333333;">${timerText}</h1>` +
      `<div style="text-align: center">
      ${
        running
          ? `<a style="color: #555555;" href="javascript:command('stop');">Stop</a> <a style="color: #555555;" href="javascript:command('reset');">Reset</a> `
          : '<a style="color: #555555;" href="javascript:command(\'start\');">Start</a>'
      }` +
      `<a style="color: #555555;" href="javascript:command('quit');">Quit</a> </div></div>`;
    return timerHtml.replace(/\s+/g, " ").trim();
  }

  protected playSound(url: string): void {
    const audio = new Audio();
    audio.src = `./src/sounds/${url}`;
    audio.load();
    audio.play();
  }
}

const timer = new Timer();
export { timer };
