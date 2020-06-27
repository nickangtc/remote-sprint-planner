const evtSource = new EventSource('/events')

evtSource.onerror = function onerror(err) {
    console.error('EventSource failed:', err)
}

// when user closes the browser tab / etc, close event source
// evtSource.close()

evtSource.addEventListener('userVote', (event) => {
    console.log('userVote:', event)
    const newElement = document.createElement('li')
    const eventList = document.getElementById('list')
    newElement.innerHTML = `${event.data}`
    eventList.appendChild(newElement)
})

// vote code
async function postVote(username, votevalue) {
    const url = '/vote'
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
