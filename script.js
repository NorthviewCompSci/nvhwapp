//to connect this web app to the actual HW Matrix and not a copy
//change the spreadsheet_id to '1zBoaMbcTiYxtrw7t32Zk0ipsJ5u-f7oKcqlPlFIaM8Q';
//the HW Matrix will also need to be published to the web
//a tutorial on how to do this can be found on this link: https://support.google.com/docs/answer/183965?hl=en

var spreadsheet_id = '1xgRVuwAnBHzfSAkbV6j5rMk-SyXDteDfW40P6dxiDsA';

var x_start;
var x_difference;
var current_week;
var depts = ['ENGLISH DEPARTMENT', 'MATH DEPARTMENT', 'SCIENCE DEPARTMENT', 'SOCIAL STUDIES DEPARTMENT', 'CAREER TECHNICAL', 'ART', 'PHYSICAL EDUCATION', 'WORLD LANGUAGE', 'MUSIC', 'SPECIAL EDUCATION'];
var json;
var dtc_object = {};
var local_department = [];
var local_teacher = [];
var local_class = [];
var tutorial_screen = 1;
var dtc_object = {};
var week_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
var week_object = {};
var week_array = [];
var worksheets_length;
var week_day;
//Add the first JSON to the document
var new_script = document.createElement('script');
new_script.setAttribute('src', 'https://spreadsheets.google.com/feeds/worksheets/' + spreadsheet_id + '/public/values?alt=json-in-script&callback=process_worksheets');
document.head.appendChild(new_script);
//Initiation when the page loads
function init() {
    if (localStorage.getItem('local_department') != null) {
        update_class_div();
    }
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        document.getElementById('week_container').addEventListener('touchstart', touch_start, false);
        document.getElementById('week_container').addEventListener('touchmove', touch_move, false);
        document.getElementById('week_container').addEventListener('touchend', touch_end, false);
    }
}
//JSON functions
function process_worksheets(worksheets) {
    var wt = new Date();
    wt = wt.getFullYear();
    wt = wt.toString();
    wt = wt.slice(-2);
    for (i = 0; i < worksheets.feed.entry.length; i++) {
        var week_title = worksheets.feed.entry[i].title.$t;
        week_title = week_title.replace('Q1', '');
        week_title = week_title.replace('Q2', '');
        week_title = week_title.replace('Q3', '');
        week_title = week_title.replace('Q4', '');
        week_title = week_title.replace('S1', '');
        week_title = week_title.replace('S2', '');
        week_title = week_title.replace(/[^0-9/.]/g, '');
        if (week_title.slice(-2) >= wt - 1) {
            week_array.push(week_title);
        }
    }
    var g = 1;
    for (j = 1; j <= week_array.length; j++) {
        if (week_array[j - 1] != ' ' && week_array[j - 1] != '20132014' && week_array[j - 1] != 20142015 && week_array[j - 1] != 20152016 && week_array[j - 1] != 20162017) {
            week_object[week_array[j - 1]] = g;
        } else {
            week_array.splice(j - 1, 1);
            j--;
        }
        g++;
    }
    week_array.sort(function (a, b) {
        var c = new Date(a);
        var d = new Date(b);
        return c.getTime() - d.getTime();
    });
    set_select(week_array, 'week');
    new_week();
}

function new_week() {
    open_div('loading_container');
    var today;
    if (document.getElementById('select_week').selectedIndex != 0) {
        today = new Date(document.getElementById('select_week').value);
    } else {
        today = new Date();
    }
    var month = today.getMonth();
    var month_day = today.getDate();
    var year = today.getFullYear();
    week_day = today.getDay();
    if (week_object[(month + 1).toString() + '/' + (month_day-(week_day - 1)).toString() + '/' + year.toString().slice(2, 4)] != null) {
        current_week = week_array.indexOf((month + 1).toString() + '/' + month_day.toString() + '/' + year.toString().slice(2, 4));
        new_json(week_object[(month + 1).toString() + '/' + (month_day-(week_day - 1)).toString() + '/' + year.toString().slice(2, 4)]);
    } else {
        current_week = week_array.length - 1;
        new_json(week_object[week_array[week_array.length - 1]]);
    }
}

