let ipUrl = `https://api.ipify.org?format=json`;
let postDataUrl = `https://api.postalpincode.in/pincode/`;
let getStartedBtn = document.querySelector("#get-started");
// Data fetcher
async function fetchData(url) {
  let resp = await fetch(url);
  let data = await resp.json();
  // console.log(data);
  return data;
}

// Getting User IP address
async function showIp() {
  let data = await fetchData(ipUrl);
  document.querySelector("#user-ip").innerHTML = data?.ip;
}

async function getUserInfo(url) {
  let data = await fetchData(url);
  let pincodeData = await fetchData(`${postDataUrl}${data?.postal}`);
  HomeNavUi(data);
  HomeMapUi(data);
  HomeMoreInfoUi(data, pincodeData[0]?.PostOffice.length);
  HomeSearchUi(pincodeData[0]?.PostOffice);
}

function HomeNavUi(data) {
  let homeNav = document.querySelector("#home-nav");
  homeNav.innerHTML = `
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div class="p-3 mb-2 rounded-lg bg-gray-900 text-white transform transition duration-300 hover:scale-105">
      <p class="text-sm font-semibold">IP Address: <span class="text-sm text-gray-300">${data.ip}</span></p>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      <div class="bg-green-800 p-3 rounded-lg flex flex-row justify-between transform transition duration-300 hover:scale-105 hover:bg-green-700">
          <div>
              <p class="text-sm font-semibold">Latitude: <span class="text-sm text-gray-300">${data?.latitude}</span></p> 
          </div>
          <div>
              <p class="text-sm font-semibold">Longitude: <span class="text-sm text-gray-300">${data?.longitude}</span></p>
          </div>
      </div>
      <div class="bg-red-800 p-3 rounded-lg flex flex-row justify-between transform transition duration-300 hover:scale-105 hover:bg-red-700">
          <div>
              <p class="text-sm font-semibold">City: <span class="text-sm text-gray-300">${data?.city}</span></p>
          </div>
          <div>
              <p class="text-sm font-semibold">Region: <span class="text-sm text-gray-300">${data?.region}</span></p> 
          </div>
      </div>
      <div class="bg-indigo-800 p-3 rounded-lg transform transition duration-300 hover:scale-105 hover:bg-indigo-700">
          <p class="text-sm font-semibold">Network: <span class="text-sm text-gray-300">${data?.network}</span></p>
      </div>
      <div class="bg-pink-800 p-3 rounded-lg transform transition duration-300 hover:scale-105 hover:bg-pink-700">
          <p class="text-sm font-semibold">Organization: <span class="text-sm text-gray-300">${data?.org}</span></p>
      </div>
  </div>
</div>

  `;
}

function HomeMapUi(data) {
  let mapDiv = document.querySelector("#map");
  mapDiv.innerHTML = `
    <h1 class="text-center text-[#B8BCCC] font-montserrat font-bold text-xl pt-2">Your Current Location</h1>
    <div class="px-4 sm:px-8 py-4 w-full flex justify-center">
        <iframe src="https://maps.google.com/maps?q=${data?.latitude}, ${data?.longitude}&z=15&output=embed" frameborder="0"  referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" style="border:0" class="rounded-md w-full h-96 sm:w-3/4 sm:h-96"></iframe>
    </div>
 `;
}
function HomeMoreInfoUi(data, numPosts) {
  let moreInfo = document.querySelector("#more-info");
  moreInfo.innerHTML = `
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
    <div class="bg-blue-900 p-3 rounded-lg transform transition duration-300 hover:scale-105 hover:bg-blue-800">
      <p class="text-sm font-semibold">Time Zone: <span class="text-sm text-gray-300">${data.timezone}</span></p>
    </div>
    <div class="bg-green-800 p-3 rounded-lg flex flex-row justify-between transform transition duration-300 hover:scale-105 hover:bg-green-700">
      <p class="text-sm font-semibold">Date & Time : <span id="dateandTime" class="text-sm text-gray-300"></span></p>
    </div>
    <div class="bg-red-800 p-3 rounded-lg transform transition duration-300 hover:scale-105 hover:bg-red-700">
      <p class="text-sm font-semibold">Pincode: <span class="text-sm text-gray-300">${data?.postal}</span></p>
    </div>
    <div class="bg-pink-800 p-3 rounded-lg transform transition duration-300 hover:scale-105 hover:bg-pink-700">
      <p class="text-sm font-semibold">Message: <span class="text-sm text-gray-300">Number of pincode(s) found ${numPosts}.</span></p>
    </div>
  </div>
</div>

 `;
  let dateAndTimeElement = document.getElementById("dateandTime");
  updateDateAndTime(dateAndTimeElement);

  let intervalID = setInterval(function () {
    updateDateAndTime(dateAndTimeElement, data?.timezone);
  }, 1000);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      clearInterval(intervalID);
    } else {
      intervalID = setInterval(function () {
        updateDateAndTime(dateAndTimeElement);
      }, 1000);
    }
  });
}

