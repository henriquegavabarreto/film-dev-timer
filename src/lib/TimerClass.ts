import BeepFrequency from '@/types/BeepFrequency';
import playBeep from './playBeep';
import Duration from '@/types/Duration';
import parseDurationToMs from './parseDurationToMs';

export default class TimerClass {
    private activeFlag: boolean = false;    // current timer status
    private agitatingFlag: boolean = false; // current agitation status
    private duration: number;               // total duration of the timer
    private startAgitationDuration: number; // first agitation duration
    private agitationInterval: number;      // interval on which the agitation should repeat
    private agitationDuration: number;      // repeated agitation duration
    private startTime?: number;             // time when the timer started
    private nextAgitationStart?: number;    // time when the next agitation will occur
    private nextAgitationEnd?: number;      // time when the next agitation will end
    private timerId?: NodeJS.Timeout;       // timeout id for clearTimeout purposes
    private onComplete?: () => void;        // callback to be executed when the timer stops

    // timer status
    get active(): boolean {
        return this.activeFlag;
    };

    // agitation status
    get agitating(): boolean {
        return this.agitatingFlag;
    };

    // elapsed time since timer start
    get elapsedTime(): number {
        return this.startTime ? Date.now() - this.startTime : 0;
    };

    private getDurationFromSeconds(totalSeconds: number) : Duration {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return { h, m, s };
    }

    get timeRemaining(): Duration {
        // calculate remaining time and return as duration to be displayed
        const totalSeconds = Math.floor((this.duration - this.elapsedTime) / 1000);
        return this.getDurationFromSeconds(totalSeconds);
    }

    get NextAgitationStartsIn(): Duration {
        if (this.agitatingFlag) return { h: 0, m: 0, s: 0 }; // Currently agitating

        if (this.nextAgitationStart) {
            const totalSecondsToAgitation = Math.floor((this.nextAgitationStart - Date.now()) / 1000);
            
            return totalSecondsToAgitation <= 0 ? { h: 0, m: 0, s: 0 } : this.getDurationFromSeconds(totalSecondsToAgitation);
        } else {
            return { h: 0, m: 0, s: 0 }
        }
    }

    get NextAgitationEndsIn(): Duration {
        if(!this.agitatingFlag) return { h: 0, m: 0, s: 0 }; // there is no agitation occuring
            
        if(!this.nextAgitationEnd) { // there is no agitation end value
            return { h: 0, m: 0, s: 0 };
        } else {
            const totalSecondsToEndAgitation = Math.floor((this.nextAgitationEnd - Date.now()) / 1000);
        
            return totalSecondsToEndAgitation <= 0 ? { h: 0, m: 0, s: 0 } : this.getDurationFromSeconds(totalSecondsToEndAgitation);
        }
    }

    constructor(
        duration: Duration,
        startAgitationDuration: Duration,
        agitationInterval: Duration,
        agitationDuration: Duration,
        onComplete?: () => void
    ) {
        this.duration = parseDurationToMs(duration);
        this.startAgitationDuration = parseDurationToMs(startAgitationDuration);
        this.agitationInterval = parseDurationToMs(agitationInterval);
        this.agitationDuration = parseDurationToMs(agitationDuration);
        this.onComplete = onComplete;
    };

    // reset variables, set start time and start timer loop
    public start(): void {
        this.activeFlag = true;
        this.nextAgitationStart = undefined;
        this.nextAgitationEnd = undefined;
        this.startTime = Date.now();
        this.loop();
    };

    // Reset variables, stop timer, clear timeout and call registered callback if there is one
    public stop(): void {
        this.activeFlag = false;
        this.agitatingFlag = false;
        this.nextAgitationStart = undefined;
        this.nextAgitationEnd = undefined;
        this.startTime = undefined;
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        if(this.onComplete)
        {
            this.onComplete();
        }
    };

    // timer loop
    private loop(): void {
        if(!this.activeFlag) return; // ignore if not active

        const currentTime = Date.now();

        // Sets up first nextAgitationStart and nextAgitationEnd
        if (!this.nextAgitationStart && (this.agitationInterval > 0 || this.startAgitationDuration > 0)) {
            // set first agitation based on start agitation
            if (this.startAgitationDuration > 0) {
                this.nextAgitationStart = this.startTime!;
                this.nextAgitationEnd = this.nextAgitationStart + this.startAgitationDuration;
            } else if (this.agitationInterval > 0) { // sets first agitation based on interval
                this.nextAgitationStart = this.startTime! + this.agitationInterval;
                this.nextAgitationEnd = this.nextAgitationStart + this.agitationDuration;
            }
        }

        // Check if the main timer is over - stop timer and return
        if (currentTime >= this.startTime! + this.duration) {
            playBeep(BeepFrequency.High, 1);
            this.stop();
            return;
        }

        // Check if next agitation time has passed
        if (currentTime >= this.nextAgitationStart! && this.agitatingFlag == false) {
            this.agitatingFlag = true;
            playBeep(BeepFrequency.Medium, 0.5);
            this.nextAgitationStart = currentTime + this.agitationInterval;
        }

        // Check if next agitation end has passed
        if (currentTime >= this.nextAgitationEnd! && this.agitatingFlag == true) {
            this.agitatingFlag = false;
            playBeep(BeepFrequency.Medium, 0.5);
            this.nextAgitationEnd = this.nextAgitationStart! + this.agitationDuration;
        }

        // call this function again
        this.timerId = setTimeout(() => this.loop(), 100);
    };
};