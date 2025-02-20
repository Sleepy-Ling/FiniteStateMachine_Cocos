import CharacterBase from "../Character/CharacterBase";
import { EnemyAi } from "../Character/EnemyAi";
import State, { IStateInfo } from "../FSM/State";

export interface ChaseStateInf extends IStateInfo {
    speed: number;
    atkRange: number;
    sightRange: number;
}

export class ChaseState extends State<EnemyAi> {
    protected info: ChaseStateInf;
    protected stateName: string = "ChaseState";

    public onUpdate(dt: number, nowGameTime: number): boolean {
        if (!super.onUpdate(dt, nowGameTime)) {//执行状态更新失败
            return false;
        }

        if (this.info.target) {
            let pos = this.owner.node.getPosition();
            let p2 = this.info.target.node.getPosition();
            let dir = p2.sub(pos);
            let dis = dir.lengthSqr();
            dir.normalizeSelf();

            let moveStep = dir.mul(this.info.speed * dt);
            let nextPos = pos.add(moveStep);
            this.owner.node.setPosition(nextPos);

            const atkRange = this.info.atkRange;
            if (dis <= atkRange * atkRange) {
                this.owner.startAttack(this.info.target);
            }

        }
        else {
            this.owner.idle();
        }

        return true;
    }
}