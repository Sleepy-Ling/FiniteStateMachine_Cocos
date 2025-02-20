import CharacterBase from "../Character/CharacterBase";
import { EnemyAi } from "../Character/EnemyAi";
import State, { IStateInfo } from "../FSM/State";

export interface AttackStateInf extends IStateInfo {
    /**前置攻击所需时间 */
    preAttackTime: number;
    /**有效时间 */
    validTime: number;
    target: CharacterBase;
}

export class AttackState extends State<EnemyAi> {
    protected info: AttackStateInf;
    protected stateName: string = "AttackState";

    public onEnterState(info?: IStateInfo): void {
        // console.log("ai ");
        super.onEnterState(info);
        this.owner.playAttackAnim();
    }

    public onUpdate(dt: number, nowGameTime: number): boolean {
        if (!super.onUpdate(dt, nowGameTime)) {//执行状态更新失败
            return false;
        }

        let preAttackTime = this.info.preAttackTime;
        if (preAttackTime > 0) {
            preAttackTime -= dt;

            if (preAttackTime < 0) {
                this.owner.attack(this.info.target);
            }

            this.info.preAttackTime = preAttackTime;
        }

        this.info.validTime -= dt;
        if (this.info.validTime < 0) {//有效时间到了，就切换成空闲状态
            this.owner.idle();
        }

        return true;
    }
}