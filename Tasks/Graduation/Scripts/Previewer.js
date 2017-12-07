/**
 * Created by Johanas on 03.12.2017.
 */
const field = document.getElementById("previewField");
const images = ["images/redButton.png","images/Zlogo.png"];

function showPreview(event) {
    field.href = event.target.href;
    field.style.backgroundImage = "url('" + images[event.target.id.slice(4)] + "')";
    console.log("url('" + images[event.target.id.slice(4)] + "')")
}