function new_json(gid) {
    var new_script = document.createElement('script');
    new_script.setAttribute('src', 'https://spreadsheets.google.com/feeds/cells/' + spreadsheet_id + '/' + gid + '/public/values?alt=json-in-script&callback=process_json'); //sets the url of the script
    document.head.appendChild(new_script);
    document.getElementById('nav_title').innerHTML = "Loading";
}

function process_json(json_param) {
    json = json_param;
    dtc_object = {};
    var temp;
    var depts_row = [];
    var temp_d;
    var temp_t;
    var temp_c;
    for (j = 0; j < depts.length; j++) {
        for (i = 0; i < json.feed.entry.length; i++) {
            if (json.feed.entry[i].gs$cell.$t == depts[j + 1] || json.feed.entry[i].gs$cell.row == json.feed.entry[json.feed.entry.length - 1]) {
                temp_d = null;
                temp_t = null;
                temp_c = null;
            }

            if (json.feed.entry[i].gs$cell.$t == depts[j]) {
                temp_d = json.feed.entry[i].gs$cell.$t;
            } else {
                if (json.feed.entry[i].gs$cell.col == 1) {
                    temp_t = json.feed.entry[i].gs$cell.$t;
                } else if (json.feed.entry[i].gs$cell.col == 2) {
                    temp_c = json.feed.entry[i].gs$cell.$t;
                    if (dtc_object[temp_d] == null) {
                        dtc_object[temp_d] = {};
                    }
                    if (dtc_object[temp_d][temp_t] == null) {
                        dtc_object[temp_d][temp_t] = {};
                    }
                    if (dtc_object[temp_d][temp_t][temp_c] == null) {
                        dtc_object[temp_d][temp_t][temp_c] = {};
                    }
                    dtc_object[temp_d][temp_t][temp_c] = json.feed.entry[i].gs$cell.row;
                }
            }
        }
    }
    if (localStorage.getItem('local_department') != null) {
        open_div('week_container');
    } else {
        open_div('add_remove_container');
    }
    if (localStorage.getItem("visit_before") == null) {
        init_tutorial();
        document.getElementById('nav_title').innerHTML = 'Tutorial';
    }
}

function write_day() {
    get_local();
    document.getElementById('nav_title').innerHTML = json.feed.title.$t;
    for (i = 0; i < week_days.length; i++) {
        for (j = 1; j <= 9; j++) {
            document.getElementById(week_days[i] + '_class_' + j).innerHTML = '';
        }
    }
    for (i = 0; i < local_department.length; i++) {
        var cont = true;
        try {
            dtc_object[local_department[i]][local_teacher[i]][local_class[i]];
        } catch (error) {
            alert(local_class[i] + ' could not be included on this week.');
            cont = false;
        }
        if (cont) {
            var temp_row = dtc_object[local_department[i]][local_teacher[i]][local_class[i]];
            for (j = 0; j < json.feed.entry.length; j++) {
                if (json.feed.entry[j].gs$cell.row == temp_row) {
                    if (json.feed.entry[j].gs$cell.col == 2) {
                        for (k = 0; k < week_days.length; k++) {
                            document.getElementById(week_days[k] + '_class_' + (i + 1)).innerHTML = '<em>' + json.feed.entry[j].gs$cell.$t + ':</em> ';
                        }
                    } else if (json.feed.entry[j].gs$cell.col != 1) {
                        document.getElementById(week_days[json.feed.entry[j].gs$cell.col - 3] + '_class_' + (i + 1)).innerHTML += json.feed.entry[j].gs$cell.$t;
                    }
                }
            }
        }
    }
}
//localStorage preferences and settings
function add_class() {
    get_local();
    if (local_department.length < 9) {
        if (document.getElementById('add_container').className == 'hidden') {
            document.getElementById('select_department').className = 'select';
            document.getElementById('add_container').className = 'add_container add_container_open';
            setTimeout(function () {
                document.getElementById('add_container').className = 'add_container';
            }, 250);
        }
    } else {
        alert('You can only add up to 9 classes');
    }
}

