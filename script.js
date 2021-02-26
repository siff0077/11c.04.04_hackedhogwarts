"use strict";

window.addEventListener("load", init);


//Globals
let json;
const link = "https://petlatkea.dk/2021/hogwarts/students.json";
const allStudents = [];
let temp = document.querySelector("template");
let container = document.querySelector("section");
let filterType = "all";
let sortBy = "sorting";
const search = document.querySelector(".search");
search.addEventListener("input", searching);
let displayedStudentsCount = document.querySelector("#studentcount");

const bloodLink = "https://petlatkea.dk/2021/hogwarts/families.json";
let bloodStatus; 

// the "start"-function
function init() {
  console.log("init");

  readButtons();
  fetchStudentData();
}


//SEARCH
function searching(event) {
  let searchList = allStudents.filter((student) => {
    let name = "";
    if (student.lastname === null) {
      name = student.firstname;
    } else {
      name = student.firstname + " " + student.lastname;
    }
    return name.toLowerCase().includes(event.target.value);
  });

  //Show number of students
  displayedStudentsCount.textContent = `Students: ${searchList.length}`;
  displayStudents(searchList);
}


function readButtons() {
  //adds eventlistener to each of the filterbuttons
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectedFilter));

  //looks after any changes in the options --> #sortingList
  document.querySelector("#sortingList").onchange = function () {
    selectedSort(this.value);
  };
}


function selectedFilter(event) {
  //Checks which button is clicked
  const filter = event.target.dataset.filter;
  console.log(`Use this ${filter}`);
  setFilter(filter);
}


function setFilter(filter) {
  filterType = filter;
  buildList();
}


function filterList(filteredList) {
  //adds the specific students to filteredList
  if (filterType === "gryffindor") {
    filteredList = allStudents.filter(selectedGryffindor);
  } else if (filterType === "hufflepuff") {
    filteredList = allStudents.filter(selectedHufflepuff);
  } else if (filterType === "ravenclaw") {
    filteredList = allStudents.filter(selectedRavenclaw);
  } else if (filterType === "slytherin") {
    filteredList = allStudents.filter(selectedSlytherin);
  } /* else if (filterType === "pureblood") {
    filteredList = allStudents.filter(selectedPureBlood);
  }else if (filterType === "halfblood") {
    filteredList = allStudents.filter(selectedHalfBlood);
  } */
  //TODO: filter on expelled and unexpelled

//Show number of students
displayedStudentsCount.textContent = `Students: ${filteredList.length}`;

  console.log(filteredList);
  return filteredList;
}




function selectedGryffindor(house) {
  //returns true if student's house is Gryffindor
  return house.house === "Gryffindor";
}


function selectedHufflepuff(house) {
  //returns true if student's house is Hufflepuff
  return house.house === "Hufflepuff";
}


function selectedRavenclaw(house) {
  //returns true if student's house is Ravenclaw
  return house.house === "Ravenclaw";
}


function selectedSlytherin(house) {
  //returns true if student's house is Slytherin
  return house.house === "Slytherin";
}

/* function selectedPureBlood(bloodstatus) {
  if (student.bloodstatus === "Pureblood") {
    return true;
  } else {
    return false;
  }
}

function selectedHalfBlood(bloodstatus) {
  if (student.bloodstatus === "Halfblood") {
    return true;
  } else {
    return false;
  }
} */


function selectedSort(event) {
  //checks what option is clicked
  sortBy = event;
  console.log(`Use this ${sortBy}`);
  buildList();
}


function sortList(sortedList) {
  //Calls certain function according to what is clicked

  if (sortBy === "firstname_a-z") {
    sortedList = sortedList.sort(sortByFirstnameAZ);
  } else if (sortBy === "firstname_z-a") {
    sortedList = sortedList.sort(sortByFirstnameZA);
  } else if (sortBy === "lastname_a-z") {
    sortedList = sortedList.sort(sortByLastnameAZ);
  } else if (sortBy === "lastname_z-a") {
    sortedList = sortedList.sort(sortByLastnameZA);
  } else if (sortBy === "house_a-z") {
    sortedList = sortedList.sort(sortByHouseAZ);
  } else if (sortBy === "house_z-a") {
    sortedList = sortedList.sort(sortByHouseZA);
  }

  return sortedList;
}


//sorting firstname a-z
function sortByFirstnameAZ(firstnameA, firstnameB) {
  if (firstnameA.firstname < firstnameB.firstname) {
    return -1;
  } else {
    return 1;
  }
}


//sorting firstname z-a
function sortByFirstnameZA(firstnameA, firstnameB) {
  if (firstnameA.firstname < firstnameB.firstname) {
    return 1;
  } else {
    return -1;
  }
}


