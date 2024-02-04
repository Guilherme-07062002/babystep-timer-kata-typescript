class Timer {
  BackgroundColorNeutral: string = "#ffffff";
  BackgroundColorFailed: string = "#ffcccc";
  BackgroundColorPassed: string = "#ccffcc";
  SecondsInCycle: number = 120;

  timerRunning: boolean = false;
  currentCycleStartTime: number = 0;
  lastRemainingTime: string = "00:00";
  bodyBackgroundColor: string = this.BackgroundColorNeutral;
  threadTimer: NodeJS.Timeout | number = 0;

  constructor() {
    this.generateTimer();
  }

  protected generateTimer(isRunning: boolean = false): void {
    document.body.innerHTML = this.CreateTimerHtml(
      this.getRemainingTimeCaption(0),
      this.BackgroundColorNeutral,
      isRunning
    );
  }

  protected startTimer(): void {
    this.generateTimer(true);
    this.timerRunning = true;
    this.currentCycleStartTime = Date.now();

    this.threadTimer = setInterval(() => {
      if (this.timerRunning) {
        let elapsedTime: number = Date.now() - this.currentCycleStartTime;

        if (elapsedTime >= this.SecondsInCycle * 1000 + 980) {
          this.currentCycleStartTime = Date.now();
          elapsedTime = Date.now() - this.currentCycleStartTime;
        }
        if (
          elapsedTime >= 5000 &&
          elapsedTime < 6000 &&
          this.bodyBackgroundColor != this.BackgroundColorNeutral
        ) {
          this.bodyBackgroundColor = this.BackgroundColorNeutral;
        }

        let remainingTime: string = this.getRemainingTimeCaption(elapsedTime);

        if (this.lastRemainingTime !== remainingTime) {
          if (remainingTime == "00:10") {
            this.playSound("2166__suburban-grilla__bowl-struck.wav");
          } else if (remainingTime == "00:00") {
            this.playSound("32304__acclivity__shipsbell.wav");
            this.bodyBackgroundColor = this.BackgroundColorFailed;
          }

          this.generateTimer(true);
          this.lastRemainingTime = remainingTime;
        }
      }
    }, 10);
  }
  protected stopTimer(): void {
    this.timerRunning = false;
    clearInterval(this.threadTimer);
    this.generateTimer();
  }

  protected resetTimer(): void {
    this.currentCycleStartTime = Date.now();
    this.bodyBackgroundColor = this.BackgroundColorPassed;
  }

  protected quitTimer(): void {
    document.body.innerHTML = "";
    clearInterval(this.threadTimer);
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