function save_class() {
    document.getElementById('select_department').selectedIndex = 0;
    document.getElementById('select_teacher').innerHTML = '';
    document.getElementById('select_class').innerHTML = '';
    set_option('Select Teacher', 'teacher');
    set_option('Select Class', 'class');
}

function next_select(index) {
    var select = ['department', 'teacher', 'class'];
    document.getElementById('select_' + select[index]).className = 'hidden';
    if (index != 2) {
        document.getElementById('select_' + select[index + 1]).className = 'select';
    } else {
        document.getElementById('add_container').className = 'select add_container_close';
        setTimeout(function () {
            document.getElementById('add_container').className = 'hidden';
        }, 250);
        push_local();
        set_local();
        get_local();
        document.getElementById('select_department').selectedIndex = 0;
        update_class_div();
        add_class();
    }
}

function update_class_div() {
    while (document.getElementById('added_container').firstChild) {
        document.getElementById('added_container').removeChild(document.getElementById('added_container').firstChild);
    }
    for (i = 0; i < local_department.length; i++) {
        var dtc_div = document.createElement('div');
        dtc_div.innerHTML = local_department[i] +
            '<br>' + local_teacher[i] + '<br>' + local_class[i];
        dtc_div.className = 'added_entry';
        var dtc_delete = document.createElement('div');
        dtc_delete.className = 'added_delete';
        dtc_delete.id = i.toString();
        dtc_delete.onclick = function () {
            delete_class(this.id);
        };
        document.getElementById('added_container').appendChild(dtc_div);
        dtc_div.appendChild(dtc_delete);
    }
}

function delete_class(index) {
    local_department.splice(index, 1);
    local_teacher.splice(index, 1);
    local_class.splice(index, 1);
    set_local();
    get_local();
    update_class_div();
}

function push_local() {
    local_department.push(document.getElementById('select_department').value);
    local_teacher.push(document.getElementById('select_teacher').value);
    local_class.push(document.getElementById('select_class').value);
}

function set_local() {
    localStorage.setItem("local_department", JSON.stringify(local_department));
    localStorage.setItem("local_teacher", JSON.stringify(local_teacher));
    localStorage.setItem("local_class", JSON.stringify(local_class));
}

function get_local() {
    local_department = JSON.parse(localStorage.getItem("local_department"));
    local_teacher = JSON.parse(localStorage.getItem("local_teacher"));
    local_class = JSON.parse(localStorage.getItem("local_class"));
    if (local_department == null) {
        local_department = [];
        local_teacher = [];
        local_class = [];
    }
}

function clear_local_storage() {
    if (confirm('Are you sure? This will clear all of the user data and settings from the app.')) {
        localStorage.clear();
        location.reload();
    }
}

//User Interface
function touch_start(event) {
    x_start = event.touches[0].clientX;
}

function touch_move(event) {
    var x_end = event.touches[0].clientX;
    x_difference = x_start - x_end;
    if (Math.abs(x_difference) < window.innerWidth * 35 / 100) {
        document.getElementById('back_week').style.left = -1 * x_difference + window.innerWidth * -35 / 100 + 'px';
        document.getElementById('next_week').style.left = -1 * x_difference + window.innerWidth * 135 / 100 + 'px';
    }
}

function touch_end(event) {
    if (Math.abs(x_difference) > window.innerWidth / 3) {
        if (x_difference > window.innerWidth / 3) {
            if (current_week < week_array.length - 1) {
                current_week++;
                new_json(week_object[week_array[current_week]]);
                open_div('loading_container');
            }
        } else if (x_difference < window.innerWidth / 3) {
            if (current_week > 0) {
                current_week--;
                new_json(week_object[week_array[current_week]]);
                open_div('loading_container');
            }
        }
    }
    close_pull_tabs();
}


