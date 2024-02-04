"use strict";

import { assert } from "chai";
import { Timer } from "../src/babystep";

class TestableTimer extends Timer {
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

describe("A new babysteps timer", function () {
  it("is successfully created", function () {
    const timer = new TestableTimer();
    var result = timer.testCreateTimerHtml();
    var expected =
      '<div style="border: 3px solid #555555; background: Noot; margin: 0; padding: 0;"><h1 style="text-align: center; font-size: 30px; color: #333333;">Aap</h1><div style="text-align: center"> <a style="color: #555555;" href="javascript:command(\'stop\');">Stop</a> <a style="color: #555555;" href="javascript:command(\'reset\');">Reset</a> <a style="color: #555555;" href="javascript:command(\'quit\');">Quit</a> </div></div>';
    assert.equal(expected, result);
  });

  it("it should start the timer", function () {
    const timer = new TestableTimer();
    timer.testStartTimer();
    assert.equal(true, timer.isTimerRunning());
  });

  it("it should stop the timer", function () {
    const timer = new TestableTimer();
    timer.testStopTimer();
    assert.equal(false, timer.isTimerRunning());
  });
});
