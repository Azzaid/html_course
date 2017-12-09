/**
 * Created by Johanas on 01.12.2017.
 */
class NewsBlock {
    constructor () {
        this.isOpen = false;
        this.news = document.getElementsByClassName("newsPost");
        this.domObj = document.getElementById("newsBlock");
        this.currentNews = 1;
    }
    togle(){
        if (this.isOpen) {
            this.domObj.classList.remove("expanded");

            this.nextBlock.classList.remove("newsPost__next");
            this.currentBlock.classList.remove("newsPost__current");
            this.prevBlock.classList.remove("newsPost__prev");
            console.log("collapse");
            this.isOpen = false;
        } else {
            this.domObj.classList.add("expanded");

            this.nextBlock = this.news[this.currentNews+1];
            this.nextBlock.classList.add("newsPost__next");
            this.currentBlock = this.news[this.currentNews];
            this.currentBlock.classList.add("newsPost__current");
            this.prevBlock = this.news[this.currentNews-1];
            this.prevBlock.classList.add("newsPost__prev");
            console.log("expande");
            this.isOpen = true;
        }

    }
    nextNews() {
        if (this.currentNews<(this.news.length-1)) {
            this.currentNews+=1;
            this.nextBlock.classList.remove("newsPost__next");
            this.nextBlock = this.news[this.currentNews+1];
            this.nextBlock.classList.add("newsPost__next");
            this.currentBlock.classList.remove("newsPost__current");
            this.currentBlock = this.news[this.currentNews];
            this.currentBlock.classList.add("newsPost__current");
            this.prevBlock.classList.remove("newsPost__prev");
            this.prevBlock = this.news[this.currentNews-1];
            this.prevBlock.classList.add("newsPost__prev");
        }
    }
    prevNews() {
        if (this.currentNews>2){
            this.currentNews-=1;
            this.nextBlock.classList.remove("newsPost__next");
            this.nextBlock = this.news[this.currentNews+1];
            this.nextBlock.classList.add("newsPost__next");
            this.currentBlock.classList.remove("newsPost__current");
            this.currentBlock = this.news[this.currentNews];
            this.currentBlock.classList.add("newsPost__current");
            this.prevBlock.classList.remove("newsPost__prev");
            this.prevBlock = this.news[this.currentNews-1];
            this.prevBlock.classList.add("newsPost__prev");
        }
    }
}

const newsBlock = new NewsBlock();

$(".jumbatrone").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 2000,

    responsive: [
        {
            breakpoint: 800,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
});

class Rules {
    constructor () {
        this.rulesIsOpen = false;
        this.ruleset = document.getElementById("ruleset");
    }
    expandRuleset(){
        if (this.rulesIsOpen) {
            this.ruleset.classList.remove("visible_rules");
            this.rulesIsOpen = false;
        } else {
            this.ruleset.classList.add("visible_rules");
            this.rulesIsOpen = true;
        }
    }
}

const rules = new Rules();

