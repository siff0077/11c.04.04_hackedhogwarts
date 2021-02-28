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

let expelledStudents = [];
let selectedStudent;

let systemHacked = false;

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

// the "start"-function
function init() {
  console.log("init");

  document.querySelector("#hackthesystem").addEventListener("click", hackTheSystem);

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
  console.log(`filtered by ${filter}`);
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
  } else if (filterType === "boy") {
    filteredList = allStudents.filter(selectedBoys);
  } else if (filterType === "girl") {
    filteredList = allStudents.filter(selectedGirls);
  } 
  //TODO: filter on expelled and unexpelled
  else if (filterType === "expelled") {
    filteredList = expelledStudents;

    console.log(expelledStudents);
  }

//Show number of students
displayedStudentsCount.textContent = `Number of displayed students: ${filteredList.length}`;

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
  //returns true if student's house is Ravenclaw
  return house.house === "Slytherin";
}


function selectedBoys(gender) {
  //returns true if student's house is Slytherin
  return gender.gender === "Boy";
}

function selectedGirls(gender) {
  //returns true if student's house is Slytherin
  return gender.gender === "Girl";
}


function selectedSort(event) {
  //checks what option is clicked
  sortBy = event;
  console.log(`Sorted by: ${sortBy}`);
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


/* async function fetchBloodData() {
  const respons = await fetch(bloodLink);
  bloodStatus = await respons.json();
}  */


function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {

    /* // TODO: Create new object with cleaned data - and store that in the allStudents array
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
    }; */


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

  if (student.expelled != true) {
    document.querySelector("#expell_button").classList.remove("button_clicked");
  } else {
    document.querySelector("#expell_button").classList.add("button_clicked");
  }

  if (student.prefect != true) {
    document.querySelector("#prefect_button").classList.remove("button_clicked");
  } else {
    document.querySelector("#prefect_button").classList.add("button_clicked");
  }

  if (student.squad != true) {
    document.querySelector("#inquisitorial_button").classList.remove("button_clicked");
  } else {
    document.querySelector("#inquisitorial_button").classList.add("button_clicked");
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

  //expell, prefect and squad
  document.querySelector("#expell_button").addEventListener("click", expell);

  document
    .querySelector("#prefect_button")
    .addEventListener("click", togglePrefect);

  document.querySelector("#inquisitorial_button").addEventListener("click", toggleInquisitorialMember);

  document.querySelector("#close").addEventListener("click", () => {
    popup.style.display = "none";

    document.querySelector("#expell_button").removeEventListener("click", () => {});
    document
      .querySelector("#prefect_button")
      .removeEventListener("click", () => {});
    document.querySelector("#inquisitorial_button").removeEventListener("click", () => {});
  })

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

  selectedStudent = student; 


}


function expell() {
    if (selectedStudent.lastname != "Leva") {
      //removes expelled student form allStudents list
      if (selectedStudent.expelled === false) {
        allStudents.splice(allStudents.indexOf(selectedStudent), 1);
        selectedStudent.expelled = true;
        selectedStudent.prefect = false;
        selectedStudent.squad = false;
        expelledStudents.push(selectedStudent);
        document.querySelector("#expell_button").classList.add("button_clicked");
        document.querySelector("#prefect_button").classList.remove("button_clicked");
        document.querySelector("#inquisitorial_button").classList.remove("button_clicked");
        console.log("expell student");
      } else {
        alert("!ERROR! - You have already expelled this student once... You can't do it twice...");
        console.log("This student has been expelled once");
      }
    } else {
      alert(`Bitch plz... U can't expell me 🧙‍♀️ ...but have you ever thought about this... If you remove the V and the T from Voldemort - he becomes much less scary... 🤣🤣🤣🤣`);
    }
  
    buildList();
  }
  
  function togglePrefect() {
    console.log("toggle prefect");
    if (selectedStudent.expelled === false) {
      const index = allStudents.indexOf(selectedStudent);
      if (selectedStudent.prefect === false) {
        CheckIfStudentCanBecomePrefect();
      } else {
        removePrefect(selectedStudent);
      }
    } else {
      alert("!ERROR! - An expelled student can't become a prefect!");
    }
  
    function CheckIfStudentCanBecomePrefect() {
      console.log("check if student can become prefect");
      const thePrefects = [];
      allStudents.filter((student) => {
        if (student.house === selectedStudent.house && student.prefect === true) {
          thePrefects.push(student);
        }
      });
      console.log(thePrefects.length);
      const numberOfPrefects = thePrefects.length;
      const anotherPrefect = [];
      thePrefects.filter((student) => {
        if (student.gender === selectedStudent.gender) {
          anotherPrefect.push(student);
        }
      });
      console.log(anotherPrefect.length);
      //if there is another of the same type
      if (anotherPrefect.length >= 1) {
        alert("!ERROR! - This student can't become a prefect! This house already has 2 prefects or 1 of the same gender. If this student is to become a prefect, you must remove another!");
      } else {
        console.log("add as prefect");
        makeStudentPrefect(selectedStudent);
      }
    }
  
    function removePrefect(studentPrefect) {
      document.querySelector("#prefect_button").classList.remove("button_clicked");
      const index = allStudents.indexOf(studentPrefect);
      allStudents[index].prefect = false;
    }
  
    function makeStudentPrefect(studentPrefect) {
      document.querySelector("#prefect_button").classList.add("button_clicked");
      const index = allStudents.indexOf(studentPrefect);
      allStudents[index].prefect = true;
    }
  }
  
  function toggleInquisitorialMember() {
    console.log("toggle squad");
    const index = allStudents.indexOf(selectedStudent);
    if (selectedStudent.expelled === false) {
      if (selectedStudent.squad === false) {
        checkIfStudentIsQualifiedAsInquisitorialMember();
      } else {
        removeInquisitorialMember();
      }
    } else {
      alert("!ERROR! - An expelled student can't become a member of The Inquisitorial Squad!");
    }
  
    function checkIfStudentIsQualifiedAsInquisitorialMember() {
      console.log("check if student can become inquisitorial");
      if (
        selectedStudent.bloodstatus === "Pure-blood" &&
        selectedStudent.house === "Slytherin"
      ) {
        makeInquisitorialMember();
      } else {
        alert(
          "Only pure-blooded students from Slytherin can join the Inquisitorial Squad! 🐍"
        );
      }
    }
  
    function makeInquisitorialMember() {
      if (systemHacked === true) {
        setTimeout(function () {
          toggleInquisitorialMember();
        }, 1000);
      }
      allStudents[index].squad = true;
      document.querySelector("#inquisitorial_button").classList.add("button_clicked");
    }
  
    function removeInquisitorialMember() {
      document.querySelector("#inquisitorial_button").classList.remove("button_clicked");
      if (systemHacked === true) {
        setTimeout(function () {
          alert("I present my compliments to you and beg you to keep your abnormally large nose out of other people's business 👃 ...No 'Inquisitorial Members' for you");
        }, 100);
      }
      allStudents[index].squad = false;
    }
  }
  
  function hackTheSystem() {
    if (systemHacked === false) {
      //add me to studentlist
      console.log("What is going on? Hacking is going on!");
      const helloItsMe = Object.create(Student);
      helloItsMe.firstname = "Siff";
      helloItsMe.lastname = "Leva";
      helloItsMe.middlename = "";
      helloItsMe.nickname = "";
      helloItsMe.photo = "me.png";
      helloItsMe.house = "Slytherin";
      helloItsMe.gender = "Girl";
      helloItsMe.prefect = false;
      helloItsMe.expelled = false;
      helloItsMe.bloodStatus = "Pureblood";
      helloItsMe.squad = false;
      BreakBloodStatusData();
      allStudents.unshift(helloItsMe);
  
      systemHacked = true;
  
      buildList();
      setTimeout(function () {
        alert("I solemnly swear that I am up to no good 😏😏😏😏");
      }, 100);
    } else {
      alert("Hacking is already happenin' 😎😎😎😎");
    }
  }
  
  function BreakBloodStatusData() {
    allStudents.forEach((student) => {
      if (student.bloodStatus === "Muggleborn") {
        student.bloodStatus = "Pureblood";
      } else if (student.bloodStatus === "Halfblood") {
        student.bloodStatus = "Pureblood";
      } else {
        let bloodStatusMath = Math.floor(Math.random() * 3);
        if (bloodStatusMath === 0) {
          student.bloodStatus = "Muggleborn";
        } else if (bloodStatusMath === 1) {
          student.bloodStatus = "Halfblood";
        } else {
          student.bloodStatus = "Pureblood";
        }
      }
    });
  }