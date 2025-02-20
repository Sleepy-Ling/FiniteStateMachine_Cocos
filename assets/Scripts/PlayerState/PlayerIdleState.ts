import CharacterBase from "../Character/CharacterBase";
import { Player } from "../Character/Player";
import State, { IStateInfo } from "../FSM/State";

export interface PlayerIdleStateInf extends IStateInfo {
    /**攻击范围 */
    atkRange: number;
    /**获取范围中，最近的敌人 */
    getNearestEnemy(who: CharacterBase, range: number): CharacterBase;
}

export class PlayerIdleState extends State<Player> {
    protected info: PlayerIdleStateInf;

    public onUpdate(dt: number, nowGameTime: number): boolean {
        if (super.onUpdate(dt, nowGameTime)) {

            const getNearestEnemy = this.info.getNearestEnemy;
            if (getNearestEnemy) {
                let target = getNearestEnemy(this.owner, this.info.atkRange);
                if (target) {
                    this.owner.startAttack(target);

                    return true;
                }
            }

            return true;
        }

        return false;
    }

}