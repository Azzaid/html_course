function kd(text,smth) {
    console.debug(text);
    console.debug(smth);
}


const jointWith = 30;
const jointHeight = 30;
const boneLenght = 30;
const actuatorLenght =30;
const gravity = 1;
const friction = 1;
const groundLevel = 600;
const jointWeight = 25;
const boneWeight = 0.3;                 //weight per pixel of length
const gameSpeed = 0.5;                 //delay in ms between frames
const minForceToRound = 2;
const actuatorMaxForce = 300;
const boneSpringiness = 2;
const frictionForce = 200;
const debugMode = true;


function createVectorFromXY (projectionXY) {
    return ([Math.sqrt(Math.pow(projectionXY[0],2) + Math.pow(projectionXY[1],2)), Math.atan(projectionXY[1]/projectionXY[0])*57.29])
}

function createXYFromVector (vector) {
    return ([vector[0]*Math.cos(vector[1]/57.29), vector[0]*Math.sin(vector[1]/57.29)])
}

function projectVectorOnAngle (vector, angle) {
    let projectedVector = [vector[0]*Math.cos((vector[1] - angle)/57.29), angle];
    return (projectedVector)
}

function getAngleBetweenDots(dot1,dot2) {
    let x = dot2[0] - dot1[0] + 1;
    let y = dot2[1] - dot1[1] + 1;
    let angle = Math.atan(y/x)*57.29;
    if (x<0) {angle = ((-1) * Math.sign(angle) * 180) + angle};
    return angle;
}

class Joint {

