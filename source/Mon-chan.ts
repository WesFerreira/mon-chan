/*
 * @Author: WesFerreira - https://github.com/WesFerreira
 * @Date: 2019-01-02 07:01:52
 * @Last Modified by: WesFerreira
 * @Last Modified time: 2019-01-03 01:30:29
 */

import { injectable, inject } from "inversify";

export namespace Mon {
    export namespace Helpers {
        @injectable()
        export class Box2App implements IBox2App {
            public world: Box2D.Dynamics.b2World;
            public scale = 30;

            public set: IBox2AppSetters = {
                animation: {
                    positionIterations: (positionIterations: number) => {
                        this.positionIterations = positionIterations;
                    },
                    timeStep: (timeStep: number) => {
                        this.timeStep = timeStep;
                    },
                    velocityIterations: (velocityIterations: number) => {
                        this.velocityIterations = velocityIterations;
                    },
                },
                debug: {
                    fillAlpha: (alpha: number) => {
                        this.fillAlpha = alpha;
                    },
                    flags: (flags: number) => {
                        this.flags = flags;
                    },
                    lineThickness: (lineThickness: number) => {
                        this.lineThickness = lineThickness;
                    },
                },
            };

            private w: number;
            private h: number;

            // Animation
            private timeStep = 1 / 60;
            private velocityIterations = 8;
            private positionIterations = 3;

            // Debug
            private fillAlpha = 0.5;
            private lineThickness = 1;
            private flags = Box2D.Dynamics.b2DebugDraw.e_shapeBit || Box2D.Dynamics.b2DebugDraw.e_jointBit;

            public applyPhysics = () => {
                this.world.Step(this.timeStep, this.velocityIterations, this.positionIterations);

                this.world.ClearForces();
                this.world.DrawDebugData();

                setTimeout(this.applyPhysics, this.timeStep);
            }

            constructor(@inject("B2AppOptions") options: B2AppOptions) {

                this.w = options.w;
                this.h = options.h;

                if (!options.gravity) { // Default gravity.
                    options.gravity = new Box2D.Common.Math.b2Vec2(0, 9.8);
                }

                this.world = new Box2D.Dynamics.b2World(options.gravity, options.allowSleep);

                if (options.debug) {
                    this.addDebugView();
                    this.setupDebugDraw();
                }
            }

            private addDebugView() {
                let box2App = document.createElement("canvas");
                box2App.width = this.w;
                box2App.height = this.h;
                box2App.setAttribute("id", "debugView");
                box2App.style.cssText = "background-color: rgba(255, 255, 255, 0.4); position: absolute;";
                document.body.insertBefore(box2App, document.body.getElementsByTagName("canvas")[0]);
            }

            private setupDebugDraw() {
                let debugDraw = new Box2D.Dynamics.b2DebugDraw();
                debugDraw.SetSprite((<HTMLCanvasElement>document.getElementById("debugView")).getContext("2d"));
                debugDraw.SetDrawScale(this.scale);
                debugDraw.SetFillAlpha(this.fillAlpha);
                debugDraw.SetLineThickness(this.lineThickness);
                debugDraw.SetFlags(this.flags);
                this.world.SetDebugDraw(debugDraw);
            }
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////
//                               INTERFACES                                     //
//////////////////////////////////////////////////////////////////////////////////
export interface IBox2App {
    world: Box2D.Dynamics.b2World;
    scale: number;
    set: IBox2AppSetters;
    applyPhysics: () => void;
}

export interface IBox2AppSetters {
    animation: {
        positionIterations: (positionIterations: number) => void,
        timeStep: (timeStep: number) => void,
        velocityIterations: (velocityIterations: number) => void,
    };
    debug: {
        fillAlpha: (alpha: number) => void,
        flags: (flags: number) => void,
        lineThickness: (lineThickness: number) => void,
    };
}

export interface B2AppOptions {
    debug?: boolean;
    gravity?: Box2D.Common.Math.b2Vec2;
    allowSleep?: boolean;
    w: number;
    h: number;
}
