async function showCrafts() {
    let response = await fetch("http://localhost:3000/api/crafts");
    let craftJSON = await response.json();
    let mainContent = document.getElementById("content");
    let iteration = 1;

    craftJSON.forEach((craft) => {

        /* Setting up Modal */
        const modal = document.createElement("div");
        modal.classList.add("modal");


        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");
        modal.append(modalContent);

        const span = document.createElement("span");
        span.innerHTML = "&times;";
        span.classList.add("close");
        span.onclick = function() {
            modal.style.display = "none";
        }
        modalContent.append(span);
        mainContent.append(modal);

        let img = document.createElement("img");
        img.src = "images/" + craft.image;
        

        /* Populating Modal */
        const rowSection = document.createElement("section");
        rowSection.classList.add("row");
        let modalImg = document.createElement("img");
        modalImg.src = "images/" + craft.image;
        modalImg.style.marginRight = "20px";
        rowSection.append(modalImg);

        const sectionDetails = document.createElement("div");
        let h1 = document.createElement("h1");
        h1.innerHTML = craft.name;
        sectionDetails.append(h1);
        

        let p = document.createElement("p");
        p.innerHTML = craft.description;
        sectionDetails.append(p);

        let h2 = document.createElement("h2");
        h2.innerHTML = "Supplies";
        sectionDetails.append(h2);

        let ul = document.createElement("ul");
        craft.supplies.forEach((supply) => {
            ul.append(getLi(supply))
        })
        sectionDetails.append(ul);
        
        rowSection.append(sectionDetails);
        modalContent.append(rowSection);

        /* Creating Image Grid */ 
        
        let posDiv = document.getElementById("col-" + iteration);
        posDiv.append(img);
        img.onclick = function() {
            modal.style.display = "block";
        }

        iteration += 1;
        if (iteration >= 5) {
            iteration = 1;
        }
    })   
}

function getLi (data) {
    let li = document.createElement("li");
    li.textContent = data;
    return li;
}


window.onload = () => {
    showCrafts();
    
}