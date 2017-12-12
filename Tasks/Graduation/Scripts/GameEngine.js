function kd(text,smth) {
    console.debug(text);
    console.debug(smth);
}
const jointWith = 30;

const jointHeight = 30;
const boneLenght = 30;
const gravity = 1;
const friction = 1;
const groundLevel = 600;
const jointWeight = 50;
const boneWeight = 0.05;                 //weight per pixel of length
const gameSpeed = 500;                 //delay in ms between frames
const minForceToRound = gravity;
const debugMode = true;

function projectForce(force, angle) {
    kd("projecting force",[force, angle]);
    let forceAngle = Math.atan(force[1]/force[0])*57.29;
    if (force[0]<0) {forceAngle -= 180;}
    kd("angle of force now", forceAngle);
    let vectorLength = Math.sqrt(Math.pow(force[0],2) + Math.pow(force[1],2));
    kd("force vector length", vectorLength);
    kd("ange between force and bone",(angle - forceAngle));
    let projectionLength = vectorLength*Math.cos((angle - forceAngle)/57.29);
    kd("projected force vector length", projectionLength);
    kd("resulting force", [projectionLength*Math.cos(angle/57.29), projectionLength*Math.sin(angle/57.29)]);
    return [projectionLength*Math.cos(angle/57.29), projectionLength*Math.sin(angle/57.29)];
}

class Joint {

    constructor(ev, number) {
        this.initialX = ev.offsetX;
        this.initialY = ev.offsetY;

        this.currentX = this.initialX;
        this.currentY = this.initialY;

        this.grounded = false;
        this.fallTime = 0.5;

        this.bones = [];

        this.speed = [0, 0];
        this.resultForce = [0, 0];

        this.domId = "join" + number.toString();

        this.domObj = document.createElement('div');
        this.domObj.classList.add("joint");
        this.domObj.style.top = this.initialY + "px";
        this.domObj.style.left = this.initialX + "px";
        this.domObj.id = this.domId;

        this.domObj.textContent = this.domId;
        this.domObj.ondragstart = function (event) {
            kd("dragged", this);
            game.takeElement(event)
        };
        this.domObj.ondragover = function (event) {
            game.allowDrop(event)
        };
        this.domObj.draggable = "true";
        ev.target.appendChild(this.domObj);

        this.forceY = document.createElement('div');
        this.forceY.classList.add("forceY");
        this.forceX = document.createElement('div');
        this.forceX.classList.add("forceX");

        this.speedY = document.createElement('div');
        this.speedY.classList.add("speedY");
        this.speedX = document.createElement('div');
        this.speedX.classList.add("speedX");

        this.domObj.appendChild(this.forceY);
        this.domObj.appendChild(this.forceX);
        this.domObj.appendChild(this.speedY);
        this.domObj.appendChild(this.speedX);
    }

    moveTo(x, y) {
        kd("moveto " + this.domId, [x, y]);
        this.initialX = x;
        this.initialY = y;

        this.currentX = this.initialX;
        this.currentY = this.initialY;

        this.domObj.style.top = (this.initialY).toString() + "px";
        this.domObj.style.left = (this.initialX).toString() + "px";

        this.bones.forEach(function (bone) {
            bone.move()
        })
    }

    showForceAndSpeed() {
        this.forceX.style.width = this.resultForce[0] + "px";
        this.forceY.style.height = this.resultForce[1] + "px";
        this.speedX.style.width = this.speed[0] + "px";
        this.speedY.style.height = this.speed[1] + "px";
    }

    hideForceAndSpeed() {
        this.resultForce[0] = 0;
        this.forceX.style.width = this.resultForce[0] + "px";
        this.resultForce[1] = 0;
        this.forceY.style.height = this.resultForce[1] + "px";
    }

    resetResultForce() {
        this.resultForce = [0, 0];
    }

    countTimeToGround() {
        if (!this.grounded) {
            kd("to ground " + groundLevel + " current is " + this.currentY + " speed " + this.speed[1] +  " and force " + this.resultForce[1]);
            this.fallTime = (Math.sqrt(Math.pow(this.speed[1],2) + 2*this.resultForce[1]*(groundLevel - this.currentY))-this.speed[1])/this.resultForce[1];
        } else {
            this.fallTime = 0.5;
        }
        kd("time to fall", this.fallTime);
        return (this.fallTime)
    }