//sorting lastname a-z
function sortByLastnameAZ(lastnameA, lastnameB) {
  if (lastnameA.lastname < lastnameB.lastname) {
    return -1;
  } else {
    return 1;
  }
}


//sorting lastname z-a
function sortByLastnameZA(lastnameA, lastnameB) {
  if (lastnameA.lastname < lastnameB.lastname) {
    return 1;
  } else {
    return -1;
  }
}


//sorting house a-z
function sortByHouseAZ(houseA, houseB) {
  if (houseA.house < houseB.house) {
    return -1;
  } else {
    return 1;
  }
}


//sorting house z-a
function sortByHouseZA(houseA, houseB) {
  if (houseA.house < houseB.house) {
    return 1;
  } else {
    return -1;
  }
}


function buildList() {
  let currentList = filterList(allStudents);
  currentList = sortList(currentList);

  displayStudents(currentList);
}


async function fetchStudentData() {
  const respons = await fetch(link);
  json = await respons.json();

  const responsBlood = await fetch(bloodLink);
  bloodStatus = await responsBlood.json();
  prepareObjects(json);
}


async function fetchBloodData() {
  const respons = await fetch(bloodLink);
  bloodStatus = await respons.json();
} 


function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {

    // TODO: Create new object with cleaned data - and store that in the allStudents array
    //Create new object
    const Student = {
      firstname: "",
      lastname: "",
      middlename: "",
      nickname: "",
      photo: "",
      house: "",
      gender: "",
      bloodStatus: "",
      prefect: false,
      inquisitorial: false,
      expelled: false,
    };


    //Create the new object from the empty object template
    const student = Object.create(Student);

    //Define names
    const fullname = jsonObject.fullname.trim();

    const fullName = jsonObject.fullname.toLowerCase().trim();
    const splitFullName = fullName.split(" ");

    const firstSpaceBeforeName = fullName.indexOf(" ");
    const lastSpaceBeforeName = fullName.lastIndexOf(" ");

    const firstQuotationMark = fullName.indexOf('"');
    const lastQuotationMark = fullName.indexOf('"');

    let lastName = "";
    let indexhyphen = 0;
    let firstLetterAfterHyphen = "";
    let smallLettersAfterHyphen = "";

    //Firstname inserts in index 0
    let firstName =
      splitFullName[0].substring(0, 1).toUpperCase() +
      splitFullName[0].substring(1);

    student.firstname = firstName;

    if (splitFullName.length > 1) {
      //Lastname inserts in at lastIndexOf
      lastName =
        splitFullName[splitFullName.length - 1].substring(0, 1).toUpperCase() +
        splitFullName[splitFullName.length - 1].substring(1);

      //Check for a hyphen in lastname
      indexhyphen = lastName.indexOf("-");
      if (indexhyphen != -1) {
        const nameBeforeHyphen = lastName.substring(0, indexhyphen + 1);
        firstLetterAfterHyphen = lastName
          .substring(indexhyphen + 1, indexhyphen + 2)
          .toUpperCase();
        smallLettersAfterHyphen = lastName.substring(indexhyphen + 2);
        lastName =
          nameBeforeHyphen + firstLetterAfterHyphen + smallLettersAfterHyphen;
      }

      student.lastname = lastName;

      //Middlename inserts in index 2
      let middlename = "";
      let nickname = null;
      if (splitFullName.length > 2) {
        if (splitFullName[1].indexOf('"') >= 0) {
          nickname = splitFullName[1].replaceAll('"', "");

          nickname =
            nickname.substring(0, 1).toUpperCase() + nickname.substring(1);
          middlename = null;
        } else {
          middlename =
            splitFullName[1].substring(0, 1).toUpperCase() +
            splitFullName[1].substring(1);
          nickname = null;
        }
      } else {
        middlename = null;
      }

      student.middlename = middlename;
      student.nickname = nickname;


    } else {
      student.lastname = null;
      student.middlename = null;
      student.nickname = null;
    }

    //Photos
    if (student.lastname != null) {
      if (indexhyphen == -1) {
        if (student.firstname == "Padma" || student.firstname == "Parvati") {
          student.photo =
            lastName.toLowerCase() +
            "_" +
            firstName.substring(0).toLowerCase() +
            ".png";
        } else {
          student.photo =
            lastName.toLowerCase() +
            "_" +
            firstName.substring(0, 1).toLowerCase() +
            ".png";
        }
      } else {
        student.photo =
          firstLetterAfterHyphen.toLocaleLowerCase() +
          smallLettersAfterHyphen +
          "_" +
          firstName.substring(0, 1).toLowerCase() +
          ".png";
      }
    } else {
      student.photo = null;
    }

    //Define the house
    const house = jsonObject.house.toLowerCase().trim();
    student.house = house.substring(0, 1).toUpperCase() + house.substring(1);

    //Define the gender
    const genderTrimmed = jsonObject.gender.substring(0).trim();
    student.gender = genderTrimmed.substring(0, 1).toUpperCase() + genderTrimmed.substring(1).toLowerCase();

    //Prefect
    student.prefect = false;

    //Define bloodstatus
    student.bloodStatus = addBloodStatusToStudent(student);

    //Show number of students
    displayedStudentsCount.textContent = `Students: ${allStudents.length}`;

    //Adds all objects "students" to the AllStudents-array
    allStudents.push(student);
  });
  displayStudents(allStudents);
}


