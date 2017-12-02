function kd(text,smth) {
    console.debug(text);
    console.debug(smth);
}
const jointWith = 30;

const jointHeight = 30;
const boneLenght = 30;
const gravity = 0.01;                      //velocity of px/gameSpeed**2 per px of bone length
const friction = 1;
const groundLevel = 600;
const jointWeight = 200;
const gameSpeed = 50;                 //delay in ms between frames
const minForceToRound = gravity;

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

        this.bones = [];

        this.speed = [0,0];
        this.resultForce = [0,0];

        this.domId = "join" + number.toString();

        this.domObj = document.createElement('div');
        this.domObj.classList.add("joint");
        this.domObj.style.top = (this.initialY).toString() + "px";
        this.domObj.style.left = (this.initialX).toString() + "px";
        this.domObj.id = this.domId;
        this.domObj.textContent = this.domId;
        this.domObj.ondragstart = function(event) {
            kd("dragged", this);
            game.takeElement(event)};
        this.domObj.ondragover = function(event) {game.allowDrop(event)};
        //this.domObj.ondrop = function(event) {
            //kd("dropped", this);
            //game.addElement1(event)};
        this.domObj.draggable="true";
        ev.target.appendChild(this.domObj);
    }

    moveTo(x,y) {
        kd("moveto " + this.domId, [x,y]);
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

    move() {
        this.speed[0] += this.resultForce[0];
        this.speed[1] += this.resultForce[1];
        this.currentX += this.speed[0];


        if (this.currentY+this.speed[1] < groundLevel) {                      //BIG BAD PLUG!
            this.currentY += this.speed[1];
            this.grounded = false;
        } else {
            this.currentY = groundLevel;
            this.grounded = true;
        }


        kd("move " + this.domId, [this.currentX,this.currentY]);

        this.domObj.style.top = (this.currentY).toString() + "px";
        this.domObj.style.left = (this.currentX).toString() + "px";

        this.bones.forEach(function (bone) {
            bone.move()
        });

        this.resultForce = [0,0];
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
    })};

    addForce(sourceId, force, passlist) {
        passlist.push(this.domId);
        let inforce = force;
        if ((Math.abs(inforce[0])>minForceToRound) || (Math.abs(inforce[1])>minForceToRound)) {
            if (Math.abs(inforce[0])<minForceToRound) {inforce[0]=0};
            if (Math.abs(inforce[1])<minForceToRound) {inforce[1]=0};
            kd(this.domId + " got force from " + sourceId, inforce);
            this.resultForce[0] += inforce[0];
            this.resultForce[1] += inforce[1];
            kd(this.domId + " result force is", this.resultForce);
            this.bones.forEach((bone)=>{
                if (!(passlist.includes(bone.domId))) {
                    kd(this.domId + " pass force to " + bone.domId, inforce);
                    bone.addForce(this.domId, projectForce(inforce, bone.angle), passlist);
                }
            })
        }

    }

    addGravity() {
        kd(this.domId + " gravity", jointWeight*gravity);
        this.addForce("gravity", [0,jointWeight*gravity], []);
    }

    pushGround() {
        if (this.grounded) {
        let frictionForce = 0;
        if (this.grounded && this.resultForce[1]>0) {
            kd("joint " + this.domId + " is grounded", this.currentY);
            if (Math.abs(this.resultForce[0]) > Math.abs(this.speed[0])) {
                if (Math.abs(this.resultForce[0]) > this.resultForce[1]*friction) {
                    if (this.resultForce[0]<0) {
                        frictionForce = this.resultForce[1]*friction;
                    } else {
                        frictionForce = -this.resultForce[1]*friction;
                    }
                } else {
                    frictionForce = -this.resultForce[0];
                }
            } else {
                if (Math.abs(this.speed[0])>this.resultForce[1]*friction) {
                    if (this.speed[0]<0) {
                        frictionForce = this.resultForce[1]*friction;
                    } else {
                        frictionForce = -this.resultForce[1]*friction;
                    }
                } else {
                    frictionForce = -this.speed[0];
                }
            }
        }
            this.addForce("ground", [frictionForce, -this.resultForce[1]-this.speed[1]],[]);
    };
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
        this.domObj.textContent = this.domId;
        this.domObj.ondragstart = function(event) {game.takeElement(event)};
        this.domObj.ondragover = function(event) {game.allowDrop(event)};
        this.domObj.ondrop = function(event) {game.addElement(event)};
        this.domObj.draggable="true";
        game.domObj.appendChild(this.domObj);
        this.move();
}
    move() {
        kd("move bone", this.domId);
        this.lenght = Math.sqrt(Math.pow((this.joints[0].currentY-this.joints[1].currentY) ,2) + Math.pow((this.joints[0].currentX-this.joints[1].currentX),2));
        this.angle = Math.atan((this.joints[0].currentY-this.joints[1].currentY)/(this.joints[0].currentX-this.joints[1].currentX))*57.29;
        if ((this.joints[0].currentX-this.joints[1].currentX)>0) {this.angle -= 180;}

        this.domObj.style.MozTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";
        this.domObj.style.WebkitTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";
        this.domObj.style.OTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";
        this.domObj.style.MsTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";
        this.domObj.style.transform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";
        kd("bone position","rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")");

        this.domObj.style.top = (this.joints[0].currentY+jointHeight/2).toString() + "px";
        this.domObj.style.left = (this.joints[0].currentX+jointWith/2).toString() + "px";
    }

    addForce(sourceId, force, passlist) {
        passlist.push(this.domId);
        let inforce = force;
        if ((Math.abs(inforce[0])>minForceToRound) || (Math.abs(inforce[1])>minForceToRound)) {
            if (Math.abs(inforce[0])<minForceToRound) {inforce[0]=0};
            if (Math.abs(inforce[1])<minForceToRound) {inforce[1]=0};
            kd(this.domId + " got force from " + sourceId, inforce);
            this.joints.forEach((joint)=>{
                if (!(passlist.includes(joint.domId))) {
                    kd(this.domId + " pass force to "+joint.domId, inforce);
                    joint.addForce(this.domId, inforce, passlist);
                }
            })
        }
    }
    addGravity() {
        kd(this.domId + " gravity", this.lenght*gravity);
        this.addForce("gravity", [0,this.lenght*gravity], []);
    }
}

