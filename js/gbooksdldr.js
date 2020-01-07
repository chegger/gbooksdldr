console.log("Executing download ...");

let i = 0;
let urls = [];
let base64_uris = [];
async function getBase64ImageFromUrl(imageUrl) {
  var res = await fetch(imageUrl);
  var blob = await res.blob();

  return new Promise((resolve, reject) => {
    var reader  = new FileReader();
    reader.addEventListener("load", function () {
        resolve(reader.result);
    }, false);

    reader.onerror = () => {
      return reject(this);
    };
    reader.readAsDataURL(blob);
  })
};


function scrolling() {
  	var book = document.getElementsByClassName("overflow-scrolling")[0];
        book.scrollTo(i, i + 80);
                if (i + 80 < book.scrollHeight) {
                        i = i + 80;
                        setTimeout(scrolling, 33);
                }else{
			console.log("timeout");
                        setTimeout(function() {getImages();}, 2000);
                }

}

function getImages() {
        var resources = window.performance.getEntriesByType("resource");
        resources.forEach(function (resource) {
                var url = resource.name;
                if (url.startsWith("https://books.google.at/books/content?")){
                        urls.push(url);
                }
        });

        createPDF();
}


function createPDF(){
	var promises = [];	

	for(var j = 0; j < urls.length; j++)
	{ 
		promises.push(getBase64ImageFromUrl(urls[j])
    			.then(function(result) {
				base64_uris.push(result);
			})
    			.catch(err => console.error(err)));	
	}

	Promise.all(promises).then(function(result) {
		var doc = new jsPDF();


		for(var j = 0; j < base64_uris.length; j++){
			doc.addImage(base64_uris[j], 'PNG', 15, 15, 180, 274);
			doc = doc.addPage('a4');
		}
		doc.save('gbooksdldr.pdf');

	});
} 

scrolling();
