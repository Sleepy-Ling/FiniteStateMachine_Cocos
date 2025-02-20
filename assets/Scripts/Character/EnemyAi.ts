import { AttackState, AttackStateInf } from "../AiState/AttackState";
import { ChaseState, ChaseStateInf } from "../AiState/ChaseState";
import { EscapeState, EscapeStateInf } from "../AiState/EscapeState";
import { IdleState, IdleStateInf } from "../AiState/IdleState";
import { MoveState, MoveStateInf } from "../AiState/MoveState";
import { Enum_FSMState } from "../FSM/Enum_State";
import StateMachine from "../FSM/StateMachine";
import CharacterBase, { GetNearestEnemyFunc } from "./CharacterBase";
const { ccclass, property } = cc._decorator;

@ccclass
export class EnemyAi extends CharacterBase {
    @property(cc.Label)
    lab_hp: cc.Label = null;

    init(getNearestEnemy: GetNearestEnemyFunc, hp: number) {
        this.getNearestEnemy = getNearestEnemy;
        this.hp = hp;

        this.stateMachine = new StateMachine(this);
        this.stateMachine.registerState(Enum_FSMState.idle, new IdleState());
        this.stateMachine.registerState(Enum_FSMState.move, new MoveState());
        this.stateMachine.registerState(Enum_FSMState.escape, new EscapeState());
        this.stateMachine.registerState(Enum_FSMState.chase, new ChaseState());
        this.stateMachine.registerState(Enum_FSMState.attack, new AttackState());
        this.stateMachine.running = true;

        this.updateHp();

        this.idle();
    }

    /**播放攻击动画 （示范方法） */
    playAttackAnim() {
        console.log("播放攻击动作");
    }

    startAttack(target: CharacterBase): boolean {
        // console.log(this.node.name, "开始播放前摇攻击动作");
        let inf: AttackStateInf = {
            preAttackTime: 1,
            validTime: 2,
            target: target,
            stateUpdateInterval: 0,
            startStateMTime: Date.now()//示范时使用的时间戳，真正项目时可换成正确时间戳
        }

        this.stateMachine.changeStateByType(Enum_FSMState.attack, inf);
        return true;
    }
    attack(target: CharacterBase): boolean {
        console.log("attack target");

        target.getHurt(1);

        return true;
    }
    move(dir: cc.Vec2): boolean {

        let inf: MoveStateInf = {
            target: null,
            stateUpdateInterval: 0,
            startStateMTime: Date.now(), //示范时使用的时间戳，真正项目时可换成正确时间戳
            speed: 30,
            dir: dir,
            validTime: 1
        }

        this.stateMachine.changeStateByType(Enum_FSMState.move, inf);

        return true;
    }
    moveTo(target: CharacterBase): boolean {
        let dir = target.node.getPosition().sub(this.node.getPosition()).normalize();

        let inf: MoveStateInf = {
            target: target,
            stateUpdateInterval: 0,
            startStateMTime: Date.now(), //示范时使用的时间戳，真正项目时可换成正确时间戳
            speed: 30,
            dir: dir,
            validTime: 1
        }

        this.stateMachine.changeStateByType(Enum_FSMState.move, inf);

        return true;
    }

    chase(target: CharacterBase): boolean {
        let inf: ChaseStateInf = {
            speed: 30,
            sightRange: 1000,
            atkRange: 50,
            stateUpdateInterval: 0,
            startStateMTime: Date.now(),
            target: target
        }

        this.stateMachine.changeStateByType(Enum_FSMState.chase, inf);

        return true;
    }

    idle(): boolean {
        let inf: IdleStateInf = {
            sightRange: 1000,
            atkRange: 50,
            getNearestEnemy: this.getNearestEnemy,
            stateUpdateInterval: 0.1,
            startStateMTime: Date.now(), //示范时使用的时间戳，真正项目时可换成正确时间戳
            target: undefined
        }

        this.stateMachine.changeStateByType(Enum_FSMState.idle, inf);

        return true;
    }

    public escape(target: CharacterBase) {
        let inf: EscapeStateInf = {
            stateUpdateInterval: 0,
            startStateMTime: Date.now(), //示范时使用的时间戳，真正项目时可换成正确时间戳
            target: target,
            speed: 30,
            validTime: 1
        }

        this.stateMachine.changeStateByType(Enum_FSMState.escape, inf);
    }

    public getHurt(damage: number): boolean {
        if (super.getHurt(damage)) {
            this.updateHp();

            return true;
        }

        return false;
    }

    updateHp() {
        this.lab_hp.string = this.hp.toString();
    }
}