class Creature {
    constructor() {
        this.joints = [];
        this.bones = [];
        this.muscles = [];
        this.ground = [];
    }

    addElement(ev) {
       const startElementId = ev.dataTransfer.getData("text");
       const endElementId = ev.target.id;
       if (startElementId == "samplejoint") {
           let newJoint = new Joint(ev, this.joints.length);
           this.joints.push(newJoint);
           return newJoint.domObj;
       } else if (startElementId.slice(0,4) == "join") {
           kd("it is a free joint", startElementId);
           const starElement = this.joints[startElementId.slice(4,startElementId.length)];
           if (endElementId == "gameField") {
               kd("end up in game field", endElementId);
               starElement.moveTo(ev.offsetX,ev.offsetY);
           } else if (endElementId.slice(0,4) == "join") {
               kd("end up in other joint", endElementId);
               const endElement = this.joints[endElementId.slice(4,endElementId.length)];
               let newBone = new Bone(this.bones.length, starElement, endElement);
               starElement.bones.push(newBone);
               endElement.bones.push(newBone);
               this.bones.push(newBone);
           }
       }
    }
    move() {
        kd("add gravity to", this.bones);
        this.bones.forEach(function (bone) {
            bone.addGravity();
        });

        kd("add gravity to", this.joints);
        this.joints.forEach(function (joint) {
            joint.addGravity();
        });

        //this.muscles.forEach(function (item) {
            //item.countDown();
        //});

        kd("add ground", this.joints);
        this.joints.forEach(function (joint) {
            joint.pushGround();
        });

        kd("move all", this.joints);
        this.joints.forEach(function (joint) {
            joint.move();
        });
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
        kd("simulating", this);
        this.moveingCreature = setInterval(() => {this.creature.move()},gameSpeed)
    }

    stopSim(){
        clearInterval(this.moveingCreature);
        this.creature.reset();
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