    constructor(ev, number) {
        this.initialX = ev.offsetX;
        this.initialY = ev.offsetY;

        this.currentX = this.initialX;
        this.currentY = this.initialY;

        this.grounded = false;
        this.fallTime = gameSpeed;

        this.bones = [];

        this.connectedBoneAndJointPares=[];

        this.speed = [0, 0];
        this.precalcedSpeed = [0,0];
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
        kd("move to " + this.domId, [x, y]);
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
            this.fallTime = gameSpeed;
        }
        kd("time to fall", this.fallTime);
        return (this.fallTime)
    }

    precalcSpeed() {

        this.precalcedSpeed = this.speed;

        kd(this.domId + " current speed is", this.speed);
        kd(this.domId + " force without bone springiness is", this.resultForce);

        this.precalcedSpeed[0] += (this.resultForce[0])/2;
        this.precalcedSpeed[1] += (this.resultForce[1])/2;

        kd(this.domId + " result speed will be ", this.precalcedSpeed);
    }

    move(timeFactor) {
        kd(this.domId + " move from ", [this.currentX, this.currentY]);
        kd(this.domId + " speedX " + this.speed[1] + " force " + this.resultForce[1] + " TIME IS " + timeFactor);

        this.speed[0] += (this.resultForce[0]*timeFactor)/2;
        this.speed[1] += (this.resultForce[1]*timeFactor)/2;

        if ((this.currentY + (this.speed[1] * timeFactor) + 5) >= groundLevel) {
            this.speed=[0,0];
            this.currentY = groundLevel;
            if (this.grounded){
                if (Math.abs(this.resultForce[0]) > frictionForce) {
                    this.currentX += ((this.resultForce[0] - Math.sign(this.resultForce[0])*frictionForce)*timeFactor)/2
                }
            } else {
                this.currentX += this.speed[0] * timeFactor;
                this.grounded = true;
                this.domObj.classList.add("joint__grounded");
            }
        } else {
            this.grounded = false;
            this.currentX += this.speed[0] * timeFactor;
            this.currentY += this.speed[1] * timeFactor;
            this.domObj.classList.remove("joint__grounded");
        }



        kd(this.domId + " RESULT speedX " + this.speed[1]);
        kd(this.domId + " move to", [this.currentX, this.currentY]);
        this.domObj.style.transition = timeFactor + "s";
        this.domObj.style.top = (this.currentY).toString() + "px";
        this.domObj.style.left = (this.currentX).toString() + "px";

        this.connectedBoneAndJointPares.forEach(function (boneJointPair) {
            boneJointPair[0].move(timeFactor)
        });

        this.resultForce = [0, 0];
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
                inforce[0] = 0};
            if (Math.abs(inforce[1]) < minForceToRound) {
                inforce[1] = 0};
            kd(this.domId + " got force from " + sourceId, inforce);

            this.resultForce[0] += inforce[0];
            this.resultForce[1] += inforce[1];

            kd(this.domId + " result force is", this.resultForce);

            this.connectedBoneAndJointPares.forEach((boneJointPair) => {
                if (!(sourceId == boneJointPair[0].domId) && !(sourceId == boneJointPair[1].domId)) {
                    kd(this.domId + " pass force to " + boneJointPair[1].domId, inforce);
                    boneJointPair[1].addForce(this.domId, createXYFromVector(projectVectorOnAngle(createVectorFromXY(inforce), getAngleBetweenDots([this.currentX,this.currentY],[boneJointPair[1].currentX,boneJointPair[1].currentY]))));
                }
            })
        }

    }

    addGravity() {
        kd(this.domId + " gravity", jointWeight * gravity);
        this.addForce("gravity", [0, jointWeight * gravity]);
    }

    addGroundReaction() {
        if (this.grounded && this.resultForce[1] > 0) {

            let groundReactionForce = [0, 0];

                groundReactionForce[1] = -this.resultForce[1];

            if (Math.abs(this.resultForce[0]) > this.resultForce[1] * friction) {
                groundReactionForce[0] = -Math.sign(this.resultForce[0]) * this.resultForce[1] * friction;
                this.frictionForceLeft = 0;
            } else {
                groundReactionForce[0] = -this.resultForce[0];
                this.frictionForceLeft = (Math.sign(this.resultForce[0]) * this.resultForce[1] * friction) - this.resultForce[0];
                this.frictionForceDirection = -Math.sign(this.resultForce[0]);
                kd(this.domId + " left friction " + this.frictionForceLeft + " pointed to " + this.frictionForceDirection)
            }

            kd(this.domId + " got ground reaction ", groundReactionForce);

            this.addForce("ground", groundReactionForce);
        }
    }

    addForceToStop(timeFactor) {
        if (this.freshlyGroundedFlag == 1) {
            kd(this.domId + " speed was ", this.speed);
            kd(this.domId + " vertically stopped by ", [0,-this.speed[1]/timeFactor]);
            this.addForce("ground", [0,-this.speed[1]/timeFactor])
        }
    }
}




class Bone {
    constructor(number, joint1, joint2) {

        this.joints = [joint1,joint2];
        this.actuators = [];
        this.domId = "bone" + number.toString();
        kd(this.domId + " joints is ", this.joints);

        this.domObj = document.createElement('div');

        this.domObj.classList.add("bone");
        this.domObj.id = this.domId;
        //this.domObj.textContent = this.domId;
        this.domObj.ondragstart = function(event) {game.takeElement(event)};
        this.domObj.ondragover = function(event) {game.allowDrop(event)};
        this.domObj.draggable="true";
        game.domObj.appendChild(this.domObj);
        this.initialLenght = Math.sqrt(Math.pow((this.joints[0].currentY-this.joints[1].currentY) ,2) + Math.pow((this.joints[0].currentX-this.joints[1].currentX),2));
        this.move();
}
    move(timeFactor) {
        kd("move bone", this.domId);
        this.middleX = this.joints[0].currentX + (this.joints[1].currentX-this.joints[0].currentX)/2;
        this.middleY = this.joints[0].currentY + (this.joints[1].currentY-this.joints[0].currentY)/2;
        this.lenght = Math.sqrt(Math.pow((this.joints[0].currentY-this.joints[1].currentY) ,2) + Math.pow((this.joints[0].currentX-this.joints[1].currentX),2));
        this.angle = getAngleBetweenDots([this.joints[0].currentX,this.joints[0].currentY],[this.joints[1].currentX,this.joints[1].currentY]);

        this.domObj.style.transition = timeFactor + "s";

        this.domObj.style.MozTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";
        this.domObj.style.WebkitTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";
        this.domObj.style.OTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";
        this.domObj.style.MsTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";
        this.domObj.style.transform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/boneLenght).toString() + ")";

