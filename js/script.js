function initTodoList() {
    const form = document.querySelector('form');
    const input = form.querySelector('input');
    const main = document.querySelector('main');

    let array = [];

    function getCookie(name) {
        const matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function checkCookie() {
        const checkedCookie = getCookie("nameOfGrocery");

        if (!checkedCookie) {
            return false;
        } else {
            return true;
        }
    }

    function mainTemplate(valueForTitle) {
        const mainTemplate = `
            <div class="groceryItem">
                <p>${valueForTitle}</p>
                <div class="groceryImg">
                    <button class="editBtn"> <i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="deleteBtn"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </div>
            `;
        return mainTemplate;
    }

    function insertDataInCookie() {
        array.push(input.value);
        document.cookie = `nameOfGrocery=${JSON.stringify(array)}; expires= ${(new Date(Date.now() + 24 * 36000).toGMTString())}`;
        main.innerHTML += mainTemplate(input.value);
    }

    function addListOfGrocery() {
        if (checkCookie()) {
            array = JSON.parse(getCookie('nameOfGrocery'));

            for (let i = 0; i < array.length; i++) {
                main.innerHTML += mainTemplate(array[i]);
            }

            if (array.length > 0) {
                clearAll();
            }
        }
    }

    function insertItemOnPage() {
        if (checkCookie() && form) {
            array = JSON.parse(getCookie('nameOfGrocery'));
            insertDataInCookie();
        } else {
            insertDataInCookie();
        }
        clearAll();
    }

    function clearAll() {
        const section = document.querySelector('section');

        if (main.children.length > 0 && section.lastElementChild.className !== 'clearBtn') {
            main.insertAdjacentHTML('afterend', '<button class="clearBtn">Clear Items</button>')
        }

        const btnClear = document.querySelector('.clearBtn');

        btnClear.addEventListener('click', () => {
            main.innerHTML = "";
            array = [];
            document.cookie = `nameOfGrocery=${JSON.stringify(array)}; max-age=0`;
            btnClear.remove();
        })
    }


    function deletOneElement(e) {
        const parent = e.target.closest('.groceryItem');
        const titelInParent = parent.querySelector('p').innerHTML;

        array = JSON.parse(getCookie('nameOfGrocery'));
        array.splice(array.indexOf(titelInParent), 1)
        document.cookie = `nameOfGrocery=${JSON.stringify(array)}; expires= ${(new Date(Date.now() + 24 * 36000).toGMTString())}`;

        parent.remove();

        if (main.children.length == 0) {
            main.nextElementSibling.remove();
        }
    }

    function editOneElement(e) {
        const parent = e.target.closest('.groceryItem');
        const titelInParent = parent.querySelector('p').innerHTML;
        const btnInForm = form.querySelector('button')

        let strForTrans;
        array = JSON.parse(getCookie('nameOfGrocery'));
        const index = array.indexOf(titelInParent)

        input.value = titelInParent;
        btnInForm.innerHTML = "Save";
        input.focus();

        btnInForm.addEventListener('click', (e) => {
            e.preventDefault()

            if (input.value !== '') {
                strForTrans = input.value;
                array[index] = strForTrans;
                document.cookie = `nameOfGrocery=${JSON.stringify(array)}; expires= ${(new Date(Date.now() + 24 * 36000).toGMTString())}`;

                main.innerHTML = '';
                input.value = '';
                btnInForm.innerHTML = "Create";

                addListOfGrocery();
            } else {
                alert('Input cannot be empty')
            }
        }, { once: true })
    }

    document.addEventListener('DOMContentLoaded', () => {
        addListOfGrocery();

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                insertItemOnPage();

                input.value = "";
            })
        }

        if (main) {
            main.addEventListener('click', (e) => {
                if (e.target.parentElement.className === 'deleteBtn') {
                    deletOneElement(e);
                } else if (e.target.parentElement.className === 'editBtn') {
                    editOneElement(e);
                }
            })
        }
    })
}

initTodoList();
