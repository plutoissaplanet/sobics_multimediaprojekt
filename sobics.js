let game_area;
let button_area;
let container;
let time_div;
let start_button;
let music_button;
let leaderboard_txt;
let segment;
let figurine;
let welcome_txt;
let shrek_audio;
let colors;
let figurine_div;
let gameover_text;
let points = 0;
let newRowInterval;
let audio_state = true;
let blocks;
let leaderboard = [];
let game_state;
let toroldmarki;
let segment_array = [];

$('document').ready(function () {


    //Játékfelület formázása

    container = $('#container');
    container.css({
        'width': '1000px',
        'height': '1000px',
        'margin': 'auto',
        'text-align': 'center'
    });
    game_area = $('#gamearea');
    game_area.css({
        'float': 'left',
        'width': '800',
        'height': '700',
        'background-image': 'url("bakcground.jpg")',
        'border-radius': '25px'

    });

    button_area = $('#buttonarea');
    button_area.css({
        'float': 'left',
        'width': '200',
        'height': '700',
        'border-radius': '25px'
    });

    time_div = $('#timer');
    time_div.css({
        'width': '10px',
        'height': '15px',
        'background-color': '#3CFF02'

    });


    //Menü gombok elkészítése és elhelyezése

    leaderboard_txt = $('<p> Leaderboard</p>');
    start_button = $('<button> Start </button>');
    music_button = $('<button style=\'font-size:24px\'> <i class=\'fas fa-volume-up\' style=\'font-size:24px\'></i></i></button>');
    let points_area = $('<p>A pontszámod: <span id="points-counter"></span></p>');
    musicOnOff();


    start_button.css({
        'width': '100px',
        'height': '50px',
        'margin-top': '20px',
        'border': 'none',
        'border-radius': '25px',
        'display': 'block',
        'margin-left': '50px',
        'background-color': '#3CFF02',
        'font-family': 'Luminari, sans-serif',
        'cursor': 'pointer'
    });

    music_button.css({
        'width': '100px',
        'height': '40px',
        'display': 'block',
        'margin-top': '30px',
        'border': 'none',
        'margin-left': '50px',
        'text-align': 'center',
        'cursor': 'pointer',
        'background-color': '#3CFF02'


    });

    leaderboard_txt.css({
        'margin-top': '50px'
    });

    button_area.prepend(points_area);
    button_area.prepend(music_button);
    button_area.prepend(start_button);

    //Game area 8 div elementre osztása, ezekben fog mozogni a kis figura
    figurine_div = $('<div>');
    figurine_div.css({
        'width': '100px',
        'height': '150px',
        'position': 'absolute',
        'bottom': '0',
        'left': '0'
    });

    figurine = $('<img src="shrek.png">');

    figurine.css({
        'width': '100px',
        'height': '150px',
        'position': 'absolute',
        'bottom': '0',
        'left': '0'
    });

    figurine_div.append(figurine);

    welcome_txt = $("<p style='font-family: Luminari, sans-serif; margin-top: 30%; color:#3CFF02 '> A kezdéshez nyomd meg a Start gombot!</p>")
    welcome_txt.css({
        'position': 'auto',
        'font-size': '50px'
    });
    game_area.append(welcome_txt);

    start_button.click(function () {
        welcome_txt.hide();
        sections();
        update();
        playMusic();
        animation();
        game_state = true;
        start_button.off('click');
    });

        // A játéktérhez elkészítem a 8 darab div sectiont, amiben mozogni fog Shrek, illetve kivilágtja, hogy melyik sectionben vagyunk éppen
    function sections() {
        points = 0;
        for (let i = 0; i < 8; i++) {
            segment = $('<div>');
            segment.addClass('div_segments');
            segment.css({
                'width': '100px',
                'height': '700px',
                'position': 'relative',
                'display': 'inline-block',
                'text-align': 'center',
                'border-radius': '25px'

            });
            segment_array[i] = segment;

            segment.on({
                mouseover: function () {
                    $(this).css({'background-color': '#3CFF02', 'opacity': '0.5'});
                    $(this).append(figurine_div);
                },
                mouseleave: function () {
                    $(this).css({'background-color': '', 'opacity': ''});
                }
            });
            game_area.append(segment);
            loadBlockArray();
        }
        newRowInterval = setInterval(addnewRow, 10000);
    }

    // a loadBlockArray függvény elészít egy tömböt, amiben a színes blokkok vannak majd ezt hozzáadja a játéktérhez
    function loadBlockArray() {
        colors = ['red', 'blue', 'green', 'yellow', 'orange'];
        let blockArray = [];

        for (let i = 5; i > 0; i--) {
            blocks = $('<div>');
            blocks.css({
                'width': '100px',
                'height': '40px',
                'border-style': 'solid',
                'border-width': '1px',
                'border-color': 'lightgrey',
            }).addClass("blocks");

            blocks.each(function () {
                let randColor = colors[Math.floor(Math.random() * colors.length)];
                $(this).css('background-color', randColor).addClass(randColor);
            });
            blockArray.push(blocks);
        }

        segment.append(blockArray);

        // itt történik meg az, hogy ha rákattintok egy segmentre, akkor a legutolsó blokkot át appendeli a Shrek figurinehoz, aztán vissza az utolsó helyre a blokkokhoz
        segment.click(function () {
            if (figurine_div.children().hasClass('inHand')) {
                $(this).find('.inHand').appendTo(this);
                $(this).find('.inHand').removeClass('inHand');
                destroy($(this));
                gameOver($(this));
            } else {
                $(this).find('.blocks').last().appendTo(figurine_div).addClass('inHand');
            }
        });
    }

    //az addNewRows csak előkészíti a blokkokat az időre történő beszúráshoz

    function addnewRow() {
        for (let i = 0; i < segment_array.length; i++) {
            let temp = $('<div>');
            temp.css({
                'width': '100px',
                'height': '40px',
                'border-style': 'solid',
                'border-width': '1px',
                'border-color': 'lightgrey',
            }).addClass("blocks");
            temp.each(function () {
                let randColor = colors[Math.floor(Math.random() * colors.length)];
                $(this).css('background-color', randColor).addClass(randColor);
            });
            segment_array[i].prepend(temp);
            gameOver(segment);
            console.log('prepended');
        }
    }

        // progress bar animáció
    function animation() {
        toroldmarki = setInterval(function () {
            time_div.animate({width: "800px"}, 10000);
            time_div.animate({width: "15px"}, 0);
        }, 0);
    }

        //ez a start csak a gameOverhez kellett
    function start() {
        start_button.click(function () {
            points = 0;
            gameover_text.hide();
            sections();
            animation();
            game_state = true;
            start_button.off('click');
        });
    }

    //ha 11 blokk kigyűlik egy oszlopban, akkor game over van, megjelenik egy új screen meg minden, itt áll le a progress bár is és az új sor beszúrós interval is
    function gameOver(segmens) {
        let size = segmens.children().length;
        if (size === 11) {
            game_area.empty();
            gameover_text = $('<p style="color:#3CFF02">Game over! Kattints a Start gombra új játék kezdéséhez, vagy rögzítsd eredményed!</p>');
            gameover_text.css({
                'position': 'auto',
                'font-size': '50px'
            });
            $('#donkey')[0].play();
            game_area.append(gameover_text);
            start();
            clearInterval(newRowInterval);
            clearInterval(toroldmarki);
            time_div.finish();
            time_div.css({width: "15px"});
        }
    }
     // ha négy egyforma színű blokk van egymás alatt, akkor removeoljuk a blokkok közül.
    function destroy(segmens) {
        let size = segmens.children().length;
        let previous_color = [];
        let state = true;
        while (state) {
            let current_color = segmens.children().eq(size - 1).attr('class').toString();
            console.log('current_color:', current_color)

            for (let i = 2; i < 6; i++) {
                previous_color[i] = segmens.children().eq(size - i).attr('class');
                if (previous_color[3] === current_color && previous_color[4] === current_color && previous_color[5] === current_color) {
                    $('#action')[0].play();
                    segmens.children().eq(size - 1).remove();
                    segmens.children().eq(size - 2).remove();
                    segmens.children().eq(size - 3).remove();
                    segmens.children().eq(size - 4).remove();
                    segmens.children().eq(size - 5).remove();

                    points += 400;
                    $('#points-counter').text(points);
                }
            }
            state = false;
        }
    }

    leaderBoard();

    // localStorage leaderboard készítése :')
    function leaderBoard() {
        let form = $('form');
        if (localStorage.getItem('leaderboard')) {
            leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
        }
        form.on('submit', function (error) {
            error.preventDefault();
            let name = $('#name').val();
            console.log(typeof (name));
            if (points === 0) {

            } else {
                leaderboard.push({user: name, point: points});
                leaderboard.sort(function (a, b) {
                    return b.point - a.point;
                });
                leaderboard = leaderboard.slice(0, 10);
                localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
                points = 0;
                update();
            }
        });
    }

    function update() {
        let tbody = $('tbody');
        tbody.empty();
        let temp = leaderboard.length
        for (let i = 0; i < temp; i++) {

            tbody.append('<tr><td>' + (i + 1) + '</td><td>' + leaderboard[i]['user'] + '</td><td>' + leaderboard[i]['point'] + '</td></tr>');

        }
    }

    function playMusic() {
        $('#audio')[0].play();
    }

    //Zene hozzáadása/indítása/leállítása
    function musicOnOff() {
        shrek_audio = $('#audio');
        music_button.click(function () {
            if (audio_state === true) {
                $(this).html("<i class='fas fa-volume-mute' style='font-size:24px'></i>");
                $('#audio')[0].pause();
                audio_state = false;
            } else {
                $('#audio')[0].play();
                $(this).html("<i class=\'fas fa-volume-up\' style='font-size:24px'></i>");

                audio_state = true;
            }
        });
    }

});