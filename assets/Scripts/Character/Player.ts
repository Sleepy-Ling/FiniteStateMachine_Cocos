import { AttackState, AttackStateInf } from "../AiState/AttackState";
import { IdleState, IdleStateInf } from "../AiState/IdleState";
import { MoveState, MoveStateInf } from "../AiState/MoveState";
import { Enum_FSMState } from "../FSM/Enum_State";
import StateMachine from "../FSM/StateMachine";
import { PlayerAttackState } from "../PlayerState/PlayerAttackState";
import { PlayerIdleState, PlayerIdleStateInf } from "../PlayerState/PlayerIdleState";
import CharacterBase, { GetNearestEnemyFunc } from "./CharacterBase";
const { ccclass, property } = cc._decorator;

@ccclass
export class Player extends CharacterBase {

    init(getNearestEnemy: GetNearestEnemyFunc) {
        this.getNearestEnemy = getNearestEnemy;

        this.stateMachine = new StateMachine(this);
        this.stateMachine.registerState(Enum_FSMState.idle, new PlayerIdleState());
        this.stateMachine.registerState(Enum_FSMState.attack, new PlayerAttackState());
        this.stateMachine.running = true;

        this.idle();
    }

    startAttack(target: CharacterBase): boolean {
        let inf: AttackStateInf = {
            preAttackTime: 0.1,
            validTime: 1,
            target: target,
            stateUpdateInterval: 0,
            startStateMTime: Date.now()//示范时使用的时间戳，真正项目时可换成正确时间戳
        }

        this.stateMachine.changeStateByType(Enum_FSMState.attack, inf);

        return true;
    }
    attack(target: CharacterBase): boolean {
        target.getHurt(1);

        return true;
    }
    move(dir: cc.Vec2): boolean {
        return true;
    }
    moveTo(target: CharacterBase): boolean {
        return true;
    }
    idle(): boolean {
        let inf: PlayerIdleStateInf = {
            atkRange: 50,
            getNearestEnemy: this.getNearestEnemy,
            stateUpdateInterval: 0.1,
            startStateMTime: Date.now(),
            target: undefined
        }
        this.stateMachine.changeStateByType(Enum_FSMState.idle, inf);

        return true;
    }

}