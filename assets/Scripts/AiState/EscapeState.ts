import CharacterBase from "../Character/CharacterBase";
import { EnemyAi } from "../Character/EnemyAi";
import State, { IStateInfo } from "../FSM/State";

export interface EscapeStateInf extends IStateInfo {
    speed: number;
    validTime: number;
}

export class EscapeState extends State<EnemyAi> {
    protected info: EscapeStateInf;
    protected stateName: string = "EscapeState";

    public onUpdate(dt: number, nowGameTime: number): boolean {
        if (!super.onUpdate(dt, nowGameTime)) {//执行状态更新失败
            return false;
        }

        let target = this.info.target;
        if (target) {

            let p1 = this.owner.node.getPosition();
            let p2 = target.node.getPosition();
            let dir = p1.sub(p2).normalize();

            let moveStep = dir.mul(this.info.speed * dt);
            let nextPos = p1.add(moveStep);
            this.owner.node.setPosition(nextPos);
        }

        this.info.validTime -= dt;
        if (this.info.validTime < 0) {//移动时间到了，就切换成空闲状态
            this.owner.idle();
        }

        return true;
    }
}