        kd("bone position","rotate(" + this.angle + "deg) scaleX(" + (this.lenght/boneLenght) + ")");

        this.domObj.style.top = (this.joints[0].currentY+jointHeight/2).toString() + "px";
        this.domObj.style.left = (this.joints[0].currentX+jointWith/2).toString() + "px";

        this.actuators.forEach(function (actuator) {
            actuator.move(timeFactor)
        });
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

    addBoneSpringiness () {

        let joint0SpeeedProjection = projectVectorOnAngle(createVectorFromXY(this.joints[0].precalcedSpeed), this.angle);
        let joint1SpeeedProjection = projectVectorOnAngle(createVectorFromXY(this.joints[1].precalcedSpeed), this.angle+180);

        let springinessForce = (joint0SpeeedProjection[0]+joint1SpeeedProjection[0])*boneSpringiness;

        if (springinessForce !== 0) {
            if (( this.joints[0].grounded && !this.joints[1].grounded ) || ( !this.joints[0].grounded && this.joints[1].grounded )) {
                if (this.joints[0].grounded) {
                    this.joints[1].addForce(this.domId, createXYFromVector([-springinessForce*2,this.angle]));
                } else {
                    this.joints[0].addForce(this.domId, createXYFromVector([-springinessForce*2,this.angle]));
                }
            } else {
                this.joints[0].addForce(this.domId, createXYFromVector([springinessForce,this.angle]));
                this.joints[1].addForce(this.domId, createXYFromVector([springinessForce,this.angle+180]));
            }
        }
    }
}




class Actuator {

    constructor (number, bone1, bone2) {
        this.bones = [bone1, bone2];

        this.domId = "actuator" + number.toString();

        kd(this.domId + " bones is ", this.bones);

        this.domObj = document.createElement('div');

        this.domObj.classList.add("actuator");
        this.domObj.id = this.domId;
        //this.domObj.textContent = this.domId;
        this.domObj.ondragstart = function(event) {game.takeElement(event)};
        this.domObj.ondragover = function(event) {game.allowDrop(event)};
        this.domObj.draggable="true";
        game.domObj.appendChild(this.domObj);

        this.actuatorsToolBar = document.getElementById("actuatorsToolBar");
        this.domProgrammBox = document.createElement("div");
        this.domProgrammBox.textContent = this.domId;
        this.actuatorsToolBar.appendChild(this.domProgrammBox);

        this.stepProgramBars = [];

        this.steps = [];

        this.addStepProgramBar();

        this.move();
    }

    addStepProgramBar () {
        this.domStepProgrammBar = document.createElement("div");
        this.domStepProgrammBar.textContent = "Step " + this.stepProgramBars.length;
        this.domProgrammBox.appendChild(this.domStepProgrammBar);

        this.domForceSlider = document.createElement('input');
        this.domForceSlider.type="range";
        this.domForceSlider.min=(-actuatorMaxForce).toString();
        this.domForceSlider.max=actuatorMaxForce.toString();
        this.domForceSlider.value="0";
        this.domForceSlider.step = 2;
        this.domForceSlider.classList.add("actuator_force_slider");
        this.domProgrammBox.appendChild(this.domForceSlider);

        this.domStartTimeField = document.createElement('input');
        this.domStartTimeField.type="textarea";
        this.domStartTimeField.title = "start time";
        this.domProgrammBox.appendChild(this.domStartTimeField);

        this.domStopTimeField = document.createElement('input');
        this.domStopTimeField.type="textarea";
        this.domStopTimeField.title = "stop time";
        this.domProgrammBox.appendChild(this.domStopTimeField);

        this.stepProgramBars.push([this.domForceSlider, this.domStartTimeField, this.domStopTimeField]);
    }

