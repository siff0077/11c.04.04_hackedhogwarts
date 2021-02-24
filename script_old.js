"use strict"

window.addEventListener("load", start);


//Array
const allStudents = [];

//prototype-object
const Student = {
    firstname: "",
    /* nickname: "", */
    middlename: "",
    lastname: "", 
    house: ""
};


//Start
function start() {
    console.log("start");

    loadJson();
}

//get JsonData
function loadJson() {
    fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then( response => response.json() )
    .then( jsonData => { 
        // when loaded, prepare objects
        prepareObjects(jsonData);
    });
}


//Prepare object and clean JsonData
function prepareObjects(jsonData){
    jsonData.forEach(jsonObject => {

    //Cleaned JsonData
    //find first and last space
    const firstSpace = jsonObject.fullname.trim().indexOf(" ");
    const lastSpace = jsonObject.fullname.trim().lastIndexOf(" ");

    //Divide in firstName, MiddleName and lastName
    const firstName = jsonObject.fullname.trim().substring(0, firstSpace);
    const middleName = jsonObject.fullname.substring(firstSpace,lastSpace).trim();
    const lastName = jsonObject.fullname.trim().substring(lastSpace).trim();
    const nickName = "";

     if (middleName.substring(0, 1) === '"') {
        nickName === middleName;
        middleName === "";
    }

    //Make the first letters capitalized
    const firstNameCap = firstName.substring(0, 1).toUpperCase() + firstName.substring(1, firstSpace).toLowerCase();
    const middleNameCap = middleName.substring(0, 1).toUpperCase() + middleName.substring(1, middleName.length).toLowerCase();
    const lastNameCap = lastName.substring(0, 1).toUpperCase() + lastName.substring(1).toLowerCase();
    const nickNameCap = middleName.substring(0, 1).toUpperCase() + middleName.substring(1, middleName.length).toLowerCase();

    //Define the gender
    const gender = jsonObject.gender.substring(0).trim();
    const genderCap = gender.substring(0, 1).toUpperCase() + gender.substring(1).toLowerCase();

    //Define the 'House'
    const house = jsonObject.house.substring(0).trim();
    const houseCap = house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase();


    //Create new object
    const student = Object.create(Student);
    student.firstNameCap = firstNameCap;
    student.middleNameCap = middleNameCap;
    student.lastNameCap = lastNameCap;
    student.nickNameCap = nickNameCap;
    student.genderCap = genderCap;
    student.houseCap = houseCap;
    allStudents.push(student);

    console.log(student);

    });

displayList();
}



function filterList() {
    //create a filtered list
    const filteredList = allStudents.filter(selectedGryffindor);

    displayList(filteredList);
}

function selectedGryffindor(student) {
    return student.genderCap === "Girl";
}





function displayList(){
    console.log("displayList");

    //clear list
    document.querySelector("#list tbody").innerHTML = ""; //<----innerHTML   ?????

    //make a new list
    allStudents.forEach(displayStudents);
}

function displayStudents(student) {
    //Create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    //clone-data
    clone.querySelector("[data-field=firstname]").textContent = student.firstNameCap;
    clone.querySelector("[data-field=middlename]").textContent = student.middleNameCap;
    clone.querySelector("[data-field=lastname]").textContent = student.lastNameCap;
    clone.querySelector("[data-field=nickname]").textContent = student.nickNameCap;
    clone.querySelector("[data-field=gender]").textContent = student.genderCap;
    clone.querySelector("[data-field=house]").textContent = student.houseCap;

    //add photos
    clone.querySelector("img").scr = `/images/${student.lastNameCap}_${student.firstNameCap.charAt(0)}.png`;

    //append/add clone to the list
    document.querySelector("#list tbody").appendChild(clone);

    console.log("displayStudents");

}

