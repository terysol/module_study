// npm install node-fetch
const fetch = require('node-fetch');
// npm install axios
const axios = require('axios');

// ES6 방식 VS require()

// fetch
fetch('https://jsonplaceholder.typicode.com/users/1')
    // 원격 서버가 응답하면 then 핸들러가 실행됨
    .then(function(response) {
        // json 메서드는 응답 텍스트 전체를 자바스크립트 객체로 파싱(변환)하는 작업을 진행하는 프라미스를 반환
        return response.json();    // 프라미스를 반환  json 자체가 promise를  반환
    })
    .then(function(json) {          // json 객체
        // 객체의 내용을 JSON.stringify 함수를 통해 문자열로 변환하여 출력
        // console.log(JSON.stringify(json));
        console.log(json);
    });

// axios
axios.get('https://jsonplaceholder.typicode.com/users/1')
    .then(res => {
        // axios 내부적으로 객체로의 역직렬화 작업을 수행하므로 그냥 객체처럼 바로 사용 가능
        console.log(res.data);
    });