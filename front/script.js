let inofWindowArray = [];
let markerArray = [];
var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.498095, 127.02761), // 지도의 중심좌표
        level: 8, // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

/*
**********************************************************
2. 더미데이터 준비하기 (제목, 주소, url, 카테고리)
*/
// const dataSet = [
//     {
//         title: "희락돈까스",
//         address: "서울 영등포구 양산로 210",
//         url: "https://www.youtube.com/watch?v=fwMTEkvcF_o",
//         category: "양식",
//     },
//     {
//         title: "즉석우동짜장",
//         address: "서울 영등포구 대방천로 260",
//         url: "https://www.youtube.com/watch?v=1YOJbOUR4vw&t=88s",
//         category: "한식",
//     },
//     {
//         title: "아카사카",
//         address: "서울 서초구 서초대로74길 23",
//         url: "https://www.youtube.com/watch?v=QmlXiGapPHI",
//         category: "일식",
//     },
// ];

// 주소-좌표 변환 객체를 생성합니다
// api 주소에 libraries=services 추가해야함.
var geocoder = new kakao.maps.services.Geocoder();

// 주소 -> 좌표 변경 함수
const getGeoCodeByAddress = (address) => {
    return new Promise((resolve, reject) => {
        geocoder.addressSearch(address, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const code = new kakao.maps.LatLng(result[0].y, result[0].x);
                resolve(code);
                return;
            }
            reject(new Error("Not valid address!"));
        });
    });
};

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다
const makeOverListener = (map, marker, infowindow, code) => {
    return function () {
        infowindowClose();
        infowindow.open(map, marker);
        map.panTo(code);
    };
};

// 클릭 시 다른 인포윈도우 닫기
const infowindowClose = () => {
    for (let infowindow of inofWindowArray) {
        infowindow.close();
    }
};

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
function makeOutListener(infowindow) {
    return function () {
        infowindow.close();
    };
}

function getYoutubeThumbnailUrl(url) {
    let replaceUrl = url.replace("https://youtu.be/", "");
    replaceUrl = replaceUrl.replace("https://www.youtube.com/embed/", "");
    replaceUrl = replaceUrl.replace("https://www.youtube.com/watch?v=", "");
    const findUrl = replaceUrl.split("&")[0];
    return `https://img.youtube.com/vi/${findUrl}/mqdefault.jpg`;
}

function getContents(data) {
    return `<div class="infowindow">
        <div class="inofwindow-img-container">
            <img src="${getYoutubeThumbnailUrl(data.videoUrl)}" 
            class="infowindow-img" />
        </div>
        <div class="infowindow-body">
            <h5 class="infowindow-title">${data.title}</h5>
            <p class="infowindow-address">${data.address}</p>
            <a class="infowindow-btn" target="_blank" href="${
                data.url
            }">영상보기</a>
        </div>
    </div>`;
}

const getData = async (category) => {
    const qs = category ? category : "";
    try {
        let dataSet = null;
        const res = await axios({
            method: "get",
            url: `http://13.209.33.42:3000/restaurantsByCategory/${qs}`,
            headers: {}, // packet header
            data: {}, // packet body
        });
        if (res && res.data && res.data.result && res.data.result.length) {
            dataSet = res.data.result;
        }
        return dataSet;
    } catch (err) {
        console.error(err);
    }
};

const setMap = async (dataSet) => {
    try {
        if (dataSet && dataSet.length) {
            for (let i = 0; i < dataSet.length; i++) {
                const code = await getGeoCodeByAddress(dataSet[i].address);
                const marker = new kakao.maps.Marker({
                    map: map,
                    position: code,
                });

                markerArray.push(marker);

                // 마커에 표시할 인포윈도우를 생성합니다
                var infowindow = new kakao.maps.InfoWindow({
                    content: getContents(dataSet[i]), // 인포윈도우에 표시할 내용
                });

                inofWindowArray.push(infowindow);

                // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
                // 이벤트 리스너로는 클로저를 만들어 등록합니다
                // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
                kakao.maps.event.addListener(
                    marker,
                    "click",
                    makeOverListener(map, marker, infowindow, code)
                );
                kakao.maps.event.addListener(
                    map,
                    "click",
                    makeOutListener(infowindow)
                );
            }
        }
    } catch (err) {
        console.error(err);
    }
};

// *****************************************
// 카테고리 분류
// *****************************************

const cateMap = {
    ko: "한식",
    cn: "중식",
    jp: "일식",
    ws: "양식",
    bu: "분식",
    gu: "구이",
    wh: "회/초밥",
    et: "기타",
};

const closeMarker = () => {
    for (marker of markerArray) {
        marker.setMap(null);
    }
};

const categoryHandler = async (e) => {
    const categoryId = e.target.id;
    const category = cateMap[categoryId];
    try {
        // 데이터 분류
        let categorizedDataset = await getData(category);

        // 기존 마커 삭제
        closeMarker();

        // 기존 인포윈도우 닫기
        infowindowClose();

        // 선택된 카테고리만 지도에 그리기
        await setMap(categorizedDataset);
    } catch (err) {
        console.error(err);
    }
};

const categoryList = document.querySelector(".category-list");
categoryList.addEventListener("click", categoryHandler);

const setting = async () => {
    try {
        const dataSet = await getData();
        await setMap(dataSet); // 지도에 전체 그리기
    } catch (err) {
        console.error(err);
    }
};

setting();
