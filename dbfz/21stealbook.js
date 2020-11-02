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
            state: "Ground"
        },
        "Ground Consecutive Energy Blast": {
            state: "Aerial"
        },
        "Ground Explosive Energy Blast": {
            state: "Aerial"
        },
        "Ground Homing Energy Blast": {
            state: "Ground"
        },
        "Ground Solar Flare": {
            state: "Aerial"
        },
        "Ground Sticky Energy Blast": {
            state: "Ground",
            whiffNext: true
        },
        "Ground Barrier Sphere": {
            state: "Ground",
            conditions: [
                "Ground Consecutive Energy Blast",
                "Ground Explosive Energy Blast"
            ]
        },
        "Ground Sonic Warp": {
            state: "Aerial",
            conditions: [
                "Ground Kamehameha",
                "Ground Homing Energy Blast"
            ]
        },
        "Aerial Kamehameha": {
            state: "Aerial"
        },
        "Aerial Consecutive Energy Blast": {
            state: "Aerial",
            allowWhiff: true
        },
        "Aerial Explosive Energy Blast": {
            state: "Aerial"
        },
        "Aerial Homing Energy Blast": {
            state: "Aerial"
        },
        "Aerial Solar Flare": {
            state: "Aerial"
        },
        "Aerial Sticky Energy Blast": {
            state: "Aerial",
            once: true
        },
        "Aerial Barrier Sphere": {
            state: "Aerial",
            conditions: [
                "Ground Consecutive Energy Blast",
                "Ground Explosive Energy Blast",
                "Aerial Kamehameha",
                "Aerial Consecutive Energy Blast",
                "Aerial Explosive Energy Blast",
                "Aerial Homing Energy Blast"
            ]
        },
        "Aerial Sonic Warp": {
            state: "Ground",
            conditions: [
                "Ground Kamehameha",
                "Ground Homing Energy Blast",
                "Aerial Explosive Energy Blast"
            ]
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

        for (let a = 0; a < 4; a++) {
            route = "";
            comboLength = 0;
            currentSlot = a;
            lastMoveSlot = a;
            grabbed = false;
            whiffNext = false;
            //Arrays in JS are references
            usedMoves = Array.from(emptyArr);
            copiedSlots = Array.from(slots);
            while (comboLength < 5) {
                if (copiedSlots[currentSlot] == "Empty") comboLength = 5;
                if (comboLength > 4) {
                    if (route != "") routes.push(route);
                } else if ((!grabbed || moveChains[copiedSlots[currentSlot]].once != true) && conditionsMet(usedMoves, copiedSlots[currentSlot]) && ((!whiffNext || moveChains[copiedSlots[currentSlot]].allowWhiff == true))) {
                    if (comboLength != 0) route += " -> ";
                    route += copiedSlots[currentSlot];
                    usedMoves.push(copiedSlots[currentSlot]);
                    if (whiffNext == true && moveChains[copiedSlots[currentSlot]].once == true) route += " (Whiff) ";
                    if (moveChains[copiedSlots[currentSlot]].once == true) grabbed = true;
                    if (moveChains[copiedSlots[currentSlot]].whiffNext == true) whiffNext = true;
                    lastMoveSlot = currentSlot;
                    currentSlot = getNextSlot(currentSlot, moveChains[copiedSlots[currentSlot]].state);
                    copiedSlots[lastMoveSlot] = "Empty";
                } else {
                    if (route != "") routes.push(route);
                    comboLength = 5;
                }
                comboLength++;
            }
        }

        return routes;
    }


    function conditionsMet(usedMoves, move) {
        let found = false;
        if (moveChains[move].conditions == undefined) return true;
        moveChains[move].conditions.forEach(required => {
            if (usedMoves.includes(required)) found = true; //return here is the return value for the forEach and not the function...
        });
        return found;
    }

    function getNextSlot(currentSlot, state) {
        if ((currentSlot == 0 || currentSlot == 1) && state == "Ground") return 2;
        if ((currentSlot == 2 || currentSlot == 3) && state == "Ground") return 0;
        if ((currentSlot == 0 || currentSlot == 1) && state == "Aerial") return 3;
        if ((currentSlot == 2 || currentSlot == 3) && state == "Aerial") return 1;
    }

    function lookUp() {
        let slots = ["Empty", "Empty", "Empty", "Empty"];

        for (let a = 1; a < 5; a++) {
            let stateTxt = a % 2 == 1 ? "Ground " : "Aerial ";
            if (document.getElementById("slot" + a).value != "Empty")
                slots[a - 1] = stateTxt + document.getElementById("slot" + a).value;
            document.getElementById("slot" + a + "Icon").innerHTML = "<img src='./images/steals/" + document.getElementById("slot" + a).value.replace(/\s/g, '').replace("Ground", "").replace("Aerial", "") + ".png'>";
        }

        let el = document.getElementById("possibleRoutes");
        let possibleRoutes = chooseMostOptimal(findRoutes(slots));
        let html = "<table class='table'>";
        html += "<tr>";
        html += "<th>Possible Routes</th>";
        html += "</tr>";
        possibleRoutes.forEach(r => {
            html += routeToHTML(r, false);
        });
        html += "</table>"
        el.innerHTML = html;
    }

    function displayAllRoutes() {
        let el = document.getElementById("allRoutes");
        let html = "<table class='table'>";
        html += "<tr>";
        html += "<th>All Routes</th>";
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
        let whiffStr;
        movesArray.forEach(m => {
            if (m.includes("(Whiff)")) {
                whiffStr = " (Whiff) ";
            } else {
                whiffStr = " ";
            }
            movesHTML += m.substring(0, 6) + whiffStr + " <img class='" + cssClass + "' src='./images/steals/" + m.replace(/\s/g, "").replace("Ground", "").replace("Aerial", "").replace("(Whiff)", "") + ".png'>";

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
            currentMove = m.replace(/Ground\s/g, "").replace(/Aerial\s/g, "");
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
