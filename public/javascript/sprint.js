const idRegex = /\/sprints\/(.*)/
const sprintId = window.location.pathname.match(idRegex)[1]
console.log('sprintId:', sprintId)

const socket = window.io()

socket.on('connect', () => {
    console.log('connected')
})

socket.on('joined', (user) => {
    console.log('joined:', user)
})

// get user-name input
// check with server if name is taken
// if not, proceed
// if yes, prompt user for new user-name
async function postUser(username) {
    const url = '/users'
    const data = { username }

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
    return response
}

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

function connect() {
    const evtSource = new EventSource(`/sprints/${id}/subscribe`)

    evtSource.onerror = function onerror(err) {
        console.error('EventSource failed:', err)
    }

    // when user closes the browser tab / etc, close event source
    // evtSource.close()

    evtSource.addEventListener('vote', (event) => {
        const newElement = document.createElement('li')
        const eventList = document.getElementById('list')
        newElement.innerHTML = `${event.data}`
        eventList.appendChild(newElement)
    })
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

        if (res.status === 403) {
            displayEphemeralMessage(res.statusText)
        } else {
            connect()

            displayEphemeralMessage('')

            const usersOnline = await res.json()
            displayUsersOnlineList(usersOnline.map((usr) => usr.username))

            usernameForm.classList.add('d-none')

            userSignupUiGroup.classList.remove('d-none')
            usersOnlineUiGroup.classList.remove('d-none')
            voteUiGroup.classList.remove('d-none')
        }
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
