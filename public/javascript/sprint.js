const idRegex = /\/sprints\/(.*)/
const sprintId = window.location.pathname.match(idRegex)[1]
console.log('sprintId:', sprintId)

const socket = window.io()

socket.on('connect', () => {
    // this client is connected to server
    console.log('connected')
})

socket.on('joined', (user) => {
    // a new client (not this one) has joined the room
    console.log('joined:', user)
})

socket.on('disconnected', (userId) => {
    // a new client (not this one) has disconnected from the room
    console.log('user disconnected:', userId)
})

socket.on('refreshState', (data) => {
    const { users } = data

    if (users) {
        // update active users list
    }
})

// async function postUser(username) {
//     const url = '/users'
//     const data = { username }

//     const response = await fetch(url, {
//         method: 'POST',
//         mode: 'cors',
//         cache: 'no-cache',
//         credentials: 'same-origin',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         redirect: 'follow',
//         referrerPolicy: 'no-referrer',
//         body: JSON.stringify(data),
//     })
//     return response
// }

// vote code
async function postVote(username, votevalue) {
    const url = `${sprintId}/votes`
    const data = {
        username,
        votevalue,
    }

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
    })
    return response.json()
}

function displayEphemeralMessage(message) {
    const userMessageBox = document.querySelector('#user-message-box')
    userMessageBox.textContent = message
}

function displayUsersOnlineList(usernames) {
    const usersOnlineList = document.querySelector('#users-online-list')

    usersOnlineList.innerHTML = ''

    usernames.forEach((username) => {
        const li = document.createElement('li')
        li.classList.add('badge', 'badge-pill', 'badge-info')
        li.textContent = username
        usersOnlineList.append(li)
    })
}

window.addEventListener('DOMContentLoaded', () => {
    const usernameForm = document.querySelector('#username-form')
    const userSignupUiGroup = document.querySelector('#user-signup-ui-group')
    const usersOnlineUiGroup = document.querySelector('#users-online-ui-group')
    const voteUiGroup = document.querySelector('#vote-ui-group')

    usernameForm.addEventListener('submit', async function submitUsernameForm(
        evt
    ) {
        evt.preventDefault()
        const { target } = evt
        // this is the most direct and readable code to access a form's specific input element's value
        const username = target.elements.username.value

        socket.emit('join', { username, sprintId })

        // const usersOnline = await res.json()
        // displayUsersOnlineList(usersOnline.map((usr) => usr.username))

        usernameForm.classList.add('d-none')

        userSignupUiGroup.classList.remove('d-none')
        usersOnlineUiGroup.classList.remove('d-none')
        // voteUiGroup.classList.remove('d-none')
    })

    const buttons = document.querySelectorAll('#vote-buttons button')

    buttons.forEach((btn) =>
        btn.addEventListener('click', (ev) => {
            const { dataset } = ev.target

            const { votevalue } = dataset
            if (votevalue) {
                postVote('nick', votevalue)
            }
        })
    )
})
