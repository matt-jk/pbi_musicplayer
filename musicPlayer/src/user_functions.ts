/*
 * MIT license
 * functions for use in the MusicPlayer custom visual
 * Matt Kalal
 * matt_jk@hotmail.com
 */

function playsound() {
    let asong: HTMLAudioElement = document.getElementById("a_song") as HTMLAudioElement;
    let aclick: HTMLAudioElement = document.getElementById("a_click") as HTMLAudioElement;

    if (asong.paused) {
        let t_time = asong.currentTime;
        aclick.currentTime = t_time;
        asong.play();
        aclick.play();
    } else {
        asong.pause();
        aclick.pause();
    }

}

function change_Click() {

    let asong: HTMLAudioElement = document.getElementById("a_song") as HTMLAudioElement;
    let aclick: HTMLAudioElement = document.getElementById("a_click") as HTMLAudioElement;

    if ((document.getElementById("chkClick") as HTMLInputElement).checked) {
        asong.volume = 0;
        aclick.volume = 1;
    } else {
        asong.volume = 1;
        aclick.volume = 0;
    }
}

function updateProgress() {
    let dur = document.getElementById("stime");
    let asong = document.getElementById("a_song") as HTMLAudioElement;
    let pbar: HTMLProgressElement = document.getElementById("pbar") as HTMLProgressElement;

    pbar.max = asong.duration;
    pbar.value = asong.currentTime;
    dur.innerHTML = timestring(asong.currentTime) + "/" + timestring(asong.duration);
}

function seekAudio(numSeconds: number) {
    let a_audio = document.getElementById("a_song") as HTMLAudioElement;
    let c_audio = document.getElementById("a_click") as HTMLAudioElement;
    let currtime: number = Math.floor(a_audio.currentTime) + numSeconds;
    a_audio.currentTime = currtime;
    c_audio.currentTime = currtime;
}

function setAudioTime(numSeconds: number) {
    let a_audio = document.getElementById("a_song") as HTMLAudioElement;
    let c_audio = document.getElementById("a_click") as HTMLAudioElement;
    a_audio.currentTime = numSeconds;
    c_audio.currentTime = numSeconds;
}

function change_playspeed(incr: number) {
    let tmpSpeed = 0
    let a_audio = document.getElementById("a_song") as HTMLAudioElement;
    let c_audio = document.getElementById("a_click") as HTMLAudioElement;

    tmpSpeed = a_audio.playbackRate;
    tmpSpeed += incr;
    if (tmpSpeed > 1.5) {
        tmpSpeed = 1.5;
    } else if (tmpSpeed < .4) {
        tmpSpeed = .4;
    }

    //
    // This line with the ToFixed is for display, it does a funny thing with the float value
    // for example instead of 1.2 you'll get 1.1999999999999999
    //

    tmpSpeed = Number(tmpSpeed.toFixed(1));
    a_audio.playbackRate = tmpSpeed;
    c_audio.playbackRate = tmpSpeed;
    (document.getElementById("playspeed") as HTMLSpanElement).innerHTML = tmpSpeed.toString();
}

function timestring(iseconds: number) {
    var rtrnTime: string;
    var min: number = Math.floor(iseconds / 60);
    var sec: number = Math.floor(iseconds % 60);
    rtrnTime = min.toString() + ":";
    if (sec < 10) {
        rtrnTime += "0";
    }
    rtrnTime += sec.toString();
    return rtrnTime;
}

function convert_to_bin(tmpArray: Array<string>) {
    //
    // returns a Uint8Array representing a binary file
    //
    let tmpfileb64: string = "";
    let binary_content: Uint8Array;

    tmpArray.sort();

    for (let tmpRow of tmpArray) {
        if (tmpRow.substring(6) != "-") {
            tmpfileb64 += tmpRow.substring(6);
        }
    }

    //
    // convert from base64
    //

    let tmpfile = atob(tmpfileb64);

    binary_content = new Uint8Array(tmpfile.length);

    for (let i = 0, strLen = tmpfile.length; i < strLen; i++) {
        binary_content[i] = tmpfile.charCodeAt(i);
    }

    return binary_content;
}