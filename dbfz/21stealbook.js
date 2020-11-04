"use strict";

var dbfz = (function () {

    var frontMoves = [
        "Kamehameha",
        "Consecutive Energy Blast",
        "Explosive Energy Blast",
        "Homing Energy Blast",
    ];

    var backMoves = [
        "Solar Flare",
        "Sticky Energy Blast",
        "Barrier Sphere",
        "Sonic Warp"
    ];

    var moveDamageProration = {
        "Kamehameha": {
            damage: 1098,
            proration: 0.2,
        },
        "Consecutive Energy Blast": {
            damage: 1122,
            proration: 0.2
        },
        "Explosive Energy Blast": {
            damage: 1760,
            proration: 0.4,
        },
        "Homing Energy Blast": {
            damage: 700,
            proration: 0.2
        },
        "Solar Flare": {
            damage: 0,
            proration: 0.02,
            mustStart: true
        },
        "Sticky Energy Blast": {
            damage: 1400,
            proration: 0.3
        }
    }

    var moveChains = {
        "Empty": {},
        "Ground Kamehameha": {
            next: 2
        },
        "Ground Consecutive Energy Blast": {
            next: 3
        },
        "Ground Explosive Energy Blast": {
            next: 3
        },
        "Ground Homing Energy Blast": {
            next: 2
        },
        "Ground Solar Flare": {
            next: 1
        },
        "Ground Sticky Energy Blast": {
            next: 0,
            grab: true,
            whiffNext: true
        },
        "Ground Barrier Sphere": {
            next: 0,
            canComboIfUsed: [
                "Ground Kamehameha",
                "Ground Homing Energy Blast"
            ]
        },
        "Ground Sonic Warp": {
            next: 1,
            canComboIfUsed: [
                "Ground Kamehameha",
                "Ground Homing Energy Blast"
            ],
            teleport: true
        },
        "Aerial Kamehameha": {
            next: 3
        },
        "Aerial Consecutive Energy Blast": {
            next: 3
        },
        "Aerial Explosive Energy Blast": {
            next: 3,
            forceCloseToGround: true
        },
        "Aerial Homing Energy Blast": {
            next: 3
        },
        "Aerial Solar Flare": {
            next: 1
        },
        "Aerial Sticky Energy Blast": {
            next: 1,
            grab: true,
            canWhiffIfUsed: ["Ground Consecutive Energy Blast"]
        },
        "Aerial Barrier Sphere": {
            next: 1,
            canComboIfUsed: [
                "Ground Consecutive Energy Blast",
                "Ground Explosive Energy Blast",
                "Aerial Kamehameha",
                "Aerial Consecutive Energy Blast",
                "Aerial Explosive Energy Blast",
                "Aerial Homing Energy Blast"
            ],
            canComboAfterIfAvailable: [
                "Aerial Consecutive Energy Blast",
                "Aerial Explosive Energy Blast"
            ]
        },
        "Aerial Sonic Warp": {
            next: 0,
            canComboIfUsed: [
                "Ground Consecutive Energy Blast",
                "Ground Explosive Energy Blast",
                "Aerial Kamehameha",
                "Aerial Consecutive Energy Blast",
                "Aerial Explosive Energy Blast",
                "Aerial Homing Energy Blast"
            ],
            canComboAfterIfUsed: [
                "Ground Kamehameha",
                "Ground Consecutive Energy Blast",
                "Ground Explosive Energy Blast",
                "Ground Homing Energy Blast",
                "Aerial Kamehameha",
                "Aerial Consecutive Energy Blast",
                "Aerial Explosive Energy Blast",
                "Aerial Homing Energy Blast"
            ],
            requiresCloseToGround: true,
            teleport: true
        }
    };

    var allRoutes = new Set();

    //Fill All Slots all permutations, find multiple routes for each permutation
    function init() {

        for (let a = -1; a < 4; a++) {
            for (let b = -1; b < 4; b++) {
                for (let c = -1; c < 4; c++) {
                    for (let d = -1; d < 4; d++) {
                        let slots = ["Empty", "Empty", "Empty", "Empty"];
                        slots[0] = "Empty";
                        slots[1] = "Empty";
                        slots[2] = "Empty";
                        slots[3] = "Empty";
                        if (a > -1)
                            slots[0] = "Ground " + frontMoves[a];
                        if (b > -1)
                            slots[1] = "Aerial " + frontMoves[b];
                        if (c > -1)
                            slots[2] = "Ground " + backMoves[c];
                        if (d > -1)
                            slots[3] = "Aerial " + backMoves[d];
                        let routesFromSlots = findRoutes(slots);
                        routesFromSlots.forEach(r => {
                            allRoutes.add(r);
                        });
                    }
                }
            }
        }

        allRoutes = chooseMostOptimal(allRoutes);

        displayAllRoutes();

        let el = document.getElementById("steals");
        let html = "<table class='table'>";
        html += "<tr>";
        html += "<th>Connoisseur Cut (Ground)</th><th>Connoisseur Cut (Mid-air)</th><th>Aerial Connoisseur Cut (Ground)</th><th>Aerial Connoisseur Cut (Mid-air)</th>";
        html += "</tr><tr><td><select id='slot1' class='selectpicker' onchange='dbfz.lookUp()'>";
        html += "<option value='Empty'>Empty</option>";
        frontMoves.forEach(m => {
            html += "<option value='" + m + "'>" + m + "</option>";
        });
        html += "</select></td>";
        html += "<td><select id='slot2' class='selectpicker' onchange='dbfz.lookUp()'>";
        html += "<option value='Empty'>Empty</option>";
        frontMoves.forEach(m => {
            html += "<option value='" + m + "'>" + m + "</option>";
        });
        html += "</select></td>";
        html += "<td><select id='slot3' class='selectpicker' onchange='dbfz.lookUp()'>";
        html += "<option value='Empty'>Empty</option>";
        backMoves.forEach(m => {
            html += "<option value='" + m + "'>" + m + "</option>";
        });
        html += "</select></td>";
        html += "<td><select id='slot4' class='selectpicker' onchange='dbfz.lookUp()'>";
        html += "<option value='Empty'>Empty</option>";
        backMoves.forEach(m => {
            html += "<option value='" + m + "'>" + m + "</option>";
        });
        html += "</select></td></tr>";
        html += "<tr><td id='slot1Icon'></td><td id='slot2Icon'></td><td id='slot3Icon'></td><td id='slot4Icon'></td></tr>"
        html += "</table>";
        el.innerHTML = html;

        lookUp();
    }

    function findRoutes(slots) {

        let route;
        let routes = [];
        let lastMoveSlot;
        let currentSlot;
        let comboLength;
        let copiedSlots = [];
        let grabbed;
        let whiffNext;
        let usedMoves = [];
        let emptyArr = [];
        let lastMove;
        let closeToGround;
        let requiresCloseToGround;

        for (let a = 0; a < 4; a++) {
            route = "";
            comboLength = 0;
            currentSlot = a;
            lastMoveSlot = a;
            grabbed = false;
            whiffNext = false;
            lastMove = false;
            closeToGround = false;
            requiresCloseToGround = false;
            //Arrays in JS are references
            usedMoves = Array.from(emptyArr);
            copiedSlots = Array.from(slots);
            while (comboLength < 5) {
                if (copiedSlots[currentSlot] == "Empty") comboLength = 5;
                if (comboLength > 4) {
                    if (route != "") routes.push(route);
                } else if (canComboIfUsedMet(currentSlot, copiedSlots, usedMoves, whiffNext) && (whiffNext || !grabbed || copiedSlots[currentSlot].grab == undefined)) {
                    if (comboLength != 0) route += " -> ";
                    route += copiedSlots[currentSlot];
                    usedMoves.push(copiedSlots[currentSlot]);
                    if (moveChains[copiedSlots[currentSlot]].forceCloseToGround == true) closeToGround = true;
                    if (moveChains[copiedSlots[currentSlot]].requiresCloseToGround == true) requiresCloseToGround = true;
                    if (requiresCloseToGround && !closeToGround && moveChains[copiedSlots[currentSlot]].teleport != true) {
                        requiresCloseToGround = false;
                        route += " (Enemy is close to the ground) ";
                    }
                    if (whiffNext == true && moveChains[copiedSlots[currentSlot]].grab == true) route += " (Whiff) ";
                    if (moveChains[copiedSlots[currentSlot]].grab == true) grabbed = true;
                    if (moveChains[copiedSlots[currentSlot]].whiffNext == true) whiffNext = true;
                    lastMoveSlot = currentSlot;
                    currentSlot = moveChains[copiedSlots[currentSlot]].next;
                    copiedSlots[lastMoveSlot] = "Empty";
                    if (lastMove == true) currentSlot = lastMoveSlot;
                    if (!canComboAfter(currentSlot, copiedSlots, usedMoves)) lastMove = true;
                } else {
                    if (route != "") routes.push(route);
                    comboLength = 5;
                }
                comboLength++;
            }
        }

        return routes;
    }


    function canComboIfUsedMet(currentSlot, copiedSlots, usedMoves, whiffNext) {
        let found1 = false;
        let found2 = false;
        if (moveChains[copiedSlots[currentSlot]].canWhiffIfUsed != undefined && whiffNext) {
            moveChains[copiedSlots[currentSlot]].canWhiffIfUsed.forEach(required => {
                if (usedMoves.includes(required)) found1 = true; //return here is the return value for the forEach and not the function...
            });
        } else {
            found1 = true;
        }
        if (moveChains[copiedSlots[currentSlot]].canComboIfUsed != undefined) {
            moveChains[copiedSlots[currentSlot]].canComboIfUsed.forEach(required => {
                if (usedMoves.includes(required)) found2 = true; //return here is the return value for the forEach and not the function...
            });
        } else {
            found2 = true;
        }
        return found1 && found2;
    }

    function canComboAfter(currentSlot, copiedSlots, usedMoves) {
        let found1 = false;
        let found2 = false;
        if (moveChains[copiedSlots[currentSlot]].canComboAfterIfUsed != undefined) {
            moveChains[copiedSlots[currentSlot]].canComboAfterIfUsed.forEach(required => {
                if (usedMoves.includes(required)) found1 = true; //return here is the return value for the forEach and not the function...
            });
        } else {
            found1 = true;
        }
        if (moveChains[copiedSlots[currentSlot]].canComboAfterIfAvailable != undefined) {
            moveChains[copiedSlots[currentSlot]].canComboAfterIfAvailable.forEach(required => {
                if (copiedSlots.includes(required)) found2 = true; //return here is the return value for the forEach and not the function...
            });
        } else {
            found2 = true;
        }
        return found1 && found2;
    }

    function lookUp() {
        let slots = ["Empty", "Empty", "Empty", "Empty"];
        let countStr = "";
        for (let a = 1; a < 5; a++) {
            let stateTxt = a % 2 == 1 ? "Ground " : "Aerial ";
            if (document.getElementById("slot" + a).value != "Empty")
                slots[a - 1] = stateTxt + document.getElementById("slot" + a).value;
            document.getElementById("slot" + a + "Icon").innerHTML = "<img src='./images/steals/" + document.getElementById("slot" + a).value.replace(/\s/g, '').replace("Ground", "").replace("Aerial", "") + ".png'>";
        }

        let el = document.getElementById("possibleRoutes");
        let possibleRoutes = chooseMostOptimal(findRoutes(slots));
        if (possibleRoutes.length > 0) countStr = "(" + possibleRoutes.length + ")";
        let html = "<table class='table'>";
        html += "<tr>";
        html += "<th>Possible Routes" + countStr + "</th>";
        html += "</tr>";
        possibleRoutes.forEach(r => {
            html += routeToHTML(r, false);
        });
        html += "</table>"
        el.innerHTML = html;
    }

    function displayAllRoutes() {
        let countStr = "";
        if (allRoutes.length > 0) countStr = "(" + allRoutes.length + ")";
        let el = document.getElementById("allRoutes");
        let html = "<table class='table'>";
        html += "<tr>";
        html += "<th>All Routes" + countStr + "</th>";
        html += "</tr>";
        allRoutes.forEach(r => {
            html += routeToHTML(r, true);
        });
        html += "</table>"
        el.innerHTML = html;
        el.style.display = "none";
    }

    function toggleAllRoutes() {
        var el = document.getElementById("allRoutes");
        if (el.style.display === "none") {
            el.style.display = "block";
        } else {
            el.style.display = "none";
        }
    }

    function routeToHTML(moves, small) {
        let cssClass = !small ? "stealRouteIcon" : "stealAllRouteIcon";
        let movesArray = moves.split(" -> ");
        let movesHTML = "<tr><td>";
        let whiffStr = "";
        let closeToGroundStr = "";
        movesArray.forEach(m => {
            if (m.includes("(Whiff)")) {
                whiffStr = " (Whiff) ";
            } else {
                whiffStr = " ";
            }
            if (m.includes("(Enemy is close to the ground)")) {
                closeToGroundStr = " (Enemy is close to the ground) ";
            } else {
                closeToGroundStr = " ";
            }
            movesHTML += m.substring(0, 6) + whiffStr + closeToGroundStr + " <img class='" + cssClass + "' src='./images/steals/" + m.replace("(Enemy is close to the ground)", "").replace("Ground", "").replace("Aerial", "").replace("(Whiff)", "").replace(/\s/g, "") + ".png'>";

        });
        movesHTML += " Aproximate Damage: " + getDamage(moves) + "</td></tr>";
        return movesHTML;
    }


    function chooseMostOptimal(routes) {
        let orderedRoutes = Array.from(routes)
        orderedRoutes.sort(function (a, b) {
            return getDamage(b) - getDamage(a);
        });
        return orderedRoutes;
    }

    function getDamage(route) {
        let moves = route.split(" -> ");
        let damage = 0;
        let proration = 1;
        let currentMove;
        let firstMove = true;
        moves.forEach(m => {
            currentMove = m.replace(/ *\([^)]*\) */g, "").replace(/Enemy\sis\sclose\sto\sthe\sground\s/g, "").replace(/Ground\s/g, "").replace(/Aerial\s/g, "");
            if (moveDamageProration[currentMove] != undefined) {
                damage += proration * moveDamageProration[currentMove].damage;
                if ((firstMove && moveDamageProration[currentMove].mustStart == true) || moveDamageProration[currentMove].mustStart == undefined) proration -= moveDamageProration[currentMove].proration;
                proration = Math.max(proration, 0.1);
                firstMove = false;
            }
        });
        return Math.ceil(damage);
    }

    return {
        init: init,
        lookUp: lookUp,
        toggleAllRoutes: toggleAllRoutes
    };

})();

dbfz.init();