    move(timeFactor) {
        this.freshlyGroundedFlag = 0;
        this.speed[0] += this.resultForce[0] * timeFactor/2;
        this.speed[1] += this.resultForce[1] * timeFactor/2;
        kd("joint speed of " + this.domId, this.speed);

        if ((this.currentY += this.speed[1] * timeFactor + 5) >= groundLevel) {
            this.currentX += this.speed[0] * timeFactor;
            this.currentY = groundLevel;                                      //BIG BAD PLUG!
            if (!this.grounded) {
                this.grounded = true;
                this.domObj.classList.add("joint__grounded");
                this.freshlyGroundedFlag = 1;
            }
        } else {
            this.grounded = false;
            this.currentX += this.speed[0] * timeFactor;
            this.currentY += this.speed[1] * timeFactor;
            this.domObj.classList.remove("joint__grounded");
        }

        kd("move " + this.domId, [this.currentX, this.currentY]);
        this.domObj.style.transition = timeFactor + "s";
        this.domObj.style.top = (this.currentY).toString() + "px";
        this.domObj.style.left = (this.currentX).toString() + "px";

        this.bones.forEach(function (bone) {
            bone.move(timeFactor)
        });

        this.resultForce = [0, 0];

        return (this.freshlyGroundedFlag);
    }

    reset() {
        this.speed[0] = 0;
        this.speed[1] = 0;
        this.currentX = this.initialX;
        this.currentY = this.initialY;
        kd("reset " + this.domId, this.speed);

        this.domObj.style.top = (this.currentY).toString() + "px";
        this.domObj.style.left = (this.currentX).toString() + "px";

        this.bones.forEach(function (bone) {
            bone.move()
        })
    };

    addForce(sourceId, force) {
        let inforce = force;
        if ((Math.abs(inforce[0]) > minForceToRound) || (Math.abs(inforce[1]) > minForceToRound)) {
            if (Math.abs(inforce[0]) < minForceToRound) {
                inforce[0] = 0
            }
            ;
            if (Math.abs(inforce[1]) < minForceToRound) {
                inforce[1] = 0
            }
            ;
            kd(this.domId + " got force from " + sourceId, inforce);
            this.resultForce[0] += inforce[0];
            this.resultForce[1] += inforce[1];
            if (!(sourceId == "ground") && this.grounded) {
                this.addGroundReaction();
            }
            kd(this.domId + " result force is", this.resultForce);
            this.bones.forEach((bone) => {
                if (!(sourceId == bone.domId)) {
                    kd(this.domId + " pass force to " + bone.domId, inforce);
                    bone.addForce(this.domId, projectForce(inforce, bone.angle));
                }
            })
        }

    }

    addGravity() {
        kd(this.domId + " gravity", jointWeight * gravity);
        this.addForce("gravity", [0, jointWeight * gravity]);
    }

    addGroundReaction() {
        let groundReactionForce = [0, 0];

        if (this.resultForce[1] > 0) {
            groundReactionForce[1] = -this.resultForce[1];
        }
        ;

        if (Math.abs(this.resultForce[0]) > this.resultForce[1] * friction) {
            groundReactionForce[0] = -1 * Math.sign(this.resultForce[0]) * this.resultForce[1] * friction;
        } else {
            groundReactionForce[0] = -1 * this.resultForce[0];
        }

        this.addForce("ground", groundReactionForce);

    }

    addForceToStop(timeFactor) {
        this.addForce("ground", [0,-this.speed[1]/timeFactor])
    }
}

class Bone {
    constructor(number, joint1, joint2) {

        this.joints = [joint1,joint2];
        this.domId = "bone" + number.toString();
        kd("joints is", this.joints);

        this.domObj = document.createElement('div');

        this.domObj.classList.add("bone");
        this.domObj.id = this.domId;
        //this.domObj.textContent = this.domId;
        this.domObj.ondragstart = function(event) {game.takeElement(event)};
        this.domObj.ondragover = function(event) {game.allowDrop(event)};
        this.domObj.ondrop = function(event) {game.addElement(event)};
        this.domObj.draggable="true";
        game.domObj.appendChild(this.domObj);
        this.move();
}
    move(timeFactor) {
        kd("move bone", this.domId);
        this.lenght = Math.sqrt(Math.pow((this.joints[0].currentY-this.joints[1].currentY) ,2) + Math.pow((this.joints[0].currentX-this.joints[1].currentX),2));
        this.angle = Math.atan((this.joints[0].currentY-this.joints[1].currentY)/(this.joints[0].currentX-this.joints[1].currentX))*57.29;
        if ((this.joints[0].currentX-this.joints[1].currentX)>0) {this.angle -= 180;}

        this.domObj.style.transition = timeFactor + "s";

        this.domObj.style.MozTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";
        this.domObj.style.WebkitTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";
        this.domObj.style.OTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";
        this.domObj.style.MsTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";
        this.domObj.style.transform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";

        kd("bone position","rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")");

        this.domObj.style.top = (this.joints[0].currentY+jointHeight/2).toString() + "px";
        this.domObj.style.left = (this.joints[0].currentX+jointWith/2).toString() + "px";
    }

