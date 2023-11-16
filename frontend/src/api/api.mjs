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
  return await fetch(`http://localhost:4000/signUp/`, {
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

export async function login(code) {
  return await fetch(`http://localhost:4000/login/`, {
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

export function logOut() {
  fetch(`http://localhost:4000/logout/`, {
    method: 'GET',
    headers: {"Content-Type": "application/json"},
    credentials: 'include',
  })
  .then(response => {
    if (response.ok) {
      router.push('/login');
    }
  })
  .catch(error => {
    console.error(error);
  });
}

export async function loggedInUser() {
  return await fetch(`http://localhost:4000/user/`, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
    body: null,
    credentials: 'include',
  }).then((response) => {
    return response.json();
  }).then((data) => {
    return data;
  });
}