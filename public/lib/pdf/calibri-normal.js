﻿// import { jsPDF } from "jspdf"
var callAddFont = function () {
this.addFileToVFS('calibri-normal.ttf', font);
this.addFont('calibri-normal.ttf', 'calibri', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])