    addForce(sourceId, force) {
        let inforce = force;
        if ((Math.abs(inforce[0])>minForceToRound) || (Math.abs(inforce[1])>minForceToRound)) {
            if (Math.abs(inforce[0])<minForceToRound) {inforce[0]=0};
            if (Math.abs(inforce[1])<minForceToRound) {inforce[1]=0};
            kd(this.domId + " got force from " + sourceId, inforce);
            this.joints.forEach((joint)=>{
                if (!(sourceId == joint.domId)) {
                    kd(this.domId + " pass force to "+joint.domId, inforce);
                    joint.addForce(this.domId, inforce);
                }
            })
        }
    }
    addGravity() {
        kd(this.domId + " gravity", this.lenght*boneWeight*gravity);
        this.addForce("gravity", [0,this.lenght*boneWeight*gravity]);
    }
}

class Creature {
    constructor() {
        this.joints = [];
        this.bones = [];
        this.muscles = [];
        this.ground = [];
        this.lifetime = 0;
        this.interval = 0.5;
        this.moveing = false;
        this.newJointsGrounded = 0;
    }

    addElement(ev) {
        const startElementId = ev.dataTransfer.getData("text");
        const endElementId = ev.target.id;
        if (startElementId == "samplejoint") {
            let newJoint = new Joint(ev, this.joints.length);
            this.joints.push(newJoint);
            return newJoint.domObj;
        } else if (startElementId.slice(0, 4) == "join") {
            kd("it is a free joint", startElementId);
            const starElement = this.joints[startElementId.slice(4, startElementId.length)];
            if (endElementId == "gameField") {
                kd("end up in game field", endElementId);
                starElement.moveTo(ev.offsetX, ev.offsetY);
            } else if (endElementId.slice(0, 4) == "join") {
                kd("end up in other joint", endElementId);
                const endElement = this.joints[endElementId.slice(4, endElementId.length)];
                let newBone = new Bone(this.bones.length, starElement, endElement);
                starElement.bones.push(newBone);
                endElement.bones.push(newBone);
                this.bones.push(newBone);
            }
        }
    }

    calcForces() {
        kd("add gravity to", this.bones);
        this.bones.forEach(function (bone) {
            bone.addGravity();
        });

        kd("add gravity to", this.joints);
        this.joints.forEach(function (joint) {
            joint.addGravity();
        });

        kd("force from muscle", this.muscles);
        this.muscles.forEach(function (muscle) {
            muscle.actionTime(this.lifetime);
        });
    }

    countTimeInterval() {
        this.interval = 0.5;
        kd("closest time to ground for", this.joints);
        for (let joint of this.joints) {
            let time = joint.countTimeToGround();
            if (time < this.interval) {
                this.interval = time;
            }
        }
        kd("interval is set to ", this.interval);
    }

    showDebugInfo() {

        this.calcForces();

        kd("add gravity to", this.joints);
        this.joints.forEach(function (joint) {
            joint.showForceAndSpeed ();
            joint.resetResultForce ();
        });
    }

    resetForce(){
        this.joints.forEach(function (joint) {
            joint.resetResultForce ();
        });
    }

    step() {
        if (this.newJointsGrounded > 0) {
            for (let joint of this.joints) {
                joint.addForceToStop(this.interval);
            };
        };
        this.newJointsGrounded = 0;
        this.calcForces();
        this.countTimeInterval();
        kd("move all", this.joints);

        for (let joint of this.joints) {
            this.newJointsGrounded += joint.move(this.interval);
        }
    }

    starMove(){
        this.moveing = true;
        this.move();
    }

    move() {
        if (this.moveing) {
            this.step();
            let that = this;
            setTimeout(function () {that.move()}, this.interval);
        } else {
            this.reset()
        }
    }

    stopMove () {
        this.moveing = false;
    }

    reset() {
        this.joints.forEach(function (joint) {
            joint.reset();
        });
    }
}

class Gamefield {

    constructor() {
        this.domObj = document.getElementById("gameField");
        this.creature = new Creature;
}
    startSim(){
        this.creature.starMove();
    }

    stepSim(){
            this.creature.step();
        }

    moreInfo() {
            this.creature.showDebugInfo();
    }

    stopSim(){
        this.creature.stopMove();
    }

    takeElement(ev) {
        kd("dragging", ev.target);
        ev.dataTransfer.setData("text", ev.target.id);
    }
    allowDrop(ev) {
        ev.preventDefault();
    }
    addElement2(ev){
        kd("called from", ev.target);
        kd("adding element to creature from gamefeild", this.creature);
        this.creature.addElement(ev);
    }
}

const game = new Gamefield();