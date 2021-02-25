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
  }
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
  prepareObjects(json);
}


function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {

    // TODO: Create new object with cleaned data - and store that in the allStudents array
    //Create new object
    const studentTemplate = {
      firstname: "-not set yet-",
      lastname: "-not set yet-",
      middlename: "-not set yet-",
      nickname: "-not set yet-",
      photo: "-not set yet-",
      house: "-not set yet-",
    };

    const fullname = jsonObject.fullname.trim();

    const fullName = jsonObject.fullname.toLowerCase().trim();
    const splitFullName = fullName.split(" ");
    const house = jsonObject.house.toLowerCase().trim();

    const firstSpaceBeforeName = fullName.indexOf(" ");
    const lastSpaceBeforeName = fullName.lastIndexOf(" ");

    const firstQuotationMark = fullName.indexOf('"');
    const lastQuotationMark = fullName.indexOf('"');

    let lastName = "";
    let indexhyphen = 0;
    let firstLetterAfterHyphen = "";
    let smallLettersAfterHyphen = "";

    //Create the new object from the empty object template
    const student = Object.create(studentTemplate);

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

    student.house = house.substring(0, 1).toUpperCase() + house.substring(1);

    student.gender = jsonObject.gender;

    //Show number of students
    displayedStudentsCount.textContent = `Students: ${allStudents.length}`;

    //Adds all objects "students" to the AllStudents-array
    allStudents.push(student);
  });
  displayStudents(allStudents);
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

  document.querySelector("#close").addEventListener("click", () => (popup.style.display = "none"));


}