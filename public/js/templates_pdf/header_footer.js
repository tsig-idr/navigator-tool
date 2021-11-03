
const addFooters = (doc) => {
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFont('helvetica');
    doc.setFontSize(8);
    const today  = new Date();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        doc.text(' -  ' + String(i) + ' / ' + String(pageCount) + '  - ', doc.internal.pageSize.width / 2, 287, {
            align: 'center'
        });

        doc.text(today.toLocaleString(), doc.internal.pageSize.width -20, 287, {
            align: 'right'
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
        doc.text("Navigator Tool", 28, 14);
        doc.setFont('helvetica', 'italic');
        //doc.setFontSize(8);
        doc.text(' -  ' + texto + '  - ', doc.internal.pageSize.width / 2, 14, {
            align: 'center'
        });
    }
}