
import CharacterBase from "../Character/CharacterBase";
import State from "./State";

export default class StateMachine<T extends CharacterBase> {
    private _target: T;
    private _curState: State<T>;

    /**状态表 */
    protected stateTable: { [key: number | string]: State<T> };
    constructor(target: T) {
        this._target = target;

        this.stateTable = {};
    }
    public setInitState(state: State<T>, stateInfo?) {
        this._curState = state;
        this._curState.setTarget(this._target);
        this._curState.onEnterState(stateInfo);
    };
    public changeState(state: State<T>, stateInfo?) {
        if (this._curState) {
            this._curState.onExitState();
        }
        
        this._curState = state;
        this._curState.setTarget(this._target);
        this._curState.onEnterState(stateInfo);
    };
    public excuteCurState(deltaTime: number, nowGameTime: number) {
        if (this._running == false) {
            return;
        }

        this._curState.onUpdate(deltaTime, nowGameTime);
    };
    public registerState(stateType: number | string, state: State<T>) {
        this.stateTable[stateType] = state;
    }

    public changeStateByType(stateType: number | string, stateInfo?) {
        let state: State<T> = this.stateTable[stateType];
        if (state == null) {
            console.error("state type error", stateType);
            return;
        }

        this.changeState(state, stateInfo);
    }

    public setInitStateByType(stateType: number | string, stateInfo?) {
        let state: State<T> = this.stateTable[stateType];
        if (state == null) {
            console.error("state type error", stateType);
            return;
        }
        this.setInitState(state, stateInfo);
    };


    private _running: boolean;
    public get running(): boolean {
        return this._running;
    }
    public set running(v: boolean) {
        this._running = v;
    }

    public clear() {
        this._curState = null;
        this._target = null;
        this.stateTable = {};
    }
}