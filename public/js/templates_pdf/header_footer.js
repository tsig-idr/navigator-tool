
const addFooters = (doc) => {
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFont('helvetica');
    doc.setFontSize(8);
    doc.setTextColor(150,150,150);
    const today  = new Date();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(' -  ' + String(i) + ' / ' + String(pageCount) + '  - ', doc.internal.pageSize.width -14, doc.internal.pageSize.height - 10, {
            align: 'right'
        });
        doc.text(today.toLocaleString(), 14, doc.internal.pageSize.height - 10, {
            align: 'left'
        });
    }
}

const addHeaders = (doc, texto) => {
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFont('helvetica', 'normal', '500');
    doc.setFontSize(22);
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.addImage("../../img/LogoFastNavigator.jpg", "JPEG", 10, 6, 15, 12);
        doc.setTextColor(150,150,150);
        doc.text("Navigator Tool", 28, 14);
        doc.setFont('helvetica', 'italic');
        //doc.setFontSize(8);
        doc.text(texto, doc.internal.pageSize.width -14, 14, {
            align: 'right'
        });
        doc.setLineWidth(0.5);
        doc.setDrawColor(180, 180, 180);
        doc.line(28, 17, doc.internal.pageSize.width -14, 17);
    }
}