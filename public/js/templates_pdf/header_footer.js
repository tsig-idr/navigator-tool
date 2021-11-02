const addFooters = (doc) => {
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(' -  ' + String(i) + ' / ' + String(pageCount) + '  - ', doc.internal.pageSize.width / 2, 287, {
            align: 'center'
        });
    }
}

const addHeaders = (doc, texto) => {
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(' -  ' + texto + '  - ', doc.internal.pageSize.width / 2, 10, {
            align: 'center'
        });
    }
}