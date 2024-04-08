var deleteCraft;


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

    //console.log("CRAFT");
    //console.log(craftJSON);

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
        img.id = "baseImg" + craft._id;
        img.src = "images/" + craft.image;

        

        /* Populating Modal */
        const rowSection = document.createElement("section");
        rowSection.classList.add("row");
        let modalImg = document.createElement("img");
        modalImg.src = "images/" + craft.image;
        modalImg.style.marginRight = "20px";
        rowSection.append(modalImg);

        const sectionDetails = document.createElement("div");

        let headerEditDelete = document.createElement("div");
        headerEditDelete.classList.add("row");
        let h1 = document.createElement("h1");
        h1.innerHTML = craft.name;
        headerEditDelete.append(h1);
        sectionDetails.append(headerEditDelete);

        let edit = document.createElement("span");
        edit.innerHTML = "&#10000;";
        edit.classList.add("otherButtons");
        edit.onclick = function() {
            modal.style.display = "none";
            openEditModal(craft);
            
        }
        headerEditDelete.append(edit);



        let del = document.createElement("delete");
        del.innerHTML = "&times;";
        del.classList.add("otherButtons");
        del.onclick = function() {
            modal.style.display = "none";
            openDelModal(craft);
        }
        headerEditDelete.append(del);
        

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
    document.getElementById("add-title").innerHTML = "Add a Craft!"
    changeModal.style.display = "block";
    resetForm();
}

function closeDelModal () {
    const delModal = document.getElementById("del-modal");
    delModal.style.display = "none";
}

function openEditModal (craft) {
    openChangeModal();
    document.getElementById("add-title").innerHTML = "Make Changes To Your Crafts!";
    populateEditForm(craft);

}

function openDelModal (craft) {
    const delModal = document.getElementById("del-modal");
    delModal.style.display = "block";
    deleteCraft = craft;
}

function populateEditForm (craft) {
    const form = document.getElementById("add-content");
    form._id.value = craft._id;
    form.name.value = craft.name;
    form.description.value = craft.description;
    document.getElementById("modal-image").src = "images/" + craft.image;

    populateSupplies(craft.supplies);
}

function populateSupplies (supplies) {
    const section = document.getElementById("supply-text")
    supplies.forEach((supply) => {
        const newSupply = document.createElement("input");
        newSupply.type = "text";
        newSupply.value = supply;
        section.append(newSupply);
    })
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
        console.log("Running POST");

        response = await fetch("/api/crafts", {
            method: "POST",
            body: formData
        });
    }

    else {
        console.log("Edit Mode");
        formData.forEach((dataPut) => {
            console.log(dataPut);
        })
        //console.log("Form Data: ", formData);
        response = await fetch(`/api/crafts/${form._id.value}`, {
            method: "PUT",
            body: formData
        });
    }

    if(response.status != 200) {
        console.log("Error contacting server");
        return;
    }
    response = await response.json();

    closeChangeModal();
    resetForm();
    showCrafts();
    

}

async function delCraft() {
    console.log("Deleting!");
    const craft = deleteCraft;
    let response = await fetch(`/api/crafts/${craft._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
    })

    if(response.status != 200) {
        console.log("Error deleting");
        return;
    }

    let result = await response.json();
    closeDelModal();
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