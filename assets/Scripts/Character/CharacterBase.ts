// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import StateMachine from "../FSM/StateMachine";

const { ccclass, property } = cc._decorator;

export type GetNearestEnemyFunc = (who: CharacterBase, range: number) => CharacterBase;

/**人物基类 定义通用各种行为 */
@ccclass
export default abstract class CharacterBase extends cc.Component {
    protected hp: number;
    protected stateMachine: StateMachine<CharacterBase>;
    protected getNearestEnemy: GetNearestEnemyFunc;

    /**开始攻击 */
    abstract startAttack(target: CharacterBase): boolean;
    /**攻击 */
    abstract attack(target: CharacterBase): boolean;
    abstract move(dir: cc.Vec2): boolean;
    abstract moveTo(target: CharacterBase): boolean;

    abstract idle(): boolean;

    getHurt(damage: number): boolean {
        this.hp -= damage;
        return true;
    }

    public update(dt: number): void {
        if (this.stateMachine) {
            this.stateMachine.excuteCurState(dt, Date.now());
        }
    }
    
    public getHp() {
        return this.hp;
    }
}
