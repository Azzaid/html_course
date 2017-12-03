/**
 * Created by Johanas on 03.12.2017.
 */
const field = document.getElementById("previewField");

function showPreview(event) {
    field.src = event.target.href;
    console.log(field.src);
}

function hidePreview() {
    field.src="//ru.wiktionary.org/wiki/%D0%B1%D0%BB%D0%B0%D0%B3%D0%BE%D0%B4%D0%B0%D1%80%D0%BD%D0%BE%D1%81%D1%82%D1%8C";
    console.log(field.src);
}