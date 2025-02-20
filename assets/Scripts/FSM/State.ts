
import CharacterBase from "../Character/CharacterBase";
import StateMachine from "./StateMachine";

export interface IStateInfo {
    /**状态更新的频率 */
    stateUpdateInterval: number;
    /**状态开始时的时间戳 */
    startStateMTime: number;
    /**状态目标 */
    target: CharacterBase;
}

export default class State<T extends CharacterBase> {
    protected owner: T;
    protected stateName: string;
    protected info: IStateInfo;
    protected lastUpdateStateTime: number;

    /**
     * 进入状态
     * @param info 进入状态时携带的数据
     */
    public onEnterState(info?: IStateInfo) {
        this.info = info;
        this.lastUpdateStateTime = info.startStateMTime;
        // LogUtil.Log("enter ", this.stateName);
        // LogUtil.Log("info ", info);

        console.log(this.owner.node.name, " enter->", this.stateName,);

    };
    public onUpdate(dt: number, nowGameTime: number) {
        if (nowGameTime - this.lastUpdateStateTime > this.info.stateUpdateInterval * 1000) {
            this.lastUpdateStateTime = nowGameTime;
            return true;
        }

        return false;
    };
    public onExitState() { };
    public setTarget(target: T) {
        this.owner = target;
    }
    public getStateName(): string {
        return this.stateName;
    }
}
