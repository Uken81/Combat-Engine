//check if need to keep this.
const player1StatsDisplay = document.querySelectorAll('.player1-stats');

//Character Objects, move to seperate sheet??????
const characters = {
    characterSam: {
        name: 'Sam',
        attack: 18,
        defense: 8,
        hitPoints: 12,
        damageModifier: 1,
        speed: 10,
        isStunned: 0
        //     attack: () => {

        //     }
    },
    characterBob: {
        name: 'Bob',
        attack: 10,
        defense: 8,
        hitPoints: 12,
        damageModifier: 1,
        speed: 10,
        isStunned: 0
    },
    characterZac: {
        name: 'Zac',
        attack: 10,
        defense: 8,
        hitPoints: 12,
        damageModifier: 1,
        speed: 10,
        isStunned: 0
    },
    characterDom: {
        name: 'Dom',
        attack: 10,
        defense: 8,
        hitPoints: 12,
        damageModifier: 1,
        speed: 10,
        isStunned: 0
    },
    characterDave: {
        name: 'Dave',
        attack: 10,
        defense: 8,
        hitPoints: 12,
        damageModifier: 1,
        speed: 10,
        isStunned: 0
    }
}

//functions which display/removes selected buttons or elements.
function removeElement(element) {
    element.style.display = 'none';
}

function displayElement(element) {
    element.style.display = '';
}

//Standard attack buttons.
const attackButton1 = document.getElementById('player1-attack-button');
const attackButton2 = document.getElementById('player2-attack-button');
//Maneuver buttons
const maneuverButtons1 = document.querySelectorAll('.maneuvers1');
const maneuverButtons2 = document.querySelectorAll('.maneuvers2');

function removeAllAttackAndManeuverButtons() {
    removeElement(attackButton1);
    removeElement(attackButton2);
    maneuverButtons1.forEach(removeElement);
    maneuverButtons2.forEach(removeElement);
}

function displayAllAttackAndManeuverButtons() {
    displayElement(attackButton1);
    displayElement(attackButton2);
    maneuverButtons1.forEach(displayElement);
    maneuverButtons2.forEach(displayElement);
}
//<<<<<Begin number of players selection phase>>>>>
//sets only number of players selection to be displayed on loading of page. called at onload().

const selectNumberOfPlayersButtons = document.querySelectorAll('.select-number-of-players');
const characterSelectionButtonsAll = document.querySelectorAll('.character-selection');
const combatDisplay = document.querySelectorAll('.combat-display');

function displayOnlyNumberOfPlayersSelection() {
    selectNumberOfPlayersButtons.forEach(displayElement);
    characterSelectionButtonsAll.forEach(removeElement);
    combatDisplay.forEach(removeElement);
}

//Displays buttons at begining of match to select if game is solo or local multiplayer.

//Player selection buttons.
const playerOneSelectionDisplay = document.querySelectorAll('.player-one-choose-fighter-display');
const playerTwoSelectionDisplay = document.querySelectorAll('.player-two-choose-fighter-display');

document.getElementById('choose-single-player').addEventListener('click', function () {
    selectNumberOfPlayersButtons.forEach(removeElement);
    characterSelectionButtonsAll.forEach(displayElement);
    playerOneSelectionDisplay.forEach(displayElement);
    playerTwoSelectionDisplay.forEach(removeElement);
});

let isGameMultiPlayer = false;
document.getElementById('choose-multi-player').addEventListener('click', function () {
    isGameMultiPlayer = true;
    selectNumberOfPlayersButtons.forEach(removeElement);
    characterSelectionButtonsAll.forEach(displayElement);
    removeAllAttackAndManeuverButtons();
    console.log('multiplayer game selected');
});
//<<<<<End number of players selection phase>>>>>

//<<<<<Beging character selection phase>>>>>
//Places info under relevant player stats section on page. 
function insertPlayerInfo(placement, player) {
    document.getElementById(`${placement}-name`).innerHTML = `Name: ${player.name}`;
    document.getElementById(`${placement}-attack`).innerHTML = `Attack: ${player.attack}`;
    document.getElementById(`${placement}-defense`).innerHTML = `Defense: ${player.defense}`;
    document.getElementById(`${placement}-speed`).innerHTML = `Speed: ${player.speed}`;
    document.getElementById(`${placement}-hp`).innerHTML = `HP: ${player.hitPoints}`;
}

//When single-player chooses character this will randomly select an opponent.    
function decideRandomPLayer2() {
    const randomPlayerRoll = Math.floor(Math.random() * 5);

    switch (randomPlayerRoll) {
        case 0:
            player2 = characters.characterSam;
            break;
        case 1:
            player2 = characters.characterBob;
            break;
        case 2:
            player2 = characters.characterZac;
            break;
        case 3:
            player2 = characters.characterDom;
            break;
        case 4:
            player2 = characters.characterDave;
            break;
    }
    console.log('p2 is ' + player2.name);
}

