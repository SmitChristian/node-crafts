async function getCrafts() {
    try {
        return (await fetch("api/crafts/")).json();
    } catch (error) {
        console.log(error);
    }
}

function clearPage() {
    const col1 = document.getElementById("col-1");
    const col2 = document.getElementById("col-2");
    const col3 = document.getElementById("col-3");
    const col4 = document.getElementById("col-4");
    col1.innerHTML = "";
    col2.innerHTML = "";
    col3.innerHTML = "";
    col4.innerHTML = "";
    
}

function changeModalImage() {
    console.log("Changing Modal Image");
    const mImage = document.getElementById("modal-image");
    const fImage = document.getElementById("file_picker").files[0];
    
    var reader = new FileReader();
    reader.onload = function() {
        mImage.src = this.result;
    }
    reader.readAsDataURL(fImage);
}


async function showCrafts() {
    let craftJSON = await getCrafts();
    let mainContent = document.getElementById("content");
    let iteration = 1;
    clearPage();

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
        img.src = "https://node-crafts-15.onrender.com/images/" + craft.image;

        

        /* Populating Modal */
        const rowSection = document.createElement("section");
        rowSection.classList.add("row");
        let modalImg = document.createElement("img");
        modalImg.src = "https://node-crafts-15.onrender.com/images/" + craft.image;
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

function closeChangeModal () {
    const changeModal = document.getElementById("change-modal");
    changeModal.style.display = "none";
}

function openChangeModal () {
    const changeModal = document.getElementById("change-modal");
    changeModal.style.display = "block";
    resetForm();
}

function resetForm () {
    const changeModalForm = document.getElementById("add-content");
    changeModalForm.reset();
    changeModalForm._id = "-1";
    document.getElementById("supply-text").innerHTML = "";
    document.getElementById("modal-image").src = "images/200x300.webp";
}

async function addCraft (e) {
    e.preventDefault();
    
    const form = document.getElementById("add-content");
    const formData = new FormData();
    formData.append("_id", form._id.value);
    formData.append("name", form.name.value);
    formData.append("image", form.file_picker.files[0]);
    formData.append("description", form.description.value);
    formData.append("supplies", getSupplyList());

    let response;
    if(form._id.value == -1) {
        formData.delete("_id");

        response = await fetch("/api/crafts", {
            method: "POST",
            body: formData
        });
    }

    if(response.status != 200) {
        console.log("Error contacting server");
        return;
    }
    await response.json();
    closeChangeModal();
    resetForm();
    showCrafts();

}

function getSupplyList () {
    const inputs = document.querySelectorAll("#supply-text input");
    const supplies = [];

    inputs.forEach((input) => {
        supplies.push(input.value);
    })

    return supplies;
}

function addSupply () {
    const supplyList = document.getElementById("supply-text");
    const newSupply = document.createElement("input");
    newSupply.type = "text";

    supplyList.append(newSupply);
}

window.onload = () => {
    showCrafts();
    document.getElementById("add-content").onsubmit = addCraft;
    document.getElementById("add_button").onclick = addSupply;
    
}