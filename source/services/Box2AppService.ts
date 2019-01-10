/*
 * @Author: WesFerreira - https://github.com/WesFerreira
 * @Date: 2019-01-03 00:52:34
 * @Last Modified by: WesFerreira
 * @Last Modified time: 2019-01-03 01:28:55
 */

import { injectable, inject } from "inversify";
import IDENTFIER from "../Identifiers";
import { IBox2App, IBox2AppSetters } from "../Mon-chan";

@injectable()
export class Box2AppService implements IBox2App {
    public world: Box2D.Dynamics.b2World;
    public scale: number;
    public set: IBox2AppSetters;

    public applyPhysics: () => void;

    private box2App: IBox2App;

    constructor(@inject(IDENTFIER.SERVICE.BOX2APP) box2App: IBox2App) {
        this.box2App = box2App;

        this.world = this.box2App.world;
        this.scale = this.box2App.scale;
        this.set = this.box2App.set;
        this.applyPhysics = this.box2App.applyPhysics;
    }
}