// Incase random choice is same as Player1
function replaceDuplicateCharacterChoice() {
    if (player1 === player2) {
        console.log('copy');
        decideRandomPLayer2();
    }
}
//The following two functions set up character selection phase for either single or multiplayer mode.
let player1;
let player2;
function singlePlayerSetup() {
    combatDisplay.forEach(displayElement);
    insertPlayerInfo("player1", player1);
    decideRandomPLayer2();
    replaceDuplicateCharacterChoice();
    insertPlayerInfo("player2", player2);
    determineWhoAttacksFirst();
    characterSelectionButtonsAll.forEach(removeElement);
    console.log('<<<<<Begin Combat>>>>>');
}

function multiPlayerSetup() {
    insertPlayerInfo("player1", player1);
    combatDisplay.forEach(displayElement);
}
//The following event listeners submit the selected characters and display their stats.
document.getElementById('submit-player-one-choice').addEventListener('click', function () {
    player1 = characters[document.getElementById('player-one-choose-fighter-button').value];
    if (!isGameMultiPlayer) {
        singlePlayerSetup();
    } else {
        multiPlayerSetup();
    }
});


document.getElementById('submit-player-two-choice').addEventListener('click', function () {
    const player2StatsDisplay = document.querySelectorAll('.player2-stats');
    player2 = characters[document.getElementById('player-two-choose-fighter-button').value];
    player2StatsDisplay.forEach(displayElement);
    insertPlayerInfo("player2", player2);
    combatDisplay.forEach(displayElement);
});
//only shows if multiplayer is selected.When clicked moves game to combat phase and decides who attacks first.
const playerSelectionDisplay = document.querySelectorAll('.character-selection');

document.getElementById('begin-combat').addEventListener('click', function () {
    displayAllAttackAndManeuverButtons();
    determineWhoAttacksFirst();
    playerSelectionDisplay.forEach(removeElement);
});

//Combatants automatically roll against their speed skill, most successfull attacks first.
//should I break this function up into smaller pieces???.
const attackOutcomeDisplay = document.getElementById('attack-outcome');
function determineWhoAttacksFirst() {
    let speedRoll1 = rollDiceFunction();
    let speedRoll2 = rollDiceFunction();
    speedRollMargin1 = player1.speed - speedRoll1;
    speedRollMargin2 = player2.speed - speedRoll2;
    console.log('P1 Speed: ' + speedRollMargin1);
    console.log('P2 Speed: ' + speedRollMargin2);
    reRollTies(speedRollMargin1, speedRollMargin2, determineWhoAttacksFirst);

    if (speedRollMargin1 > speedRollMargin2) {
        defenderPlayer = 'player2';
        attackOutcomeDisplay.innerHTML = `${player1.name} is quicker to react and strikes first.`;
        maneuverButtons2.forEach(removeElement);
        attackButton2.style.display = 'none';
    } else {
        defenderPlayer = 'player1';
        attackOutcomeDisplay.innerHTML = `${player2.name} is quicker to react and strikes first.`;
        maneuverButtons1.forEach(removeElement);
        attackButton1.style.display = 'none';
    }
}

function reRollTies(element1, element2, functionToReroll) {
    if (element1 === element2) {
        functionToReroll;
    }
}
//<<<<<Ends character selection phase>>>>>

//<<<<<Begins combat phase>>>>>
//Rolls 3 die and adds them together to make most required rolls.
function rollDiceFunction() {
    let die1 = Math.floor(Math.random() * 6 + 1);
    let die2 = Math.floor(Math.random() * 6 + 1);
    let die3 = Math.floor(Math.random() * 6 + 1);
    let rollResult = die1 + die2 + die3;
    return rollResult;
}

//Attack Function.
const damageOutcomeDisplay = document.getElementById('damage-outcome');
let rollDiceAttack;
let isAttackDetermined;

function rollAgainstAttackSkillAndDetermineIfSuccessfull(playerMakingAttack) {
    let attackSkillAfterModifiers = playerMakingAttack.attack - stun;
    console.log(attackSkillAfterModifiers);
    // isAttackDetermined ? attackSkillAfterModifiers + 4 : attackSkillAfterModifiers + 0;
    if (isAttackDetermined === true) {
        attackSkillAfterModifiers = attackSkillAfterModifiers + 4;
    }
    console.log('Attack With Modifiers: ' + attackSkillAfterModifiers);
    rollDiceAttack = rollDiceFunction();   
    if (rollDiceAttack <= attackSkillAfterModifiers) {
        attackResult = 'success';
        checkRollForCriticalSuccess();
    } else {
        attackResult = 'failure';
    }
    //displays if the attack is successfull or not.
    attackOutcomeDisplay.innerHTML = `${playerMakingAttack.name}s attack of ${rollDiceAttack} is a ${attackResult}`;
    console.log(playerMakingAttack.name + ' attacks,' + ' it is a ' + attackResult + ' with a roll of ' + rollDiceAttack);
    //resets the display for damage Outcome.
    damageOutcomeDisplay.innerHTML = '';
    resetAttackModifiers();
}

