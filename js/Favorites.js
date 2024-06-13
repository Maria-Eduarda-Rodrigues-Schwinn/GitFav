import { GitHubUser } from "./GitHubUser.js"

// estrutura dos dados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
  }

  async add(userName) {
    try {
      const userExists = this.entries.find((entry) => entry.login === userName)

      if (userExists) {
        throw new Error(`Already registered user`)
      }

      const user = await GitHubUser.search(userName)

      if (user.login === undefined) {
        throw new Error(`User not found`)
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    )

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class FavoriteView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector("table tbody")

    this.update()
    this.onAdd()
  }

  update() {
    this.removeAllRows()

    this.entries.forEach((user) => {
      const newRow = this.createRow()

      newRow.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`
      newRow.querySelector(".user img").alt = `Image de ${user.name}`
      newRow.querySelector(".user p").textContent = user.name
      newRow.querySelector(".user a").href = `https://github.com/${user.login}`
      newRow.querySelector(".user span").textContent = `/${user.login}`
      newRow.querySelector(".repositories").textContent = user.public_repos
      newRow.querySelector(".followers").textContent = user.followers

      newRow.querySelector(".remove").onclick = () => {
        const isOk = confirm(`Are you sure you want to delete this line?`)

        if (isOk) {
          this.delete(user)
        }
      }
      this.tbody.append(newRow)
    })
  }

  removeAllRows() {
    this.tbody.querySelectorAll("tr").forEach((row) => {
      row.remove()
    })
  }

  createRow() {
    const row = document.createElement("tr")

    row.innerHTML = `
            <td class="user">
              <img
                src="https://github.com/example.png"
                alt="Imagem de Example e"
              />
              <a
                href="https://github.com/example"
                target="_blank"
              >
                <p>Example e</p>
                <span>example</span>
              </a>
            </td>
            <td class="repositories">7665</td>
            <td class="followers">5435</td>
            <td>
              <button class="remove">Remove</button>
            </td>
    `

    return row
  }

  onAdd() {
    const addButton = this.root.querySelector(".search button")

    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input")

      this.add(value)
    }
  }
}
