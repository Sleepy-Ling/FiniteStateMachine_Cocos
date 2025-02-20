import CharacterBase from "../Character/CharacterBase";
import State, { IStateInfo } from "../FSM/State";

export interface MoveStateInf extends IStateInfo {
    speed: number;
    dir: cc.Vec2;
    validTime: number;
}

export class MoveState extends State<CharacterBase> {
    protected info: MoveStateInf;
    protected stateName: string = "MoveState";
    
    public onUpdate(dt: number, nowGameTime: number): boolean {
        if (!super.onUpdate(dt, nowGameTime)) {//执行状态更新失败
            return false;
        }

        let dir = this.info.dir;
        let pos = this.owner.node.getPosition();
        let moveStep = dir.mul(this.info.speed * dt);
        let nextPos = pos.add(moveStep);
        this.owner.node.setPosition(nextPos);

        this.info.validTime -= dt;
        if (this.info.validTime < 0) {//移动时间到了，就切换成空闲状态
            this.owner.idle();
        }

        return true;
    }
}