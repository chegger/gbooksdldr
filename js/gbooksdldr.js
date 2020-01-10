console.log("Executing download ...");

let i = 0;
let urls = [];
let base64_uris = [];

/*
 * PRIMARY ORDERING PP > PR > PA > PT
 * SECONDGARY ORDERING: Numbers, ascending
 * Returns 1 if letters_numbers1 is greater than letters_numbers2, -1 vice versa, 0 otherwise 
 */
function compare(letters_numbers1, letters_numbers2){
	var letters1 = letters_numbers1[0];
	var numbers1 = letters_numbers1[1];
	var letters2 = letters_numbers2[0];
	var numbers2 = letters_numbers2[1];

	if(letters1 === null || letters2 === null || numbers1 === null || numbers2 === null)
		return 1;

	if(letters1.localeCompare(letters2) === 0)
		return numbers1 <= numbers2;
	return letter_compare();

	function letter_compare(){
		var the_order = ['PP', 'PR', 'PA', 'PT'];
		var rank_letters1 = 0;
		var rank_letters2 = 0;
		for(var j = 0; j < the_order.length; j++){
			if (the_order[j].localeCompare(letters1) === 0)
				rank_letters1 = j;		
			if (the_order[j].localeCompare(letters2) === 0)
				rank_letters2 = j;					
		}
		return rank_letters1 < rank_letters2;
	}

}

function assemble_pdf(result){
         var doc = new jsPDF();

       	for(var j = 0; j < base64_uris.length; j++){
                doc.addImage((base64_uris[j])[0], 'PNG', 15, 15, 180, 274);
        	doc = doc.addPage('a4');
        }
       	doc.save('gbooksdldr.pdf');
}

function sort_urls(){

	var sorted_elements = [];
	var unsorted_elements = [];
	var position_start;
	var position_end;
	var letters;
	var numbers;

	//Build URL data structs
	for(var j = 0; j < urls.length; j++){
		var let_num = get_letters_numbers(j);
		sorted_elements.push(let_num);
		unsorted_elements.push(let_num);
		sorted_elements.sort(compare);

	}

	//USe data structs to sort urls
	for(var j = 0; j < urls.length; j++){
		var let_num = get_letters_numbers(j);
		swap(j, sorted_elements.findIndex(find_index_cmp, let_num));

	}

	function swap(j,k)
	{
		var tmp = urls[j];
		urls[j] = urls[k];
		swap[k] = tmp;		
	}

	function find_index_cmp(let_num){
		return let_num[0].localeCompare(this[0]) === 0  &&
			let_num[1] === this[1];
	}

	function get_letters_numbers(){
		position_start = urls[j].indexOf('&pg=') + 4;
		position_end = urls[j].indexOf("&", position_start);
		
		letters = (urls[j]).substr(position_start, 2);
		numbers = (urls[j]).substring(position_start + 2, position_end);

		return [letters, numbers];
	}
}

async function getBase64ImageFromUrl(imageUrl, idx) {
  var res = await fetch(imageUrl);
  var blob = await res.blob();

  return new Promise((resolve, reject) => {
    var reader  = new FileReader();
    reader.addEventListener("load", function () {
        resolve([reader.result, idx]);
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
                        setTimeout(function() {get_images();}, 2000);
                }

}

function get_images() {
        var resources = window.performance.getEntriesByType("resource");
        resources.forEach(function (resource) {
                var url = resource.name;
                if (url.includes('&pg=') && url.startsWith("https://books.google.at/books/content?"))
                        urls.push(url);
        });

	sort_urls();
        create_pdf();
}


function create_pdf(){
	var promises = [];	

	for(var j = 0; j < urls.length; j++)
	{ 
		if(urls[j] !== undefined){
			promises.push(getBase64ImageFromUrl(urls[j], j)
    				.then(function(result) {
					base64_uris.push(result);
				})
    				.catch(err => console.error(err)));	
		}
	}

	Promise.all(promises).then(function(result) {
		base64_uris.sort(compare);
		assemble_pdf(result);
	});

	function compare(result1, result2){
		if(result1[1] < result2[1]) return -1;
		else if(result1[1]  == result2[2]) return 0;
		else return 1;
	}
} 


scrolling();
