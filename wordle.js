
var height = 6;
var width = 5;

var row = 0;
var col = 0;

const WORDS = ["ABOUT","ABOVE","ACTOR","ADULT","ADIEU","AFTER","AGAIN","AGREE","ALARM","ALIVE","ALONE",
  "ANGEL","ANGER","APPLE","ARISE","AUDIO","AWARD","BASIC","BEACH","BEGIN","BIRTH",
  "BLACK","BLADE","BLAME","BLOOD","BOARD","BRAIN","BRAND","BREAD","BREAK","BRING",
  "BROWN","BUILD","CANDY","CARRY","CAUSE","CHAIN","CHAIR","CHART","CHASE","CHEAP",
  "CHECK","CHEST","CHILD","CLAIM","CLASS","CLEAN","CLEAR","CLIMB","CLOCK","CLOSE",
  "CLOUD","COACH","COAST","COUNT","COURT","COVER","CRAFT","CRANE","CRASH","CREAM",
  "CROWD","CROWN","DAILY","DANCE","DEATH","DOUBT","DRAFT","DRAMA","DREAM","DRESS",
  "DRINK","DRIVE","EAGLE","EARLY","EARTH","EIGHT","ELECT","EMPTY","ENEMY","ENJOY",
  "ENTER","ENTRY","EQUAL","ERROR","EVENT","EVERY","EXACT","EXIST","EXTRA","FAITH",
  "FALSE","FAULT","FIELD","FIGHT","FINAL","FIRST","FLAME","FLASH","FLOOR","FOCUS",
  "FORCE","FRAME","FRESH","FRONT","FRUIT","GIANT","GLASS","GLOBE","GRACE","GRADE",
  "GRAND","GRAPE","GRASS","GREAT","GREEN","GROUP","GUARD","GUESS","GUEST","GUIDE",
  "HAPPY","HEART","HEAVY","HORSE","HOTEL","HOUSE","HUMAN","IDEAL","IMAGE","INDEX",
  "IVORY","JOINT","JOLLY","JUDGE","JUICE","KNIFE","KNOCK","LARGE","LASER","LATER",
  "LAUGH","LAYER","LEARN","LEAST","LEAVE","LEGAL","LEMON","LEVEL","LIGHT","LIMIT",
  "LOCAL","LOOSE","LOVED","LUCKY","LUNCH","MAGIC","MAJOR","MAPLE","MARCH","MATCH",
  "MAYBE","MAYOR","MEDIA","METAL","MIGHT","MINOR","MODEL","MONEY","MONTH","MORAL",
  "MOTOR","MOUNT","MOUSE","MOUTH","MOVIE","MUSIC","NERVE","NEVER","NIGHT","NOISE",
  "NORTH","NOVEL","NURSE","OCEAN","OFFER","OFTEN","OLIVE","ORDER","OTHER","OUTER",
  "PAINT","PANEL","PAPER","PARTY","PEACE","PHONE","PHOTO","PIANO","PILOT","PLACE",
  "PLAIN","PLANE","PLANT","PLATE","POINT","POUND","POWER","PRESS","PRICE","PRIDE",
  "PRIME","PRINT","PRIZE","PROOF","PROUD","QUEEN","QUICK","QUIET","QUITE","RADIO",
  "RAISE","RANGE","RAPID","RATIO","REACH","READY","RIGHT","RIVER","ROUGH","ROUND",
  "ROYAL","RURAL","SCALE","SCENE","SCORE","SENSE","SERVE","SEVEN","SHAPE","SHARE",
  "SHARP","SHEET","SHELF","SHIFT","SHINE","SHIRT","SHOCK","SHORT","SIGHT","SKILL",
  "SLEEP","SLIDE","SMALL","SMART","SMILE","SMOKE","SOLID","SOUND","SOUTH","SPACE",
  "SPARE","SPEAK","SPEED","SPEND","SPORT","STAFF","STAGE","STAND","START","STATE",
  "STEAM","STEEL","STICK","STILL","STONE","STORE","STORM","STORY","STRIP","STUDY",
  "STUFF","STYLE","SUGAR","SUPER","SWEET","TABLE","TASTE","TEACH","THANK","THEME",
  "THICK","THING","THINK","THREE","THROW","TIGER","TIGHT","TIRED","TITLE","TODAY",
  "TOOTH","TOPIC","TOTAL","TOUCH","TOUGH","TOWER","TRACK","TRADE","TRAIN","TREAT",
  "TREND","TRIAL","TRIBE","TRICK","TRUCK","TRULY","TRUST","TRUTH","UNCLE","UNDER",
  "UNION","UNITY","UNTIL","UPPER","URBAN","USAGE","USUAL","VALID","VALUE","VIDEO",
  "VISIT","VITAL","VOICE","WASTE","WATCH","WATER","WHEEL","WHERE","WHICH","WHILE",
  "WHITE","WHOLE","WOMAN","WORLD","WORRY","WORTH","WOULD","WRITE","WRONG","YOUNG",
  "YOUTH","ZEBRA"];

