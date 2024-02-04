import { Timer } from "../../src/babystep";

export class TestableTimer extends Timer {
  public testCreateTimerHtml() {
    return this.CreateTimerHtml("Aap", "Noot", true);
  }

  public testStartTimer() {
    this.startTimer();
  }

  public testStopTimer() {
    this.stopTimer();
  }

  public isTimerRunning(): boolean {
    return this.timerRunning;
  }
}
