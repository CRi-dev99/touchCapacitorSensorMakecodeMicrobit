function sense () {
    reading = 0
    for (let index = 0; index <= samples; index++) {
        read_pin(0)
        basic.pause(1)
    }
    pin0_state = calibration_value0 + threshold0 < reading / samples
    if (verbosity) {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            # # # # #
            `)
        basic.pause(100)
        basic.showNumber(calibration_value0)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            # # # # #
            . . . . .
            `)
        basic.pause(100)
        basic.showNumber(reading / samples)
        basic.pause(100)
    }
    reading = 0
    for (let index = 0; index <= samples; index++) {
        read_pin(1)
        basic.pause(1)
    }
    pin1_state = calibration_value1 + threshold1 < reading / samples
    reading = 0
    for (let index = 0; index <= samples; index++) {
        read_pin(2)
        basic.pause(1)
    }
    pin2_state = calibration_value2 + threshold2 < reading / samples
}
input.onButtonPressed(Button.A, function () {
    calibration_value0 = 0
    calibration(0)
    if (verbosity) {
        basic.showNumber(calibration_value0)
        basic.pause(100)
    }
    calibration_value1 = 0
    calibration(1)
    if (verbosity) {
        basic.showNumber(calibration_value1)
        basic.pause(100)
    }
    calibration_value2 = 0
    calibration(2)
    if (verbosity) {
        basic.showNumber(calibration_value2)
        basic.pause(100)
    }
})
input.onButtonPressed(Button.AB, function () {
    sensing = false
    basic.showLeds(`
        . . . . .
        . . . . .
        # . # . #
        . . . . .
        . . . . .
        `)
})
function calibration (pin: number) {
    reading = 0
    for (let index = 0; index <= samples; index++) {
        read_pin(pin)
        basic.pause(1)
    }
    if (pin == 0) {
        calibration_value0 = reading / samples
    } else if (pin == 1) {
        calibration_value1 = reading / samples
    } else if (pin == 2) {
        calibration_value2 = reading / samples
    }
}
input.onButtonPressed(Button.B, function () {
    basic.showLeds(`
        # # # . .
        # . . # .
        # # # . .
        # . . # .
        # # # . .
        `)
    sensing = true
    while (sensing) {
        sense()
        if (pin0_state) {
            basic.showLeds(`
                . # . # .
                . # . # .
                . . . . .
                # . . . #
                . # # # .
                `)
            basic.pause(100)
            basic.clearScreen()
            datalogger.log(datalogger.createCV("happy", 1))
        } else if (pin1_state) {
            basic.showLeds(`
                . # . # .
                . # . # .
                . . . . .
                # # # # #
                . . . . .
                `)
            basic.pause(100)
            basic.clearScreen()
            datalogger.log(datalogger.createCV("meh", 1))
        } else if (pin2_state) {
            basic.showLeds(`
                . # . # .
                . # . # .
                . . . . .
                . # # # .
                # . . . #
                `)
            basic.pause(100)
            basic.clearScreen()
            datalogger.log(datalogger.createCV("sad", 1))
        }
    }
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (verbosity) {
        verbosity = false
        basic.showLeds(`
            . . # . .
            . # . # .
            . # . # .
            # . . . #
            # . . . #
            `)
        basic.pause(100)
        basic.clearScreen()
    } else {
        verbosity = true
        basic.showLeds(`
            # . . . #
            # . . . #
            . # . # .
            . # . # .
            . . # . .
            `)
        basic.pause(100)
        basic.clearScreen()
    }
})
function read_pin (pin: number) {
    if (pin == 1) {
        reading += pins.analogReadPin(AnalogReadWritePin.P1)
        pins.digitalWritePin(DigitalPin.P1, 1)
    } else if (pin == 2) {
        reading += pins.analogReadPin(AnalogReadWritePin.P2)
        pins.digitalWritePin(DigitalPin.P2, 1)
    } else if (pin == 0) {
        reading += pins.analogReadPin(AnalogReadWritePin.P0)
        pins.digitalWritePin(DigitalPin.P0, 1)
    }
}
let sensing = false
let calibration_value2 = 0
let calibration_value1 = 0
let calibration_value0 = 0
let reading = 0
let verbosity = false
let pin2_state = false
let pin1_state = false
let pin0_state = false
let samples = 0
let threshold2 = 0
let threshold1 = 0
let threshold0 = 0
threshold0 = 40
threshold1 = 40
threshold2 = 40
pins.setPull(DigitalPin.P0, PinPullMode.PullNone)
pins.setPull(DigitalPin.P1, PinPullMode.PullNone)
pins.setPull(DigitalPin.P2, PinPullMode.PullNone)
samples = 8
pin0_state = false
pin1_state = false
pin2_state = false
verbosity = false
datalogger.includeTimestamp(FlashLogTimeStampFormat.Minutes)
datalogger.setColumnTitles(
"happy",
"meh",
"sad"
)
