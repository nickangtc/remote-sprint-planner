const idRegex = /\/rooms\/(.*)/
const id = window.location.pathname.match(idRegex)[1]
console.log('id:', id)
const evtSource = new EventSource(`/rooms/${id}/subscribe`)

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

// vote code
async function postVote(username, votevalue) {
    const url = `${id}/vote`
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

window.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button')

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