function close_pull_tabs() {
    document.styleSheets[0].cssRules[0].deleteRule('0%');
    document.styleSheets[0].cssRules[1].deleteRule('0%');
    if (document.styleSheets[0].cssRules[0].appendRule) {
        document.styleSheets[0].cssRules[0].appendRule('0% {left:' + document.getElementById('next_week').style.left + '}', 0);
        document.styleSheets[0].cssRules[1].appendRule('0% {left:' + document.getElementById('back_week').style.left + '}', 0);

    } else {
        document.styleSheets[0].cssRules[0].insertRule('0% {left:' + document.getElementById('next_week').style.left + '}', 0);
        document.styleSheets[0].cssRules[1].insertRule('0% {left:' + document.getElementById('back_week').style.left + '}', 0);
    }
    document.getElementById('next_week').className = 'next_week_keyframes';
    document.getElementById('back_week').className = 'back_week_keyframes';
    setTimeout(function () {
        document.getElementById('next_week').className = '';
        document.getElementById('back_week').className = '';
        document.getElementById('next_week').style.left = '135vw';
        document.getElementById('back_week').style.left = '-35vw';
    }, 500);
}

function init_tutorial() {
    localStorage.setItem("visit_before", true);
    open_div('add_remove_container');
    document.getElementById('tutorial_select').className = 'tutorial_select';
    document.getElementById('tutorial_next').className = 'tutorial_next';
}

function show_tutorial() {
    if (localStorage.getItem('local_department') == null) {
        alert('Please select at least one class before clicking "Next".');
    } else {
        tutorial_screen++;
        if (tutorial_screen == 2) {
            open_close_nav('open');
            document.getElementById('tutorial_select').className = 'hidden';
            document.getElementById('tutorial_nav').className = 'tutorial_nav';
        } else if (tutorial_screen == 3) {
            open_div('week_container');
            document.getElementById('tutorial_nav').className = 'hidden';
            document.getElementById('tutorial_week').className = 'tutorial_week';
        } else if (tutorial_screen == 4) {
            open_div('settings_container');
            document.getElementById('tutorial_week').className = 'hidden';
            document.getElementById('tutorial_settings').className = 'tutorial_settings';
        } else if (tutorial_screen == 5) {
            open_div('week_container');
            document.getElementById('tutorial_settings').className = 'hidden';
            document.getElementById('tutorial_reminder').className = 'tutorial_reminder';
            document.getElementById('tutorial_next').innerHTML = 'End';
        } else {
            location.reload();
        }
        document.getElementById('tutorial_next').className = 'tutorial_next';
    }
}

function open_close_nav(option) { //opens or closes the nav menu
    if (option == 'open') {
        document.getElementById('nav_menu').className = 'nav_menu_open';
        setTimeout(function () {
            document.getElementById('nav_menu').className = '';
        }, 500);
    }
    if (option == 'close') {
        document.getElementById('nav_menu').className = 'nav_menu_close';
        setTimeout(function () {
            document.getElementById('nav_menu').className = 'hidden';
        }, 500);
    }
    if (option == 'alt') {
        if (document.getElementById('nav_menu').className == 'hidden') {
            open_close_nav('open');
        } else {
            open_close_nav('close');
        }
    }
}

function open_div(div) {
    document.getElementById('settings_container').className = 'hidden';
    document.getElementById('week_container').className = 'hidden';
    document.getElementById('add_remove_container').className = 'hidden';
    document.getElementById('loading_container').className = 'hidden';
    if (document.getElementById('nav_menu').className != 'hidden') {
        open_close_nav('close');
    }
    if (div == 'add_remove_container') {
        document.getElementById('nav_title').innerHTML = 'Classes';
        document.getElementById('add_icon').className = 'add_icon';
    } else {
        document.getElementById('add_icon').className = 'hidden';
    }
    if (div == 'week_container') {
        write_day();
    }
    document.getElementById(div).className = div;
}

function set_select(value, type) {
    document.getElementById('select_' + type).innerHTML = '';
    if (type == 'week') {
        set_option('&#9744; Select Week', type);
    } else {
        set_option('Select ' + type[0].toUpperCase() + type.substring(1), type);
    }
    for (b = 0; b < value.length; b++) {
        set_option(value[b], type);
    }
}

function set_option(value, type) {
    var select_option = document.createElement('option');
    select_option.innerHTML = value;
    select_option.value = value;
    document.getElementById('select_' + type).appendChild(select_option);
}
