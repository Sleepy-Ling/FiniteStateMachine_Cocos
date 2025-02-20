// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import CharacterBase from "./Character/CharacterBase";
import { EnemyAi } from "./Character/EnemyAi";
import { Player } from "./Character/Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    @property(EnemyAi)
    enemy: EnemyAi = null;

    @property(Player)
    player: Player = null;

    protected enemyList: EnemyAi[] = [];
    protected enemyPool: cc.NodePool = new cc.NodePool();

    protected start(): void {
        this.player.init(this.GetNearestEnemy.bind(this));

        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    /**生成敌人 */
    public onClickGenerateEnemy() {
        let enemyNode = this.enemyPool.get();
        if (!enemyNode) {
            enemyNode = cc.instantiate(this.enemy.node);
        }

        let enemy = enemyNode.getComponent(EnemyAi);
        enemy.init(this.GetNearestEnemy.bind(this), 10);
        enemyNode.setPosition(-250 + Math.random() * 500, -250 + Math.random() * 500);
        // enemyNode.setPosition(50, 50);
        enemyNode.setParent(this.node);

        this.enemyList.push(enemy);
    }

    protected GetNearestEnemy(who: CharacterBase, range: number) {
        if (who == null) {
            return null;
        }

        if (range == null) {
            return null;
        }

        if (who instanceof EnemyAi) {//简单判断，逻辑可修改
            let p1 = who.node.getPosition();
            let p2 = this.player.node.getPosition();

            let lengthSqr = p1.sub(p2).lengthSqr();
            if (lengthSqr <= range * range) {
                return this.player;
            }
        }
        else if (who instanceof Player) {//简单判断，逻辑可修改
            let p1 = who.node.getPosition();
            let target: CharacterBase;
            let minLength: number = Infinity;
            for (const element of this.enemyList) {
                let p2 = element.node.getPosition();

                let lengthSqr = p1.sub(p2).lengthSqr();
                if (minLength > lengthSqr && lengthSqr <= range * range) {
                    minLength = lengthSqr;
                    target = element;
                }
            }

            return target;
        }

        return null;
    }

    protected onTouchMove(evt: cc.Event.EventTouch) {
        let delta = evt.getDelta();

        let pos = this.player.node.getPosition();
        let nextPos = pos.add(delta);
        this.player.node.setPosition(nextPos);

    }
}
