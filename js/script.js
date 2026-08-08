// ===============================
// Smooth Scroll for Navigation
// ===============================

const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const targetId = this.getAttribute("href");

        const targetSection = document.querySelector(targetId);

        window.scrollTo({

            top: targetSection.offsetTop - 70,

            behavior: "smooth"

        });

    });

});


// ===============================
// Scroll Reveal Animation
// ===============================

const revealElements = document.querySelectorAll(
    ".about, .card, .address-box, .section-title"
);

function revealOnScroll() {

    const windowHeight = window.innerHeight;

    revealElements.forEach(element => {

        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 120) {

            element.style.opacity = "1";

            element.style.transform = "translateY(0)";

        }

    });

}

revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform = "translateY(50px)";

    element.style.transition = "all 0.8s ease";

});

window.addEventListener("scroll", revealOnScroll);

window.addEventListener("load", revealOnScroll);


// ===============================
// Hero Button Animation
// ===============================

const heroButton = document.querySelector(".hero-btn");

heroButton.addEventListener("mouseenter", () => {

    heroButton.style.transform = "scale(1.08)";

});

heroButton.addEventListener("mouseleave", () => {

    heroButton.style.transform = "scale(1)";

});


// ===============================
// Card Hover Animation
// ===============================

const cards = document.querySelectorAll(".card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.boxShadow = "0 18px 35px rgba(0,0,0,0.25)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";

    });

});


// ===============================
// Navbar Background Change
// ===============================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        navbar.style.background = "#0f172a";

        navbar.style.transition = "0.4s";

    } else {

        navbar.style.background = "rgba(0,0,0,.75)";

    }

});


// ===============================
// Active Navigation
// ===============================

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});


// ===============================
// Get Directions Button
// ===============================

const locationButton = document.querySelector(".location-btn");

locationButton.addEventListener("click", () => {

    window.open(
        "https://www.google.com/maps/search/Opposite+Sankarapuram+Boys+School+Sankarapuram+Kallakurichi",
        "_blank"
    );

});


// ===============================
// Welcome Message
// ===============================

window.addEventListener("load", () => {

    setTimeout(() => {

        console.log("🏆 Welcome to RAJ SPORTS SHOP");

    }, 500);

});


// ===============================
// Button Ripple Effect
// ===============================

const buttons = document.querySelectorAll(".hero-btn, .card-btn, .location-btn");

buttons.forEach(button => {

    button.addEventListener("click", function(e){

        let ripple = document.createElement("span");

        ripple.className = "ripple";

        ripple.style.left = e.offsetX + "px";

        ripple.style.top = e.offsetY + "px";

        this.appendChild(ripple);

        setTimeout(()=>{

            ripple.remove();

        },600);

    });

});


// ===============================
// Scroll To Top Button (Optional)
// ===============================

const scrollBtn = document.createElement("button");

scrollBtn.innerHTML = "⬆";

scrollBtn.id = "topBtn";

document.body.appendChild(scrollBtn);

scrollBtn.style.position = "fixed";
scrollBtn.style.bottom = "25px";
scrollBtn.style.right = "25px";
scrollBtn.style.width = "50px";
scrollBtn.style.height = "50px";
scrollBtn.style.border = "none";
scrollBtn.style.borderRadius = "50%";
scrollBtn.style.background = "#00c853";
scrollBtn.style.color = "white";
scrollBtn.style.fontSize = "22px";
scrollBtn.style.cursor = "pointer";
scrollBtn.style.display = "none";
scrollBtn.style.boxShadow = "0 5px 15px rgba(0,0,0,.3)";
scrollBtn.style.zIndex = "999";

window.addEventListener("scroll", () => {

    if(window.scrollY > 400){

        scrollBtn.style.display = "block";

    }else{

        scrollBtn.style.display = "none";

    }

});

scrollBtn.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});