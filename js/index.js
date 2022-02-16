//start accessing DOM once it's loaded
document.addEventListener("DOMContentLoaded",()=>{
    //create variables for DOM elements
    const form = document.getElementById('github-form');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');

    //function to add github user to user-list
    function displayUser(user) {
        const userDisp = document.createElement("li");
        const userName = document.createElement("p");
        const userAvatar = document.createElement("img");
        const userProfile = document.createElement("a");
        
        userDisp.id = user.id;
        userName.textContent = user.login;
        userAvatar.src = user.avatar_url;
        userAvatar.alt = `${user.login}'s avatar`;
        userProfile.href =  user.html_url;
        userProfile.textContent = "User's Github Profile";
        userDisp.addEventListener("click", () => {
            fetch(`https://api.github.com/users/${user.login}/repos`, {
                method: "GET",
                headers: {
                    Accept: "application/vnd.github.v3+json"
                }
            })
            .then((resp) => resp.json())
            .then((json) => {
                json.forEach((repo) => {
                    addRepo(repo);
                })
            })
        })
        userDisp.append(userName, userAvatar, userProfile);
        userList.append(userDisp);
    }

    //function to add a repo to the dom
    function addRepo(repo) {
        console.log(repo);
        const li = document.createElement('li')
        li.textContent = `${repo.owner.login}: `;
        li.id = repo.id;
        const a = document.createElement('a');
        a.textContent = repo.name;
        console.log(repo.name);
        a.href = repo.clone_url;
        li.appendChild(a);
        reposList.appendChild(li);
    }

    //event listener on form submit
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchOpt = document.querySelector('input[name="endpoint"]:checked').value;
        console.log(e.target.search.value);
        if(searchOpt === "users") {
            userList.innerHTML = '';
            reposList.innerHTML = '';
            fetch(`https://api.github.com/search/users?q=${e.target.search.value}`, {
                method: "GET",
                headers: {
                    Accept: "application/vnd.github.v3+json"
                }
            })
            .then((resp) => resp.json())
            .then((json) => {
                json.items.forEach((user) => {
                    displayUser(user);
                })
            })
        } else {
            fetch(`https://api.github.com/search/repositories?q=${e.target.search.value}&sort=stars&order=desc`, {
                method: "GET",
                headers: {
                    Accept: "application/vnd.github.v3+json"
                }
            })
            .then((resp) => resp.json())
            .then((json) => {
                userList.innerHTML = '';
                reposList.innerHTML = '';
                json.items.forEach((repo) => {
                    addRepo(repo);
                })
            })

        }
    })
})