'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}

const apiURL = "https://itzpire.com/information/news-indonesia/antara/terbaru";
        

        // Fetch and display blog posts
        fetch(apiURL)
        .then(res => res.json())
        .then(data => {
            const blogPostsList = document.getElementById("blogPostsList");
            blogPostsList.innerHTML = ''; // Clear any existing content

            data.data.posts.forEach(post => {
                const coverImg = post.thumbnail;
                const judul = post.title;
                const deskripsi = post.description;
                const tanggal = post.pubDate;
                const link = post.link;

                const li = document.createElement("li");
                li.classList.add("blog-post-item");

                const a = document.createElement("a");
                a.href = link;

                const figure = document.createElement("figure");
                figure.classList.add("blog-banner-box");
                const img = document.createElement("img");
                img.src = coverImg;
                img.alt = judul;
                img.loading = "lazy";
                figure.appendChild(img);

                const divContent = document.createElement("div");
                divContent.classList.add("blog-content");

                const divMeta = document.createElement("div");
                divMeta.classList.add("blog-meta");
                const categoryP = document.createElement("p");
                categoryP.classList.add("blog-category");
                categoryP.textContent = "News"; 
                const dotSpan = document.createElement("span");
                dotSpan.classList.add("dot");
                const timeElement = document.createElement("time");
                timeElement.dateTime = new Date(tanggal).toISOString();
                timeElement.textContent = new Date(tanggal).toLocaleDateString();
                divMeta.appendChild(categoryP);
                divMeta.appendChild(dotSpan);
                divMeta.appendChild(timeElement);

                const h3 = document.createElement("h3");
                h3.classList.add("h3");
                h3.classList.add("blog-item-title");
                h3.textContent = judul;

                const p = document.createElement("p");
                p.classList.add("blog-text");
                p.textContent = deskripsi.length > 100 ? deskripsi.substring(0, 99) + "..." : deskripsi;

                divContent.appendChild(divMeta);
                divContent.appendChild(h3);
                divContent.appendChild(p);

                a.appendChild(figure);
                a.appendChild(divContent);

                li.appendChild(a);
                blogPostsList.appendChild(li);
            });
        });

       


        document.addEventListener("DOMContentLoaded", () => {
          const form = document.querySelector("[data-form]");
          const formInputs = document.querySelectorAll("[data-form-input]");
          const formBtn = document.querySelector("[data-form-btn]");
        
          // add event to all form input fields
          formInputs.forEach(input => {
            input.addEventListener("input", () => {
              // check form validation
              formBtn.disabled = !form.checkValidity();
            });
          });
        
          // Function to send data to Telegram
          function send() {
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const pesan = document.getElementById("pesan").value;
            
            const gabungan = `nama%3A%0A${encodeURIComponent(name)}%0Aemail%3A%0A${encodeURIComponent(email)}%0Apesan%3A%0A${encodeURIComponent(pesan)}`;
            
            const token = '7339479583:AAGHoW-Zg271MeGR4cHPTGV-LL82z8Mg5jU';
            const grup = '1898287814';
        
            return fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${grup}&text=${gabungan}&parse_mode=html`, {
              method: 'POST',
            })
            .then(response => response.json())
            .then(data => {
              if (data.ok) {
                console.log("Pesan berhasil dikirim!");
                return true; // Indicate success
              } else {
                console.error("Gagal mengirim pesan:", data.description);
                return false; // Indicate failure
              }
            })
            .catch(error => {
              console.error("Terjadi kesalahan:", error);
              return false; // Indicate failure
            });
          }
        
          // Handle form submission
          form.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent the default form submission
        
            send().then(success => {
              if (success) {
                form.reset(); // Reset the form if the message was sent successfully
              }
            });
          });
        });
        




// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}