var VALID_GUESSES = new Set(WORDS);

async function loadValidWords(){
    try {
        const res = await fetch("words.txt");
        const text = await res.text();
        text.split("\n").forEach(w => {
            w = w.trim().toUpperCase();
            if (w.length === 5) VALID_GUESSES.add(w);
        });
    } catch (e) {}
}

var gameOver = false;
var word = "";
var stats = {wins: 0, losses: 0, streak: 0};
var won = false;

window.onload = async function(){
    await loadValidWords();
    initialize();
}

function pickRandomWord(){
    let index = Math.floor(Math.random() * WORDS.length);
    return WORDS[index];
}

function loadStats(){
    try {
        let saved = localStorage.getItem("wordleStats");
        if (saved) stats = JSON.parse(saved);
    } catch (e){}
    showStats();
}

function saveStats(){
    try{
        localStorage.setItem("wordleStats", JSON.stringify(stats));
    } catch (e) {}
}

function showStats(){
    document.getElementById("wins").innerText = stats.wins;
    document.getElementById("losses").innerText = stats.losses;
    document.getElementById("streak").innerText = stats.streak;
}

function recordResult(won){
    if (won == true){
        stats.wins += 1;
        stats.streak += 1;
    } else {
        stats.losses += 1;
        stats.streak = 0;
        stats.wins = 0;
    }
    saveStats();
    showStats();
}

function resetGame(){
    for(let r = 0; r < height; r++){
        for (let c = 0; c < width; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "";
            tile.classList.remove("correct", "present", "absent");
        }
    }
    

    row = 0;
    col = 0;
    gameOver = false;
    word = pickRandomWord();
    console.log(word);

    document.getElementById("answer").innerText = "";
    document.getElementById("message").innerText = "";
    document.getElementById("replay").blur();
    document.getElementById("replay").style.display = "none";
}

function showMessage(text){
    let msg = document.getElementById("message");
    msg.innerText = text;
    setTimeout(() => {
        if (msg.innerText === text) msg.innerText = "";
    }, 1500);
}

function initialize(){
    loadStats();
    word = pickRandomWord();
    console.log(word);

    for(let r = 0; r < height; r++){
        for (let c = 0; c < width; c++){
            // <span id="0-0" class=tile>P</span>
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    document.addEventListener("keyup", (e) => {
        if (gameOver) return;

        //alert(e.code);
        if("KeyA" <= e.code && e.code <= "KeyZ"){
            if(col < width){
                let currTile = document.getElementById(row.toString() + "-" + col.toString());
                if (currTile.innerText == ""){
                    currTile.innerText = e.code[3];
                    col += 1;
                }
            }
        }
        else if (e.code == "Backspace"){
            if (0 < col && col <= width){
                col -= 1;
            }
            let currTile = document.getElementById(row.toString() + "-" + col.toString());
            currTile.innerText = "";
        }

        else if(e.code == "Enter"){
            if (col < width){
                showMessage("Not enough letters");
                return;
            }

            let guess = "";
            for(let c = 0; c < width; c++){
                guess += document.getElementById(row.toString() + "-" + c.toString()).innerText;
            }

            if (!VALID_GUESSES.has(guess)){
                showMessage("Word doesn't exist");
                return;
            }

            update();
            row += 1;
            col = 0;
        }

        if (!gameOver && row == height){
            gameOver = true;
            document.getElementById("answer").innerText = word;
            recordResult(false);
            document.getElementById("replay").style.display = "inline-block";
        }
        
        })
    
}

function update(){
    let correct = 0;
    for (let c = 0; c < width; c++){
        let currTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currTile.innerText;
        
        if(word[c] == letter){
            currTile.classList.add("correct");
            correct += 1;
        }
        else if (word.includes(letter)){
            currTile.classList.add("present");
        }
        else{
            currTile.classList.add("absent");
        }

        if (correct == width){
            gameOver = true;
            recordResult(true);
            document.getElementById("replay").style.display = "inline-block";
        }
    }
}