//Defense function.
const defenseOutcomeDisplay = document.getElementById('defense-outcome');
let defenseResult;
function rollAgainstDefenseSkillAndDetermineIfSuccessfull(playerMakingDefense) {
    let rollDiceDefense = rollDiceFunction();

    if (wasLastAttackCritical === true) {
        defenseResult = 'failure';
        defenseOutcomeDisplay.innerHTML = `${playerMakingDefense.name} is struck by a critcal attack and can not defend`;
    } else if (rollDiceDefense > playerMakingDefense.defense) {
        defenseResult = 'failure';

        defenseOutcomeDisplay.innerHTML = `${playerMakingDefense.name} defense of ${rollDiceDefense} is a ${defenseResult}`;
        console.log(playerMakingDefense.name + ' makes defense roll of ' + rollDiceDefense + ' which is a ' + defenseResult);
    } else {
        defenseResult = 'success';
        //displays if the defense is successfull or not.
        defenseOutcomeDisplay.innerHTML = `${playerMakingDefense.name} defense of ${rollDiceDefense} is a ${defenseResult}`;
        console.log(playerMakingDefense.name + ' makes defense roll of ' + rollDiceDefense + ' which is a ' + defenseResult);
    }
}

//Critical success and failures.
let wasLastAttackCritical;
function checkRollForCriticalSuccess() {

    if (rollDiceAttack <= 4) {
        wasLastAttackCritical = true;
        console.log('crit success!!!');
    } else {
        wasLastAttackCritical = false;
        console.log('no crit');
    }
}

//Damage functions.
let damageRoll;
function rollDamage() {
    let die = Math.floor(Math.random() * 6 + 1);
    damageRoll = die;
    return damageRoll;
}

let finalDamage;
function determineFinalDamage(attacker, characterTakingDamage) {
    let newHp;

    if (attackResult === 'success' && defenseResult === 'failure') {
        damageRoll = rollDamage();
        finalDamage = damageRoll + attacker.damageModifier;
        newHp = characterTakingDamage.hitPoints - finalDamage;
        characterTakingDamage.hitPoints = newHp;
        document.getElementById(`${defenderPlayer}-hp`).innerHTML = `HP: ${newHp}`;
        damageOutcomeDisplay.innerHTML = `${characterTakingDamage.name} takes ${finalDamage} damage`;
        console.log(`${characterTakingDamage.name} takes ${finalDamage} points of damage and their HP is now ${newHp}`);
        determineStun();
    }
    console.log('DamageRoll: ' + damageRoll);
    console.log('FinalDamage: ' + finalDamage);
    console.log('NewHP: ' + newHp);
}
let stun = 0;
function determineStun() {
    finalDamage <= 4 && finalDamage > 0 ? stun = finalDamage : stun = 0;
    if (finalDamage <= 4) {
        stun = finalDamage;
    } else {
        stun = 4;
    }
    console.log('stun: ' + stun);
}

//This calls and ties previous functions together and provides "flow" of turn.
function decideAttackOutcome(attacker, defender) {
    rollAgainstAttackSkillAndDetermineIfSuccessfull(attacker);
    //false result will remove redundant defense outcome.
    attackResult === 'success' ? rollAgainstDefenseSkillAndDetermineIfSuccessfull(defender) : defenseOutcomeDisplay.innerHTML = '';
    determineFinalDamage(attacker, defender);
}

function resetAttackModifiers() {
    stun = 0;
    isAttackDetermined = false;
}

//End Turn Functions.
function playerEndTurn(playerNumber, opponentNumber) {
    //Defines who the defender is in a given turn so hit points can be removed if damaged.
    defenderPlayer = `player${playerNumber}`;
    //Removes attack/maneuver buttons and displays it for opponent.
    document.getElementById(`player${playerNumber}-attack-button`).style.display = 'none';
    document.getElementById(`player${opponentNumber}-attack-button`).style.display = '';
//find better way of doing below.
    if (playerNumber === '1') {
        maneuverButtons2.forEach(displayElement);
        maneuverButtons1.forEach(removeElement);
    } else {
        maneuverButtons1.forEach(displayElement);
        maneuverButtons2.forEach(removeElement);
    }
    console.log('<<<<<<<<<<NEW TURN>>>>>>>>>>');
}


//Standard attack buttons.
attackButton1.onclick = function () {
    decideAttackOutcome(player1, player2);
    playerEndTurn('1', '2');

}

attackButton2.onclick = function () {
    decideAttackOutcome(player2, player1);
    playerEndTurn('2', '1');

}

// Special Maneuver buttons

//Determined attack.
const determinedAttack1 = document.getElementById('determined1');
const determinedAttack2 = document.getElementById('determined2');
determinedAttack1.onclick = function () {
    isAttackDetermined = true;

    isPlayer1AllOut = true;
    decideAttackOutcome(player1, player2);
    playerEndTurn('1', '2');
}

determinedAttack2.onclick = function () {
    isAttackDetermined = true;

    isPlayer2AllOut = true;
    decideAttackOutcome(player2, player1);
    playerEndTurn('2', '1');
}

//Heavy Attack

