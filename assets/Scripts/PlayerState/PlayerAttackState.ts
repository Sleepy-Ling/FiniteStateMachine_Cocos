import CharacterBase from "../Character/CharacterBase";
import { Player } from "../Character/Player";
import State, { IStateInfo } from "../FSM/State";

export interface PlayerAttackStateInf extends IStateInfo {
    preAttackTime: number;
    validTime: number;
}

export class PlayerAttackState extends State<Player> {
    protected info: PlayerAttackStateInf;

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