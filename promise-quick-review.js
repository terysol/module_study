// 프라미스 객체 생성하며 바로 함수 전달 (해당 함수 내부에서 비동기 작업 수행)
// let promise = new Promise(function(resolve, reject) {
//
//     // 프라미스가 만들어지면 전달한 함수는 자동으로 실행됨
//     // ... 비동기 작업을 수행하는 코드 작성 ...
//     // 여기서는 1초 뒤에 결괏값("done")을 전달하며 resolve 함수를 호출하여 작업이 성공적으로 끝났음을 알림
//     setTimeout(() => resolve("done"), 1000);
// });

// resolve 함수 호출 시 then 메서드로 전달한 첫 번째 함수가 실행되며 결과를 전달받음
// promise.then(v => console.log(v)); // "done" 출력
// then() -> resolve 하기를 기다림. => 정상적인 실행

// ------------------------------------------------------------------------------------------

// let promise1 = new Promise(function(resolve, reject) {
//     // 1초 뒤에 에러 객체를 전달하며 reject 함수를 호출하여 작업 실패를 알림
//     // (reject 함수에 꼭 에러 객체를 전달해야 한다는 제약은 없지만, 보통 에러 객체를 전달함)
//     setTimeout(() => reject(new Error("에러 발생!")), 1000);
// });

// reject 함수 호출 시 catch 메서드로 전달한 함수가 실행되며 에러 객체를 전달 받음
// promise1.catch(e => console.log(e)); // 에러 객체를 출력
// catch() => 에러

// ------------------------------------------------------------------------------------------

// let promise2 = new Promise(function(resolve, reject) {
//     // 시간이 좀 걸리는 비동기 작업 진행
//     // (프라미스 함수에서 반드시 비동기 작업을 진행해야 한다는 제약은 없지만, 비동기 작업이 아니면 굳이 프라미스 객체를 쓸 이유가 없음)
//     setTimeout(() => {
//         // 특정 작업을 진행하고, 성공, 실패 여부를 알게 됨
//         let success = Math.random() + .5 >> 0; // 50% 확률로 성공 혹은 실패
//
//         if(success) {
//             // 성공하면 resolve
//             resolve({ result: "Hello" });
//         } else {
//             // 실패하면 reject
//             reject(new Error("실패"));
//         }
//     }, 1000);
// });

// resolve 함수는 then 메서드로 전달한 첫 번째 함수를 실행
// reject 함수는 then 메서드로 전달한 두 번째 함수를 실행

// promise2.then(
//     result => console.log(JSON.stringify(result)),
//     error => console.log(error)
// );

// ------------------------------------------------------------------------------------------

/*
new Promise(function(resolve, reject) {
    setTimeout(() => resolve(1), 1000);
}).then(function(result) {          // then 하게 되면 프라미스 객체를 리턴해줘야 한다. -> 내부적으로 프라미스 객체를 만들어줌.
    // resolve 호출의 결과로 전달된 값(1)이 result로 넘어옴
    console.log(result); // 1
    // 여기서 2가 반환되지만, 내부적으로 반환값을 resolve 함수로 전달하는 Promise 객체를 생성하여 반환하므로 결과적으로 연쇄적인 then 메서드 호출이 가능함
    return result * 2;
    // 즉, 내부적으로는 아래와 같은 코드를 실행
    // return new Promise(resolve => resolve(result * 2));   --> 프라미스 객체가 아닌 것을 return 해주면 리턴
}).then(function(result) {
    console.log(result); // 2
    return result * 2;
}).then(function(result) {
    console.log(result); // 4
    return result * 2;
});
*/


// ------------------------------------------------------------------------------------------
// 작업 중간 예외 발생할 경우 catch 블록으로 이동
/*
new Promise(function(resolve, reject) {
    setTimeout(() => resolve(1), 1000);
}).then(function(result) {
    console.log(result)
    // 연속적인 비동기 작업 진행
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(result * 2)
        }, 1000)
    });
    // 콜백 지옥 문제 없이 then으로 결과 받아내기
}).then(function(result) {
    console.log(result)
    // 또 다른 연속적인 비동기 작업 진행
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(result * 2)
        }, 1000)
    });
}).then(function(result) {
    console.log(result)
});
 */

// ------------------------------------------------------------------------------------------
/*
// 작업 중간 예외 발생할 경우 catch 블록으로 이동
new Promise(function(resolve, reject) {
    setTimeout(() => {
        // 초기 작업 진행
        // throw new Error("error 1");
        try{
            throw new Error("error 1");
            resolve(1);
        }catch(e){
            reject(e);
        }

    }, 1000); // (*)
})
    .then(function(result) {
        // 중간 작업 진행
        // throw new Error("error 2");
        console.log(result);
        return result * 2;
    })
    .then(function(result) {
        // 마지막 최종 작업 진행
        // throw new Error("error 3");
        console.log(result);
    })
    // Promise 생성시 전달한 함수 및 체이닝 함수 내부에서 발생한 에러는 모두 여기서 처리 가능
    .catch(function(e) {
        console.log('catch!!!!');
        console.log(e);
    });

 */
// ------------------------------------------------------------------------------------------
/*
Promise.all([     // 모든 promise가 resolve()일 때 then()을 실행
    new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
    new Promise(resolve => setTimeout(() => resolve(2), 2000)), // 2
    new Promise((resolve,reject) => setTimeout(() => {
        // 어떤 Promise 내부에서든, 실패하면 catch 블록으로 이동
        try{
            throw new Error("error 3");
            resolve(3);
        }catch(e){
            reject(e);
        }

    }, 1000)) // 3
])
    .then(result => {
        // 프라미스 전체가 성공적으로 처리되면 배열([1, 2, 3])이 반환됨,
        // (즉, 각 프라미스의 결과값이 배열을 구성하는 요소가 됨)
        console.log(result);
    })
    .catch(e => {
        // 프라미스 중 하나라도 실패하면, 모두 실패한 것으로 처리되고 catch 블록으로 이동

        console.log(e);
    });

 */