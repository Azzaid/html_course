/**
 * Created by Johanas on 03.12.2017.
 */
const field = document.getElementById("previewField");
const images = ["images/gratitues/Link1.png","images/gratitues/Link2.png","images/gratitues/Link3.png","images/gratitues/Link4.jpeg"];

function showPreview(event) {
    field.href = event.target.href;
    field.style.backgroundImage = "url('" + images[event.target.id.slice(4)] + "')";
    console.log("url('" + images[event.target.id.slice(4)] + "')")
}
