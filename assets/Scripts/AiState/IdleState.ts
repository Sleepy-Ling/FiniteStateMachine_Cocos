import CharacterBase from "../Character/CharacterBase";
import { EnemyAi } from "../Character/EnemyAi";
import State, { IStateInfo } from "../FSM/State";

export interface IdleStateInf extends IStateInfo {
    /**视野范围 */
    sightRange: number;
    /**攻击范围 */
    atkRange: number;
    /**获取范围中，最近的敌人 */
    getNearestEnemy(who: CharacterBase, range: number): CharacterBase;
}

export class IdleState extends State<EnemyAi> {
    protected info: IdleStateInf;
    protected stateName: string = "IdleState";

    public onUpdate(dt: number, nowGameTime: number): boolean {
        if (!super.onUpdate(dt, nowGameTime)) {//执行状态更新失败
            return false;
        }

        const getNearestEnemy = this.info.getNearestEnemy;
        if (getNearestEnemy) {
            let target = getNearestEnemy(this.owner, this.info.atkRange);
            if (target && this.owner.getHp() < 5) {//写死5滴血逃跑
                this.owner.escape(target);

                return true;
            }

            if (target) {
                this.owner.startAttack(target);

                return true;
            }

            target = getNearestEnemy(this.owner, this.info.sightRange);
            if (target) {
                this.owner.chase(target);

                return true;
            }

            let randomX: number = -1 + Math.random() * 2;
            let randomY: number = -1 + Math.random() * 2;
            this.owner.move(cc.v2(randomX, randomY));
        }

        return true;
    }
}