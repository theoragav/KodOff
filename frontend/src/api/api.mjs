function send(method, url, data){
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND}${url}`, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: (data)? JSON.stringify(data): null,
    }).then((response) => {
      return response.json();
    });
}

export async function signUp(code) {
  await fetch(`http://localhost:4000/signUp/`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ code: code })
  }).then((response) => {
    return response.json();
  }).then((data) => {
    return data;
  });
}

export async function login(code) {
  await fetch(`http://localhost:4000/login/`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ code: code }),
    credentials: 'include',
  }).then((response) => {
    return response.json();
  }).then((data) => {
    return data;
  });
}

export async function logOut() {
  await fetch(`http://localhost:4000/logout/`, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
    body: null,
  }).then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data);
  });
}

export async function loggedInUser() {
  await fetch(`http://localhost:4000/user/`, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
    body: null,
    credentials: 'include',
  }).then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data);
    return data;
  });
}