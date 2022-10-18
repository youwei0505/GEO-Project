$(document).ready(function(){
	//var doc = new jsPDF();
	//var imgData = 'data:image/png;base64,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'
	//doc.text('Hello world!', 10,10);
	//doc.addImage(imgData, 'PNG', 15, 40, 79, 104, null, 'FAST');
	//doc.save('a4.pdf');
})