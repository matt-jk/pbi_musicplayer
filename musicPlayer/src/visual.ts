/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

/*
 * Modified by Matt Kalal
 * matt_jk@hotmail.com
 * for custom visual musicplayer
 */

module powerbi.extensibility.visual {
    "use strict";
    export class Visual implements IVisual {
        private target: HTMLElement;
        private settings: VisualSettings;

        constructor(options: VisualConstructorOptions) {
            this.target = options.element;

            let shtml: string = '<audio id="a_song"></audio> <audio id="a_click"></audio>';
            shtml += '<table>'
            shtml += '<tr><td>Song:</td><td><span id="songname"></span></td></tr>';
            shtml += '<tr> <td>Speed:</td> <td><span id="playspeed">1</span></td> </tr>';
            shtml += '</table>';
            shtml += '<br><button id="btnPlay">Play / Pause</button> &nbsp;&nbsp;Include Click <input type="checkbox" id=chkClick>';
            shtml += '<p><progress id="pbar" value=0 max=100></progress> <span id="stime">0:00/0:00</span>';
            shtml += '<p><button id="btnBackStart">|&lt;</button> <button id="btnBack5s">&lt; 5s</button><button id="btnBack1s">&lt; 1s</button> <button id="btnAhead1s">1s &gt;</button><button id="btnAhead5s">5s &gt;</button>';
            shtml += '<p><p><button id="btnSlower">&lt; Slower</button> Playback <button id="btnFaster">Faster &gt;</button>';

           //console.log("constructor");

            if (typeof document !== "undefined") {

                let controlDiv: HTMLDivElement = document.createElement("div");
                controlDiv.innerHTML = shtml;
                this.target.appendChild(controlDiv);

                (document.getElementById("btnPlay") as HTMLButtonElement).addEventListener("click", function () {playsound()} );
                (document.getElementById("a_song") as HTMLAudioElement).ontimeupdate = updateProgress;
    
                (document.getElementById("btnBackStart") as HTMLButtonElement).addEventListener("click", function () { setAudioTime(0) });
                (document.getElementById("btnBack5s") as HTMLButtonElement).addEventListener("click", function () { seekAudio(-5) });
                (document.getElementById("btnBack1s") as HTMLButtonElement).addEventListener("click", function () { seekAudio(-1) });
                (document.getElementById("btnAhead1s") as HTMLButtonElement).addEventListener("click", function () { seekAudio(1) });
                (document.getElementById("btnAhead5s") as HTMLButtonElement).addEventListener("click", function () { seekAudio(5) });
                (document.getElementById("btnSlower") as HTMLButtonElement).addEventListener("click", function () { change_playspeed(-.1) });
                (document.getElementById("btnFaster") as HTMLButtonElement).addEventListener("click", function () { change_playspeed(.1) });
                (document.getElementById("chkClick") as HTMLInputElement).addEventListener("click", function () {change_Click()});
                change_Click();
            }
        }

        public update(options: VisualUpdateOptions) {
            this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
            let dataView: DataView = options.dataViews[0];

            //console.log("update Start!!!");

            for (let cc of dataView.table.columns) {
                switch (true) {
                    case cc.roles.hasOwnProperty("song_name"):
                        var song_name = dataView.table.rows[0][cc.index] as number;
                        break;
                    case cc.roles.hasOwnProperty("song_content"):
                        var song_colno = cc.index;
                        break;
                    case cc.roles.hasOwnProperty("click_content"):
                        var click_colno = cc.index;
                        break;
                    case cc.roles.hasOwnProperty("activeaudio"):
                        var activeaudio: string = dataView.table.rows[0][cc.index] as string;
                        break;
                    default:
                }
            }

            let current_song_name: HTMLSpanElement = document.getElementById("songname") as HTMLSpanElement; //).innerHTML; //= song_name.toString();

            /*
             * this block is where it loads the audio content.
             * It only takes a second to run, but I guess if it doesn't have to run
             * we shouldn't run
             */

             if (current_song_name.innerHTML != song_name.toString()) {

                let song_content: Uint8Array = convert_to_bin(dataView.table.rows.map(trow => trow[song_colno].toString() ) );
                let click_content: Uint8Array = convert_to_bin(dataView.table.rows.map(trow => trow[click_colno].toString() ) );

                current_song_name.innerHTML = song_name.toString();
                (document.getElementById("a_song") as HTMLAudioElement).src = URL.createObjectURL(new Blob([song_content.buffer]));
                (document.getElementById("a_click") as HTMLAudioElement).src = URL.createObjectURL(new Blob([click_content.buffer]));
                (document.getElementById("playspeed") as HTMLSpanElement).innerHTML = "1";
            }
        }

        private static parseSettings(dataView: DataView): VisualSettings {
            return VisualSettings.parse(dataView) as VisualSettings;
        }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        }
    }
}
