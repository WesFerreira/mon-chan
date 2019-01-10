/*
 * @Author: WesFerreira - https://github.com/WesFerreira
 * @Date: 2019-01-03 00:46:19
 * @Last Modified by: WesFerreira
 * @Last Modified time: 2019-01-10 04:10:10
 */

import "reflect-metadata";
import { Container } from "inversify";
import { Mon, IBox2App, B2AppOptions } from "../Mon-chan";
import IDENTFIER from "../Identifiers";

let dependencyContainer = new Container();

dependencyContainer.bind<IBox2App>(IDENTFIER.SERVICE.BOX2APP).to(Mon.Helpers.Box2App);

export function initBox2App(options: B2AppOptions) {
    dependencyContainer.bind<B2AppOptions>("B2AppOptions")
        .toConstantValue(options).whenInjectedInto(Mon.Helpers.Box2App);
}
export default dependencyContainer;