    createProgram () {
        this.stepProgramBars.forEach(function (bar) {
            this.steps.push([bar[0].value,bar[1].value,bar[2].value])
        })
    }

    move(timeFactor) {
        kd("move actuator", this.domId);
        this.lenght = Math.sqrt(Math.pow((this.bones[0].middleY-this.bones[1].middleY) ,2) + Math.pow((this.bones[0].middleX-this.bones[1].middleX),2));
        this.angle = Math.atan((this.bones[0].middleY-this.bones[1].middleY)/(this.bones[0].middleX-this.bones[1].middleX))*57.29;
        if ((this.bones[0].middleX-this.bones[1].middleX)>0) {this.angle -= 180;}

        this.domObj.style.transition = timeFactor + "s";

        this.domObj.style.MozTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/actuatorLenght).toString() + ")";
        this.domObj.style.WebkitTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/actuatorLenght).toString() + ")";
        this.domObj.style.OTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/actuatorLenght).toString() + ")";
        this.domObj.style.MsTransform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/actuatorLenght).toString() + ")";
        this.domObj.style.transform = "rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/actuatorLenght).toString() + ")";

        kd("bone position","rotate(" + this.angle.toString() + "deg) scaleX(" + (this.lenght/actuatorLenght).toString() + ")");

        this.domObj.style.top = (this.bones[0].middleY).toString() + "px";
        this.domObj.style.left = (this.bones[0].middleX).toString() + "px";
    }

    act(time) {
        this.actuatorCurrentForce = 0;
        for (step of this.steps) {
            if (step[1]<=time && step[2]>=time) {
                this.actuatorCurrentForce = step[0];
            }
        }
        if (this.actuatorCurrentForce !== 0) {
            this.bones[0].addForce(this.domId, createXYFromVector([-this.actuatorCurrentForce,this.angle]));
            this.bones[1].addForce(this.domId, createXYFromVector([this.actuatorCurrentForce,this.angle]));
        }
    }
}




class Creature {
    constructor() {
        this.joints = [];
        this.bones = [];
        this.actuators = [];
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
                starElement.connectedBoneAndJointPares.push([newBone, endElement]);
                endElement.connectedBoneAndJointPares.push([newBone, starElement]);
                this.bones.push(newBone);
            }
        } else if (startElementId.slice(0, 4) == "bone") {
            kd(" it is a bone ", startElementId);
            const starElement = this.bones[startElementId.slice(4, startElementId.length)];
            if (endElementId.slice(0, 4) == "bone") {
                kd("end up in other bone", endElementId);
                const endElement = this.bones[endElementId.slice(4, endElementId.length)];
                let newActuator = new Actuator(this.actuators.length, starElement, endElement);
                starElement.actuators.push(newActuator);
                endElement.actuators.push(newActuator);
                this.actuators.push(newActuator);
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
        this.actuators.forEach(function (actuator) {
            actuator.addForce(this.lifetime);
        });

        kd("predict movement of ", this.joints);
        this.joints.forEach(function (joint) {
            joint.precalcSpeed();
        });

        kd("add springiness of ", this.bones);
        this.bones.forEach(function (bone) {
            bone.addBoneSpringiness();
        });

        //kd("add ground reaction", this.joints);
        //this.joints.forEach(function (joint) {
            //joint.addGroundReaction();
        //});
    }

    countTimeInterval() {
        this.interval = gameSpeed;
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

        kd(" show forces for ", this.joints);

        this.calcForces();

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


        this.calcForces();

        this.countTimeInterval();

        kd("move all", this.joints);
        for (let joint of this.joints) {
            joint.move(this.interval);
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