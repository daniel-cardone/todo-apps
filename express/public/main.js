"use strict";
(function () {
    const userBtns = document.querySelectorAll("button.user");
    const itemCountSpan = document.querySelector("#itemCount");
    const itemInput = document.querySelector("#itemInput");
    const addItemBtn = document.querySelector("#addItemBtn");
    window.onload = () => {
        const totalItems = 0;
        itemCountSpan.textContent = totalItems.toString();
        switchActiveUser("user1");
    };
    function switchActiveUser(username) {
        if (!username)
            return;
        userBtns.forEach(btn => {
            if (btn.dataset.username === username) {
                btn.classList.add("active");
                localStorage.setItem("username", username);
            }
            else {
                btn.classList.remove("active");
            }
        });
    }
    function createTask(taskName) {
        fetch("/create", {
            method: "POST",
            body: JSON.stringify({
                username: localStorage.getItem("username"),
                taskName
            })
        });
    }
    function prependNewTask(taskName) {
    }
    userBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            switchActiveUser(btn.dataset.username);
        });
    });
    addItemBtn.addEventListener("click", () => {
        const taskName = itemInput.value;
        createTask(taskName);
    });
})();