function addBloodStatusToStudent(student) {
  if (bloodStatus.half.indexOf(student.lastname) != -1) {
    return "Halfblood";
  } else if (bloodStatus.pure.indexOf(student.lastname) != -1) {
    return "Pureblood";
  } else {
    return "Muggleborn";
  }
}


function displayStudents(students) {
  console.log(students);
  container.innerHTML = "";
  students.forEach((student) => {
    const klon = temp.cloneNode(true).content;
    if (student.lastname == null) {
      klon.querySelector(".fullname").textContent = student.firstname;
    } else {
      klon.querySelector(".fullname").textContent =
        student.firstname + " " + student.lastname;
    }
    if (student.photo != null) {
      klon.querySelector("img").src = "images/" + student.photo;
    }

    klon.querySelector(".house").textContent = student.house;
     

    klon
      .querySelector("article")
      .addEventListener("click", () => displayStudentPopup(student));

    container.appendChild(klon);
  });
}


function displayStudentPopup(student) {
  popup.style.display = "block";

if (student.prefect != true) {
  document.querySelector("#prefect_button").classList.remove("clicked_button");
} else {
  document.querySelector("#prefect_button").classList.add("clicked_button");
}

  if (student.middlename == null && student.nickname == null) {
    if (student.lastname == null) {
      popup.querySelector("h2").textContent = student.firstname;
    } else {
      popup.querySelector("h2").textContent =
        student.firstname + " " + student.lastname;
    }
  } else if (student.middlename != null) {
    popup.querySelector("h2").textContent =
      student.firstname + " " + student.middlename + " " + student.lastname;
  } else if (student.nickname != null) {
    popup.querySelector("h2").textContent =
      student.firstname +
      " " +
      '"' +
      student.nickname +
      '"' +
      " " +
      student.lastname;
  }
  
  popup.querySelector(".house").textContent = student.house;
  popup.querySelector(".gender").textContent = student.gender;

  popup.querySelector("#house_crest").src = "crests/" + student.house + ".png";
  if (student.photo != null) {
    popup.querySelector("img").src = "images/" + student.photo;
  }

  popup.querySelector(".bloodstatus").textContent = student.bloodStatus;


  document.querySelector("#close").addEventListener("click", () => {
    
    popup.style.display = "none";

   
  });


  //Div where the theme color will show
const color_of_house = document.querySelector('#color_of_house');
//Color for each house
//Code from - https://www.w3schools.com/js/js_switch.asp
switch (true) {
  //If there is a match, the associated block of code is executed
  //If there is no match, the default code block is executed (white background)
  case student.house === 'Gryffindor':
    color_of_house.setAttribute('style', 'background: linear-gradient(180deg, rgba(95,27,5,1) 0%, rgba(121,35,9,1) 25%, rgba(166,62,6,1) 50%, rgba(207,74,3,1) 75%, rgba(255,101,0,1) 100%);'); 
    break;
  case student.house === 'Slytherin':
    color_of_house.setAttribute('style', 'background: linear-gradient(360deg, rgba(42,98,61,1) 0%, rgba(26,71,42,1) 50%, rgba(0,0,0,1) 100%);');
    break;
  case student.house === 'Hufflepuff':
    color_of_house.setAttribute('style', 'background: linear-gradient(180deg, rgba(36,30,0,1) 0%, rgba(121,105,9,1) 25%, rgba(169,157,6,1) 50%, rgba(214,188,3,1) 75%, rgba(255,223,0,1) 100%);');
    break;
  case student.house === 'Ravenclaw':
    color_of_house.setAttribute('style', 'background: linear-gradient(360deg, rgba(34,47,91,1) 0%, rgba(14,26,64,1) 75%, rgba(0,0,0,1) 100%);');
    break;


}
}