function updateDateAndTime(dateAndTimeElement, timezone) {
  let dateObj = new Date();
  let currentDateAndTime = dateObj.toLocaleString("en-US", {
    timeZone: timezone,
  });
  dateAndTimeElement.textContent = currentDateAndTime;
}

function HomeSearchUi(pincodes) {
  console.log(pincodes);
  let nearPostDiv = document.querySelector("#near-post");
  nearPostDiv.innerHTML = `
  <div>
  <h1 class="text-center text-[#B8BCCC] font-montserrat font-bold text-xl pt-2">
      Post Offices Near You
  </h1>
</div>
<div class="relative mb-6 mt-6 px-4">
  <div class="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.592 25.9369L23.7498 20.0957C23.4861 19.832 23.1286 19.6856 22.7536 19.6856H21.7985C23.4158 17.6174 24.3768 15.0161 24.3768 12.1863C24.3768 5.45455 18.9213 0 12.1884 0C5.45548 0 0 5.45455 0 12.1863C0 18.9181 5.45548 24.3726 12.1884 24.3726C15.0187 24.3726 17.6204 23.4118 19.6889 21.7947V22.7497C19.6889 23.1247 19.8354 23.4821 20.0991 23.7457L25.9414 29.587C26.4922 30.1377 27.3829 30.1377 27.9278 29.587L29.5862 27.9289C30.137 27.3782 30.137 26.4876 29.592 25.9369ZM12.1884 19.6856C8.04551 19.6856 4.68784 16.3343 4.68784 12.1863C4.68784 8.04414 8.03965 4.68704 12.1884 4.68704C16.3313 4.68704 19.6889 8.03828 19.6889 12.1863C19.6889 16.3285 16.3371 19.6856 12.1884 19.6856Z" fill="#B8BCCC"/>
      </svg>
  </div>
  <input type="text" id="search-btn" class="bg-gray-700 border border-gray-300 text-[#B8BCCC] text-sm rounded-lg block w-full pl-10 p-2.5" placeholder="Search By Name">
</div>
<div id="visible-pincode" class="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
${pincodes
  .map(
    (pin) => `
        <div class="bg-[#575A85] p-6 rounded-lg shadow-md hover:bg-[#6c6f9e] hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            <h2 class="text-lg font-semibold mb-2 text-white">${pin?.Name}</h2>
            <p class="text-sm text-gray-300"><strong>Branch Type:</strong> ${pin?.BranchType}</p>
            <p class="text-sm text-gray-300"><strong>Delivery Status:</strong> ${pin?.DeliveryStatus}</p>
            <p class="text-sm text-gray-300"><strong>District:</strong> ${pin?.District}</p>
            <p class="text-sm text-gray-300"><strong>Division:</strong> ${pin?.Division}</p>
        </div>
    `
  )
  .join("")}
</div>
  `;
  let serachBtn = document.querySelector("#search-btn");
  serachBtn.addEventListener("keyup", (e) => {
    let val = e.target.value.toLowerCase();
    let visiblePincode = document.querySelector("#visible-pincode");
    let newCodes = pincodes.filter((pin) =>
      pin?.Name.toLowerCase().includes(val)
    );
    visiblePincode.innerHTML = "";
    visiblePincode.innerHTML += `
${newCodes
  .map(
    (pin) => `
    <div class="bg-[#575A85] p-6 rounded-lg shadow-md hover:bg-[#6c6f9e] hover:shadow-lg transform hover:scale-105 transition-all duration-300">
    <h2 class="text-lg font-semibold mb-2 text-white">${pin?.Name}</h2>
    <p class="text-sm text-gray-300"><strong>Branch Type:</strong> ${pin?.BranchType}</p>
    <p class="text-sm text-gray-300"><strong>Delivery Status:</strong> ${pin?.DeliveryStatus}</p>
    <p class="text-sm text-gray-300"><strong>District:</strong> ${pin?.District}</p>
    <p class="text-sm text-gray-300"><strong>Division:</strong> ${pin?.Division}</p>
</div>
      `
  )
  .join("")}
      `;
  });
}

document.addEventListener("DOMContentLoaded", showIp);
getStartedBtn.addEventListener("click", () => {
  document.querySelector("#front-page").classList.add("hidden");
  document.querySelector("#home-page").classList.remove("hidden");
  let ip = document.querySelector("#user-ip").innerText;
  let ipUserInfoUrl = `https://ipapi.co/${ip}/json/`;
  getUserInfo(ipUserInfoUrl);
});
